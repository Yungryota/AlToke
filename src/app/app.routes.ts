import { Routes } from '@angular/router';
import { AgendarComponent } from './pages/agendar/agendar';
import { Usuario } from './pages/usuario/usuario';
import { Empresa } from './pages/empresa/empresa';
import { Login } from './pages/login/login';

export const routes: Routes = [
  { path: '', redirectTo: 'agendar', pathMatch: 'full' },
  { path: 'agendar', component: AgendarComponent },
  { path: 'usuario', component: Usuario },
  { path: 'empresa', component: Empresa },
  { path: 'login', component: Login },
];

