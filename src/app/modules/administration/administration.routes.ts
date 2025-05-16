import { Routes } from '@angular/router';
import {authGuard} from '../../core/guards/auth.guard';
import {administratorGuard} from '../../core/guards/administrator.guard';
import { UsersIndexComponent } from './pages/users/users-index/users-index.component';
import { PlacesIndexComponent } from './pages/places/places-index/places-index.component'; 
import { UsersProfileComponent } from './pages/users/users-profile/users-profile.component';

export const MiniRutaRoutes: Routes = [
  {
    canActivate: [authGuard, administratorGuard],
    path: 'users', component: UsersIndexComponent,
  },
  {
    canActivate: [authGuard],
    path: 'places', component: PlacesIndexComponent,
  },
  {
    canActivate: [authGuard],
    path: 'profile', component: UsersProfileComponent,
  }
];