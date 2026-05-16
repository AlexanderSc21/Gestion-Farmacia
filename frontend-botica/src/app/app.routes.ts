import { Routes } from '@angular/router';
import { UsuarioListaComponent } from './components/usuario-lista/usuario-lista.component';
import { RegistroComponent } from './components/registro/registro.component';
import { ProductoListaComponent } from './components/producto-lista/producto-lista.component'; // <--- IMPORTACIÓN
import { ProductoRegistroComponent } from './components/producto-registro/producto-registro.component';

export const routes: Routes = [
  { path: 'usuarios', component: UsuarioListaComponent },
  { path: 'registro', component: RegistroComponent },
  { path: 'editar/:id', component: RegistroComponent },
  { path: 'productos', component: ProductoListaComponent },
  { path: 'productos/nuevo', component: ProductoRegistroComponent },
  { path: 'productos/editar/:id', component: ProductoRegistroComponent },
  { path: '', redirectTo: '/productos', pathMatch: 'full' } // Cambiamos el inicio para ver los productos primero ahora
];