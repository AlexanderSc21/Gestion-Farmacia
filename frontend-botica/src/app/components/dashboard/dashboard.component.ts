import { Component, DestroyRef, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { FormsModule } from '@angular/forms';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { forkJoin, of } from 'rxjs';
import { catchError, finalize } from 'rxjs/operators';
import { Compra, Lote, MovimientoCaja, Producto, Venta } from '../../models/models';
import { CompraService } from '../../services/compra.service';
import { LoteService } from '../../services/lote.service';
import { MovimientoCajaService } from '../../services/movimiento-caja.service';
import { ProductoService } from '../../services/producto.service';
import { VentaService } from '../../services/venta.service';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule],
  template: `
    <div class="dashboard-container">

      <div class="d-flex flex-wrap justify-content-between align-items-center gap-3 mb-4">
        <div>
          <h2 class="fw-bold mb-0">Inicio</h2>
          <div class="text-muted small" *ngIf="isLoggedIn">Panel de control</div>
        </div>
        <div class="btn-group rounded-3 shadow-sm" role="group" aria-label="Selector de dashboard">
          <button
            type="button"
            class="btn"
            [class.btn-primary]="dashboardMode === 'bienvenida'"
            [class.btn-outline-primary]="dashboardMode !== 'bienvenida'"
            (click)="setDashboardMode('bienvenida')"
          >
            Bienvenida
          </button>
          <button
            type="button"
            class="btn"
            [class.btn-primary]="dashboardMode === 'resumen'"
            [class.btn-outline-primary]="dashboardMode !== 'resumen'"
            [disabled]="!isLoggedIn"
            (click)="setDashboardMode('resumen')"
          >
            Resumen
          </button>
        </div>
      </div>

      <ng-container *ngIf="dashboardMode === 'bienvenida'">
        <div class="row mb-4">
          <div class="col-12">
            <div class="card border-0 shadow-sm rounded-4 welcome-banner p-5">
              <div class="row align-items-center">
                <div class="col-md-7">
                  <h1 class="display-4 fw-bold text-primary mb-3">Botica Nuevo Perú</h1>
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
      </ng-container>

      <ng-container *ngIf="dashboardMode === 'resumen'">
        <div class="row g-4">
          <div class="col-12" *ngIf="loadingResumen">
            <div class="alert alert-info border-0 shadow-sm rounded-4 mb-0">
              Cargando resumen...
            </div>
          </div>
          <div class="col-12" *ngIf="resumenError">
            <div class="alert alert-danger border-0 shadow-sm rounded-4 mb-0">
              {{ resumenError }}
            </div>
          </div>

          <div class="col-md-3">
            <div class="card border-0 shadow-sm rounded-4 kpi-card bg-primary text-white p-4 h-100">
              <div class="d-flex justify-content-between align-items-start">
                <div>
                  <div class="text-uppercase small fw-bold opacity-75">Ventas Hoy</div>
                  <div class="display-6 fw-bold">{{ ventasHoyCount }}</div>
                  <div class="small opacity-75">{{ formatMoney(ventasHoyTotal) }}</div>
                </div>
                <i class="bi bi-receipt fs-1 opacity-25"></i>
              </div>
              <div class="mt-3">
                <a routerLink="/ventas" class="btn btn-light btn-sm fw-bold rounded-3">Ir a Ventas</a>
              </div>
            </div>
          </div>

          <div class="col-md-3">
            <div class="card border-0 shadow-sm rounded-4 kpi-card bg-dark text-white p-4 h-100">
              <div class="d-flex justify-content-between align-items-start">
                <div>
                  <div class="text-uppercase small fw-bold opacity-75">Compras Hoy</div>
                  <div class="display-6 fw-bold">{{ comprasHoyCount }}</div>
                  <div class="small opacity-75">{{ formatMoney(comprasHoyTotal) }}</div>
                </div>
                <i class="bi bi-cart-check fs-1 opacity-25"></i>
              </div>
              <div class="mt-3">
                <a routerLink="/compras" class="btn btn-light btn-sm fw-bold rounded-3" [class.disabled]="isVendedor">Ir a Compras</a>
              </div>
            </div>
          </div>

          <div class="col-md-3">
            <div class="card border-0 shadow-sm rounded-4 kpi-card bg-success text-white p-4 h-100">
              <div class="d-flex justify-content-between align-items-start">
                <div>
                  <div class="text-uppercase small fw-bold opacity-75">Caja Hoy</div>
                  <div class="display-6 fw-bold">{{ formatMoney(saldoCaja) }}</div>
                  <div class="small opacity-75">Ing: {{ formatMoney(ingresosCaja) }} · Egr: {{ formatMoney(egresosCaja) }}</div>
                </div>
                <i class="bi bi-safe fs-1 opacity-25"></i>
              </div>
              <div class="mt-3">
                <a routerLink="/caja" class="btn btn-light btn-sm fw-bold rounded-3">Ir a Caja</a>
              </div>
            </div>
          </div>

          <div class="col-md-3">
            <div class="card border-0 shadow-sm rounded-4 kpi-card bg-warning text-dark p-4 h-100">
              <div class="d-flex justify-content-between align-items-start">
                <div>
                  <div class="text-uppercase small fw-bold opacity-75">Por Vencer ({{ inventoryWindowDays }}d)</div>
                  <div class="display-6 fw-bold">{{ inventoryPorVencerCount }}</div>
                  <div class="small opacity-75">Agotados: {{ inventoryAgotadosCount }}</div>
                </div>
                <i class="bi bi-exclamation-triangle fs-1 opacity-25"></i>
              </div>
              <div class="mt-3">
                <a routerLink="/lotes" class="btn btn-dark btn-sm fw-bold rounded-3">Ver Lotes</a>
              </div>
            </div>
          </div>

          <div class="col-md-3">
            <div class="card border-0 shadow-sm rounded-4 kpi-card bg-secondary text-white p-4 h-100">
              <div class="d-flex justify-content-between align-items-start">
                <div>
                  <div class="text-uppercase small fw-bold opacity-75">Catálogo</div>
                  <div class="display-6 fw-bold">{{ productosCount }}</div>
                  <div class="small opacity-75">Productos</div>
                </div>
                <i class="bi bi-capsule-pill fs-1 opacity-25"></i>
              </div>
              <div class="mt-3">
                <a routerLink="/productos" class="btn btn-light btn-sm fw-bold rounded-3" [class.disabled]="isVendedor">Ver Productos</a>
              </div>
            </div>
          </div>

          <div class="col-lg-6">
            <div class="card border-0 shadow-sm rounded-4 h-100">
              <div class="card-header bg-white border-0 p-4 pb-0">
                <div class="d-flex justify-content-between align-items-center gap-3">
                  <h5 class="fw-bold mb-0">Estado de inventario</h5>
                  <select class="form-select form-select-sm w-auto" [ngModel]="inventoryWindowDays" (ngModelChange)="setInventoryWindowDays($event)">
                    <option [ngValue]="7">7 días</option>
                    <option [ngValue]="30">30 días</option>
                    <option [ngValue]="60">60 días</option>
                  </select>
                </div>
              </div>
              <div class="card-body p-4 pt-3">
                <div class="row align-items-center g-3">
                  <div class="col-md-5">
                    <div class="donut-wrap">
                      <svg class="donut" viewBox="0 0 120 120" role="img" aria-label="Estado de inventario">
                        <circle class="donut-bg" cx="60" cy="60" r="42"></circle>
                        <circle
                          *ngFor="let s of inventorySegments"
                          class="donut-segment"
                          cx="60"
                          cy="60"
                          r="42"
                          [attr.stroke]="s.color"
                          [attr.stroke-dasharray]="s.dasharray"
                          [attr.stroke-dashoffset]="s.dashoffset"
                        ></circle>
                      </svg>
                      <div class="donut-center">
                        <div class="donut-total">{{ inventoryTotal }}</div>
                        <div class="donut-subtitle">Lotes</div>
                      </div>
                    </div>
                  </div>
                  <div class="col-md-7">
                    <div class="d-grid gap-2">
                      <div class="d-flex justify-content-between align-items-center" *ngFor="let s of inventorySegments">
                        <div class="d-flex align-items-center gap-2">
                          <span class="legend-dot" [style.background]="s.color"></span>
                          <span class="fw-semibold">{{ s.label }}</span>
                        </div>
                        <div class="d-flex align-items-center gap-2">
                          <span class="text-muted small">{{ s.count }}</span>
                          <span class="badge bg-light text-dark border">{{ s.percent.toFixed(1) }}%</span>
                        </div>
                      </div>
                    </div>
                    <div class="text-muted small mt-3">
                      Por vencer considera lotes con vencimiento dentro de {{ inventoryWindowDays }} días.
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div class="col-lg-6">
            <div class="card border-0 shadow-sm rounded-4 h-100">
              <div class="card-header bg-white border-0 p-4 pb-0">
                <div class="d-flex justify-content-between align-items-center">
                  <h5 class="fw-bold mb-0">Últimas ventas</h5>
                  <a routerLink="/ventas" class="btn btn-outline-primary btn-sm rounded-3">Ver todo</a>
                </div>
              </div>
              <div class="card-body p-4 pt-3">
                <div class="table-responsive">
                  <table class="table table-sm align-middle mb-0">
                    <thead>
                      <tr class="text-muted small">
                        <th>Comprobante</th>
                        <th>Método</th>
                        <th class="text-end">Total</th>
                        <th class="text-end">Fecha</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr *ngFor="let v of ultimasVentas">
                        <td class="fw-bold">{{ v.nroComprobante }}</td>
                        <td>{{ v.metodoPago }}</td>
                        <td class="text-end">{{ formatMoney(v.total) }}</td>
                        <td class="text-end">{{ v.fechaVenta | date:'short' }}</td>
                      </tr>
                      <tr *ngIf="ultimasVentas.length === 0 && !loadingResumen">
                        <td colspan="4" class="text-center text-muted py-4">Sin ventas para mostrar</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </div>

          <div class="col-lg-6">
            <div class="card border-0 shadow-sm rounded-4 h-100">
              <div class="card-header bg-white border-0 p-4 pb-0">
                <div class="d-flex justify-content-between align-items-center">
                  <h5 class="fw-bold mb-0">Movimientos de caja (hoy)</h5>
                  <a routerLink="/caja" class="btn btn-outline-primary btn-sm rounded-3">Ver todo</a>
                </div>
              </div>
              <div class="card-body p-4 pt-3">
                <div class="table-responsive">
                  <table class="table table-sm align-middle mb-0">
                    <thead>
                      <tr class="text-muted small">
                        <th>Tipo</th>
                        <th>Descripción</th>
                        <th class="text-end">Monto</th>
                        <th class="text-end">Fecha</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr *ngFor="let m of ultimosMovimientos">
                        <td class="fw-bold">{{ m.tipoMovimiento?.nombre ?? '—' }}</td>
                        <td class="text-truncate" style="max-width: 260px;">{{ m.descripcion }}</td>
                        <td class="text-end">{{ formatMoney(m.monto) }}</td>
                        <td class="text-end">{{ m.fechaMovimiento | date:'short' }}</td>
                      </tr>
                      <tr *ngIf="ultimosMovimientos.length === 0 && !loadingResumen">
                        <td colspan="4" class="text-center text-muted py-4">Sin movimientos para mostrar</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </div>
        </div>
      </ng-container>

    </div>
  `,
  styles: [`
    .dashboard-container { padding: 0; }
    .welcome-banner { background: #ffffff; }
    .banner-img { max-height: 250px; }
    .stat-card { min-height: 160px; transition: transform 0.3s; }
    .stat-card:hover { transform: translateY(-5px); }
    .location-card .card-header { background-color: #212529 !important; }
    .rounded-4 { border-radius: 1.25rem !important; }
    .kpi-card { min-height: 190px; }
    .donut-wrap { position: relative; width: 180px; height: 180px; margin: 0 auto; }
    .donut { width: 180px; height: 180px; transform: rotate(-90deg); }
    .donut-bg { fill: none; stroke: #eef0f3; stroke-width: 14; }
    .donut-segment { fill: none; stroke-width: 14; }
    .donut-center { position: absolute; inset: 0; display: flex; flex-direction: column; align-items: center; justify-content: center; }
    .donut-total { font-weight: 800; font-size: 2rem; line-height: 1; }
    .donut-subtitle { color: #6c757d; font-size: 0.85rem; }
    .legend-dot { width: 10px; height: 10px; border-radius: 999px; display: inline-block; }

    :host-context(.theme-dark) .welcome-banner {
      background: #0f172a;
      color: #e5e7eb;
      border: 1px solid rgba(255, 255, 255, 0.08);
    }

    :host-context(.theme-dark) .welcome-banner .text-muted {
      color: rgba(229, 231, 235, 0.75) !important;
    }

    :host-context(.theme-dark) .location-card .card-body {
      background: #0f172a !important;
    }

    :host-context(.theme-dark) .location-card .card-body .text-dark {
      color: #e5e7eb !important;
    }

    :host-context(.theme-dark) .donut-bg {
      stroke: rgba(255, 255, 255, 0.08);
    }
  `]
})
export class DashboardComponent implements OnInit {
  private readonly destroyRef = inject(DestroyRef);

