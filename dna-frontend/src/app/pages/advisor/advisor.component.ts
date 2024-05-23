import { Component } from '@angular/core';
import { AdvisorBarComponent } from 'app/core/components/advisor-bar/advisor-bar.component';

@Component({
  selector: 'app-advisor',
  standalone: true,
  imports: [AdvisorBarComponent],
  templateUrl: './advisor.component.html',
  styleUrl: './advisor.component.scss',
})
export class AdvisorComponent {}
