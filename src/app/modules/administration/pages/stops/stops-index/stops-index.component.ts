import {Component, inject, OnDestroy, OnInit, signal, WritableSignal} from '@angular/core';
import {PrimeNgModule} from '../../../../../../shared/components/primeNg';
import {CommonModule, NgStyle} from "@angular/common";
import {FormsModule, ReactiveFormsModule} from "@angular/forms";
import {TagModule} from "primeng/tag";
import {BehaviorSubject, catchError, EMPTY, finalize, Observable, Subscription, switchMap, take, tap} from "rxjs";
import {Action} from "../../../../../core/enums/action";
import {DynamicDialogRef} from "primeng/dynamicdialog";
import {StopsFormComponent} from "../stops-form/stops-form.component";
import {ToastService} from '../../../../../core/service/toast.service';
import {DialogService} from '../../../../../core/service/dialog.service';
import {ConfirmationDialogService} from '../../../../../core/service/confirmation-dialog.service';
import { StopService } from '../../../service/stop.service';
import { Stop } from '../../../models/stop';

@Component({
  selector: 'app-stops-index',
  standalone: true,
  imports: [
    PrimeNgModule,
    NgStyle,
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    TagModule,
  ],
  templateUrl: './stops-index.component.html',
  styleUrl: './stops-index.component.css'
})
export class StopsIndexComponent implements OnInit, OnDestroy {
  private stopService = inject(StopService);
  private toastService = inject(ToastService);
  private dialogService = inject(DialogService);
  private confirmationDialogService = inject(ConfirmationDialogService);

  stops: WritableSignal<Stop[]> = signal([]);
  queriesUpdated$: BehaviorSubject<void> = new BehaviorSubject<void>(undefined);
  subs: Subscription = new Subscription();
  isLoading: WritableSignal<boolean> = signal(false);
  readonly action = Action;
  searchTerm: string = '';

  ref: DynamicDialogRef | undefined;

  ngOnInit(): void {
    this.stopsListQueriesSubscription();
  }

  ngOnDestroy(): void {
    this.subs.unsubscribe();
  }

  stopsListQueriesSubscription() {
    this.subs.add (
      this.queriesUpdated$.asObservable()
        .pipe(switchMap( () => this.loadStops$().pipe(
          catchError((err) => {
            this.toastService.present({severity: 'error', detail: err.message, sticky: true})
            return EMPTY;
          }))
        ))
        .subscribe()
    );
  }

  loadStops$(): Observable<Stop[]> {
    this.isLoading.set(true);
    return this.stopService.get()
      .pipe(tap((data: Stop[]) => {
          this.stops.set(data);
        }),
        finalize(() => this.isLoading.set(false))
      );
  }

  delete(id: number, isDelete: boolean) {
    this.confirmationDialogService.confirm({
      message: `Are you sure you want to ${isDelete ? 'delete' : 'restore'}  this record?`,
      accept: () => {
        this.stopService.delete(id).subscribe({
          next: (stop: Stop) => {
            this.toastService.present({ severity: 'success', detail: `${isDelete ? 'Delete' : 'Restore'} successful!.` })
            this.handleStopAction({ stop, action: Action.Update });
          },
          error: err => this.toastService.present({ severity: 'error', detail: err.message })
        })
      }
    });
  }

  showFormDialog(action: Action = Action.Store, stop?: Stop) {
    const payload = { action, stop };
    this.ref = this.dialogService.open(StopsFormComponent, {
      header: action === Action.Store ? 'Create Stop' : 'Edit Stop',
      data: payload,
      styleClass: 'size-sm',
      dismissableMask: false,
    });
    this.onCloseDialogSubscription();
  }

  onCloseDialogSubscription() {
    const sub: Subscription = this.ref!.onClose.pipe(take(1)).subscribe({
      next: (data: { stop: Stop, action: Action }) => {
        this.handleStopAction(data);
      },
      complete: () => sub.unsubscribe()
    });
  }

  handleActionEmitter(action: Action) {
    this.showFormDialog(action);
  }

  searchStop(){
    return this.stops().filter(regulations => regulations.name.toLowerCase().includes(this.searchTerm.toLowerCase()));
  }

  handleStopAction(data: { stop: Stop, action: Action }) {
    if (data?.stop) {
      data.action === Action.Store ?
      this.stops.update(currentStops => [...currentStops, data.stop])
      : this.stops.update(currentStops => currentStops.map(
        currentUser => currentUser.id === data.stop.id ? data.stop : currentUser)
      );
    }
  }
}