import { Component, Input } from '@angular/core';
import { TuiIslandModule } from '@taiga-ui/kit';
import { TuiPieChartModule } from '@taiga-ui/addon-charts';
import { TuiHintModule } from '@taiga-ui/core';
import { PercentPipe } from '@angular/common';

@Component({
  selector: 'app-pie-chart',
  standalone: true,
  imports: [TuiIslandModule, TuiPieChartModule, TuiHintModule, PercentPipe],
  templateUrl: './pie-chart.component.html',
  styleUrl: './pie-chart.component.scss',
})
export class PieChartComponent {
  @Input() header: string = '';
  @Input() value: {
    name: string;
    value: number;
  }[] = [];

  get total() {
    return this.value.reduce((acc, item) => acc + item.value, 0);
  }

  get names() {
    return this.value.map(item => item.name);
  }

  get values() {
    return this.value.map(item => item.value / this.total);
  }
}
