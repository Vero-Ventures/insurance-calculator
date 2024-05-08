import { Component, Input } from '@angular/core';
import { TuiTabsModule } from '@taiga-ui/kit';
import { NgFor } from '@angular/common';

@Component({
  selector: 'app-tabs',
  standalone: true,
  imports: [TuiTabsModule, NgFor],
  templateUrl: './tabs.component.html',
  styleUrl: './tabs.component.scss',
})
export class TabsComponent {
  activeItemIndex = 0;

  @Input() tabs = ['Tab Alpha', 'Tab Bravo'];

  onClick(newIndex: number): void {
    this.activeItemIndex = newIndex;
  }
}
