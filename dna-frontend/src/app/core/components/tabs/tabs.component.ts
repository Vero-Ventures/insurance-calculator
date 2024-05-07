import { Component } from '@angular/core';
import { TuiTabsModule } from '@taiga-ui/kit';

@Component({
  selector: 'app-tabs',
  standalone: true,
  imports: [TuiTabsModule],
  templateUrl: './tabs.component.html',
  styleUrl: './tabs.component.scss',
})
export class TabsComponent {
  activeItemIndex = 0;

  constructor() {}

  onClick(activeIndex: number): void {
    this.activeItemIndex = activeIndex;
  }
}
