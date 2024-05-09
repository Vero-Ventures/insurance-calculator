import { Component, Input } from '@angular/core';
import { TuiAxesModule, TuiLineChartModule } from '@taiga-ui/addon-charts';
import { TuiPoint } from '@taiga-ui/core';

@Component({
  selector: 'app-linechart',
  standalone: true,
  imports: [TuiLineChartModule, TuiAxesModule],
  templateUrl: './linechart.component.html',
  styleUrl: './linechart.component.scss',
})
export class LinechartComponent {
  @Input() value: readonly TuiPoint[] = [
    [50, 50],
    [100, 75],
    [150, 50],
    [200, 150],
    [250, 155],
    [300, 190],
    [350, 90],
  ];

  @Input() x = 0;
  @Input() y = 0;
  @Input() width = 200;
  @Input() height = 100;

  @Input() labelsX = ['Jan 2019', 'Feb', 'Mar'];
  @Input() labelsY = ['0', '5000', '10000'];
}
