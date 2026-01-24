import { Routes } from '@angular/router';
import { AgendarComponent } from './pages/agendar/agendar';
import { Usuario } from './pages/usuario/usuario';
import { Empresa } from './pages/empresa/empresa';
import { Login } from './pages/login/login';
import { Register } from './pages/register/register';

export const routes: Routes = [
  { path: '', redirectTo: 'login', pathMatch: 'full' },
  { path: 'agendar', component: AgendarComponent },
  { path: 'usuario', component: Usuario },
  { path: 'empresa', component: Empresa },
  { path: 'login', component: Login },
  { path: 'register', component: Register },
];

