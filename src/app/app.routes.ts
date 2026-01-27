import { Routes } from '@angular/router';
import { AgendarComponent } from './pages/agendar/agendar';
import { Usuario } from './pages/usuario/usuario';
import { Empresa } from './pages/empresa/empresa';
import { Login } from './pages/login/login';
import { Register } from './pages/register/register';
import { MainLayout } from '././layouts/main-layout/main-layout';

export const routes: Routes = [
  { path: '', redirectTo: 'login', pathMatch: 'full' },
  { path: 'login', component: Login },
  { path: 'register', component: Register },
  {
    path: 'agendar',component: MainLayout,children: [{ path: '', component: AgendarComponent },],
  },
  {
    path: 'empresa',component: MainLayout,children: [{ path: '', component: Empresa },],
  },
  {
    path: 'usuario',component: MainLayout,children: [{ path: '', component: Usuario },],
  }
];

