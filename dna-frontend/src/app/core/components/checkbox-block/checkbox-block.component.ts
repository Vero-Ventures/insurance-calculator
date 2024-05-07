import { Component } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { TuiCheckboxBlockModule } from '@taiga-ui/kit';
import { FormControl, FormGroup } from '@angular/forms';

@Component({
  selector: 'app-checkbox-block',
  standalone: true,
  imports: [FormsModule, ReactiveFormsModule, TuiCheckboxBlockModule],
  templateUrl: './checkbox-block.component.html',
  styleUrl: './checkbox-block.component.scss',
})
export class CheckboxBlockComponent {
  testForm = new FormGroup({
    testValue: new FormControl(),
  });
}
