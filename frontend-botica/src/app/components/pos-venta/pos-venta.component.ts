import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-pos-venta',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './pos-venta.component.html',
  styles: [`
    .product-card { transition: transform 0.2s; }
    .product-card:hover { transform: translateY(-5px); box-shadow: 0 10px 20px rgba(0,0,0,0.1); }
    .img-catalogo { height: 180px; object-fit: contain; padding: 10px; }
  `]
})
export class PosVentaComponent implements OnInit {
  lotesDisponibles: any[] = [];
  categoriasUnicas: string[] = [];
  ticketActual: any = null;
  
  // Filtros
  categoriaSeleccionada: string = 'TODAS';
  terminoBusqueda: string = '';

  carrito: any[] = [];
  venta = {
    usuarioId: 1, 
    nroComprobante: 'B001-' + Math.floor(Math.random() * 1000000).toString().padStart(6, '0'),
    metodoPago: 'Efectivo',
    total: 0
  };

  constructor(private http: HttpClient) {}

  ngOnInit(): void {
    this.cargarLotes();
  }

  cargarLotes() {
    this.http.get<any[]>('http://localhost:8080/api/lotes/listar').subscribe(data => {
      this.lotesDisponibles = data.filter(lote => lote.cantidadActual > 0);
      
      // Extraer categorías sin repetir para el menú lateral
      const cats = this.lotesDisponibles.map(l => l.categoriaNombre).filter(Boolean);
      this.categoriasUnicas = [...new Set(cats)];
    });
  }

  // Getter dinámico que filtra en tiempo real lo que se ve en pantalla
  get lotesFiltrados() {
    return this.lotesDisponibles.filter(lote => {
      const matchCat = this.categoriaSeleccionada === 'TODAS' || lote.categoriaNombre === this.categoriaSeleccionada;
      const matchNom = lote.nombreProducto.toLowerCase().includes(this.terminoBusqueda.toLowerCase());
      return matchCat && matchNom;
    });
  }

  agregarAlCarrito(lote: any) {
    const itemExistente = this.carrito.find(item => item.loteId === lote.lote_id);

    if (itemExistente) {
      if ((itemExistente.cantidad + 1) > lote.cantidadActual) {
        alert(`Stock físico insuficiente. Solo hay ${lote.cantidadActual} cajas.`);
        return;
      }
      itemExistente.cantidad++;
      itemExistente.subtotal = itemExistente.cantidad * itemExistente.precioUnitario;
    } else {
      this.carrito.push({
        loteId: lote.lote_id,
        nombreProducto: lote.nombreProducto,
        codigoLote: lote.codigoLote,
        cantidad: 1, // Por defecto agrega 1 al hacer clic
        precioUnitario: lote.precioVenta,
        subtotal: lote.precioVenta,
        imagen: lote.imagenUrl
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

  quitarItem(index: number) {
    this.carrito.splice(index, 1);
    this.calcularTotal();
  }

  calcularTotal() {
    this.venta.total = this.carrito.reduce((acc, item) => acc + item.subtotal, 0);
  }

  registrarVenta() {
    if (this.carrito.length === 0) return alert('El carrito está vacío.');

    const payload = {
      usuarioId: this.venta.usuarioId,
      nroComprobante: this.venta.nroComprobante,
      metodoPago: this.venta.metodoPago,
      total: this.venta.total,
      detalles: this.carrito.map(item => ({
        loteId: item.loteId,
        cantidad: item.cantidad,
        precioUnitario: item.precioUnitario
      }))
    };

    this.http.post('http://localhost:8080/api/ventas/registrar', payload).subscribe({
      next: () => {
        // 1. CAPTURAMOS LOS DATOS PARA EL TICKET (Antes de borrar el carrito)
        this.ticketActual = {
          empresa: 'BOTICA EL BUEN SALUD', // Nombre ficticio de tu botica
          ruc: '20123456789',
          nroComprobante: this.venta.nroComprobante,
          fecha: new Date(),
          metodoPago: this.venta.metodoPago,
          total: this.venta.total,
          items: [...this.carrito] // Hacemos una copia exacta del carrito
        };

        // 2. Limpiamos la pantalla de la caja para el siguiente cliente en la fila
        this.carrito = [];
        this.calcularTotal();
        this.venta.nroComprobante = 'B001-' + Math.floor(Math.random() * 1000000).toString().padStart(6, '0');
        this.cargarLotes(); // Refrescamos el stock
      },
      error: (err) => alert('Error al registrar venta.')
    });
  }

  // --- NUEVAS FUNCIONES PARA EL TICKET ---
  imprimirTicket() {
    window.print(); // Comando nativo del navegador web para invocar la impresora
  }

  cerrarTicket() {
    this.ticketActual = null; // Cierra el modal y deja la caja lista
  }
}