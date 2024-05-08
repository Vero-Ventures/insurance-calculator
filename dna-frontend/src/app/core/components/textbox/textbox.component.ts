import { Component, Input } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { TuiInputModule } from '@taiga-ui/kit';

@Component({
  selector: 'app-textbox',
  standalone: true,
  imports: [ReactiveFormsModule, TuiInputModule],
  templateUrl: './textbox.component.html',
  styleUrl: './textbox.component.scss',
})
export class TextboxComponent {
  @Input() formControlName = 'textboxControlName';
  @Input() textInputLabel = '';
}
