import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { UsuarioService } from '../../services/usuario.service';
import { Usuario } from '../../models/models';

@Component({
  selector: 'app-registro',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './registro.component.html'
})
export class RegistroComponent implements OnInit {
  @Input() embedded = false;
  @Output() saved = new EventEmitter<void>();
  @Output() cancelled = new EventEmitter<void>();

  private _usuarioId?: number;
  @Input() set usuarioId(value: number | undefined) {
    this._usuarioId = value;
    this.aplicarModoDesdeId();
  }
  get usuarioId(): number | undefined {
    return this._usuarioId;
  }

  usuario: Usuario = this.crearUsuarioVacio();

  esEdicion: boolean = false;

  constructor(
    private usuarioService: UsuarioService,
    private route: ActivatedRoute,
    private router: Router
  ) {}

  ngOnInit(): void {
    if (this._usuarioId != null) {
      this.aplicarModoDesdeId();
      return;
    }

    const idParam = this.route.snapshot.paramMap.get('id');
    if (idParam) this.usuarioId = +idParam;
  }

  private crearUsuarioVacio(): Usuario {
    return {
      nombre_completo: '',
      email: '',
      password_hash: '',
      activo: true,
      rol: { rol_id: 2, nombre: 'Vendedor', descripcion: '' }
    };
  }

  private aplicarModoDesdeId() {
    if (this._usuarioId != null) {
      this.esEdicion = true;
      this.cargarUsuario(this._usuarioId);
    } else {
      this.esEdicion = false;
      this.usuario = this.crearUsuarioVacio();
    }
  }

  cargarUsuario(id: number) {
    this.usuarioService.listar().subscribe(usuarios => {
      const userFound = usuarios.find(u => u.usuario_id === id);
      if (userFound) {
        this.usuario = { ...userFound };
        this.usuario.password_hash = '';
      }
    });
  }

  registrar() {
    if (this.esEdicion && this._usuarioId) {
      this.usuarioService.actualizar(this._usuarioId, this.usuario)
        .subscribe({
          next: () => {
            alert('¡Usuario actualizado con éxito!');
            if (this.embedded) {
              this.saved.emit();
            } else {
              this.router.navigate(['/usuarios']);
            }
          }
        });
    } else {
      this.usuarioService.registrar(this.usuario)
        .subscribe({
          next: () => {
            alert('¡Usuario registrado con éxito!');
            if (this.embedded) {
              this.saved.emit();
              this.usuario = this.crearUsuarioVacio();
            } else {
              this.router.navigate(['/usuarios']);
            }
          }
        });
    }
  }

  cancelar() {
    if (this.embedded) {
      this.cancelled.emit();
      return;
    }
    this.router.navigate(['/usuarios']);
  }
}
