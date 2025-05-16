import { NgModule } from '@angular/core';
import { PrimeNgModule } from './prime-ng.module';
import { ReactiveFormsModule } from '@angular/forms';
import { ErrorMsgComponent} from '../error-msg/error-msg.component';

@NgModule({
  imports: [
    ErrorMsgComponent
  ],
  exports: [
    PrimeNgModule,
    ReactiveFormsModule,
    ErrorMsgComponent
  ]
})
export class PrimeReactiveFormsModule { }