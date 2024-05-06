import { Component } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { TuiInputModule } from '@taiga-ui/kit';
import { FormControl, FormGroup } from '@angular/forms';

@Component({
  selector: 'app-textbox',
  standalone: true,
  imports: [ReactiveFormsModule, TuiInputModule],
  templateUrl: './textbox.component.html',
  styleUrl: './textbox.component.scss',
})
export class TextboxComponent {
  testForm = new FormGroup({
    testValue: new FormControl('test@test.ca'),
  });
}
