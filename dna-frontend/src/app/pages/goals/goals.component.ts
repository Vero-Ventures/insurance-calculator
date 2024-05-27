import {
  AsyncPipe,
  CurrencyPipe,
  NgFor,
  NgIf,
  PercentPipe,
} from '@angular/common';
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
import { GoalsStore } from './goals.store';
import { Goal } from 'app/core/models/goal.model';
import { ActivatedRoute } from '@angular/router';
import { Subscription, map, take } from 'rxjs';
import { ValueListCardComponent } from 'app/core/components/value-list-card/value-list-card.component';
import { AssetsStore } from '../assets/assets.store';
import { Asset } from 'app/core/models/asset.model';
import { ChartIslandComponent } from 'app/core/components/chart-island/chart-island.component';
import { TuiAxesModule, TuiBarSetModule } from '@taiga-ui/addon-charts';
import {
  createAxisYLabels,
  getColor,
  horizontalLinesHandler,
} from 'app/core/utils/charts.utils';
import { LegendComponent } from 'app/core/components/legend/legend.component';
import { LegendItem } from 'app/core/models/legend.model';

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
    TuiAxesModule,
    TuiBarSetModule,
    HorizontalDividerComponent,
    ValueListCardComponent,
    ChartIslandComponent,
    CalculatorComponent,
    LegendComponent,
    NgIf,
    NgFor,
    AsyncPipe,
    PercentPipe,
    CurrencyPipe,
  ],
  templateUrl: './goals.component.html',
  styleUrl: './goals.component.scss',
  providers: [
    GoalsStore,
    AssetsStore,
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
  assetVm$ = this.assetsStore.vm$;
  readonly goalsForm = this.fb.group({
    percentGoalLiquidity: new FormControl(),
    goals: this.fb.array<Goal>([]),
  });
  initialPercentSub: Subscription | null = null;
  readonly horizontalLinesHandler = horizontalLinesHandler;

  constructor(
    @Inject(TuiDialogService)
    private readonly dialogs: TuiDialogService,
    private readonly goalsStore: GoalsStore,
    private readonly assetsStore: AssetsStore,
    private readonly fb: FormBuilder,
    private readonly route: ActivatedRoute
  ) {
    this.route.params.subscribe(params => {
      this.clientId = +params['clientId'];
      this.assetsStore.getAssets(this.clientId);
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

  calculateFutureValue(current: number, rate: number, term: number) {
    return current * Math.pow(1 + rate / 100, term);
  }

  calculateCurrentValueFixed(assets: Asset[]) {
    return assets
      .filter(asset => !asset.isLiquid && !asset.isToBeSold)
      .reduce((acc, asset) => {
        return acc + (asset.currentValue || 0);
      }, 0);
  }

  calculateFutureValueFixed(assets: Asset[]) {
    return assets
      .filter(asset => !asset.isLiquid && !asset.isToBeSold)
      .reduce((acc, asset) => {
        return (
          acc +
          this.calculateFutureValue(
            asset.currentValue || 0,
            asset.rate || 0,
            asset.term || 0
          )
        );
      }, 0);
  }

  calculateCurrentValueLiquid(assets: Asset[]) {
    return assets
      .filter(asset => asset.isLiquid)
      .reduce((acc, asset) => {
        return acc + (asset.currentValue || 0);
      }, 0);
  }

  calculateFutureValueLiquid(assets: Asset[]) {
    return assets
      .filter(asset => asset.isLiquid)
      .reduce((acc, asset) => {
        return (
          acc +
          this.calculateFutureValue(
            asset.currentValue || 0,
            asset.rate || 0,
            asset.term || 0
          )
        );
      }, 0);
  }

  calculateCurrentValueToBeSold(assets: Asset[]) {
    return assets
      .filter(asset => asset.isToBeSold)
      .reduce((acc, asset) => {
        return acc + (asset.currentValue || 0);
      }, 0);
  }

  calculateFutureValueToBeSold(assets: Asset[]) {
    return assets
      .filter(asset => asset.isToBeSold)
      .reduce((acc, asset) => {
        return (
          acc +
          this.calculateFutureValue(
            asset.currentValue || 0,
            asset.rate || 0,
            asset.term || 0
          )
        );
      }, 0);
  }

  calculateLiquidityPreserved(assets: Asset[], allocation: number) {
    return this.calculateFutureValueLiquid(assets) * (1 - allocation / 100);
  }

  calculateLiquidityToGoal(assets: Asset[], allocation: number) {
    return this.calculateFutureValueLiquid(assets) * (allocation / 100);
  }

  calculateTotalSumGoals(goals: Goal[]) {
    return goals.reduce((acc, goal) => {
      return acc + (goal.amount || 0);
    }, 0);
  }

  calculateShortfall(assets: Asset[], goals: Goal[], allocation: number) {
    return (
      this.calculateLiquidityToGoal(assets, allocation) -
      this.calculateTotalSumGoals(goals)
    );
  }

  getLiquidityGoalDistribution(
    assets: Asset[],
    goals: Goal[],
    allocation: number
  ) {
    const values: number[] = [];

    values.push(this.calculateFutureValueLiquid(assets));
    values.push(this.calculateLiquidityPreserved(assets, allocation));
    values.push(this.calculateLiquidityToGoal(assets, allocation));
    values.push(this.calculateTotalSumGoals(goals) * -1);
    values.push(this.calculateShortfall(assets, goals, allocation));

    return values;
  }

  getAssetYMax(assets: Asset[], goals: Goal[], allocation: number) {
    return Math.max(
      this.calculateCurrentValueLiquid(assets),
      this.calculateLiquidityPreserved(assets, allocation),
      this.calculateLiquidityToGoal(assets, allocation),
      this.calculateTotalSumGoals(goals),
      this.calculateShortfall(assets, goals, allocation)
    );
  }

  getGoalLegend() {
    const labels = this.axisXLabels();

    const legendItems: LegendItem[] = [];
    labels.forEach((label, index) => {
      legendItems.push({
        color: getColor(index),
        label: label,
      });
    });

    return legendItems;
  }

  readonly axisXLabels = () => {
    return [
      'Future Liquidity',
      'Preserved Liquidity',
      'Allocated To Goals',
      'Total Goals',
      'Surplus/Shortfall',
    ];
  };

  readonly axisValueYLabels = (
    assets: Asset[],
    goals: Goal[],
    allocation: number
  ) => {
    const min = 0;
    const max = this.getAssetYMax(assets, goals, allocation);
    const steps = 4;
    return createAxisYLabels(min, max, steps);
  };
}
