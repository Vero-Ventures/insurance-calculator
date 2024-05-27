import { Component, Input } from '@angular/core';
import { HorizontalDividerComponent } from '../horizontal-divider/horizontal-divider.component';

@Component({
  selector: 'app-chart-island',
  standalone: true,
  imports: [HorizontalDividerComponent],
  templateUrl: './chart-island.component.html',
  styleUrl: './chart-island.component.scss',
})
export class ChartIslandComponent {
  @Input() header: string = '';
}
