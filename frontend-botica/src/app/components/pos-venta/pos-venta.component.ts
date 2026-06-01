import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { forkJoin, of } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { LoteService } from '../../services/lote.service';
import { ProductoService } from '../../services/producto.service';
import { VentaService } from '../../services/venta.service';
import { Producto, Venta } from '../../models/models';

type LoteApi = {
  lote_id?: number;
  productoId?: number;
  codigoLote?: string;
  fechaVencimiento?: string;
  cantidadActual?: number;
  nombreProducto?: string;
  nombreGenerico?: string;
  presentacionProducto?: string;
  precioVenta?: number | string;
  imagenUrl?: string;
  categoriaNombre?: string;
  producto?: {
    producto_id?: number;
    nombreComercial?: string;
    nombreGenerico?: string;
    presentacion?: string;
    precioVentaUnitario?: number;
    imagenUrl?: string;
    categoria?: { nombre?: string };
  };
};

type CatalogoProductoItem = {
  productoId: number;
  nombreComercial: string;
  nombreGenerico: string;
  presentacion: string;
  categoriaNombre: string;
  imagenUrl: string;
  precioVentaUnitario: number;
  stockTotal: number;
  lotes: Array<{ loteId: number; codigoLote: string; fechaVencimiento: string; cantidadActual: number }>;
};

type CarritoItem = {
  productoId: number;
  nombreProducto: string;
  cantidad: number;
  precioUnitario: number;
  subtotal: number;
  imagen: string;
  asignaciones: Array<{ loteId: number; codigoLote: string; cantidad: number }>;
};

@Component({
  selector: 'app-pos-venta',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './pos-venta.component.html',
  styleUrls: ['./pos-venta.component.css']
})
export class PosVentaComponent implements OnInit {
  catalogo: CatalogoProductoItem[] = [];
  categoriasUnicas: string[] = [];
  ticketActual: Venta | null = null;
  generandoPdf = false;
  ticketImpresion: {
    fecha: Date;
    nroComprobante: string;
    metodoPago: string;
    total: number;
    items: Array<{ nombreProducto: string; cantidad: number; precioUnitario: number; subtotal: number }>;
  } | null = null;
  
  categoriaSeleccionada: string = 'TODAS';
  terminoBusqueda: string = '';

  carrito: CarritoItem[] = [];
  venta = {
    usuarioId: 1, 
    nroComprobante: 'B001-' + Math.floor(Math.random() * 1000000).toString().padStart(6, '0'),
    metodoPago: 'Efectivo',
    total: 0
  };

  constructor(
    private loteService: LoteService,
    private productoService: ProductoService,
    private ventaService: VentaService
  ) {}

  ngOnInit(): void {
    this.cargarCatalogo();
  }

  cargarCatalogo() {
    forkJoin({
      productos: this.productoService.listar().pipe(catchError(() => of([] as Producto[]))),
      lotes: this.loteService.listar().pipe(catchError(() => of([] as any[])))
    }).subscribe(({ productos, lotes }) => {
      const lotesApi = (lotes as LoteApi[]).map(l => this.normalizeLote(l));
      this.catalogo = this.buildCatalogo(productos, lotesApi);
      const cats = this.catalogo.map(p => p.categoriaNombre).filter(Boolean);
      this.categoriasUnicas = [...new Set(cats)];
    });
  }

  get productosFiltrados(): CatalogoProductoItem[] {
    const term = this.terminoBusqueda.trim().toLowerCase();
    return this.catalogo.filter(p => {
      const matchCat = this.categoriaSeleccionada === 'TODAS' || p.categoriaNombre === this.categoriaSeleccionada;
      const matchNom =
        !term ||
        p.nombreComercial.toLowerCase().includes(term) ||
        p.nombreGenerico.toLowerCase().includes(term);
      return matchCat && matchNom;
    });
  }

  get sugerencias() {
    const term = this.terminoBusqueda.trim().toLowerCase();
    if (term.length < 2) return [];
    return this.productosFiltrados.slice(0, 8);
  }

  agregarAlCarrito(producto: CatalogoProductoItem) {
    if (producto.stockTotal <= 0) {
      alert('Este producto no tiene stock disponible.');
      return;
    }

    const itemExistente = this.carrito.find(i => i.productoId === producto.productoId);
    if (!itemExistente) {
      const nuevo: CarritoItem = {
        productoId: producto.productoId,
        nombreProducto: producto.nombreComercial,
        cantidad: 0,
        precioUnitario: producto.precioVentaUnitario,
        subtotal: 0,
        imagen: producto.imagenUrl,
        asignaciones: []
      };
      this.carrito.push(nuevo);
      this.asignarUnidades(producto, nuevo, 1);
      this.calcularTotal();
      return;
    }

    const ok = this.asignarUnidades(producto, itemExistente, 1);
    if (!ok) {
      alert(`Stock insuficiente. Solo hay ${producto.stockTotal} disponibles.`);
      return;
    }
    this.calcularTotal();
  }

