import { Injectable, Type, inject } from '@angular/core';
import { DynamicDialogConfig, DynamicDialogRef, DialogService as PrimeNgDialogService } from 'primeng/dynamicdialog';
import {Subject} from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class DialogService {
  private pngDialogService = inject(PrimeNgDialogService);
  private actionSource = new Subject<void>();
  private actionSourceForm = new Subject<boolean>();
  private actionAccessories= new Subject<void>();
  private actionRequests= new Subject<void>();
  private actionRejectForm= new Subject<void>();
  private actionFormItems= new Subject<void>();
  saveAction$ = this.actionSource.asObservable();
  saveActionForm$= this.actionSourceForm.asObservable();
  saveAccessories$ = this.actionAccessories.asObservable();
  saveRequests$ = this.actionRequests.asObservable();
  saveRejectForm$ = this.actionRejectForm.asObservable();
  saveFormItems$ = this.actionFormItems.asObservable();

  open(componentType: Type<any>, config: DynamicDialogConfig): DynamicDialogRef {
    const defaultConfig: DynamicDialogConfig = {
      baseZIndex: 10000,
      maximizable: true,
      modal: true,
      draggable: true,
      closable: true,
      dismissableMask: true,
      styleClass: 'size-m'
    }
    return this.pngDialogService.open(componentType, { ...defaultConfig, ...config });
  }
  triggerCloseAction() {
    this.actionSource.next();
  }

  triggerCloseAccessories() {
    this.actionAccessories.next();
  }

  triggerCloseRequests() {
    this.actionRequests.next();
  }

  triggerSaveAction() {
    this.actionSource.next();
  }

  triggerSaveActionForm(action: boolean) {
    this.actionSourceForm.next(action);
  }

  triggerSaveRejectForm() {
    this.actionRejectForm.next();
  }

  triggerSaveFormItems() {
    this.actionFormItems.next();
  }
}