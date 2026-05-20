import { Routes } from '@angular/router';
import { UsuarioListaComponent } from './components/usuario-lista/usuario-lista.component';
import { RegistroComponent } from './components/registro/registro.component';
import { ProductoListaComponent } from './components/producto-lista/producto-lista.component'; 
import { ProductoRegistroComponent } from './components/producto-registro/producto-registro.component';
import { ProveedorListaComponent } from './components/proveedor-lista/proveedor-lista.component';
import { ProveedorRegistroComponent } from './components/proveedor-registro/proveedor-registro.component';
import { CompraRegistroComponent } from './components/compra-registro/compra-registro.component';
import { InventarioLotesComponent } from './components/inventario-lotes/inventario-lotes.component';
import { PosVentaComponent } from './components/pos-venta/pos-venta.component';
import { CajaComponent } from './components/caja/caja.component';
import { DevolucionesComponent } from './components/devoluciones/devoluciones.component';

export const routes: Routes = [
  { path: 'usuarios', component: UsuarioListaComponent },
  { path: 'registro', component: RegistroComponent },
  { path: 'editar/:id', component: RegistroComponent },
  { path: 'productos', component: ProductoListaComponent },
  { path: 'productos/nuevo', component: ProductoRegistroComponent },
  { path: 'productos/editar/:id', component: ProductoRegistroComponent },
  { path: 'proveedores', component: ProveedorListaComponent },
  { path: 'proveedores/nuevo', component: ProveedorRegistroComponent },
  { path: 'proveedores/editar/:id', component: ProveedorRegistroComponent },
  { path: 'compras/nueva', component: CompraRegistroComponent },
  { path: 'inventario', component: InventarioLotesComponent },
  { path: 'caja', component: PosVentaComponent },
  { path: 'arqueo', component: CajaComponent },
  { path: 'devoluciones', component: DevolucionesComponent },

  { path: '', redirectTo: '/caja', pathMatch: 'full' } // Cambiamos el inicio para ver los productos primero ahora
];