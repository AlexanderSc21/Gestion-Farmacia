import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { ProveedorService } from '../../services/proveedor.service';
import { Proveedor } from '../../models/models';

@Component({
  selector: 'app-proveedor-registro',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './proveedor-registro.component.html'
})
export class ProveedorRegistroComponent implements OnInit {
  @Input() embedded = false;
  @Output() saved = new EventEmitter<void>();
  @Output() cancelled = new EventEmitter<void>();

  private _proveedorId?: number;
  @Input() set proveedorId(value: number | undefined) {
    this._proveedorId = value;
    this.aplicarModoDesdeId();
  }
  get proveedorId(): number | undefined {
    return this._proveedorId;
  }
  
  proveedor: Proveedor = this.crearProveedorVacio();

  esEdicion: boolean = false;

  constructor(
    private proveedorService: ProveedorService,
    private router: Router,
    private route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    if (this._proveedorId != null) {
      this.aplicarModoDesdeId();
      return;
    }

    const idParam = this.route.snapshot.paramMap.get('id');
    if (idParam) this.proveedorId = +idParam;
  }

  private crearProveedorVacio(): Proveedor {
    return {
      ruc: '',
      razonSocial: '',
      telefono: '',
      email: '',
      direccion: '',
      activo: true
    };
  }

  private aplicarModoDesdeId() {
    if (this._proveedorId != null) {
      this.esEdicion = true;
      this.cargarProveedor(this._proveedorId);
    } else {
      this.esEdicion = false;
      this.proveedor = this.crearProveedorVacio();
    }
  }

  cargarProveedor(id: number) {
    this.proveedorService.listar().subscribe(proveedores => {
      const provFound = proveedores.find(p => p.proveedor_id === id);
      if (provFound) {
        this.proveedor = provFound;
      }
    });
  }

  guardarProveedor() {
    if (this.esEdicion && this._proveedorId) {
      this.proveedorService.actualizar(this._proveedorId, this.proveedor)
        .subscribe({
          next: () => {
            alert('¡Proveedor actualizado con éxito!');
            if (this.embedded) {
              this.saved.emit();
            } else {
              this.router.navigate(['/proveedores']);
            }
          },
          error: (err) => console.error('Error al actualizar', err)
        });
    } else {
      this.proveedorService.registrar(this.proveedor)
        .subscribe({
          next: () => {
            alert('¡Proveedor registrado con éxito!');
            if (this.embedded) {
              this.saved.emit();
              this.proveedor = this.crearProveedorVacio();
            } else {
              this.router.navigate(['/proveedores']);
            }
          },
          error: (err) => console.error('Error al registrar', err)
        });
    }
  }

  cancelar() {
    if (this.embedded) {
      this.cancelled.emit();
      return;
    }
    this.router.navigate(['/proveedores']);
  }
}
