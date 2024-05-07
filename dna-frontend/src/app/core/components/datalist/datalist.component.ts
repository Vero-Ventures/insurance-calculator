import { Component } from '@angular/core';
import { TuiDataListModule } from '@taiga-ui/core';

@Component({
  selector: 'app-datalist',
  standalone: true,
  imports: [TuiDataListModule],
  templateUrl: './datalist.component.html',
  styleUrl: './datalist.component.scss',
})
export class DatalistComponent {
  value = 0;

  items = ['Option 1', 'Option 2', 'Option 3'];
}
