import { Injectable, inject } from '@angular/core';
import { MessageService } from 'primeng/api';

@Injectable({
  providedIn: 'root'
})
export class ToastService {

  private messageService = inject(MessageService);

  private customToastStyle: any = {
    welcome: '.p-toast-message-welcome'
  };

  present(
    message: { key?: string, severity: string, summary?: string, detail: string, life?: number, styleClass?: string, sticky?: boolean, resourceId?: string }
  ) {
    message.life = message.life ?? 4500;
    message.styleClass = message.styleClass ?? (this.customToastStyle[message.severity] ?? '');
    message.styleClass = `${message.styleClass} ${message.summary ? '' : 'has-no-summary'}`;
    // message.sticky = true;
    this.messageService.add(message);
  }
}