import { Component, Input } from '@angular/core';
import { TuiProgressModule } from '@taiga-ui/kit';
import { TuiProgressSegmentedModule } from '@taiga-ui/experimental';

@Component({
  selector: 'app-progress-segmented',
  standalone: true,
  imports: [TuiProgressModule, TuiProgressSegmentedModule],
  templateUrl: './progress-segmented.component.html',
  styleUrl: './progress-segmented.component.scss',
})
export class ProgressSegmentedComponent {
  @Input() max = 10;
  @Input() segments = 10;
  @Input() value = 5;
}
