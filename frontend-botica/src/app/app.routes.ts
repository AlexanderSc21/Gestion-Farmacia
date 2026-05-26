import { Routes } from '@angular/router';
import { LayoutComponent } from './components/layout/layout.component';
import { DashboardComponent } from './components/dashboard/dashboard.component';
import { UsuarioListaComponent } from './components/usuario-lista/usuario-lista.component';
import { ProductoListaComponent } from './components/producto-lista/producto-lista.component';
import { ProveedorListaComponent } from './components/proveedor-lista/proveedor-lista.component';
import { CompraRegistroComponent } from './components/compra-registro/compra-registro.component';
import { InventarioLotesComponent } from './components/inventario-lotes/inventario-lotes.component';
import { PosVentaComponent } from './components/pos-venta/pos-venta.component';
import { CajaComponent } from './components/caja/caja.component';
import { DevolucionesComponent } from './components/devoluciones/devoluciones.component';
import { CategoriasComponent } from './components/categorias/categorias.component';
import { AuthGuard } from './auth.guard';

const ROLE_ADMIN = 1;
const ROLE_VENDEDOR = 2;

export const routes: Routes = [
  {
    path: '',
    component: LayoutComponent,
    children: [
      { path: 'dashboard', component: DashboardComponent },
      { path: 'usuarios', component: UsuarioListaComponent, canActivate: [AuthGuard], data: { roleIds: [ROLE_ADMIN] } },
      { path: 'productos', component: ProductoListaComponent, canActivate: [AuthGuard], data: { roleIds: [ROLE_ADMIN] } },
      { path: 'categorias', component: CategoriasComponent, canActivate: [AuthGuard], data: { roleIds: [ROLE_ADMIN] } },
      { path: 'proveedores', component: ProveedorListaComponent, canActivate: [AuthGuard], data: { roleIds: [ROLE_ADMIN] } },
      { path: 'compras', component: CompraRegistroComponent, canActivate: [AuthGuard], data: { roleIds: [ROLE_ADMIN] } },
      { path: 'lotes', component: InventarioLotesComponent, canActivate: [AuthGuard], data: { roleIds: [ROLE_ADMIN] } },
      { path: 'ventas', component: PosVentaComponent, canActivate: [AuthGuard], data: { roleIds: [ROLE_ADMIN, ROLE_VENDEDOR] } },
      { path: 'caja', component: CajaComponent, canActivate: [AuthGuard], data: { roleIds: [ROLE_ADMIN, ROLE_VENDEDOR] } },
      { path: 'devoluciones', component: DevolucionesComponent, canActivate: [AuthGuard], data: { roleIds: [ROLE_ADMIN, ROLE_VENDEDOR] } },
      { path: '', redirectTo: 'dashboard', pathMatch: 'full' }
    ]
  },
  { path: '**', redirectTo: 'dashboard' }
];
