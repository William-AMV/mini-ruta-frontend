import {Component, inject, OnDestroy, OnInit, signal, WritableSignal} from '@angular/core';
import {FormGroup, NonNullableFormBuilder, ReactiveFormsModule, Validators} from "@angular/forms";
import {ErrorMsgComponent} from "../../../../../shared/components/error-msg/error-msg.component";
import {CardModule} from "primeng/card";
import {Router} from "@angular/router";
import {finalize, Subscription} from "rxjs";
import {LoginFormGroup} from "../../interfaces/login-form-group";
import {NgClass, NgOptimizedImage} from "@angular/common";
import {PasswordModule} from "primeng/password";
import {ButtonModule} from 'primeng/button';
import {InputTextModule} from 'primeng/inputtext';
import {AuthService} from "../../services/auth.service";
import {EncryptionService} from "../../services/encryption.service";
import {BadgeModule} from 'primeng/badge';
import {VerifyResponse} from "../../interfaces/verify-response";
import {ToastService} from '../../../../core/service/toast.service';
import {ImageModule} from 'primeng/image';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    ErrorMsgComponent,
    CardModule,
    NgClass,
    PasswordModule,
    ButtonModule,
    InputTextModule,
    BadgeModule,
    NgOptimizedImage,
    ImageModule
  ],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent implements OnInit, OnDestroy {

  private authService = inject(AuthService);
  private encryptionService = inject(EncryptionService);
  private fb = inject(NonNullableFormBuilder);
  private toastService = inject(ToastService);
  private router = inject(Router);

  isLoading: WritableSignal<boolean> = signal(false);
  isMaskPassword: WritableSignal<boolean> = signal(true);

  form: FormGroup<LoginFormGroup> = this.initLoginForm();
  maskPasswordToggle = () => this.isMaskPassword.update(value => !value);
  isValidEmail: WritableSignal<boolean> = signal(false);
  subs: Subscription = new Subscription();

  ngOnInit(): void {
  }

  ngOnDestroy(): void {
    this.subs.unsubscribe();
  }

  initLoginForm(): FormGroup<LoginFormGroup> {
    return this.fb.group<LoginFormGroup>({
      email: this.fb.control('', [Validators.required, Validators.email]),
      password: this.fb.control('', [Validators.required])
    });
  }

  signIn() {
    if (this.form.invalid) {
      return Object.values(this.form.controls).forEach(formControl => {
        formControl.markAsTouched();
        formControl.markAsDirty();
      });
    }
    this.isLoading.set(true);
    this.subs.add(this.authService.login({
      email: this.encryptionService.encryptData(String(this.form.value.email)),
      password: this.encryptionService.encryptData(String(this.form.value.password)),
    })
      .pipe(finalize(() => this.isLoading.set(false))).subscribe({
        next: async (resp) => {
          await this.router.navigate(['']);
          this.toastService.present({severity: 'success', detail: `Bienvenid@ ${resp.user.email}`});
        },
        error: (err) => this.toastService.present({severity: 'error', detail: err.message})
      }));
  }

  verifyEmail(): any {
    const emailControl = this.form.controls.email;
    if (emailControl.invalid) {
      emailControl.markAsTouched();
      emailControl.markAsDirty();
      return
    }
    this.isLoading.set(true);
    this.subs.add(this.authService.verifyEmail(this.encryptionService.encryptData(this.form.controls.email.value)).pipe(finalize(() => this.isLoading.set(false))).subscribe({
      next: (res: VerifyResponse) => this.isValidEmail.set(res.success),
      error: err => this.toastService.present({severity: 'error', detail: err.message}),
    }))
  }
}