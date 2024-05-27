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
import { ActivatedRoute } from '@angular/router';
import { FormArray, FormBuilder, ReactiveFormsModule } from '@angular/forms';
import { BeneficiariesStore } from './beneficiaries.store';
import { Beneficiary } from 'app/core/models/beneficiary.model';
import { take } from 'rxjs';
import { generateId } from 'app/core/utils/common.utils';
import { AssetsStore } from '../assets/assets.store';
import { Asset } from 'app/core/models/asset.model';
import { ChartIslandComponent } from 'app/core/components/chart-island/chart-island.component';
import { Value } from 'app/core/models/value.model';
import { LegendComponent } from 'app/core/components/legend/legend.component';
import { LegendItem } from 'app/core/models/legend.model';
import {
  createAxisYLabels,
  getColor,
  horizontalLinesHandler,
} from 'app/core/utils/charts.utils';
import { TuiAxesModule, TuiBarChartModule } from '@taiga-ui/addon-charts';

@Component({
  selector: 'app-beneficiaries',
  standalone: true,
  imports: [
    CalculatorComponent,
    TuiTabsModule,
    TuiInputModule,
    TuiInputNumberModule,
    TuiButtonModule,
    TuiBarChartModule,
    TuiAxesModule,
    HorizontalDividerComponent,
    ChartIslandComponent,
    LegendComponent,
    PieChartComponent,
    AsyncPipe,
    ReactiveFormsModule,
    NgIf,
    NgFor,
  ],
  templateUrl: './beneficiaries.component.html',
  styleUrl: './beneficiaries.component.scss',
  providers: [
    BeneficiariesStore,
    AssetsStore,
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
  assetVm$ = this.assetsStore.vm$;
  readonly beneficiariesForm = this.fb.group({
    beneficiaries: this.fb.array<Beneficiary>([]),
  });
  readonly horizontalLinesHandler = horizontalLinesHandler;

  constructor(
    @Inject(TuiDialogService)
    private readonly dialogs: TuiDialogService,
    private readonly beneficiariesStore: BeneficiariesStore,
    private readonly assetsStore: AssetsStore,
    private readonly fb: FormBuilder,
    private readonly route: ActivatedRoute
  ) {
    this.route.params.subscribe(params => {
      this.clientId = +params['clientId'];
      this.beneficiariesStore.getBeneficiaries(this.clientId);
      this.assetsStore.getAssets(this.clientId);
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
      label: beneficiary.name,
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

  getBeneficiaryDistribution(beneficiary: Beneficiary, assets: Asset[]) {
    return assets.reduce((acc, asset) => {
      return (
        acc +
        (asset.currentValue || 0) *
          (asset.beneficiaries.find(b => b.id === beneficiary.id)?.allocation ||
            0)
      );
    }, 0);
  }

  getRealDistribution(beneficiaries: Beneficiary[], assets: Asset[]) {
    const currentTotal = assets.reduce((acc, asset) => {
      return acc + (asset.currentValue || 0);
    }, 0);

    const distribution: Value[] = [];

    beneficiaries.forEach(beneficiary => {
      distribution.push({
        label: beneficiary.name || 'Unnamed Beneficiary',
        value: (
          this.getBeneficiaryDistribution(beneficiary, assets) / currentTotal
        ).toFixed(2),
      });
    });

    return distribution;
  }

  getAssetValueDistribution(beneficiaries: Beneficiary[], assets: Asset[]) {
    const distribution: number[][] = [];

    beneficiaries.forEach(beneficiary => {
      const beneficiaryDistribution = assets.map(asset => {
        return (
          (asset.currentValue || 0) *
          ((asset.beneficiaries.find(b => b.id === beneficiary.id)
            ?.allocation || 0) /
            100)
        );
      });
      distribution.push(beneficiaryDistribution);
    });

    return distribution;
  }

  getBeneficiaryLegend(beneficiaries: Beneficiary[]) {
    const legendItems: LegendItem[] = [];
    beneficiaries.forEach((beneficiary, index) => {
      legendItems.push({
        color: getColor(index),
        label: beneficiary.name || `Beneficiary ${index + 1}`,
      });
    });
    return legendItems;
  }

  getAssetYMax(assets: Asset[]) {
    return assets.reduce(
      (acc, asset) =>
        Math.max(
          acc,
          asset.beneficiaries.reduce((acc, beneficiary) => {
            return Math.max(
              acc,
              (asset.currentValue || 0) * ((beneficiary.allocation || 0) / 100)
            );
          }, 0)
        ),
      0
    );
  }

  readonly axisXLabels = (assets: Asset[]) => {
    return assets.map(asset => asset.name || 'Unnamed Asset');
  };

  readonly axisValueYLabels = (debts: Asset[]) => {
    const min = 0;
    const max = this.getAssetYMax(debts);
    const steps = 4;
    return createAxisYLabels(min, max, steps);
  };
}
