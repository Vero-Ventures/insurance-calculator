import { NgIf } from '@angular/common';
import { Component, ChangeDetectionStrategy } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import {
  TuiButtonModule,
  TuiDataListModule,
  TuiNotificationModule,
} from '@taiga-ui/core';
import {
  TuiCheckboxBlockModule,
  TuiDataListWrapperModule,
  TuiInputDateModule,
  TuiInputModule,
  TuiInputNumberModule,
  TuiInputSliderModule,
  TuiSelectModule,
  TuiTabsModule,
} from '@taiga-ui/kit';
import { CalculatorComponent } from '../calculator/calculator.component';
import { HorizontalDividerComponent } from 'app/core/components/horizontal-divider/horizontal-divider.component';
import { ValueCardComponent } from 'app/core/components/value-card/value-card.component';

@Component({
  selector: 'app-goals',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    TuiInputModule,
    TuiInputDateModule,
    TuiInputNumberModule,
    TuiInputSliderModule,
    TuiSelectModule,
    TuiDataListModule,
    TuiDataListWrapperModule,
    TuiTabsModule,
    TuiNotificationModule,
    TuiCheckboxBlockModule,
    TuiButtonModule,
    HorizontalDividerComponent,
    NgIf,
    ValueCardComponent,
    CalculatorComponent,
  ],
  templateUrl: './goals.component.html',
  styleUrl: './goals.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class GoalsComponent {
  activeItemIndex = 0;

  currentValueOfFixedAssets = {
    label: 'Total Current Value of Fixed Assets',
    value: '$1,000,000',
  };
  futureValueOfFixedAssets = {
    label: 'Total Future Value of Fixed Assets',
    value: '$1,000,000',
  };
  currentValueOfLiquidAssets = {
    label: 'Total Current Value of Liquid Assets',
    value: '$1,000,000',
  };
  futureValueOfLiquidAssets = {
    label: 'Total Current Value of Liquid Assets',
    value: '$1,000,000',
  };
  currentValueOfAssetsToBeSold = {
    label: 'Total Current Value of Assets to be Sold',
    value: '$1,000,000',
  };
  futureValueOfAssetsToBeSold = {
    label: 'Total Future Value of Assets to be Sold',
    value: '$1,000,000',
  };
  percentageLiquidityAllocatedToGoals = {
    label: '% Liquidity Allocated Towards Goals',
    value: '50%',
  };
  liquidityPreserved = {
    label: 'Liquidity Preserved',
    value: '$1,000,000',
  };
  liquidityAllocatedTowardsGoals = {
    label: 'Liquidity Allocated Towards Goals',
    value: '$1,000,000',
  };
  totalSumOfAllGoals = {
    label: 'Total Sum of All Goals',
    value: '$1,000,000',
  };
  surplus = {
    label: 'Surplus / Shortfall',
    value: '$1,000,000',
  };
}
