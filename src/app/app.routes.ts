import { Routes } from '@angular/router';
import {AppLayoutComponent} from './layout/app.layout.component';
import {DashboardComponent} from './modules/dashboard/dashboard.component';
import {ErrorPermissionsComponent} from '../shared/components/error-permissions/error-permissions.component';
import {AuthRoutes} from './modules/auth/auth.routes';
import {setupGuard} from './core/guards/setup.guard';
import { MiniRutaRoutes } from './modules/administration/administration.routes';

export const routes: Routes = [
  {
    path: "",
    component: AppLayoutComponent,
    canActivate: [setupGuard],
    title: 'MiniRuta System',
    children: [
      {path: '', component: DashboardComponent},
      {
        path: 'miniruta', loadChildren: () => import('./modules/administration/administration.routes').then(r => MiniRutaRoutes)
      },
    ]
  },
  {
    path: 'auth',
    loadChildren: () => import('./modules/auth/auth.routes').then(r => AuthRoutes),
  },
  {
    path: 'error_permissions',
    component: ErrorPermissionsComponent
  },
  {
    path: '**', //If path doesn't match anything reroute to /authentication/signin
    redirectTo: '',
    pathMatch: 'full'
  },
];