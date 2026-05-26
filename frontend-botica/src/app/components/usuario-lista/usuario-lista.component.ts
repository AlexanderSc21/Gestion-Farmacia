import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { UsuarioService } from '../../services/usuario.service';
import { Usuario } from '../../models/models';
import { RegistroComponent } from '../registro/registro.component';

@Component({
  selector: 'app-usuario-lista',
  standalone: true,
  imports: [CommonModule, RegistroComponent],
  templateUrl: './usuario-lista.component.html'
})
export class UsuarioListaComponent implements OnInit {
  usuarios: Usuario[] = [];
  mostrarFormulario = false;
  usuarioEditId?: number;

  constructor(private usuarioService: UsuarioService) {}

  ngOnInit(): void {
    this.obtenerUsuarios();
  }

  obtenerUsuarios() {
    this.usuarioService.listar().subscribe(data => {
      this.usuarios = data;
    });
  }

  nuevoUsuario() {
    this.usuarioEditId = undefined;
    this.mostrarFormulario = true;
  }

  editarUsuario(id: number) {
    this.usuarioEditId = id;
    this.mostrarFormulario = true;
  }

  cerrarFormulario() {
    this.mostrarFormulario = false;
    this.usuarioEditId = undefined;
  }

  onUsuarioGuardado() {
    this.cerrarFormulario();
    this.obtenerUsuarios();
  }

  darDeBaja(id: number) {
    if (confirm('¿Estás seguro de que deseas dar de baja a este empleado?')) {
      this.usuarioService.desactivar(id).subscribe(() => {
        alert('Empleado desactivado con éxito');
        this.obtenerUsuarios();
      });
    }
  }

  activar(id: number) {
    if (confirm('¿Estás seguro de que deseas reactivar a este empleado?')) {
      this.usuarioService.activar(id).subscribe(() => {
        alert('Empleado reactivado con éxito');
        this.obtenerUsuarios();
      });
    }
  }
}
