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
import { FileUploadModule } from 'primeng/fileupload';
import {ErrorResponse} from "../../../../../core/interfaces/error-response";
import {ToastService} from '../../../../../core/service/toast.service';
import {RoleTypeList} from '../../../../../core/enums/role-enum';
import { StopService } from '../../../service/stop.service';
import { StopDialogFormGroup } from '../../../interfaces/stop-dialog-form-groups';
import { Stop } from '../../../models/stop';

@Component({
  selector: 'app-stops-form',
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
  templateUrl: './stops-form.component.html',
  styleUrl: './stops-form.component.css'
})
export class StopsFormComponent implements OnInit, OnDestroy {
  private fb = inject(NonNullableFormBuilder);
  private ref = inject(DynamicDialogRef);
  private dialogConfig = inject(DynamicDialogConfig);
  private toastService = inject(ToastService);
  private stopService = inject(StopService);

  @Output() closeDialogEventAccept = new EventEmitter<boolean>();

  form: FormGroup<StopDialogFormGroup> = this.initForm();
  stop!: Stop;
  readonly roleList = RoleTypeList;
  action!: Action;
  isLoading: WritableSignal<boolean> = signal(false);
  saveStopLabel: WritableSignal<string> = signal('Guardar');
  subs: Subscription=new Subscription();

  ngOnInit(): void {
    this.handlePayload();
  }

  ngOnDestroy(): void {
    this.subs.unsubscribe();
  }

  initForm(): FormGroup<StopDialogFormGroup> {
    return this.fb.group<StopDialogFormGroup>({
      name: this.fb.control('',[Validators.required]),
      linkPlace: this.fb.control(null,[]),
      isActive: this.fb.control(true)
    });
  }

  handlePayload() {
    const { action, stop } = this.dialogConfig.data;
    this.action = action;
    if (stop) {
      this.stop = stop;
      this.form.reset(stop);
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
    this.saveStopLabel.set('Guardando');
    this.subs.add(concat(this.action === Action.Store ? this.createStop$() : this.updateStop$()).pipe(
        finalize(() => { this.isLoading.set(false); this.saveStopLabel.set('Guardar'); })
      ).subscribe({
        next: (stop) => this.ref.close({ stop, action: this.action }),
        error: (err) => {
          const error = err.error.errors.map((err: ErrorResponse) => err.message)
          this.toastService.present({ severity: 'error', detail: error })
        }
      })
    );
  }

  createStop$(): Observable<Stop> {
    const stop = new Stop({ ...this.form.value});
    return this.stopService.create(stop).pipe(
      tap(() => this.toastService.present({ severity: 'success', detail: 'Register successful!.' }),
      )
    );
  }

  updateStop$(): Observable<Stop> {
    const stop = new Stop({ ...this.form.value, id: this.stop.id });
    return this.stopService.update(this.stop.id, stop).pipe(
      tap(() => this.toastService.present({ severity: 'success', detail: `Update successful!.` }),
      )
    );
  }

  close() {
    this.ref.close();
  }
}