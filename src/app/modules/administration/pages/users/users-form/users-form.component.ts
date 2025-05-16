import {Component, EventEmitter, inject, OnDestroy, OnInit, Output, signal, WritableSignal} from '@angular/core';
import {ButtonDirective} from "primeng/button";
import {DropdownModule} from "primeng/dropdown";
import {ErrorMsgComponent} from "../../../../../../shared/components/error-msg/error-msg.component";
import {InputNumberModule} from "primeng/inputnumber";
import {InputTextModule} from "primeng/inputtext";
import {PaginatorModule} from "primeng/paginator";
import {PrimeTemplate} from "primeng/api";
import {FormGroup, NonNullableFormBuilder, ReactiveFormsModule, Validators} from "@angular/forms";
import {Ripple} from "primeng/ripple";
import {DynamicDialogConfig, DynamicDialogRef} from "primeng/dynamicdialog";
import {Action} from "../../../../../core/enums/action";
import {concat, finalize, Observable, Subscription, tap} from "rxjs";
import {User} from "../../../models/user";
import {UserService} from "../../../service/user.service";
import {UserDialogFormGroup} from "../../../interfaces/user-dialog-form-groups";
import { FileUploadModule } from 'primeng/fileupload';
import {ErrorResponse} from "../../../../../core/interfaces/error-response";
import {ToastService} from '../../../../../core/service/toast.service';
import {RoleTypeList} from '../../../../../core/enums/role-enum';

@Component({
  selector: 'app-users-form',
  standalone: true,
  imports: [
    ButtonDirective,
    DropdownModule,
    ErrorMsgComponent,
    InputNumberModule,
    InputTextModule,
    PaginatorModule,
    PrimeTemplate,
    ReactiveFormsModule,
    Ripple,
    FileUploadModule,
  ],
  templateUrl: './users-form.component.html',
  styleUrl: './users-form.component.css'
})
export class UsersFormComponent implements OnInit, OnDestroy {
  private fb = inject(NonNullableFormBuilder);
  private ref = inject(DynamicDialogRef);
  private dialogConfig = inject(DynamicDialogConfig);
  private toastService = inject(ToastService);
  private userService = inject(UserService);

  @Output() closeDialogEventAccept = new EventEmitter<boolean>();

  form: FormGroup<UserDialogFormGroup> = this.initForm();
  user!: User;
  readonly roleList = RoleTypeList;
  action!: Action;
  isLoading: WritableSignal<boolean> = signal(false);
  saveUserLabel: WritableSignal<string> = signal('Guardar');
  subs: Subscription=new Subscription();

  ngOnInit(): void {
    this.handlePayload();
  }

  ngOnDestroy(): void {
    this.subs.unsubscribe();
  }

  initForm(): FormGroup<UserDialogFormGroup> {
    return this.fb.group<UserDialogFormGroup>({
      fullName: this.fb.control('',[Validators.required]),
      email: this.fb.control('',[Validators.required, Validators.email]),
      password: this.fb.control(null,[]),
      role: this.fb.control(null,[Validators.required]),
      isActive: this.fb.control(true)
    });
  }

  handlePayload() {
    const { action, user } = this.dialogConfig.data;
    this.action = action;
    if (user) {
      this.user = user;
      this.form.reset(user);
    }
  }

  saveUser() {
    if (this.form.invalid) {
      return Object.values(this.form.controls).forEach(formControl => {
        formControl.markAsTouched();
        formControl.markAsDirty();
      });
    }
    this.isLoading.set(true);
    this.saveUserLabel.set('Guardando');
    this.subs.add(concat(this.action === Action.Store ? this.createUser$() : this.updateUser$()).pipe(
        finalize(() => { this.isLoading.set(false); this.saveUserLabel.set('Guardar'); })
      ).subscribe({
        next: (user) => this.ref.close({ user, action: this.action }),
        error: (err) => {
          const error = err.error.errors.map((err: ErrorResponse) => err.message)
          this.toastService.present({ severity: 'error', detail: error })
        }
      })
    );
  }

  createUser$(): Observable<User> {
    const user = new User({ ...this.form.value});
    return this.userService.create(user).pipe(
      tap(() => this.toastService.present({ severity: 'success', detail: 'Register successful!.' }),
      )
    );
  }

  updateUser$(): Observable<User> {
    const user = new User({ ...this.form.value, id: this.user.id });
    return this.userService.update(this.user.id, user).pipe(
      tap(() => this.toastService.present({ severity: 'success', detail: `Update successful!.` }),
      )
    );
  }

  close() {
    this.ref.close();
  }
}