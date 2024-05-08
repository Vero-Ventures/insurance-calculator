import { Component, Input } from '@angular/core';
import { TuiAxesModule, TuiLineHandler } from '@taiga-ui/addon-charts';

@Component({
  selector: 'app-axes',
  standalone: true,
  imports: [TuiAxesModule],
  templateUrl: './axes.component.html',
  styleUrl: './axes.component.scss',
})
export class AxesComponent {
  @Input() axisXLabels = ['Jan 2019', 'Feb', 'Mar'];
  @Input() axisYLabels = ['', '25%', '50%', '75%', '100%'];
  @Input() axisYSecondaryLabels = ['80 k', '100 k', '120 k'];
  readonly verticalLinesHandler: TuiLineHandler = (index, total) =>
    index === total - 1 ? 'none' : 'dashed';
}
