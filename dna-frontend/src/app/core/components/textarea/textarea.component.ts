import { Component, Input } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { TuiTextareaModule } from '@taiga-ui/kit';

@Component({
  selector: 'app-textarea',
  standalone: true,
  imports: [FormsModule, ReactiveFormsModule, TuiTextareaModule],
  templateUrl: './textarea.component.html',
  styleUrl: './textarea.component.scss',
})
export class TextareaComponent {
  @Input() formControlName = 'textareaControlName';
  @Input() label = '';
}
