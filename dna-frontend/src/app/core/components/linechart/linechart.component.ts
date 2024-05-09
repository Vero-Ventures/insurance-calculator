import { Component, Input } from '@angular/core';
import { TuiAxesModule, TuiLineChartModule } from '@taiga-ui/addon-charts';
import { TUI_DEFAULT_STRINGIFY, TuiContextWithImplicit } from '@taiga-ui/cdk';
import { TuiPoint } from '@taiga-ui/core';

@Component({
  selector: 'app-linechart',
  standalone: true,
  imports: [TuiLineChartModule, TuiAxesModule],
  templateUrl: './linechart.component.html',
  styleUrl: './linechart.component.scss',
})
export class LinechartComponent {
  readonly value: readonly TuiPoint[] = [
    [50, 50],
    [100, 75],
    [150, 50],
    [200, 150],
    [250, 155],
    [300, 190],
    [350, 90],
  ];

  readonly stringify = TUI_DEFAULT_STRINGIFY;

  @Input() labelsX = ['Jan 2019', 'Feb', 'Mar'];
  @Input() labelsY = ['0', '10 000'];

  readonly hintContent = ({
    $implicit,
  }: TuiContextWithImplicit<readonly TuiPoint[]>): number => $implicit[0][1];
}
