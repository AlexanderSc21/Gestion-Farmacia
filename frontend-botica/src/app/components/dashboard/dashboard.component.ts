import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
    <div class="container-fluid p-4">
      
      <!-- Banner Principal de Bienvenida -->
      <div class="row mb-4">
        <div class="col-12">
          <div class="card border-0 shadow-sm rounded-4 welcome-banner p-5">
            <div class="row align-items-center">
              <div class="col-md-7">
                <h1 class="display-4 fw-bold text-primary mb-3">Farmacia & Botica "Salud Total"</h1>
                <p class="text-muted fs-5 mb-4">
                  Tu bienestar es nuestra prioridad. Gestionamos medicamentos y suministros médicos con los más altos estándares de calidad.
                </p>
                <div class="d-flex gap-3" *ngIf="isLoggedIn">
                  <a routerLink="/ventas" class="btn btn-primary btn-lg px-4 rounded-3 d-flex align-items-center shadow-sm">
                    <i class="bi bi-cart-plus me-2"></i> Nueva Venta
                  </a>
                  <a *ngIf="!isVendedor" routerLink="/lotes" class="btn btn-outline-secondary btn-lg px-4 rounded-3 d-flex align-items-center">
                    <i class="bi bi-box-seam me-2"></i> Ver Inventario
                  </a>
                </div>
                <div class="mt-4" *ngIf="!isLoggedIn">
                  <span class="badge bg-warning text-dark p-2 px-3 fs-6 rounded-pill">
                    <i class="bi bi-info-circle me-2"></i> Por favor, inicia sesión desde la barra superior para acceder
                  </span>
                </div>
              </div>
              <div class="col-md-5 text-center">
                <img src="https://cdn-icons-png.flaticon.com/512/4320/4320337.png" alt="Farmacia Icon" class="img-fluid banner-img">
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Fila de Tarjetas e Información -->
      <div class="row g-4">
        <div class="col-md-4">
          <div class="card border-0 shadow-sm rounded-4 stat-card bg-primary text-white p-4 h-100">
            <div class="d-flex justify-content-between align-items-start">
              <div>
                <p class="text-uppercase small fw-bold mb-1 opacity-75">Ventas de Hoy</p>
                <h2 class="display-5 fw-bold mb-0">{{ isLoggedIn ? 'S/ 1,450.00' : '---' }}</h2>
              </div>
              <i class="bi bi-currency-dollar fs-1 opacity-25"></i>
            </div>
          </div>
        </div>

        <div class="col-md-3">
          <div class="card border-0 shadow-sm rounded-4 stat-card bg-success text-white p-4 h-100">
            <div class="d-flex justify-content-between align-items-start">
              <div>
                <p class="text-uppercase small fw-bold mb-1 opacity-75">Productos en Stock</p>
                <h2 class="display-5 fw-bold mb-0">{{ isLoggedIn ? '524' : '---' }}</h2>
              </div>
              <i class="bi bi-capsule fs-1 opacity-25"></i>
            </div>
          </div>
        </div>

        <div class="col-md-5">
          <div class="card border-0 shadow-sm rounded-4 location-card h-100 overflow-hidden">
            <div class="card-header bg-dark text-white py-3 px-4 border-0">
              <h5 class="mb-0 fw-bold d-flex align-items-center">
                <i class="bi bi-geo-alt-fill me-2"></i> Nuestra Ubicación
              </h5>
            </div>
            <div class="card-body p-4 bg-white">
              <div class="row">
                <div class="col-12 mb-3">
                  <p class="mb-1 fw-bold text-dark">Dirección:</p>
                  <p class="text-muted mb-0">Av. Principal 123, Centro de la Ciudad</p>
                </div>
                <div class="col-12">
                  <p class="mb-1 fw-bold text-dark">Teléfono:</p>
                  <p class="text-muted mb-0">(01) 456-7890</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

    </div>
  `,
  styles: [`
    .welcome-banner { background: #ffffff; }
    .banner-img { max-height: 250px; }
    .stat-card { min-height: 160px; transition: transform 0.3s; }
    .stat-card:hover { transform: translateY(-5px); }
    .location-card .card-header { background-color: #212529 !important; }
    .rounded-4 { border-radius: 1.25rem !important; }
  `]
})
export class DashboardComponent implements OnInit {
  isLoggedIn = false;
  isVendedor = false;

  constructor(private authService: AuthService) {}

  ngOnInit(): void {
    this.isLoggedIn = this.authService.isLoggedIn();
    this.authService.user$.subscribe(user => {
      this.isLoggedIn = !!user;
      const roleName = (user?.rol?.nombre ?? '').trim().toLowerCase();
      this.isVendedor = roleName === 'vendedor';
    });
  }
}
