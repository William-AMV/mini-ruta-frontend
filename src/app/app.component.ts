import {Component, HostListener, OnInit} from '@angular/core';
import { RouterLink, RouterOutlet } from '@angular/router';
import {ButtonModule} from 'primeng/button';
import {PrimeNGConfig} from "primeng/api";
import {TabMenuModule} from 'primeng/tabmenu'
import { ToastModule } from 'primeng/toast';
import { ConfirmDialogModule } from 'primeng/confirmdialog';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, ButtonModule, TabMenuModule, RouterLink, ToastModule, ConfirmDialogModule],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent implements OnInit {
  title = 'document-generator-frontend';

  constructor(private primengConfig: PrimeNGConfig) {}

  ngOnInit() {
    this.primengConfig.ripple = true;
  }

  @HostListener('window:storage', ['$event'])
  onStorageChange(event: StorageEvent) {
    if (event.key === 'auth-token-changedDG') {
      window.location.reload()
    }
  }
}
