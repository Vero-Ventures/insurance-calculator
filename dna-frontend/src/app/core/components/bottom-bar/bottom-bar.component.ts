import { NgFor } from '@angular/common';
import { Component, NgZone } from '@angular/core';
import {
  ActivatedRoute,
  Router,
  RouterLink,
  RouterLinkActive,
} from '@angular/router';
import { TuiButtonModule } from '@taiga-ui/core';
import { TuiProgressSegmentedModule } from '@taiga-ui/experimental';
import { TuiProgressModule } from '@taiga-ui/kit';
import { ClientStore } from 'app/pages/client/client.store';

@Component({
  selector: 'app-bottom-bar',
  standalone: true,
  imports: [
    TuiProgressModule,
    TuiProgressSegmentedModule,
    TuiButtonModule,
    RouterLink,
    RouterLinkActive,
    NgFor,
  ],
  templateUrl: './bottom-bar.component.html',
  styleUrl: './bottom-bar.component.scss',
  providers: [ClientStore],
})
export class BottomBarComponent {
  constructor(
    private readonly router: Router,
    private readonly zone: NgZone,
    private route: ActivatedRoute
  ) {
    this.route.params.subscribe(params => {
      this.clientId = +params['clientId'];
      this.urlSuffix = `/${this.clientId}`;
    });
  }

  clientId = 0;
  urlSuffix = `/0`;

  pageList = [
    'client',
    'beneficiaries',
    'businesses',
    'assets',
    'debts',
    'goals',
    'total-needs',
  ];
  currentPageName = this.router.url.substring(1).split('/')[0];

  isBackButtonDisabled(): boolean {
    return this.getPageIndex() == 0;
  }

  isNextButtonDisabled(): boolean {
    return this.getPageIndex() == this.pageList.length - 1;
  }

  getPageIndex(): number {
    return this.pageList.indexOf(this.currentPageName);
  }

  getPreviousPageName(): string {
    if (this.isBackButtonDisabled()) {
      return this.currentPageName;
    } else {
      return this.pageList[this.getPageIndex() - 1];
    }
  }

  getNextPageName(): string {
    if (this.isNextButtonDisabled()) {
      return this.currentPageName;
    } else {
      return this.pageList[this.getPageIndex() + 1];
    }
  }

  back() {
    this.zone.run(() => {
      this.router.navigate([`/${this.getPreviousPageName()}${this.urlSuffix}`]);
    });
  }

  next() {
    this.zone.run(() => {
      this.router.navigate([`/${this.getNextPageName()}${this.urlSuffix}`]);
    });
  }
}
