import {Component, inject, OnInit} from '@angular/core';
import {MenuItem} from "primeng/api";
import {ToastModule} from "primeng/toast";
import {MenuModule} from "primeng/menu";
import {ButtonModule} from "primeng/button";
import {AuthService} from '../modules/auth/services/auth.service';

@Component({
  selector: 'app-menu',
  standalone: true,
  imports: [
    ToastModule,
    MenuModule,
    ButtonModule
  ],
  templateUrl: './app.menu.component.html',
  styleUrl: './app.menu.component.css'
})
export class AppMenuComponent implements OnInit{
  items: MenuItem[] | undefined;
  private authService = inject(AuthService);

  ngOnInit() {
    const isAdministrator = this.authService.isAdministrator();

    this.items = [
      {
        items: [
          {
            label: 'Dashboard',
            icon: 'pi pi-home',
            routerLink: '/',
          }
        ]
      },
      {
        label: 'Administration',
        items: [
          ...(isAdministrator ? [{
            label: 'Users',
            icon: 'pi pi-users',
            routerLink: 'miniruta/users'
          }] : []),
          {
            label: 'Places',
            icon: 'pi pi-address-book',
            routerLink: 'miniruta/places'
          },
        ]
      },
    ];
  }

}