  isLoggedIn = false;
  isVendedor = false;

  dashboardMode: 'bienvenida' | 'resumen' = 'bienvenida';
  loadingResumen = false;
  resumenError = '';

  productosCount = 0;
  inventoryOkCount = 0;
  inventoryPorVencerCount = 0;
  inventoryAgotadosCount = 0;
  inventoryTotal = 0;
  inventoryWindowDays = 30;
  inventorySegments: Array<{ key: string; label: string; color: string; count: number; percent: number; dasharray: string; dashoffset: number }> = [];
  ventasHoyCount = 0;
  ventasHoyTotal = 0;
  comprasHoyCount = 0;
  comprasHoyTotal = 0;
  ingresosCaja: number | null = null;
  egresosCaja: number | null = null;
  saldoCaja: number | null = null;

  ultimasVentas: Venta[] = [];
  ultimosMovimientos: MovimientoCaja[] = [];

  private readonly moneyFormatter = new Intl.NumberFormat('es-PE', {
    style: 'currency',
    currency: 'PEN',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  });

  private readonly donutRadius = 42;
  private readonly donutCircumference = 2 * Math.PI * this.donutRadius;
  private lotesSnapshot: Lote[] = [];

  constructor(
    private route: ActivatedRoute,
    private authService: AuthService,
    private productoService: ProductoService,
    private loteService: LoteService,
    private ventaService: VentaService,
    private compraService: CompraService,
    private movimientoCajaService: MovimientoCajaService
  ) {}

