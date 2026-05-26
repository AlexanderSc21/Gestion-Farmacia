import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { VentaService } from '../../services/venta.service';
import { DevolucionService } from '../../services/devolucion.service';

@Component({
  selector: 'app-devoluciones',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './devoluciones.component.html'
})
export class DevolucionesComponent {
  nroComprobante: string = '';
  ventaEncontrada: any = null;
  detallesVenta: any[] = [];
  mensajeError: string = '';

  detalleSeleccionado: any = null;
  cantidadDevolver: number = 1;
  motivoDevolucion: string = '';

  constructor(
    private ventaService: VentaService,
    private devolucionService: DevolucionService
  ) {}

  buscarTicket() {
    this.mensajeError = '';
    this.ventaEncontrada = null;
    this.detallesVenta = [];
    this.detalleSeleccionado = null;

    if (!this.nroComprobante.trim()) return;

    this.ventaService.buscarPorComprobante(this.nroComprobante).subscribe({
      next: (data) => {
        this.ventaEncontrada = data.venta;
        this.detallesVenta = data.detalles;
      },
      error: (err) => {
        this.mensajeError = 'No se encontró el comprobante o hubo un error de conexión.';
      }
    });
  }

  prepararDevolucion(detalle: any) {
    this.detalleSeleccionado = detalle;
    this.cantidadDevolver = 1;
    this.motivoDevolucion = '';
  }

  procesarDevolucion() {
    if (this.cantidadDevolver > this.detalleSeleccionado.cantidad || this.cantidadDevolver <= 0) {
      alert('Cantidad inválida.');
      return;
    }
    if (!this.motivoDevolucion.trim()) {
      alert('El motivo de la devolución es obligatorio.');
      return;
    }

    const payload = {
      ventaId: this.ventaEncontrada.venta_id,
      loteId: this.detalleSeleccionado.lote.lote_id,
      usuarioId: 1,
      cantidad: this.cantidadDevolver,
      motivo: this.motivoDevolucion
    };

    this.devolucionService.procesar(payload).subscribe({
      next: () => {
        alert('¡ÉXITO! La devolución se procesó correctamente.');
        this.detalleSeleccionado = null; 
        this.buscarTicket();
      },
      error: (err) => {
        alert('Hubo un error al procesar la devolución.');
        console.error(err);
      }
    });
  }

  get montoDevolucion(): number {
    if (!this.detalleSeleccionado) return 0;
    const precio = Number(this.detalleSeleccionado?.precioUnitario ?? 0);
    const cantidad = Number(this.cantidadDevolver ?? 0);
    return precio * cantidad;
  }
}
