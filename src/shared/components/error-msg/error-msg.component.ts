import { Component, EnvironmentInjector, Input, OnInit, WritableSignal, inject, runInInjectionContext, signal } from '@angular/core';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { toSignal } from '@angular/core/rxjs-interop';
import { delay, tap } from 'rxjs';
import { defaultValidation, validations } from '../../constants';
import { PrimeNgModule} from '../primeNg';

@Component({
  selector: 'err',
  standalone: true,
  imports: [CommonModule, PrimeNgModule, ReactiveFormsModule],
  template: `
    @if (control.invalid && control.touched && control.dirty) {
      <small class="p-error">
        {{ message() }}
      </small>
    }
  `
})
export class ErrorMsgComponent implements OnInit {

  injector = inject(EnvironmentInjector);

  @Input() control: FormControl = new FormControl();
  @Input() attribute: string = '';
  @Input() type: string = 'text';

  message: WritableSignal<string> = signal('');

  ngOnInit() {
    this.generateValidationErrorMessage();
    runInInjectionContext(this.injector, () => {
      toSignal(this.control.valueChanges.pipe(delay(5), tap(() => {
        this.generateValidationErrorMessage();
      })));
    });
  }

  generateValidationErrorMessage() {
    if (this.control.invalid) {
      const errorKey: string = Object.keys(this.control.errors ?? {})[0];
      const validation = validations[errorKey]
        ? validations[errorKey][this.type] ?? validations[errorKey]['default']
        : defaultValidation;
      const message = validation.replace(/:[A-Za-z]+/g, (replacer) => {
        return (replacer !== ':attribute')
          ? this.control.errors![errorKey][replacer.replace(':', '')]
          : this.attribute;
      })
      this.message.set(message);
    }
  }

}