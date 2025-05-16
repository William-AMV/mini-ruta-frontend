import {Component, ElementRef, inject} from '@angular/core';
import {AppMenuComponent} from "./app.menu.component";
import {SidebarModule} from "primeng/sidebar";
import {ButtonModule} from "primeng/button";
import {LayoutService} from "./service/app.layout.service";
import {AuthService} from '../modules/auth/services/auth.service';
import {LocalStorageService} from '../core/service/local-storage.service';
import {PrimeNgModule} from '../../shared/components/primeNg';

@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [
    AppMenuComponent,
    SidebarModule,
    ButtonModule,
    PrimeNgModule
  ],
  templateUrl: './app.sidebar.component.html',
})
export class AppSidebarComponent {
  localStorageService = inject(LocalStorageService);
  authService = inject(AuthService);

  constructor(public layoutService: LayoutService, public el: ElementRef) { }
}
