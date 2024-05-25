import { AsyncPipe, CurrencyPipe, NgFor, NgIf } from '@angular/common';
import {
  Component,
  OnInit,
  OnDestroy,
  Input,
  Inject,
  NgZone,
} from '@angular/core';
import { FormArray, FormBuilder, ReactiveFormsModule } from '@angular/forms';
import {
  TuiButtonModule,
  TuiDialogService,
  TuiNotificationModule,
  TuiPoint,
  tuiNumberFormatProvider,
} from '@taiga-ui/core';
import {
  TUI_PROMPT,
  TuiInputModule,
  TuiInputNumberModule,
  TuiTabsModule,
} from '@taiga-ui/kit';
import { CalculatorComponent } from '../calculator/calculator.component';
import { HorizontalDividerComponent } from 'app/core/components/horizontal-divider/horizontal-divider.component';
import { ValueCardComponent } from 'app/core/components/value-card/value-card.component';
import { ActivatedRoute, Router } from '@angular/router';
import { take } from 'rxjs';
import { generateId } from 'app/core/utils/common.utils';
import { DebtsStore } from './debts.store';
import { Debt } from 'app/core/models/debt.model';
import { ChartIslandComponent } from 'app/core/components/chart-island/chart-island.component';
import { TuiAxesModule, TuiLineChartModule } from '@taiga-ui/addon-charts';
import {
  createAxisYLabels,
  createYearAxisXLabels,
  getColor,
  horizontalLinesHandler,
} from 'app/core/utils/charts.utils';
import { LegendItem } from 'app/core/models/legend.model';
import { LegendComponent } from 'app/core/components/legend/legend.component';
import { ValueListCardComponent } from 'app/core/components/value-list-card/value-list-card.component';

@Component({
  selector: 'app-debts',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    TuiInputModule,
    TuiInputNumberModule,
    TuiTabsModule,
    TuiNotificationModule,
    TuiLineChartModule,
    TuiButtonModule,
    TuiAxesModule,
    HorizontalDividerComponent,
    LegendComponent,
    ChartIslandComponent,
    ValueCardComponent,
    ValueListCardComponent,
    CalculatorComponent,
    NgIf,
    NgFor,
    AsyncPipe,
    CurrencyPipe,
  ],
  templateUrl: './debts.component.html',
  styleUrl: './debts.component.scss',
  providers: [
    DebtsStore,
    tuiNumberFormatProvider({
      decimalSeparator: '.',
      thousandSeparator: ',',
    }),
  ],
})
export class DebtsComponent implements OnInit, OnDestroy {
  @Input() clientId: number = 0;
  activeItemIndex = 0;
  vm$ = this.debtsStore.vm$;
  readonly debtsForm = this.fb.group({
    debts: this.fb.array<Debt>([]),
  });
  readonly horizontalLinesHandler = horizontalLinesHandler;

  constructor(
    @Inject(TuiDialogService)
    private readonly dialogs: TuiDialogService,
    private readonly debtsStore: DebtsStore,
    private readonly fb: FormBuilder,
    private readonly zone: NgZone,
    private readonly router: Router,
    private readonly route: ActivatedRoute
  ) {
    this.route.params.subscribe(params => {
      this.clientId = +params['clientId'];
      this.debtsStore.getDebts(this.clientId);
      // This is necessary to first populate the form with the initial state and then the data from the db
      this.vm$.pipe(take(2)).subscribe(state => {
        state.debts.forEach(debt => {
          this.addDebt(debt);
        });
      });
    });
  }

  get debts() {
    return this.debtsForm.get('debts') as FormArray;
  }

  ngOnInit() {
    this.debtsForm.valueChanges.subscribe(formData => {
      this.debtsStore.setDebts((formData.debts as Debt[]) || []);
    });
  }

  ngOnDestroy() {
    this.debtsStore.updateDebts(this.clientId);
  }

  onBlur() {
    this.debtsStore.updateDebts(this.clientId);
  }

  addDebt(debt: Debt | null = null) {
    this.debts.push(
      this.fb.group({
        id: [debt?.id || this.generateId()],
        name: [debt?.name || ''],
        initialValue: [debt?.initialValue || 0],
        yearAcquired: [debt?.yearAcquired || 0],
        rate: [debt?.rate || 0],
        term: [debt?.term || 0],
        annualPayment: [debt?.annualPayment || 0],
      })
    );
  }

  editDebt(index: number) {
    const id = this.debts.at(index).value.id;
    this.zone.run(() => {
      this.router.navigate([`/debt/${this.clientId}/${id}`]);
    });
  }

  deleteDebt(index: number) {
    this.debts.removeAt(index);
    this.debtsStore.updateDebts(this.clientId);
  }

  generateId() {
    let id = generateId();
    while (this.debts.value.find((debt: Debt) => parseInt(debt.id) === id)) {
      id++;
    }
    return id.toString();
  }

