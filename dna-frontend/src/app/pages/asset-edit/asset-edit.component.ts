import { NgIf } from '@angular/common';
import { Component, NgZone } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { TuiButtonModule, TuiDataListModule } from '@taiga-ui/core';
import {
  TuiCheckboxBlockModule,
  TuiDataListWrapperModule,
  TuiInputModule,
  TuiInputNumberModule,
  TuiSelectModule,
  TuiTabsModule,
} from '@taiga-ui/kit';
import { HorizontalDividerComponent } from 'app/core/components/horizontal-divider/horizontal-divider.component';
import { HeaderBarComponent } from 'app/core/components/header-bar/header-bar.component';
import { ActionBarComponent } from 'app/core/components/action-bar/action-bar.component';
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
    TuiSelectModule,
    TuiDataListModule,
    TuiDataListWrapperModule,
    TuiCheckboxBlockModule,
    HorizontalDividerComponent,
    NgIf,
    CalculatorComponent,
    HeaderBarComponent,
    ActionBarComponent,
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

  types = [
    'Cash',
    'Stocks',
    'Bonds',
    'Real Estate',
    'Mutual Funds',
    'Retirement Account',
    'Crypto',
    'Life Insurance',
  ];

  assetEditForm = new FormGroup({
    type: new FormControl(),
    taxable: new FormControl(),
  });

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