  ngOnInit(): void {
    const savedMode = localStorage.getItem('botica_dashboard_mode');
    if (savedMode === 'bienvenida' || savedMode === 'resumen') {
      this.dashboardMode = savedMode;
    }

    this.route.queryParamMap.pipe(takeUntilDestroyed(this.destroyRef)).subscribe(params => {
      const mode = params.get('mode');
      if (mode === 'bienvenida' || mode === 'resumen') {
        this.setDashboardMode(mode);
      }
    });

    const savedWindowDays = Number(localStorage.getItem('botica_inventory_window_days'));
    if ([7, 30, 60].includes(savedWindowDays)) {
      this.inventoryWindowDays = savedWindowDays as 7 | 30 | 60;
    }

    this.isLoggedIn = this.authService.isLoggedIn();
    this.authService.user$.pipe(takeUntilDestroyed(this.destroyRef)).subscribe(user => {
      this.isLoggedIn = !!user;
      const roleName = (user?.rol?.nombre ?? '').trim().toLowerCase();
      this.isVendedor = roleName === 'vendedor';

      if (!this.isLoggedIn && this.dashboardMode === 'resumen') {
        this.setDashboardMode('bienvenida');
      }

      if (this.isLoggedIn && this.dashboardMode === 'resumen') {
        this.loadResumen();
      }
    });

    if (this.isLoggedIn && this.dashboardMode === 'resumen') {
      this.loadResumen();
    }
  }