  openDeleteDialog(index: number) {
    const debtName = this.debts.at(index).value.name;
    this.dialogs
      .open<boolean>(TUI_PROMPT, {
        data: {
          content: `Do you want to delete ${debtName}? This action cannot be undone.`,
          yes: 'Delete',
          no: 'Cancel',
        },
      })
      .subscribe(result => {
        if (result) {
          this.deleteDebt(index);
        }
      });
  }

  calculateTotalInitialValue(debts: Debt[]) {
    return debts.reduce((acc, debt) => acc + (debt.initialValue || 0), 0);
  }

  calculateSingleFutureValue(debt: Debt) {
    const currentYearsHeld = this.calculateYearsHeld(debt);
    const amountPaidOffDollars = (debt.annualPayment || 0) * currentYearsHeld;
    const futureValueOfActualTermDebt =
      (debt.initialValue || 0) *
      Math.pow(1 + (debt.rate || 0) / 100, debt.term || 0);
    return futureValueOfActualTermDebt - amountPaidOffDollars;
  }

  calculateTotalFutureValue(debts: Debt[]) {
    return debts.reduce(
      (acc, debt) => acc + this.calculateSingleFutureValue(debt),
      0
    );
  }

  calculateYearsHeld(debt: Debt) {
    const currentYear = new Date().getFullYear();
    return currentYear - (debt.yearAcquired || currentYear);
  }

  calculateAmountPaid(debt: Debt) {
    const yearsPaid = this.calculateYearsHeld(debt);
    return yearsPaid * (debt.annualPayment || 0);
  }

  calculateCurrentDebt(debt: Debt) {
    return (
      (debt.initialValue || 0) *
      Math.pow(1 + (debt.rate || 0) / 100, this.calculateYearsHeld(debt))
    );
  }

  calculateSingleRemainingDebt(debt: Debt) {
    const remainingDebt: TuiPoint[] = [];
    const initialValue = debt.initialValue || 0;
    const annualPayment = debt.annualPayment || 0;
    const startingYear = debt.yearAcquired || 0;
    const rate = debt.rate || 0;
    const term = debt.term || 0;
    const years = this.calculateYearsHeld(debt) + term;
    let remainingValue = initialValue;
    for (let i = 0; i <= years; i++) {
      remainingValue = remainingValue * (1 + rate / 100) - annualPayment;
      remainingDebt.push([startingYear + i, remainingValue]);
    }
    return remainingDebt;
  }

  calculateRemainingDebt(debts: Debt[]) {
    const debtValue: TuiPoint[][] = [];
    debts.forEach(debt => {
      debtValue.push(this.calculateSingleRemainingDebt(debt));
    });
    return debtValue;
  }

  calculateYearsToPayOff(debt: Debt) {
    if (debt.annualPayment === 0) {
      return null;
    }

    return DebtsComponent.nper(
      debt.rate || 0,
      debt.annualPayment || 0,
      this.calculateCurrentDebt(debt) - this.calculateAmountPaid(debt)
    );
  }

  getXMin(debts: Debt[]) {
    return debts.reduce(
      (acc, debt) =>
        Math.min(
          acc,
          debt.yearAcquired ? debt.yearAcquired : new Date().getFullYear()
        ),
      new Date().getFullYear()
    );
  }

  getXMax(debts: Debt[]) {
    return debts.reduce(
      (acc, debt) =>
        Math.max(
          acc,
          new Date().getFullYear() -
            (debt.yearAcquired ? debt.yearAcquired : new Date().getFullYear()) +
            (debt.term || 0)
        ),
      0
    );
  }

  getDebtYMax(debts: Debt[]) {
    return debts.reduce(
      (acc, debt) =>
        Math.max(
          acc,
          Math.max(
            ...this.calculateSingleRemainingDebt(debt).map(point => point[1])
          ) || 0
        ),
      0
    );
  }

  getDebtLegend(debts: Debt[]) {
    const legendItems: LegendItem[] = [];
    debts.forEach((debt, index) => {
      legendItems.push({
        color: getColor(index),
        label: debt.name || `Debt ${index + 1}`,
      });
    });
    return legendItems;
  }

  color(index: number) {
    return getColor(index);
  }

  readonly axisXLabels = (debts: Debt[]) => {
    const min = this.getXMin(debts);
    const max = this.getXMax(debts);
    return createYearAxisXLabels(max, min);
  };

  readonly axisDebtYLabels = (debts: Debt[]) => {
    const min = 0;
    const max = this.getDebtYMax(debts);
    const steps = 4;
    return createAxisYLabels(min, max, steps);
  };

  static nper(
    rate: number,
    annualPayment: number,
    presentValue: number
  ): number {
    rate = rate / 100;

    if (rate <= 0) {
      rate *= -1;
    }

    const numerator: number = Math.log(
      annualPayment / (annualPayment - presentValue * rate)
    );
    const denominator: number = Math.log(1 + rate);
    return numerator / denominator;
  }
}
