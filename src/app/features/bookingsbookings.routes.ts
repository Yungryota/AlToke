import { Routes } from '@angular/router';
import { BookingCreate } from './bookings/pages/booking-create/booking-create';

export const BOOKINGS_ROUTES: Routes = [
  { path: 'resources/:resourceId/bookings/create', component: BookingCreate },
];
