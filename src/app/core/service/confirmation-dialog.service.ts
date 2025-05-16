import { Injectable, inject } from '@angular/core';
import { ConfirmationService } from 'primeng/api';

@Injectable({
  providedIn: 'root'
})
export class ConfirmationDialogService {
  private confirmationService = inject(ConfirmationService); 

  confirm(options: ConfirmationOptions) {
    const defaultConfig = {
      header: 'Confirmatión',
      icon: 'pi pi-exclamation-triangle',
      acceptLabel: 'Yes',
      rejectLabel: 'No',
      acceptButtonStyleClass: 'p-button-outlined',
    };

    const confirmationConfig = { ...defaultConfig, ...options };

    this.confirmationService.confirm(confirmationConfig);
  }
}

export interface ConfirmationOptions {
  message: string;
  accept: () => void;
  reject?: () => void;
}