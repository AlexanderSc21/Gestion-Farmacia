import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ProductoService } from '../../services/producto.service';
import { Producto } from '../../models/models';
import { ProductoRegistroComponent } from '../producto-registro/producto-registro.component';

@Component({
  selector: 'app-producto-lista',
  standalone: true,
  imports: [CommonModule, ProductoRegistroComponent],
  templateUrl: './producto-lista.component.html'
})
export class ProductoListaComponent implements OnInit {
  productos: Producto[] = [];
  mostrarFormulario = false;
  productoEditId?: number;

  constructor(private productoService: ProductoService) {}

  ngOnInit(): void {
    this.obtenerProductos();
  }

  obtenerProductos() {
    this.productoService.listar().subscribe({
      next: (data) => {
        this.productos = data;
      },
      error: (err) => {
        console.error('Error al traer los productos:', err);
      }
    });
  }

  nuevoProducto() {
    this.productoEditId = undefined;
    this.mostrarFormulario = true;
  }

  editarProducto(id: number) {
    this.productoEditId = id;
    this.mostrarFormulario = true;
  }

  cerrarFormulario() {
    this.mostrarFormulario = false;
    this.productoEditId = undefined;
  }

  onProductoGuardado() {
    this.cerrarFormulario();
    this.obtenerProductos();
  }

  eliminar(id: number) {
    if (confirm('¿Estás seguro de que deseas eliminar este medicamento del catálogo?')) {
      this.productoService.eliminar(id).subscribe({
        next: () => {
          alert('Producto eliminado correctamente.');
          this.obtenerProductos();
        },
        error: (err) => {
          console.error('Error al eliminar:', err);
          alert('No se pudo eliminar. Verifica si el producto está siendo usado en otras tablas.');
        }
      });
    }
  }
}
