import { Component, Input, OnInit, OnDestroy, Inject } from '@angular/core';
import { CalculatorComponent } from '../calculator/calculator.component';
import {
  TUI_PROMPT,
  TuiInputModule,
  TuiInputNumberModule,
  TuiTabsModule,
} from '@taiga-ui/kit';
import {
  TuiButtonModule,
  TuiDialogService,
  tuiNumberFormatProvider,
} from '@taiga-ui/core';
import { AsyncPipe, NgFor, NgIf } from '@angular/common';
import { HorizontalDividerComponent } from 'app/core/components/horizontal-divider/horizontal-divider.component';
import { PieChartComponent } from 'app/core/components/pie-chart/pie-chart.component';
import { BarChartComponent } from 'app/core/components/bar-chart/bar-chart.component';
import { ActivatedRoute } from '@angular/router';
import { FormArray, FormBuilder, ReactiveFormsModule } from '@angular/forms';
import { BeneficiariesStore } from './beneficiaries.store';
import { Beneficiary } from 'app/core/models/beneficiary.model';
import { take } from 'rxjs';
import { generateId } from 'app/core/utils/common.utils';

@Component({
  selector: 'app-beneficiaries',
  standalone: true,
  imports: [
    CalculatorComponent,
    TuiTabsModule,
    TuiInputModule,
    TuiInputNumberModule,
    TuiButtonModule,
    HorizontalDividerComponent,
    PieChartComponent,
    BarChartComponent,
    AsyncPipe,
    ReactiveFormsModule,
    NgIf,
    NgFor,
  ],
  templateUrl: './beneficiaries.component.html',
  styleUrl: './beneficiaries.component.scss',
  providers: [
    BeneficiariesStore,
    tuiNumberFormatProvider({
      decimalSeparator: '.',
      thousandSeparator: ',',
    }),
  ],
})
export class BeneficiariesComponent implements OnInit, OnDestroy {
  @Input() clientId: number = 0;
  activeItemIndex = 0;
  vm$ = this.beneficiariesStore.vm$;
  readonly beneficiariesForm = this.fb.group({
    beneficiaries: this.fb.array<Beneficiary>([]),
  });

  constructor(
    @Inject(TuiDialogService)
    private readonly dialogs: TuiDialogService,
    private readonly beneficiariesStore: BeneficiariesStore,
    private readonly fb: FormBuilder,
    private readonly route: ActivatedRoute
  ) {
    this.route.params.subscribe(params => {
      this.clientId = +params['id'];
      this.beneficiariesStore.getBeneficiaries(this.clientId);
      // This is necessary to first populate the form with the initial state and then the data from the db
      this.vm$.pipe(take(2)).subscribe(state => {
        state.beneficiaries.forEach(beneficiary => {
          this.addBeneficiary(beneficiary);
        });
      });
    });
  }

  get beneficiaries() {
    return this.beneficiariesForm.get('beneficiaries') as FormArray;
  }

  get beneficiariesChart() {
    return this.beneficiaries.value.map((beneficiary: Beneficiary) => ({
      name: beneficiary.name,
      value: beneficiary.allocation,
    }));
  }

  get totalAllocation() {
    return this.beneficiariesChart.reduce(
      (total: number, beneficiary: Beneficiary) =>
        total + (beneficiary.allocation || 0),
      0
    );
  }

  ngOnInit() {
    this.beneficiariesForm.valueChanges.subscribe(formData => {
      this.beneficiariesStore.setBeneficiaries(
        (formData.beneficiaries as Beneficiary[]) || []
      );
    });
  }

  ngOnDestroy() {
    this.beneficiariesStore.updateBeneficiaries(this.clientId);
  }

  onBlur() {
    this.beneficiariesStore.updateBeneficiaries(this.clientId);
  }

  addBeneficiary(beneficiary: Beneficiary | null = null) {
    this.beneficiaries.push(
      this.fb.group({
        id: [beneficiary?.id || this.generateId()],
        name: [beneficiary?.name || ''],
        allocation: [beneficiary?.allocation || 0],
      })
    );
  }

  deleteBeneficiary(index: number) {
    this.beneficiaries.removeAt(index);
    this.beneficiariesStore.updateBeneficiaries(this.clientId);
  }

  generateId() {
    let id = generateId();
    while (
      this.beneficiaries.value.find(
        (beneficiary: Beneficiary) => parseInt(beneficiary.id) === id
      )
    ) {
      id++;
    }
    return id.toString();
  }

  openDeleteDialog(index: number) {
    const beneficiaryName = this.beneficiaries.at(index).value.name;
    this.dialogs
      .open<boolean>(TUI_PROMPT, {
        data: {
          content: `Do you want to delete ${beneficiaryName}? This action cannot be undone.`,
          yes: 'Delete',
          no: 'Cancel',
        },
      })
      .subscribe(result => {
        if (result) {
          this.deleteBeneficiary(index);
        }
      });
  }
}
