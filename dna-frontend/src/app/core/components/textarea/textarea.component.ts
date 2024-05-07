import { Component } from '@angular/core';
import {
  FormControl,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
} from '@angular/forms';
import { TuiTextareaModule } from '@taiga-ui/kit';

@Component({
  selector: 'app-textarea',
  standalone: true,
  imports: [FormsModule, ReactiveFormsModule, TuiTextareaModule],
  templateUrl: './textarea.component.html',
  styleUrl: './textarea.component.scss',
})
export class TextareaComponent {
  testForm = new FormGroup({
    testValue: new FormControl('Some prefilled text'),
  });
}
