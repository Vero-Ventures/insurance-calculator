import { NgIf } from '@angular/common';
import { Component, NgZone } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { TuiButtonModule } from '@taiga-ui/core';
import {
  TuiInputModule,
  TuiInputNumberModule,
  TuiTabsModule,
} from '@taiga-ui/kit';
import { HorizontalDividerComponent } from 'app/core/components/horizontal-divider/horizontal-divider.component';
import { HeaderBarComponent } from 'app/core/components/header-bar/header-bar.component';
import { ActionBarComponent } from 'app/core/components/action-bar/action-bar.component';
import { BottomBarComponent } from 'app/core/components/bottom-bar/bottom-bar.component';
import { Router } from '@angular/router';
import { CalculatorComponent } from '../calculator/calculator.component';

@Component({
  selector: 'app-asset-edit',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    TuiTabsModule,
    TuiInputModule,
    TuiInputNumberModule,
    TuiButtonModule,
    HorizontalDividerComponent,
    NgIf,
    CalculatorComponent,
    HeaderBarComponent,
    ActionBarComponent,
    BottomBarComponent,
  ],
  templateUrl: './asset-edit.component.html',
  styleUrl: './asset-edit.component.scss',
})
export class AssetEditComponent {
  constructor(
    private router: Router,
    private zone: NgZone
  ) {}

  activeItemIndex = 0;

  cancel() {
    this.zone.run(() => {
      this.router.navigate(['/assets']);
    });
  }

  save() {
    this.zone.run(() => {
      this.router.navigate(['/assets']);
    });
  }
}
