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
import { PlaceService } from '../../../service/place.service';
import { PlaceDialogFormGroup } from '../../../interfaces/place-dialog-form-groups';
import { Place } from '../../../models/place';

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
  templateUrl: './places-form.component.html',
  styleUrl: './places-form.component.css'
})
export class PlacesFormComponent implements OnInit, OnDestroy {
  private fb = inject(NonNullableFormBuilder);
  private ref = inject(DynamicDialogRef);
  private dialogConfig = inject(DynamicDialogConfig);
  private toastService = inject(ToastService);
  private placeService = inject(PlaceService);

  @Output() closeDialogEventAccept = new EventEmitter<boolean>();

  form: FormGroup<PlaceDialogFormGroup> = this.initForm();
  place!: Place;
  readonly roleList = RoleTypeList;
  action!: Action;
  isLoading: WritableSignal<boolean> = signal(false);
  savePlaceLabel: WritableSignal<string> = signal('Guardar');
  subs: Subscription=new Subscription();

  ngOnInit(): void {
    this.handlePayload();
  }

  ngOnDestroy(): void {
    this.subs.unsubscribe();
  }

  initForm(): FormGroup<PlaceDialogFormGroup> {
    return this.fb.group<PlaceDialogFormGroup>({
      name: this.fb.control('',[Validators.required]),
      linkPlace: this.fb.control(null,[]),
      isActive: this.fb.control(true)
    });
  }

  handlePayload() {
    const { action, place } = this.dialogConfig.data;
    this.action = action;
    if (place) {
      this.place = place;
      this.form.reset(place);
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
    this.savePlaceLabel.set('Guardando');
    this.subs.add(concat(this.action === Action.Store ? this.createPlace$() : this.updatePlace$()).pipe(
        finalize(() => { this.isLoading.set(false); this.savePlaceLabel.set('Guardar'); })
      ).subscribe({
        next: (place) => this.ref.close({ place, action: this.action }),
        error: (err) => {
          const error = err.error.errors.map((err: ErrorResponse) => err.message)
          this.toastService.present({ severity: 'error', detail: error })
        }
      })
    );
  }

  createPlace$(): Observable<Place> {
    const place = new Place({ ...this.form.value});
    return this.placeService.create(place).pipe(
      tap(() => this.toastService.present({ severity: 'success', detail: 'Register successful!.' }),
      )
    );
  }

  updatePlace$(): Observable<Place> {
    const place = new Place({ ...this.form.value, id: this.place.id });
    return this.placeService.update(this.place.id, place).pipe(
      tap(() => this.toastService.present({ severity: 'success', detail: `Update successful!.` }),
      )
    );
  }

  close() {
    this.ref.close();
  }
}