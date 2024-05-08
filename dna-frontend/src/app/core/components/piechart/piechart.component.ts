import { Component, Input } from '@angular/core';
import { TuiPieChartModule } from '@taiga-ui/addon-charts';

@Component({
  selector: 'app-piechart',
  standalone: true,
  imports: [TuiPieChartModule],
  templateUrl: './piechart.component.html',
  styleUrl: './piechart.component.scss',
})
export class PiechartComponent {
  @Input() value = [25, 25, 50];
}
