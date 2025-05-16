import { Routes } from '@angular/router';
import { LoginComponent } from './pages/login/login.component';
import {guestGuard} from "../../core/guards/guest.guard";

export const AuthRoutes: Routes = [
  {
    path: 'login', component: LoginComponent,
    title: 'MiniRuta Login',
    canActivate: [guestGuard]
  },
  {
    path: '', redirectTo: 'login', pathMatch: 'full'
  }
];