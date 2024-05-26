import { Component, Input } from '@angular/core';
import { TuiAppBarModule } from '@taiga-ui/experimental';
import { TuiSidebarModule } from '@taiga-ui/addon-mobile';
import { TuiActiveZoneModule } from '@taiga-ui/cdk';
import { TuiLinkModule, TuiSvgModule } from '@taiga-ui/core';
import { RouterModule } from '@angular/router';
import { HorizontalDividerComponent } from '../horizontal-divider/horizontal-divider.component';

@Component({
  selector: 'app-appbar',
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
  templateUrl: './appbar.component.html',
  styleUrl: './appbar.component.scss',
})
export class AppbarComponent {
  @Input() pageName = '';
  @Input() clientId = 0;

  open = false;

  toggle(open: boolean) {
    this.open = open;
  }

  constructRoute(route: string) {
    return `/${route}/${this.clientId}`;
  }
}
