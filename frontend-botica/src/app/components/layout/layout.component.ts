import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { Usuario } from '../../models/models';

@Component({
  selector: 'app-layout',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule],
  templateUrl: './layout.component.html',
  styleUrls: ['./layout.component.css']
})
export class LayoutComponent {
  isSidebarOpen = true;
  usuario$ = this.authService.user$;
  isDarkMode = false;

  readonly ROLE_ADMIN = 1;
  readonly ROLE_VENDEDOR = 2;
  readonly ROLE_ALMACENERO = 3;
  
  authMode: 'login' | 'register' | 'none' = 'none';
  loginData = { email: '', password: '' };
  regData: Usuario = {
    nombre_completo: '',
    email: '',
    password_hash: '',
    activo: true,
    rol: { rol_id: 1, nombre: 'Administrador', descripcion: '' }
  };
  error = '';

  constructor(private authService: AuthService) {
    if (typeof window !== 'undefined') {
      this.isSidebarOpen = !window.matchMedia('(max-width: 768px)').matches;
      const savedTheme = localStorage.getItem('botica_theme');
      if (savedTheme === 'dark' || savedTheme === 'light') {
        this.isDarkMode = savedTheme === 'dark';
      } else {
        this.isDarkMode = window.matchMedia('(prefers-color-scheme: dark)').matches;
      }
      this.applyTheme(this.isDarkMode);
    }
    this.authService.user$.subscribe(user => {
      if (user) this.authMode = 'none';
    });
  }

  toggleSidebar() {
    this.isSidebarOpen = !this.isSidebarOpen;
  }

  closeSidebar() {
    this.isSidebarOpen = false;
  }

  toggleTheme() {
    this.isDarkMode = !this.isDarkMode;
    if (typeof window !== 'undefined') {
      localStorage.setItem('botica_theme', this.isDarkMode ? 'dark' : 'light');
    }
    this.applyTheme(this.isDarkMode);
  }

  private applyTheme(isDark: boolean) {
    if (typeof document === 'undefined') return;
    document.body.classList.toggle('theme-dark', isDark);
  }

  tieneRol(user: Usuario, roles: Array<string | number>): boolean {
    const roleId = Number(user?.rol?.rol_id ?? NaN);
    const roleName = (user?.rol?.nombre ?? '').trim().toLowerCase();

    return roles.some(r => {
      if (typeof r === 'number') {
        return Number.isFinite(roleId) && roleId === r;
      }
      return !!roleName && r.trim().toLowerCase() === roleName;
    });
  }

  onLogin() {
    this.error = '';
    this.authService.login(this.loginData.email, this.loginData.password).subscribe({
      next: () => {
        this.authMode = 'none';
        this.loginData = { email: '', password: '' };
      },
      error: () => this.error = 'Credenciales inválidas'
    });
  }

  onRegister() {
    this.authService.register(this.regData).subscribe({
      next: () => {
        alert('Cuenta creada. Ahora inicia sesión.');
        this.authMode = 'login';
      },
      error: () => alert('Error al registrar')
    });
  }

  logout() {
    this.authService.logout();
  }
}
