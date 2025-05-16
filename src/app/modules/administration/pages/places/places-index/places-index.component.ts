import {Component, inject, OnDestroy, OnInit, signal, WritableSignal} from '@angular/core';
import {PrimeNgModule} from '../../../../../../shared/components/primeNg';
import {CommonModule, NgStyle} from "@angular/common";
import {FormsModule, ReactiveFormsModule} from "@angular/forms";
import {TagModule} from "primeng/tag";
import {BehaviorSubject, catchError, EMPTY, finalize, Observable, Subscription, switchMap, take, tap} from "rxjs";
import {Action} from "../../../../../core/enums/action";
import {DynamicDialogRef} from "primeng/dynamicdialog";
import {PlacesFormComponent} from "../places-form/places-form.component";
import {ToastService} from '../../../../../core/service/toast.service';
import {DialogService} from '../../../../../core/service/dialog.service';
import {ConfirmationDialogService} from '../../../../../core/service/confirmation-dialog.service';
import { PlaceService } from '../../../service/place.service';
import { Place } from '../../../models/place';

@Component({
  selector: 'app-places-index',
  standalone: true,
  imports: [
    PrimeNgModule,
    NgStyle,
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    TagModule,
  ],
  templateUrl: './places-index.component.html',
  styleUrl: './places-index.component.css'
})
export class PlacesIndexComponent implements OnInit, OnDestroy {
  private placeService = inject(PlaceService);
  private toastService = inject(ToastService);
  private dialogService = inject(DialogService);
  private confirmationDialogService = inject(ConfirmationDialogService);

  places: WritableSignal<Place[]> = signal([]);
  queriesUpdated$: BehaviorSubject<void> = new BehaviorSubject<void>(undefined);
  subs: Subscription = new Subscription();
  isLoading: WritableSignal<boolean> = signal(false);
  readonly action = Action;
  searchTerm: string = '';

  ref: DynamicDialogRef | undefined;

  ngOnInit(): void {
    this.placesListQueriesSubscription();
  }

  ngOnDestroy(): void {
    this.subs.unsubscribe();
  }

  placesListQueriesSubscription() {
    this.subs.add (
      this.queriesUpdated$.asObservable()
        .pipe(switchMap( () => this.loadPlaces$().pipe(
          catchError((err) => {
            this.toastService.present({severity: 'error', detail: err.message, sticky: true})
            return EMPTY;
          }))
        ))
        .subscribe()
    );
  }

  loadPlaces$(): Observable<Place[]> {
    this.isLoading.set(true);
    return this.placeService.get()
      .pipe(tap((data: Place[]) => {
          this.places.set(data);
        }),
        finalize(() => this.isLoading.set(false))
      );
  }

  delete(id: number, isDelete: boolean) {
    this.confirmationDialogService.confirm({
      message: `Are you sure you want to ${isDelete ? 'delete' : 'restore'}  this record?`,
      accept: () => {
        this.placeService.delete(id).subscribe({
          next: (place: Place) => {
            this.toastService.present({ severity: 'success', detail: `${isDelete ? 'Delete' : 'Restore'} successful!.` })
            this.handlePlaceAction({ place, action: Action.Update });
          },
          error: err => this.toastService.present({ severity: 'error', detail: err.message })
        })
      }
    });
  }

  showFormDialog(action: Action = Action.Store, place?: Place) {
    const payload = { action, place };
    this.ref = this.dialogService.open(PlacesFormComponent, {
      header: action === Action.Store ? 'Create Place' : 'Edit Plce',
      data: payload,
      styleClass: 'size-sm',
      dismissableMask: false,
    });
    this.onCloseDialogSubscription();
  }

  onCloseDialogSubscription() {
    const sub: Subscription = this.ref!.onClose.pipe(take(1)).subscribe({
      next: (data: { place: Place, action: Action }) => {
        this.handlePlaceAction(data);
      },
      complete: () => sub.unsubscribe()
    });
  }

  handleActionEmitter(action: Action) {
    this.showFormDialog(action);
  }

  searchPlace(){
    return this.places().filter(regulations => regulations.name.toLowerCase().includes(this.searchTerm.toLowerCase()));
  }

  handlePlaceAction(data: { place: Place, action: Action }) {
    if (data?.place) {
      data.action === Action.Store ?
      this.places.update(currentPlaces => [...currentPlaces, data.place])
      : this.places.update(currentPlaces => currentPlaces.map(
        currentPlace => currentPlace.id === data.place.id ? data.place : currentPlace)
      );
    }
  }
}