  setDashboardMode(mode: 'bienvenida' | 'resumen'): void {
    this.dashboardMode = mode;
    localStorage.setItem('botica_dashboard_mode', mode);
    if (mode === 'resumen' && this.isLoggedIn) {
      this.loadResumen();
    }
  }

  setInventoryWindowDays(days: number): void {
    if (![7, 30, 60].includes(days)) return;
    this.inventoryWindowDays = days as 7 | 30 | 60;
    localStorage.setItem('botica_inventory_window_days', String(this.inventoryWindowDays));
    this.recomputeInventory();
  }

  formatMoney(value: unknown): string {
    const n = this.toNumber(value);
    if (n == null) return '—';
    return this.moneyFormatter.format(n);
  }

  private toNumber(value: unknown): number | null {
    if (value == null) return null;
    if (typeof value === 'number' && Number.isFinite(value)) return value;
    if (typeof value === 'string') {
      const normalized = value.replace(',', '.');
      const n = Number(normalized);
      return Number.isFinite(n) ? n : null;
    }
    return null;
  }

  private parseDate(value: unknown): Date | null {
    if (typeof value !== 'string' || !value.trim()) return null;
    const d = new Date(value);
    if (!Number.isFinite(d.getTime())) return null;
    return d;
  }

  private isSameDay(a: Date, b: Date): boolean {
    return (
      a.getFullYear() === b.getFullYear() &&
      a.getMonth() === b.getMonth() &&
      a.getDate() === b.getDate()
    );
  }

