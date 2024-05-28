import { Component, Input } from '@angular/core';
import { TuiAppBarModule } from '@taiga-ui/experimental';
import { TuiSidebarModule } from '@taiga-ui/addon-mobile';
import { TuiActiveZoneModule } from '@taiga-ui/cdk';
import { TuiLinkModule, TuiSvgModule } from '@taiga-ui/core';
import { RouterModule } from '@angular/router';
import { HorizontalDividerComponent } from '../horizontal-divider/horizontal-divider.component';

@Component({
  selector: 'app-advisor-bar',
  standalone: true,
  imports: [
    TuiAppBarModule,
    TuiSidebarModule,
    TuiActiveZoneModule,
    TuiLinkModule,
    RouterModule,
    HorizontalDividerComponent,
    TuiSvgModule,
  ],
  templateUrl: './advisor-bar.component.html',
  styleUrl: './advisor-bar.component.scss',
})
export class AdvisorBarComponent {
  @Input() pageName = '';

  open = false;

  toggle(open: boolean) {
    this.open = open;
  }
}
