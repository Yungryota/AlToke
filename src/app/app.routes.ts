import { Routes } from '@angular/router';
import { AgendarComponent } from './pages/agendar/agendar';

export const routes: Routes = [
  { path: '', redirectTo: 'agendar', pathMatch: 'full' },
  { path: 'agendar', component: AgendarComponent },
];

