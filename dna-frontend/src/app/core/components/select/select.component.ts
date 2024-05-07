import { Component } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { TuiDataListModule } from '@taiga-ui/core';
import { TuiDataListWrapperModule, TuiSelectModule } from '@taiga-ui/kit';
import { FormControl, FormGroup } from '@angular/forms';

@Component({
  selector: 'app-select',
  standalone: true,
  imports: [
    FormsModule,
    ReactiveFormsModule,
    TuiSelectModule,
    TuiDataListModule,
    TuiDataListWrapperModule,
  ],
  templateUrl: './select.component.html',
  styleUrl: './select.component.scss',
})
export class SelectComponent {
  items = ['Option1', 'Option2', 'Option3'];

  testForm = new FormGroup({
    testValue: new FormControl(),
  });
}
