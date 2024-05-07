import { Component } from '@angular/core';
import { TuiAppBarModule } from '@taiga-ui/experimental';

@Component({
  selector: 'app-appbar',
  standalone: true,
  imports: [TuiAppBarModule],
  templateUrl: './appbar.component.html',
  styleUrl: './appbar.component.scss',
})
export class AppbarComponent {}