  aumentarCantidad(index: number) {
    const item = this.carrito[index];
    const producto = this.catalogo.find(p => p.productoId === item.productoId);
    if (!producto) return;
    const ok = this.asignarUnidades(producto, item, 1);
    if (!ok) alert(`Stock insuficiente. Solo hay ${producto.stockTotal} disponibles.`);
    this.calcularTotal();
  }

  disminuirCantidad(index: number) {
    const item = this.carrito[index];
    if (item.cantidad <= 1) return;
    this.desasignarUnidades(item, 1);
    this.calcularTotal();
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
      detalles: this.buildDetallesFromCarrito()
    };

    this.ventaService.registrar(ventaRequest).subscribe({
      next: (res) => {
        alert('Venta realizada con éxito');
        this.ticketActual = res;
        this.ticketImpresion = ticketSnapshot;
        this.carrito = [];
        this.venta.total = 0;
        this.venta.nroComprobante = 'B001-' + Math.floor(Math.random() * 1000000).toString().padStart(6, '0');
        this.cargarCatalogo();
      },
      error: (err) => alert('Error al procesar la venta: ' + err.message)
    });
  }

  seleccionarSugerencia(producto: CatalogoProductoItem) {
    this.agregarAlCarrito(producto);
    this.terminoBusqueda = '';
  }

  private normalizeLote(lote: LoteApi): LoteApi {
    const productoId = lote.productoId ?? lote.producto?.producto_id;
    const nombreProducto = lote.nombreProducto ?? lote.producto?.nombreComercial ?? '';
    const nombreGenerico = lote.nombreGenerico ?? lote.producto?.nombreGenerico ?? '';
    const presentacionProducto = lote.presentacionProducto ?? lote.producto?.presentacion ?? '';
    const categoriaNombre = lote.categoriaNombre ?? lote.producto?.categoria?.nombre ?? 'Sin Categoría';
    const imagenUrl = lote.imagenUrl ?? lote.producto?.imagenUrl ?? '';
    const precioVenta =
      typeof lote.precioVenta === 'number'
        ? lote.precioVenta
        : typeof lote.precioVenta === 'string'
          ? Number(lote.precioVenta)
          : lote.producto?.precioVentaUnitario ?? 0;

    return {
      ...lote,
      productoId,
      nombreProducto,
      nombreGenerico,
      presentacionProducto,
      categoriaNombre,
      imagenUrl,
      precioVenta: Number.isFinite(precioVenta) ? precioVenta : 0
    };
  }

  private buildCatalogo(productos: Producto[], lotes: LoteApi[]): CatalogoProductoItem[] {
    const mapLotesByProducto = new Map<number, LoteApi[]>();
    const mapLotesByKey = new Map<string, LoteApi[]>();
    for (const l of lotes) {
      const pid = l.productoId;
      if (pid) {
        const arr = mapLotesByProducto.get(pid) ?? [];
        arr.push(l);
        mapLotesByProducto.set(pid, arr);
        continue;
      }

      const nombre = (l.nombreProducto ?? '').trim();
      const pres = (l.presentacionProducto ?? '').trim();
      if (!nombre) continue;
      const key = `${nombre}|||${pres}`;
      const arr = mapLotesByKey.get(key) ?? [];
      arr.push(l);
      mapLotesByKey.set(key, arr);
    }

    const catalogo = productos.map(p => {
      const pid = p.producto_id ?? 0;
      const key = `${(p.nombreComercial ?? '').trim()}|||${(p.presentacion ?? '').trim()}`;
      const lotesFuente = (mapLotesByProducto.get(pid) ?? []).length
        ? (mapLotesByProducto.get(pid) ?? [])
        : (mapLotesByKey.get(key) ?? []);

      const lotesProducto = lotesFuente
        .map(l => ({
          loteId: l.lote_id ?? 0,
          codigoLote: l.codigoLote ?? '',
          fechaVencimiento: (l.fechaVencimiento ?? '').toString(),
          cantidadActual: l.cantidadActual ?? 0
        }))
        .filter(x => x.loteId > 0)
        .sort((a, b) => (new Date(a.fechaVencimiento).getTime() || 0) - (new Date(b.fechaVencimiento).getTime() || 0));

      const stockTotal = lotesProducto.reduce((acc, x) => acc + (x.cantidadActual ?? 0), 0);
      return {
        productoId: pid,
        nombreComercial: p.nombreComercial ?? '',
        nombreGenerico: p.nombreGenerico ?? '',
        presentacion: p.presentacion ?? '',
        categoriaNombre: p.categoria?.nombre ?? 'Sin Categoría',
        imagenUrl: p.imagenUrl ?? '',
        precioVentaUnitario: p.precioVentaUnitario ?? 0,
        stockTotal,
        lotes: lotesProducto
      };
    });

    return catalogo.sort((a, b) => a.nombreComercial.localeCompare(b.nombreComercial));
  }

  private asignarUnidades(producto: CatalogoProductoItem, item: CarritoItem, unidades: number): boolean {
    const totalEnCarrito = this.carrito.find(i => i.productoId === producto.productoId)?.cantidad ?? 0;
    if (totalEnCarrito + unidades > producto.stockTotal) return false;

    let restantes = unidades;
    for (const lote of producto.lotes) {
      if (restantes <= 0) break;
      const yaAsignado = item.asignaciones.find(a => a.loteId === lote.loteId)?.cantidad ?? 0;
      const disponible = (lote.cantidadActual ?? 0) - yaAsignado;
      if (disponible <= 0) continue;
      const tomar = Math.min(disponible, restantes);
      const existente = item.asignaciones.find(a => a.loteId === lote.loteId);
      if (existente) {
        existente.cantidad += tomar;
      } else {
        item.asignaciones.push({ loteId: lote.loteId, codigoLote: lote.codigoLote, cantidad: tomar });
      }
      restantes -= tomar;
    }

    item.cantidad += unidades;
    item.subtotal = item.cantidad * item.precioUnitario;
    return restantes === 0;
  }

  private desasignarUnidades(item: CarritoItem, unidades: number): void {
    let restantes = unidades;
    for (let i = item.asignaciones.length - 1; i >= 0 && restantes > 0; i--) {
      const a = item.asignaciones[i];
      const quitar = Math.min(a.cantidad, restantes);
      a.cantidad -= quitar;
      restantes -= quitar;
      if (a.cantidad <= 0) item.asignaciones.splice(i, 1);
    }
    item.cantidad = Math.max(0, item.cantidad - unidades);
    item.subtotal = item.cantidad * item.precioUnitario;
    if (item.cantidad === 0) {
      const idx = this.carrito.findIndex(x => x.productoId === item.productoId);
      if (idx >= 0) this.carrito.splice(idx, 1);
    }
  }

  private buildDetallesFromCarrito(): Array<{ loteId: number; cantidad: number; precioUnitario: number }> {
    const detalleMap = new Map<number, { loteId: number; cantidad: number; precioUnitario: number }>();
    for (const item of this.carrito) {
      for (const a of item.asignaciones) {
        const prev = detalleMap.get(a.loteId);
        if (prev) {
          prev.cantidad += a.cantidad;
        } else {
          detalleMap.set(a.loteId, { loteId: a.loteId, cantidad: a.cantidad, precioUnitario: item.precioUnitario });
        }
      }
    }
    return Array.from(detalleMap.values());
  }

  async previsualizarBoletaPdf() {
    if (!this.ticketImpresion || this.generandoPdf) return;
    const win = window.open('', '_blank');
    if (!win) return;

    const blob = await this.generarBoletaPdfBlob();
    if (!blob) return;

    const url = URL.createObjectURL(blob);
    win.location.href = url;
    win.focus();
    window.setTimeout(() => URL.revokeObjectURL(url), 60_000);
  }

  async descargarBoletaPdf() {
    if (!this.ticketImpresion || this.generandoPdf) return;
    const blob = await this.generarBoletaPdfBlob();
    if (!blob) return;

    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${this.ticketImpresion.nroComprobante}.pdf`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    window.setTimeout(() => URL.revokeObjectURL(url), 60_000);
  }

  private async generarBoletaPdfBlob(): Promise<Blob | null> {
    if (!this.ticketImpresion) return null;
    const ticketEl = document.getElementById('ticket-print');
    if (!ticketEl) return null;

    this.generandoPdf = true;
    try {
      const [{ default: jsPDF }, { default: html2canvas }] = await Promise.all([
        import('jspdf'),
        import('html2canvas')
      ]);

      const wrapper = document.createElement('div');
      wrapper.style.position = 'fixed';
      wrapper.style.left = '-10000px';
      wrapper.style.top = '0';
      wrapper.style.width = '320px';
      wrapper.style.padding = '12px';
      wrapper.style.background = '#ffffff';
      wrapper.style.color = '#000000';
      wrapper.style.fontFamily = 'Arial, sans-serif';
      wrapper.innerHTML = ticketEl.innerHTML;
      document.body.appendChild(wrapper);

      const canvas = await html2canvas(wrapper, {
        scale: 2,
        backgroundColor: '#ffffff'
      });

      document.body.removeChild(wrapper);

      const imgData = canvas.toDataURL('image/png');
      const pdfWidthMm = 80;
      const imgHeightMm = (canvas.height * pdfWidthMm) / canvas.width;
      const pdf = new jsPDF({
        orientation: 'portrait',
        unit: 'mm',
        format: [pdfWidthMm, imgHeightMm + 8]
      });
      pdf.addImage(imgData, 'PNG', 0, 0, pdfWidthMm, imgHeightMm);
      return pdf.output('blob');
    } finally {
      this.generandoPdf = false;
    }
  }
}
