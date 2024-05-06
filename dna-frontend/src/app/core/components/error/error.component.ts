import { Component } from '@angular/core';
import { TuiValidationError } from '@taiga-ui/cdk';
import { TuiErrorModule } from '@taiga-ui/core';

@Component({
  selector: 'app-error',
  standalone: true,
  imports: [TuiErrorModule],
  templateUrl: './error.component.html',
  styleUrl: './error.component.scss',
})
export class ErrorComponent {
  enabled = false;
  error = new TuiValidationError('Error component');

  get computedError(): TuiValidationError | null {
    return this.enabled ? this.error : null;
  }
}