  private loadResumen(): void {
    if (this.loadingResumen) return;

    this.loadingResumen = true;
    this.resumenError = '';

    const productos$ = this.productoService.listar().pipe(catchError(() => of([] as Producto[])));
    const lotes$ = this.loteService.listar().pipe(catchError(() => of([] as Lote[])));
    const ventas$ = this.ventaService.listar().pipe(catchError(() => of([] as Venta[])));
    const compras$ = this.compraService.listar().pipe(catchError(() => of([] as Compra[])));
    const resumenCaja$ = this.movimientoCajaService.obtenerResumen().pipe(catchError(() => of(null)));
    const movimientos$ = this.movimientoCajaService.listar().pipe(catchError(() => of([] as MovimientoCaja[])));

    forkJoin({ productos: productos$, lotes: lotes$, ventas: ventas$, compras: compras$, resumenCaja: resumenCaja$, movimientos: movimientos$ })
      .pipe(
        takeUntilDestroyed(this.destroyRef),
        finalize(() => {
          this.loadingResumen = false;
        })
      )
      .subscribe({
        next: ({ productos, lotes, ventas, compras, resumenCaja, movimientos }) => {
          this.productosCount = productos.length;

          this.lotesSnapshot = lotes;
          this.recomputeInventory();

          const now = new Date();
          const ventasHoy = ventas
            .map(v => ({ venta: v, fecha: this.parseDate(v.fechaVenta) }))
            .filter(x => x.fecha != null && this.isSameDay(x.fecha, now))
            .map(x => x.venta);
          this.ventasHoyCount = ventasHoy.length;
          this.ventasHoyTotal = ventasHoy.reduce((acc, v) => acc + (this.toNumber(v.total) ?? 0), 0);

          const comprasHoy = compras
            .map(c => ({ compra: c, fecha: this.parseDate(c.fechaCompra) }))
            .filter(x => x.fecha != null && this.isSameDay(x.fecha, now))
            .map(x => x.compra);
          this.comprasHoyCount = comprasHoy.length;
          this.comprasHoyTotal = comprasHoy.reduce((acc, c) => acc + (this.toNumber(c.montoTotal) ?? 0), 0);

          const ingresos = this.toNumber((resumenCaja as any)?.ingresos);
          const egresos = this.toNumber((resumenCaja as any)?.egresos);
          const saldo = this.toNumber((resumenCaja as any)?.saldoCaja);
          this.ingresosCaja = ingresos;
          this.egresosCaja = egresos;
          this.saldoCaja = saldo;

          this.ultimasVentas = [...ventas]
            .sort((a, b) => (this.parseDate(b.fechaVenta)?.getTime() ?? 0) - (this.parseDate(a.fechaVenta)?.getTime() ?? 0))
            .slice(0, 6);

          this.ultimosMovimientos = [...movimientos]
            .sort((a, b) => (this.parseDate(b.fechaMovimiento)?.getTime() ?? 0) - (this.parseDate(a.fechaMovimiento)?.getTime() ?? 0))
            .slice(0, 6);
        },
        error: () => {
          this.resumenError = 'No se pudo cargar el resumen. Revisa que el backend esté activo.';
        }
      });
  }

  private recomputeInventory(): void {
    const now = new Date();
    const limit = new Date(now);
    limit.setDate(limit.getDate() + this.inventoryWindowDays);

    const total = this.lotesSnapshot.length;
    const agotados = this.lotesSnapshot.filter(l => (l.cantidadActual ?? 0) <= 0).length;
    const porVencer = this.lotesSnapshot.filter(l => {
      if ((l.cantidadActual ?? 0) <= 0) return false;
      const venc = this.parseDate(l.fechaVencimiento);
      if (venc == null) return false;
      return venc <= limit;
    }).length;
    const ok = Math.max(0, total - agotados - porVencer);

    this.inventoryTotal = total;
    this.inventoryAgotadosCount = agotados;
    this.inventoryPorVencerCount = porVencer;
    this.inventoryOkCount = ok;

    this.inventorySegments = this.buildInventorySegments();
  }

  private buildInventorySegments(): Array<{ key: string; label: string; color: string; count: number; percent: number; dasharray: string; dashoffset: number }> {
    const total = this.inventoryTotal || 0;
    const parts = [
      { key: 'ok', label: 'Stock OK', color: '#6f6bd9', count: this.inventoryOkCount },
      { key: 'porVencer', label: 'Por vencer', color: '#41c27d', count: this.inventoryPorVencerCount },
      { key: 'agotado', label: 'Agotado', color: '#f15b5b', count: this.inventoryAgotadosCount }
    ];

    const safeTotal = total > 0 ? total : 1;
    let acc = 0;
    return parts.map(p => {
      const fraction = p.count / safeTotal;
      const length = fraction * this.donutCircumference;
      const dasharray = `${length} ${this.donutCircumference}`;
      const dashoffset = -acc * this.donutCircumference;
      acc += fraction;
      return {
        ...p,
        percent: (p.count / safeTotal) * 100,
        dasharray,
        dashoffset
      };
    });
  }
}
