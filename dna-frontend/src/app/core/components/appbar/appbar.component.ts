import { Component, Input } from '@angular/core';
import { TuiAppBarModule } from '@taiga-ui/experimental';
import { TuiSvgModule } from '@taiga-ui/core';

@Component({
  selector: 'app-appbar',
  standalone: true,
  imports: [TuiAppBarModule, TuiSvgModule],
  templateUrl: './appbar.component.html',
  styleUrl: './appbar.component.scss',
})
export class AppbarComponent {
  @Input() pageName = "It's an app bar";
}
