import { AsyncPipe, NgFor, NgIf } from '@angular/common';
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
import { LineChartComponent } from 'app/core/components/line-chart/line-chart.component';
import { ActivatedRoute, Router } from '@angular/router';
import { take } from 'rxjs';
import { generateId } from 'app/core/utils/common.utils';
import { DebtsStore } from './debts.store';
import { Debt } from 'app/core/models/debt.model';

@Component({
  selector: 'app-debts',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    TuiInputModule,
    TuiInputNumberModule,
    TuiTabsModule,
    TuiNotificationModule,
    TuiButtonModule,
    HorizontalDividerComponent,
    ValueCardComponent,
    CalculatorComponent,
    LineChartComponent,
    NgIf,
    NgFor,
    AsyncPipe,
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
        insurableFutureValue: [debt?.insurableFutureValue || 0],
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

  totalInitialValue = {
    label: 'Total Initial Value ($)',
    value: '$1,000,000',
  };
  totalInsurableFutureValue = {
    label: 'Total Insurable Future Value ($)',
    value: '$1,000,000',
  };
}
