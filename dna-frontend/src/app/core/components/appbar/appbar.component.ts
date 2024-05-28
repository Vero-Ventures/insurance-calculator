import { Component, Input } from '@angular/core';
import { TuiAppBarModule } from '@taiga-ui/experimental';
import { TuiSidebarModule } from '@taiga-ui/addon-mobile';
import { TuiActiveZoneModule } from '@taiga-ui/cdk';
import { TuiLinkModule, TuiSvgModule } from '@taiga-ui/core';
import { RouterModule } from '@angular/router';
import { HorizontalDividerComponent } from '../horizontal-divider/horizontal-divider.component';
import { SupabaseService } from 'app/core/services/supabase.service';

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

  constructor(private supabaseService: SupabaseService) {}

  toggle(open: boolean) {
    this.open = open;
  }

  constructRoute(route: string) {
    return `/${route}/${this.clientId}`;
  }

  constructRouteWithoutClientId(route: string) {
    return `/${route}`;
  }

  async downloadProfile() {
    const id = this.clientId;
    const profile = await this.supabaseService.getProfile(id);

    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute(
      'href',
      'data:text/plain;charset=utf-u,' +
        encodeURIComponent(JSON.stringify(profile))
    );
    downloadAnchor.setAttribute('download', `dna-user-profile-${id}.json`);
    downloadAnchor.click();
  }
}
