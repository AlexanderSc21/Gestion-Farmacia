import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { LoteService } from '../../services/lote.service';
import { VentaService } from '../../services/venta.service';
import { Lote, Venta, DetalleVenta } from '../../models/models';

@Component({
  selector: 'app-pos-venta',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './pos-venta.component.html',
  styleUrls: ['./pos-venta.component.css']
})
export class PosVentaComponent implements OnInit {
  lotesDisponibles: any[] = [];
  categoriasUnicas: string[] = [];
  ticketActual: Venta | null = null;
  ticketImpresion: {
    fecha: Date;
    nroComprobante: string;
    metodoPago: string;
    total: number;
    items: Array<{ nombreProducto: string; cantidad: number; precioUnitario: number; subtotal: number }>;
  } | null = null;
  
  categoriaSeleccionada: string = 'TODAS';
  terminoBusqueda: string = '';

  carrito: any[] = [];
  venta = {
    usuarioId: 1, 
    nroComprobante: 'B001-' + Math.floor(Math.random() * 1000000).toString().padStart(6, '0'),
    metodoPago: 'Efectivo',
    total: 0
  };

  constructor(
    private loteService: LoteService,
    private ventaService: VentaService
  ) {}

  ngOnInit(): void {
    this.cargarLotes();
  }

  cargarLotes() {
    this.loteService.listar().subscribe(data => {
      this.lotesDisponibles = data.filter(lote => lote.cantidadActual > 0);
      const cats = this.lotesDisponibles.map(l => l.producto?.categoria?.nombre).filter(Boolean);
      this.categoriasUnicas = [...new Set(cats)];
    });
  }

  get lotesFiltrados() {
    return this.lotesDisponibles.filter(lote => {
      const matchCat = this.categoriaSeleccionada === 'TODAS' || lote.producto?.categoria?.nombre === this.categoriaSeleccionada;
      const matchNom = lote.producto?.nombreComercial.toLowerCase().includes(this.terminoBusqueda.toLowerCase()) || 
                       lote.producto?.nombreGenerico.toLowerCase().includes(this.terminoBusqueda.toLowerCase());
      return matchCat && matchNom;
    });
  }

  get sugerencias() {
    const term = this.terminoBusqueda.trim().toLowerCase();
    if (term.length < 2) return [];
    return this.lotesFiltrados.slice(0, 8);
  }

  agregarAlCarrito(lote: any) {
    const itemExistente = this.carrito.find(item => item.loteId === lote.lote_id);

    if (itemExistente) {
      if ((itemExistente.cantidad + 1) > lote.cantidadActual) {
        alert(`Stock insuficiente. Solo hay ${lote.cantidadActual} disponibles.`);
        return;
      }
      itemExistente.cantidad++;
      itemExistente.subtotal = itemExistente.cantidad * itemExistente.precioUnitario;
    } else {
      this.carrito.push({
        loteId: lote.lote_id,
        nombreProducto: lote.producto.nombreComercial,
        codigoLote: lote.codigoLote,
        cantidad: 1,
        precioUnitario: lote.producto.precioVentaUnitario,
        subtotal: lote.producto.precioVentaUnitario,
        imagen: lote.producto.imagenUrl
      });
    }
    this.calcularTotal();
  }

  aumentarCantidad(index: number) {
    const item = this.carrito[index];
    const loteOriginal = this.lotesDisponibles.find(l => l.lote_id === item.loteId);
    if (item.cantidad < loteOriginal.cantidadActual) {
      item.cantidad++;
      item.subtotal = item.cantidad * item.precioUnitario;
      this.calcularTotal();
    }
  }

  disminuirCantidad(index: number) {
    const item = this.carrito[index];
    if (item.cantidad > 1) {
      item.cantidad--;
      item.subtotal = item.cantidad * item.precioUnitario;
      this.calcularTotal();
    }
  }

  eliminarDelCarrito(index: number) {
    this.carrito.splice(index, 1);
    this.calcularTotal();
  }

  calcularTotal() {
    this.venta.total = this.carrito.reduce((sum, item) => sum + item.subtotal, 0);
  }

  finalizarVenta() {
    if (this.carrito.length === 0) return;

    const ticketSnapshot = {
      fecha: new Date(),
      nroComprobante: this.venta.nroComprobante,
      metodoPago: this.venta.metodoPago,
      total: this.venta.total,
      items: this.carrito.map(item => ({
        nombreProducto: item.nombreProducto,
        cantidad: item.cantidad,
        precioUnitario: item.precioUnitario,
        subtotal: item.subtotal
      }))
    };

    const ventaRequest = {
      usuarioId: this.venta.usuarioId,
      metodoPago: this.venta.metodoPago,
      nroComprobante: this.venta.nroComprobante,
      total: this.venta.total,
      detalles: this.carrito.map(item => ({
        loteId: item.loteId,
        cantidad: item.cantidad,
        precioUnitario: item.precioUnitario
      }))
    };

    this.ventaService.registrar(ventaRequest).subscribe({
      next: (res) => {
        alert('Venta realizada con éxito');
        this.ticketActual = res;
        this.ticketImpresion = ticketSnapshot;
        this.carrito = [];
        this.venta.total = 0;
        this.venta.nroComprobante = 'B001-' + Math.floor(Math.random() * 1000000).toString().padStart(6, '0');
        this.cargarLotes();
      },
      error: (err) => alert('Error al procesar la venta: ' + err.message)
    });
  }

  seleccionarSugerencia(lote: any) {
    this.agregarAlCarrito(lote);
    this.terminoBusqueda = '';
  }

  imprimirTicket() {
    if (!this.ticketImpresion) return;
    const ticketEl = document.getElementById('ticket-print');
    if (!ticketEl) return;

    const win = window.open('', '_blank', 'width=400,height=700');
    if (!win) return;

    win.document.open();
    win.document.write(`
      <html>
        <head>
          <title>${this.ticketImpresion.nroComprobante}</title>
          <style>
            body { font-family: Arial, sans-serif; margin: 0; padding: 12px; }
            .ticket { width: 280px; margin: 0 auto; }
            .center { text-align: center; }
            .row { display: flex; justify-content: space-between; gap: 8px; }
            .muted { color: #555; font-size: 12px; }
            .line { border-top: 1px dashed #000; margin: 10px 0; }
            table { width: 100%; border-collapse: collapse; font-size: 12px; }
            th, td { padding: 4px 0; }
            th { text-align: left; }
            td.r, th.r { text-align: right; }
            .total { font-size: 14px; font-weight: 700; }
          </style>
        </head>
        <body>
          ${ticketEl.innerHTML}
        </body>
      </html>
    `);
    win.document.close();
    win.focus();
    win.print();
    win.close();
  }
}
