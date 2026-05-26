import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, ActivatedRoute, RouterModule } from '@angular/router';
import { ProductoService } from '../../services/producto.service';
import { CategoriaService } from '../../services/categoria.service';
import { Producto, Categoria } from '../../models/models';

@Component({
  selector: 'app-producto-registro',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './producto-registro.component.html'
})
export class ProductoRegistroComponent implements OnInit {
  @Input() embedded = false;
  @Output() saved = new EventEmitter<void>();
  @Output() cancelled = new EventEmitter<void>();

  private _productoId?: number;
  @Input() set productoId(value: number | undefined) {
    this._productoId = value;
    this.aplicarModoDesdeId();
  }
  get productoId(): number | undefined {
    return this._productoId;
  }

  producto: Producto = this.crearProductoVacio();

  categorias: Categoria[] = [];
  esEdicion: boolean = false;

  constructor(
    private productoService: ProductoService,
    private categoriaService: CategoriaService,
    private router: Router,
    private route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    this.cargarCategorias();
    
    if (this._productoId != null) {
      this.aplicarModoDesdeId();
      return;
    }

    const idParam = this.route.snapshot.paramMap.get('id');
    if (idParam) this.productoId = +idParam;
  }

  private crearProductoVacio(): Producto {
    return {
      nombreComercial: '',
      nombreGenerico: '',
      presentacion: '',
      precioVentaUnitario: 0,
      stockMinimo: 0,
      imagenUrl: '',
      categoria: { categoria_id: undefined, nombre: '', descripcion: '' }
    };
  }

  private aplicarModoDesdeId() {
    if (this._productoId != null) {
      this.esEdicion = true;
      this.cargarProducto(this._productoId);
    } else {
      this.esEdicion = false;
      this.producto = this.crearProductoVacio();
    }
  }

  cargarCategorias() {
    this.categoriaService.listar().subscribe(data => this.categorias = data);
  }

  cargarProducto(id: number) {
    this.productoService.listar().subscribe(productos => {
      const prodFound = productos.find(p => p.producto_id === id);
      if (prodFound) {
        this.producto = prodFound;
        if (!this.producto.categoria) {
            this.producto.categoria = { categoria_id: undefined, nombre: '', descripcion: '' };
        }
      }
    });
  }

  registrarProducto() {
    if (this.esEdicion && this._productoId) {
      this.productoService.actualizar(this._productoId, this.producto)
        .subscribe({
          next: () => {
            alert('¡Medicamento actualizado con éxito!');
            if (this.embedded) {
              this.saved.emit();
            } else {
              this.router.navigate(['/productos']);
            }
          },
          error: (err) => console.error(err)
        });
    } else {
      this.productoService.registrar(this.producto)
        .subscribe({
          next: () => {
            alert('¡Medicamento registrado con éxito!');
            if (this.embedded) {
              this.saved.emit();
              this.producto = this.crearProductoVacio();
            } else {
              this.router.navigate(['/productos']);
            }
          },
          error: (err) => console.error(err)
        });
    }
  }

  cancelar() {
    if (this.embedded) {
      this.cancelled.emit();
      return;
    }
    this.router.navigate(['/productos']);
  }
}
