import { Routes } from '@angular/router';
import {authGuard} from '../../core/guards/auth.guard';
import {administratorGuard} from '../../core/guards/administrator.guard';
import { UsersIndexComponent } from './pages/users/users-index/users-index.component';
import { StopsIndexComponent } from './pages/stops/stops-index/stops-index.component';
import { UsersProfileComponent } from './pages/users/users-profile/users-profile.component';

export const MiniRutaRoutes: Routes = [
  {
    canActivate: [authGuard, administratorGuard],
    path: 'users', component: UsersIndexComponent,
  },
  {
    canActivate: [authGuard],
    path: 'stops', component: StopsIndexComponent,
  },
  {
    canActivate: [authGuard],
    path: 'profile', component: UsersProfileComponent,
  }
];