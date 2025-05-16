import {Component} from '@angular/core';
import {Router} from "@angular/router";
import {ButtonModule} from "primeng/button";

@Component({
  selector: 'app-error-permissions',
  standalone: true,
  imports: [
    ButtonModule,
  ],
  templateUrl: './error-permissions.component.html',
  styleUrl: './error-permissions.component.css'
})
export class ErrorPermissionsComponent {
  constructor(
    private router: Router
  ) {
  }

  goBack(): void {
    this.router.navigateByUrl('');
  }
}