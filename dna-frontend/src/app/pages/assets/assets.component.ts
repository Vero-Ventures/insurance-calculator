import { NgIf } from '@angular/common';
import { Component, ChangeDetectionStrategy, Input } from '@angular/core';
import {
  FormArray,
  FormControl,
  FormGroup,
  ReactiveFormsModule,
} from '@angular/forms';
import { TuiButtonModule, TuiNotificationModule } from '@taiga-ui/core';
import {
  TuiInputModule,
  TuiInputNumberModule,
  TuiTabsModule,
} from '@taiga-ui/kit';
import { CalculatorComponent } from '../calculator/calculator.component';
import { HorizontalDividerComponent } from 'app/core/components/horizontal-divider/horizontal-divider.component';
import { ValueCardComponent } from 'app/core/components/value-card/value-card.component';
import { LineChartComponent } from 'app/core/components/line-chart/line-chart.component';
import { ValueListCardComponent } from 'app/core/components/value-list-card/value-list-card.component';
import { PieChartComponent } from 'app/core/components/pie-chart/pie-chart.component';
import { ClientStore } from '../client/client.store';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-assets',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    TuiInputModule,
    TuiInputNumberModule,
    TuiTabsModule,
    TuiNotificationModule,
    TuiButtonModule,
    HorizontalDividerComponent,
    NgIf,
    ValueCardComponent,
    CalculatorComponent,
    LineChartComponent,
    ValueListCardComponent,
    PieChartComponent,
  ],
  templateUrl: './assets.component.html',
  styleUrl: './assets.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [ClientStore],
})
export class AssetsComponent {
  @Input() clientId: number = 0;
  activeItemIndex = 0;

  constructor(
    private readonly clientStore: ClientStore,
    private route: ActivatedRoute
  ) {
    this.route.params.subscribe(params => {
      this.clientId = +params['clientId'];
      // Use the clientStore here.
    });
  }

  readonly assetsForm = new FormGroup({
    assets: new FormArray([]),
  });

  get assets(): FormArray {
    return this.assetsForm.get('assets') as FormArray;
  }

  createAsset(): FormGroup {
    return new FormGroup({
      name: new FormControl(),
      currentValue: new FormControl(),
      futureTaxLiability: new FormControl(),
    });
  }

  addAsset() {
    this.assets.push(this.createAsset());
  }

  removeAsset(index: number) {
    this.assets.removeAt(index);
  }

  totalInitialValue = {
    label: 'Total Initial Value ($)',
    value: '$1,000,000',
  };
  totalInsurableFutureValue = {
    label: 'Total Insurable Future Value ($)',
    value: '$1,000,000',
  };

  beneficiary1 = [
    { label: 'Amount ($)', value: '$600,000.00' },
    { label: 'Percentage (%)', value: '30.00%' },
    { label: 'Ideal Distribution (%)', value: '30.00%' },
    { label: 'Additional Required ($)', value: '$0.00' },
  ];
  beneficiary2 = [
    { label: 'Amount ($)', value: '$600,000.00' },
    { label: 'Percentage (%)', value: '30.00%' },
    { label: 'Ideal Distribution (%)', value: '30.00%' },
    { label: 'Additional Required ($)', value: '$0.00' },
  ];
}
