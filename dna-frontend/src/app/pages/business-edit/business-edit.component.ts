import { Location, NgIf } from '@angular/common';
import { Component, NgZone } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { TuiButtonModule, TuiNotificationModule } from '@taiga-ui/core';
import {
  TuiInputModule,
  TuiInputNumberModule,
  TuiTabsModule,
} from '@taiga-ui/kit';
import { ActionBarComponent } from 'app/core/components/action-bar/action-bar.component';
import { BottomBarComponent } from 'app/core/components/bottom-bar/bottom-bar.component';
import { HeaderBarComponent } from 'app/core/components/header-bar/header-bar.component';
import { HorizontalDividerComponent } from 'app/core/components/horizontal-divider/horizontal-divider.component';

@Component({
  selector: 'app-business-edit',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    TuiInputModule,
    TuiInputNumberModule,
    HorizontalDividerComponent,
    HeaderBarComponent,
    ActionBarComponent,
    BottomBarComponent,
    TuiTabsModule,
    NgIf,
    TuiButtonModule,
    TuiNotificationModule,
  ],
  templateUrl: './business-edit.component.html',
  styleUrl: './business-edit.component.scss',
})
export class BusinessEditComponent {
  activeItemIndex = 0;

  constructor(
    private router: Router,
    private zone: NgZone,
    private location: Location
  ) {}

  cancel() {
    this.zone.run(() => {
      this.location.back();
    });
  }

  save() {
    this.zone.run(() => {
      this.location.back();
    });
  }
}
