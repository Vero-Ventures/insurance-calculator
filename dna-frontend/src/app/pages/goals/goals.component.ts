import { NgIf } from '@angular/common';
import { Component, ChangeDetectionStrategy, Input } from '@angular/core';
import {
  FormArray,
  FormControl,
  FormGroup,
  ReactiveFormsModule,
} from '@angular/forms';
import { TuiButtonModule } from '@taiga-ui/core';
import {
  TuiCheckboxBlockModule,
  TuiInputModule,
  TuiInputNumberModule,
  TuiSelectModule,
  TuiTabsModule,
} from '@taiga-ui/kit';
import { CalculatorComponent } from '../calculator/calculator.component';
import { HorizontalDividerComponent } from 'app/core/components/horizontal-divider/horizontal-divider.component';
import { ValueCardComponent } from 'app/core/components/value-card/value-card.component';
import { BarChartComponent } from 'app/core/components/bar-chart/bar-chart.component';
import { ClientStore } from '../client/client.store';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-goals',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    TuiInputModule,
    TuiInputNumberModule,
    TuiSelectModule,
    TuiTabsModule,
    TuiCheckboxBlockModule,
    TuiButtonModule,
    HorizontalDividerComponent,
    NgIf,
    ValueCardComponent,
    CalculatorComponent,
    BarChartComponent,
  ],
  templateUrl: './goals.component.html',
  styleUrl: './goals.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [ClientStore],
})
export class GoalsComponent {
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

  readonly goalsForm = new FormGroup({
    liquidityAllocatedToGoals: new FormControl(),
    goals: new FormArray([]),
  });

  get goals(): FormArray {
    return this.goalsForm.get('goals') as FormArray;
  }

  createGoal(): FormGroup {
    return new FormGroup({
      name: new FormControl(),
      amount: new FormControl(),
      philanthropic: new FormControl(),
    });
  }

  addGoal() {
    this.goals.push(this.createGoal());
  }

  removeGoal(index: number) {
    this.goals.removeAt(index);
  }

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
