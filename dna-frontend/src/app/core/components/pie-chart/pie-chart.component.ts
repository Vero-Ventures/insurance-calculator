import { Component, Input } from '@angular/core';
import { TuiIslandModule } from '@taiga-ui/kit';
import { TuiPieChartModule } from '@taiga-ui/addon-charts';
import { TuiHintModule } from '@taiga-ui/core';
import { PercentPipe } from '@angular/common';
import { Value } from 'app/core/models/value.model';

@Component({
  selector: 'app-pie-chart',
  standalone: true,
  imports: [TuiIslandModule, TuiPieChartModule, TuiHintModule, PercentPipe],
  templateUrl: './pie-chart.component.html',
  styleUrl: './pie-chart.component.scss',
})
export class PieChartComponent {
  @Input() value: Value[] = [];

  get total() {
    return this.value.reduce((acc, item) => acc + parseFloat(item.value), 0);
  }

  get names() {
    return this.value.map(item => item.label);
  }

  get values() {
    return this.value.map(item => parseFloat(item.value) / this.total);
  }
}
