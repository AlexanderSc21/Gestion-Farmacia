import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-devoluciones',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './devoluciones.component.html'
})
export class DevolucionesComponent {
  // Variables del buscador
  nroComprobante: string = '';
  ventaEncontrada: any = null;
  detallesVenta: any[] = [];
  mensajeError: string = '';

  // Variables para procesar la devolución
  detalleSeleccionado: any = null;
  cantidadDevolver: number = 1;
  motivoDevolucion: string = '';

  constructor(private http: HttpClient) {}

  buscarTicket() {
    this.mensajeError = '';
    this.ventaEncontrada = null;
    this.detallesVenta = [];
    this.detalleSeleccionado = null;

    if (!this.nroComprobante.trim()) return;

    this.http.get<any>(`http://localhost:8080/api/ventas/buscar/${this.nroComprobante}`).subscribe({
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
      alert('Cantidad inválida. Verifica lo que compró el cliente.');
      return;
    }
    if (!this.motivoDevolucion.trim()) {
      alert('El motivo de la devolución es obligatorio por políticas de calidad.');
      return;
    }

    const payload = {
      ventaId: this.ventaEncontrada.venta_id,
      loteId: this.detalleSeleccionado.lote.lote_id,
      usuarioId: 1, // ID del Administrador (luego lo ataremos al login)
      cantidad: this.cantidadDevolver,
      motivo: this.motivoDevolucion
    };

    this.http.post('http://localhost:8080/api/devoluciones/procesar', payload).subscribe({
      next: () => {
        alert('¡ÉXITO! La devolución se procesó correctamente. El dinero se restó de caja y el stock regresó al estante.');
        this.detalleSeleccionado = null; 
        this.buscarTicket(); // Volvemos a buscar el ticket para refrescar la vista
      },
      error: (err) => {
        alert('Hubo un error al procesar la devolución.');
        console.error(err);
      }
    });
  }
}
