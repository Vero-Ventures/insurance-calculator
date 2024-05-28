import { Component, Input } from '@angular/core';
import { RouterLink } from '@angular/router';
import { TuiButtonModule } from '@taiga-ui/core';
import { TuiIslandModule } from '@taiga-ui/kit';

@Component({
  selector: 'app-landing-card',
  standalone: true,
  imports: [TuiIslandModule, TuiButtonModule, RouterLink],
  templateUrl: './landing-card.component.html',
  styleUrl: './landing-card.component.scss',
})
export class LandingCardComponent {
  @Input() header: string = '';
  @Input() buttonText: string = '';
  @Input() linkDestination: Array<string> = ['/test'];
  @Input() imageSrc: string = '';
}
