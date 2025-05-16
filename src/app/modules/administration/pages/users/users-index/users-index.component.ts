import {Component, inject, OnDestroy, OnInit, signal, WritableSignal} from '@angular/core';
import {PrimeNgModule} from '../../../../../../shared/components/primeNg';
import {CommonModule, NgStyle} from "@angular/common";
import {FormsModule, ReactiveFormsModule} from "@angular/forms";
import {TagModule} from "primeng/tag";
import {BehaviorSubject, catchError, EMPTY, finalize, Observable, Subscription, switchMap, take, tap} from "rxjs";
import {Action} from "../../../../../core/enums/action";
import {DynamicDialogRef} from "primeng/dynamicdialog";
import {UserService} from "../../../service/user.service";
import {User} from "../../../models/user";
import {UsersFormComponent} from "../users-form/users-form.component";
import {ToastService} from '../../../../../core/service/toast.service';
import {DialogService} from '../../../../../core/service/dialog.service';
import {ConfirmationDialogService} from '../../../../../core/service/confirmation-dialog.service';

@Component({
  selector: 'app-users-index',
  standalone: true,
  imports: [
    PrimeNgModule,
    NgStyle,
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    TagModule,
  ],
  templateUrl: './users-index.component.html',
  styleUrl: './users-index.component.css'
})
export class UsersIndexComponent implements OnInit, OnDestroy {
  private userService = inject(UserService);
  private toastService = inject(ToastService);
  private dialogService = inject(DialogService);
  private confirmationDialogService = inject(ConfirmationDialogService);

  users: WritableSignal<User[]> = signal([]);
  queriesUpdated$: BehaviorSubject<void> = new BehaviorSubject<void>(undefined);
  subs: Subscription = new Subscription();
  isLoading: WritableSignal<boolean> = signal(false);
  readonly action = Action;
  searchTerm: string = '';

  ref: DynamicDialogRef | undefined;

  ngOnInit(): void {
    this.usersListQueriesSubscription();
  }

  ngOnDestroy(): void {
    this.subs.unsubscribe();
  }

  usersListQueriesSubscription() {
    this.subs.add (
      this.queriesUpdated$.asObservable()
        .pipe(switchMap( () => this.loadUsers$().pipe(
          catchError((err) => {
            this.toastService.present({severity: 'error', detail: err.message, sticky: true})
            return EMPTY;
          }))
        ))
        .subscribe()
    );
  }

  loadUsers$(): Observable<User[]> {
    this.isLoading.set(true);
    return this.userService.get()
      .pipe(tap((data: User[]) => {
          this.users.set(data);
        }),
        finalize(() => this.isLoading.set(false))
      );
  }

  delete(id: number, isDelete: boolean) {
    this.confirmationDialogService.confirm({
      message: `Are you sure you want to ${isDelete ? 'delete' : 'restore'}  this record?`,
      accept: () => {
        this.userService.delete(id).subscribe({
          next: (user: User) => {
            this.toastService.present({ severity: 'success', detail: `${isDelete ? 'Delete' : 'Restore'} successful!.` })
            this.handleUserAction({ user, action: Action.Update });
          },
          error: err => this.toastService.present({ severity: 'error', detail: err.message })
        })
      }
    });
  }

  showFormDialog(action: Action = Action.Store, user?: User) {
    const payload = { action, user };
    this.ref = this.dialogService.open(UsersFormComponent, {
      header: action === Action.Store ? 'Create User' : 'Edit User',
      data: payload,
      styleClass: 'size-sm',
      dismissableMask: false,
    });
    this.onCloseDialogSubscription();
  }

  onCloseDialogSubscription() {
    const sub: Subscription = this.ref!.onClose.pipe(take(1)).subscribe({
      next: (data: { user: User, action: Action }) => {
        this.handleUserAction(data);
      },
      complete: () => sub.unsubscribe()
    });
  }

  handleActionEmitter(action: Action) {
    this.showFormDialog(action);
  }

  searchUser(){
    return this.users().filter(regulations => regulations.fullName.toLowerCase().includes(this.searchTerm.toLowerCase())
      ||  regulations.email.toLowerCase().includes(this.searchTerm.toLowerCase())
    );
  }

  handleUserAction(data: { user: User, action: Action }) {
    if (data?.user) {
      data.action === Action.Store ?
      this.users.update(currentUsers => [...currentUsers, data.user])
      : this.users.update(currentUsers => currentUsers.map(
        currentUser => currentUser.id === data.user.id ? data.user : currentUser)
      );
    }
  }
}