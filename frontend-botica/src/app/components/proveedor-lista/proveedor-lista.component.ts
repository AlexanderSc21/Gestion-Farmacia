import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ProveedorService } from '../../services/proveedor.service';
import { Proveedor } from '../../models/models';
import { ProveedorRegistroComponent } from '../proveedor-registro/proveedor-registro.component';

@Component({
  selector: 'app-proveedor-lista',
  standalone: true,
  imports: [CommonModule, ProveedorRegistroComponent],
  templateUrl: './proveedor-lista.component.html'
})
export class ProveedorListaComponent implements OnInit {
  proveedores: Proveedor[] = [];
  mostrarFormulario = false;
  proveedorEditId?: number;

  constructor(private proveedorService: ProveedorService) {}

  ngOnInit(): void {
    this.obtenerProveedores();
  }

  obtenerProveedores() {
    this.proveedorService.listar().subscribe({
      next: (data) => this.proveedores = data,
      error: (err) => console.error('Error al listar proveedores:', err)
    });
  }

  nuevoProveedor() {
    this.proveedorEditId = undefined;
    this.mostrarFormulario = true;
  }

  editarProveedor(id: number) {
    this.proveedorEditId = id;
    this.mostrarFormulario = true;
  }

  cerrarFormulario() {
    this.mostrarFormulario = false;
    this.proveedorEditId = undefined;
  }

  onProveedorGuardado() {
    this.cerrarFormulario();
    this.obtenerProveedores();
  }

  darDeBaja(id: number) {
    if (confirm('¿Estás seguro de que deseas dar de baja a este proveedor?')) {
      this.proveedorService.desactivar(id).subscribe(() => {
        alert('Proveedor desactivado correctamente');
        this.obtenerProveedores();
      });
    }
  }

  activar(id: number) {
    if (confirm('¿Deseas reactivar este proveedor para futuras compras?')) {
      this.proveedorService.activar(id).subscribe(() => {
        alert('Proveedor reactivado con éxito');
        this.obtenerProveedores();
      });
    }
  }
}
