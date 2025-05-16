import {Component, ElementRef, inject, OnDestroy, ViewChild} from '@angular/core';
import {NgClass} from "@angular/common";
import {SharedModule} from "primeng/api";
import {ToolbarModule} from "primeng/toolbar";
import {AvatarModule} from "primeng/avatar";
import {ButtonModule} from "primeng/button";
import {Router, RouterLink} from "@angular/router";
import {LayoutService} from "./service/app.layout.service";
import {BadgeModule} from "primeng/badge";
import {Subscription} from "rxjs";
import {ToastService} from '../core/service/toast.service';
import {ConfirmationDialogService} from '../core/service/confirmation-dialog.service';
import {AuthService} from '../modules/auth/services/auth.service';

@Component({
  selector: 'app-topbar',
  standalone: true,
  imports: [
    NgClass,
    ToolbarModule,
    AvatarModule,
    SharedModule,
    ButtonModule,
    RouterLink,
    BadgeModule
  ],
  templateUrl: './app.topbar.component.html',
})
export class AppTopbarComponent implements OnDestroy {
  @ViewChild('menubutton') menuButton!: ElementRef;

  @ViewChild('topbarmenubutton') topbarMenuButton!: ElementRef;

  @ViewChild('topbarmenu') menu!: ElementRef;
  private toastService = inject(ToastService);
  private router = inject(Router);
  private confirmationDialogService = inject(ConfirmationDialogService);
  authService = inject(AuthService);
  subs: Subscription = new Subscription();

  constructor(public layoutService: LayoutService) { }

  ngOnDestroy(): void {
    this.subs.unsubscribe();
  }

   logout() {
     this.confirmationDialogService.confirm({
       message: `Are you sure you want to logout?`,
       accept: () => {
         this.subs.add(this.authService.logout().subscribe({
           next: () => {
             this.router.navigate(['/auth/login'])
             this.toastService.present({severity: 'success', detail: 'Session closed successfully'});
           },
           error: (e) => {
             this.toastService.present({severity: 'error', detail: e.message});
           }
         }));
       }
     });
   }

   profile(){
     this.router.navigate([`miniruta/profile`])
   }

}
