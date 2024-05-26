import { AsyncPipe, NgFor, NgIf } from '@angular/common';
import { Component, OnInit, OnDestroy, Input, Inject } from '@angular/core';
import {
  FormArray,
  FormBuilder,
  FormControl,
  ReactiveFormsModule,
} from '@angular/forms';
import {
  TuiButtonModule,
  TuiDialogService,
  tuiNumberFormatProvider,
} from '@taiga-ui/core';
import {
  TUI_PROMPT,
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
import { GoalsStore } from './goals.store';
import { Goal } from 'app/core/models/goal.model';
import { ActivatedRoute } from '@angular/router';
import { Subscription, map, take } from 'rxjs';

@Component({
  selector: 'app-goals',
  standalone: true,
  imports: [
    TuiInputModule,
    TuiInputNumberModule,
    TuiSelectModule,
    TuiTabsModule,
    TuiCheckboxBlockModule,
    TuiButtonModule,
    HorizontalDividerComponent,
    ValueCardComponent,
    CalculatorComponent,
    BarChartComponent,
    ReactiveFormsModule,
    NgIf,
    NgFor,
    AsyncPipe,
  ],
  templateUrl: './goals.component.html',
  styleUrl: './goals.component.scss',
  providers: [
    GoalsStore,
    tuiNumberFormatProvider({
      decimalSeparator: '.',
      thousandSeparator: ',',
    }),
  ],
})
export class GoalsComponent implements OnInit, OnDestroy {
  @Input() clientId: number = 0;
  activeItemIndex = 0;
  vm$ = this.goalsStore.vm$;
  readonly goalsForm = this.fb.group({
    percentGoalLiquidity: new FormControl(),
    goals: this.fb.array<Goal>([]),
  });
  initialPercentSub: Subscription | null = null;

  constructor(
    @Inject(TuiDialogService)
    private readonly dialogs: TuiDialogService,
    private readonly goalsStore: GoalsStore,
    private readonly fb: FormBuilder,
    private readonly route: ActivatedRoute
  ) {
    this.route.params.subscribe(params => {
      this.clientId = +params['clientId'];
      this.initializeFields();
    });
  }

  get goals() {
    return this.goalsForm.get('goals') as FormArray;
  }

  ngOnInit() {
    this.goalsForm.valueChanges.subscribe(formData => {
      this.goalsStore.setPercentGoalLiquidity(
        (formData.percentGoalLiquidity as number) || 0
      );
      this.goalsStore.setGoals((formData.goals as Goal[]) || []);
    });
  }

  ngOnDestroy() {
    this.goalsStore.updateGoals(this.clientId);
  }

  onPercentBlur() {
    this.goalsStore.updatePercentGoalLiquidity(this.clientId);
  }

  onBlur() {
    this.goalsStore.updateGoals(this.clientId);
  }

  initializeFields() {
    this.goalsStore.getPercentGoalLiquidity(this.clientId);
    this.initialPercentSub = this.vm$
      .pipe(map(state => state.percentGoalLiquidity))
      .subscribe(percentGoalLiquidity => {
        if (percentGoalLiquidity !== null) {
          this.initialPercentSub?.unsubscribe();
          this.goalsForm
            .get('percentGoalLiquidity')
            ?.setValue(percentGoalLiquidity);
          this.initializeGoals();
        }
      });
  }

  initializeGoals() {
    this.goalsStore.getGoals(this.clientId);
    this.vm$
      .pipe(take(3))
      .pipe(map(state => state.goals))
      .subscribe(goals => {
        console.log(goals);
        if (goals.length !== null) {
          goals.forEach(goal => {
            this.addGoal(goal);
          });
        }
      });
  }

  addGoal(goal: Goal | null = null) {
    this.goals.push(
      this.fb.group({
        name: [goal?.name || ''],
        amount: [goal?.amount || 0],
        isPhilanthropic: [goal?.isPhilanthropic || false],
      })
    );
  }

  deleteGoal(index: number) {
    this.goals.removeAt(index);
    this.goalsStore.updateGoals(this.clientId);
  }

  openDeleteDialog(index: number) {
    const goalName = this.goals.at(index).value.name;
    this.dialogs
      .open<boolean>(TUI_PROMPT, {
        data: {
          content: `Do you want to delete ${goalName}? This action cannot be undone.`,
          yes: 'Delete',
          no: 'Cancel',
        },
      })
      .subscribe(result => {
        if (result) {
          this.deleteGoal(index);
        }
      });
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
