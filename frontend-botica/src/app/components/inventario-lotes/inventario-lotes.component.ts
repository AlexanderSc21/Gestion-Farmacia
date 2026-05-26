import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { LoteService } from '../../services/lote.service';
import { Lote } from '../../models/models';

interface LoteExtendida extends Lote {
  diasRestantes: number;
  estadoSemaforo: string;
  nombreProducto?: string;
  presentacionProducto?: string;
  categoriaNombre?: string;
  nombreProveedor?: string;
  nroFactura?: string;
}

@Component({
  selector: 'app-inventario-lotes',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule],
  templateUrl: './inventario-lotes.component.html'
})
export class InventarioLotesComponent implements OnInit {
  lotes: LoteExtendida[] = [];
  categoriasUnicas: string[] = [];
  proveedoresUnicos: string[] = [];

  filtro = {
    texto: '',
    estado: 'TODOS',
    categoria: 'TODAS',
    proveedor: 'TODOS'
  };

  constructor(private loteService: LoteService) {}

  ngOnInit(): void {
    this.obtenerLotes();
  }

  obtenerLotes() {
    this.loteService.listar().subscribe({
      next: (data) => {
        this.lotes = data.map(lote => {
          const dias = this.calcularDiasRestantes(lote.fechaVencimiento);
          return {
            ...lote,
            diasRestantes: dias,
            estadoSemaforo: this.determinarColor(dias)
          } as LoteExtendida;
        });
        this.lotes.sort((a, b) => a.diasRestantes - b.diasRestantes);
        this.categoriasUnicas = [
          ...new Set(this.lotes.map(l => this.getCategoriaNombre(l)).filter(Boolean))
        ] as string[];
        this.proveedoresUnicos = [
          ...new Set(this.lotes.map(l => this.getNombreProveedor(l)).filter(Boolean))
        ] as string[];
      },
      error: (err) => console.error('Error al listar lotes:', err)
    });
  }

  calcularDiasRestantes(fechaVencimiento: string): number {
    const fechaVenc = new Date(fechaVencimiento);
    const hoy = new Date();
    const diferencia = fechaVenc.getTime() - hoy.getTime();
    return Math.ceil(diferencia / (1000 * 3600 * 24));
  }

  determinarColor(dias: number): string {
    if (dias <= 0) return 'danger';
    if (dias <= 90) return 'danger';
    if (dias <= 180) return 'warning';
    return 'success';
  }

  obtenerEtiquetaEstado(dias: number): string {
    if (dias <= 0) return 'VENCIDO';
    if (dias <= 90) return 'Próximo a Vencer';
    if (dias <= 180) return 'En Alerta';
    return 'Vigente';
  }

  getNombreProducto(lote: LoteExtendida): string {
    const fromNested = (lote as any)?.producto?.nombreComercial;
    return (fromNested ?? lote.nombreProducto ?? '').toString();
  }

  getNombreGenerico(lote: LoteExtendida): string {
    const fromNested = (lote as any)?.producto?.nombreGenerico;
    return (fromNested ?? '').toString();
  }

  getCategoriaNombre(lote: LoteExtendida): string {
    const fromNested = (lote as any)?.producto?.categoria?.nombre;
    return (fromNested ?? lote.categoriaNombre ?? '').toString();
  }

  getNombreProveedor(lote: LoteExtendida): string {
    const fromNested = (lote as any)?.detalleCompra?.compra?.proveedor?.razonSocial;
    return (fromNested ?? lote.nombreProveedor ?? '').toString();
  }

  getNroFactura(lote: LoteExtendida): string {
    const fromNested = (lote as any)?.detalleCompra?.compra?.nroFactura;
    return (fromNested ?? lote.nroFactura ?? '').toString();
  }

  get lotesFiltrados(): LoteExtendida[] {
    const texto = this.filtro.texto.trim().toLowerCase();
    return this.lotes.filter(l => {
      const matchTexto =
        !texto ||
        (l.codigoLote ?? '').toLowerCase().includes(texto) ||
        this.getNombreProducto(l).toLowerCase().includes(texto) ||
        this.getNombreGenerico(l).toLowerCase().includes(texto);

      const etiqueta = this.obtenerEtiquetaEstado(l.diasRestantes);
      const matchEstado = this.filtro.estado === 'TODOS' || etiqueta === this.filtro.estado;

      const categoria = this.getCategoriaNombre(l);
      const matchCategoria = this.filtro.categoria === 'TODAS' || categoria === this.filtro.categoria;

      const proveedor = this.getNombreProveedor(l);
      const matchProveedor = this.filtro.proveedor === 'TODOS' || proveedor === this.filtro.proveedor;

      return matchTexto && matchEstado && matchCategoria && matchProveedor;
    });
  }

  limpiarFiltros() {
    this.filtro = { texto: '', estado: 'TODOS', categoria: 'TODAS', proveedor: 'TODOS' };
  }
}
