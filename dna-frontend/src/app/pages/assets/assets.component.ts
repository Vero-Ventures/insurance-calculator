import {
  AsyncPipe,
  CurrencyPipe,
  NgFor,
  NgIf,
  PercentPipe,
} from '@angular/common';
import {
  Component,
  Inject,
  Input,
  NgZone,
  OnDestroy,
  OnInit,
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
import { ValueListCardComponent } from 'app/core/components/value-list-card/value-list-card.component';
import { PieChartComponent } from 'app/core/components/pie-chart/pie-chart.component';
import { take } from 'rxjs';
import { ActivatedRoute, Router } from '@angular/router';
import { generateId } from 'app/core/utils/common.utils';
import { Asset } from 'app/core/models/asset.model';
import { AssetsStore } from './assets.store';
import { ClientStore } from '../client/client.store';
import { PROVINCE_TAX_BRACKETS } from 'app/core/constants/tax.constant';
import { CA_PROVINCES } from 'app/core/enums/ca-provinces.enum';
import { Client } from 'app/core/models/client.model';
import { ChartIslandComponent } from 'app/core/components/chart-island/chart-island.component';
import { LegendComponent } from 'app/core/components/legend/legend.component';
import { LegendItem } from 'app/core/models/legend.model';
import {
  createAxisYLabels,
  createYearAxisXLabels,
  getColor,
  horizontalLinesHandler,
} from 'app/core/utils/charts.utils';
import { BeneficiariesStore } from '../beneficiaries/beneficiaries.store';
import { Beneficiary } from 'app/core/models/beneficiary.model';
import { Value } from 'app/core/models/value.model';
import { ASSET_TYPE } from 'app/core/enums/asset-type.enum';
import { TuiAxesModule, TuiLineChartModule } from '@taiga-ui/addon-charts';

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
    TuiAxesModule,
    TuiLineChartModule,
    HorizontalDividerComponent,
    ValueCardComponent,
    CalculatorComponent,
    ValueListCardComponent,
    ChartIslandComponent,
    LegendComponent,
    PieChartComponent,
    NgIf,
    NgFor,
    AsyncPipe,
    CurrencyPipe,
    PercentPipe,
  ],
  templateUrl: './assets.component.html',
  styleUrl: './assets.component.scss',
  providers: [
    AssetsStore,
    ClientStore,
    BeneficiariesStore,
    tuiNumberFormatProvider({
      decimalSeparator: '.',
      thousandSeparator: ',',
    }),
  ],
})
export class AssetsComponent implements OnInit, OnDestroy {
  @Input() clientId: number = 0;
  activeItemIndex = 0;
  vm$ = this.assetsStore.vm$;
  clientVm$ = this.clientStore.vm$;
  beneficiaryVm$ = this.beneficiariesStore.vm$;
  readonly assetsForm = this.fb.group({
    assets: this.fb.array<Asset>([]),
  });
  readonly horizontalLinesHandler = horizontalLinesHandler;

  constructor(
    @Inject(TuiDialogService)
    private readonly dialogs: TuiDialogService,
    private readonly assetsStore: AssetsStore,
    private readonly clientStore: ClientStore,
    private readonly beneficiariesStore: BeneficiariesStore,
    private readonly fb: FormBuilder,
    private readonly zone: NgZone,
    private readonly router: Router,
    private readonly route: ActivatedRoute
  ) {
    this.route.params.subscribe(params => {
      this.clientId = +params['clientId'];
      this.assetsStore.getAssets(this.clientId);
      // This is necessary to first populate the form with the initial state and then the data from the db
      this.vm$.pipe(take(2)).subscribe(state => {
        state.assets.forEach(asset => {
          this.addAsset(asset);
        });
      });
      this.clientStore.getClient(this.clientId);
      this.beneficiariesStore.getBeneficiaries(this.clientId);
    });
  }

  get assets() {
    return this.assetsForm.controls['assets'] as FormArray;
  }

  ngOnInit() {
    this.assetsForm.valueChanges.subscribe(formData => {
      this.assetsStore.setAssets((formData.assets as Asset[]) || []);
    });
  }

  ngOnDestroy() {
    this.assetsStore.updateAssets(this.clientId);
  }

  onBlur() {
    this.assetsStore.updateAssets(this.clientId);
  }

  addAsset(asset: Asset | null = null) {
    this.assets.push(
      this.fb.group({
        id: [asset?.id || this.generateId()],
        name: [asset?.name || ''],
        initialValue: [asset?.initialValue || 0],
        currentValue: [asset?.currentValue || 0],
        yearAcquired: [asset?.yearAcquired || 0],
        rate: [asset?.rate || 0],
        term: [asset?.term || 0],
        type: [asset?.type || null],
        isTaxable: [asset?.isTaxable || false],
        isLiquid: [asset?.isLiquid || false],
        isToBeSold: [asset?.isToBeSold || false],
        beneficiaries: [asset?.beneficiaries || []],
      })
    );
  }

  editAsset(index: number) {
    const id = this.assets.at(index).value.id;
    this.zone.run(() => {
      this.router.navigate([`/asset/${this.clientId}/${id}`]);
    });
  }

  deleteAsset(index: number) {
    this.assets.removeAt(index);
    this.assetsStore.updateAssets(this.clientId);
  }

  generateId() {
    let id = generateId();
    while (
      this.assets.value.find((asset: Asset) => parseInt(asset.id) === id)
    ) {
      id++;
    }
    return id.toString();
  }

  openDeleteDialog(index: number) {
    const assetName = this.assets.at(index).value.name;
    this.dialogs
      .open<boolean>(TUI_PROMPT, {
        data: {
          content: `Do you want to delete ${assetName}? This action cannot be undone.`,
          yes: 'Delete',
          no: 'Cancel',
        },
      })
      .subscribe(result => {
        if (result) {
          this.deleteAsset(index);
        }
      });
  }

  calculateAllocation(asset: Asset) {
    return asset.beneficiaries.reduce(
      (acc, beneficiary) => acc + (beneficiary.allocation || 0) / 100,
      0
    );
  }

  calculateTaxBracket(province: CA_PROVINCES | null, value: number | null) {
    if (!province || !value) {
      return null;
    }

    const brackets = PROVINCE_TAX_BRACKETS[province];
    let selectedBracket = brackets[0];
    for (const bracket of brackets) {
      if (value >= bracket.minIncome) {
        selectedBracket = bracket;
      }
    }
    return selectedBracket;
  }

  getCapitalGainsTaxRate(value: number, client: Client) {
    const taxBracket = this.calculateTaxBracket(client.province, value);

    if (!taxBracket) {
      return 0;
    }
    return taxBracket.taxRate * 0.5;
  }

  calculateFutureValueDollars(asset: Asset) {
    return (
      (asset.currentValue || 0) *
      Math.pow(1 + (asset.rate || 0) / 100, asset.term || 0)
    );
  }

  calculateFutureTaxLiability(asset: Asset, client: Client) {
    if (!asset.isTaxable) {
      return 0;
    }
    const futureValueDollars = this.calculateFutureValueDollars(asset);
    return (
      (futureValueDollars - (asset.initialValue || 0)) *
      (this.getCapitalGainsTaxRate(futureValueDollars, client) / 100)
    );
  }

  calculateCurrentTaxLiability(asset: Asset, client: Client) {
    if (!asset.isTaxable) {
      return 0;
    }
    const currentValue = asset.currentValue || 0;
    return (
      (currentValue - (asset.initialValue || 0)) *
      (this.getCapitalGainsTaxRate(currentValue, client) / 100)
    );
  }

  calculateCurrentYearsHeld(asset: Asset) {
    const currentYear = new Date().getFullYear();
    return currentYear - (asset.yearAcquired || currentYear);
  }

  calculateGrowthDollars(asset: Asset) {
    return (asset.currentValue || 0) - (asset.initialValue || 0);
  }

  calculateGrowthPercentage(start: number, end: number) {
    return end / start - 1;
  }

  calculateTotalFutureValue(assets: Asset[]) {
    return assets.reduce(
      (acc, asset) => acc + this.calculateFutureValueDollars(asset),
      0
    );
  }

  calculateSingleBeneficiaryTotal(assets: Asset[], beneficiary: Beneficiary) {
    return assets.reduce((acc, asset) => {
      const assetBeneficiary = asset.beneficiaries.find(
        b => b.id === beneficiary.id
      );

      if (!assetBeneficiary) {
        return acc;
      }

      return (
        acc +
        ((this.calculateFutureValueDollars(asset) *
          (assetBeneficiary?.allocation || 0)) /
          100 || 0)
      );
    }, 0);
  }

  calculateBeneficiaryTotal(assets: Asset[]) {
    return assets.reduce((acc, asset) => {
      return (
        acc +
        asset.beneficiaries.reduce(
          (acc, beneficiary) =>
            acc +
            ((this.calculateFutureValueDollars(asset) *
              (beneficiary.allocation || 0)) /
              100 || 0),
          0
        )
      );
    }, 0);
  }

  calculateSingleBeneficiaryPercent(assets: Asset[], beneficiary: Beneficiary) {
    const beneficiaryTotal = this.calculateSingleBeneficiaryTotal(
      assets,
      beneficiary
    );
    const total = this.calculateTotalFutureValue(assets);
    return (beneficiaryTotal / total) * 100 || 0;
  }

  calculateBeneficiaryPercent(assets: Asset[]) {
    const beneficiaryTotal = this.calculateBeneficiaryTotal(assets);
    const total = this.calculateTotalFutureValue(assets);
    return (beneficiaryTotal / total) * 100 || 0;
  }

  calculateIdealDistribution(beneficiaries: Beneficiary[]) {
    return beneficiaries.reduce((acc, beneficiary) => {
      return acc + (beneficiary.allocation || 0);
    }, 0);
  }

  calculateTotalDesiredValue(assets: Asset[], beneficiaries: Beneficiary[]) {
    return beneficiaries.reduce((total, beneficiary) => {
      const currentAmount = this.calculateSingleBeneficiaryTotal(
        assets,
        beneficiary
      );
      const desiredPercent = (beneficiary.allocation || 0) / 100;
      const idealAmount = currentAmount / desiredPercent;
      return Math.max(total, idealAmount);
    }, 0);
  }

  calculateSingleAdditionalRequired(
    assets: Asset[],
    beneficiaries: Beneficiary[],
    beneficiary: Beneficiary
  ) {
    const totalDesiredValue = this.calculateTotalDesiredValue(
      assets,
      beneficiaries
    );
    const currentAmount = this.calculateSingleBeneficiaryTotal(
      assets,
      beneficiary
    );
    const desiredPercent = (beneficiary.allocation || 0) / 100;
    const realIdealAmount = totalDesiredValue * desiredPercent;
    return Math.max(0, realIdealAmount - currentAmount);
  }

  calculateAdditionalRequired(assets: Asset[], beneficiaries: Beneficiary[]) {
    const total = beneficiaries.reduce((acc, beneficiary) => {
      return (
        acc +
        this.calculateSingleAdditionalRequired(
          assets,
          beneficiaries,
          beneficiary
        )
      );
    }, 0);
    return Math.max(0, total);
  }

  getAssetTypeDistribution(assets: Asset[]) {
    const currentTotal = assets.reduce((acc, asset) => {
      return acc + (asset.currentValue || 0);
    }, 0);

    const distribution: Value[] = [];

    assets.forEach(asset => {
      const type = asset.type || ASSET_TYPE.OTHER;
      const index = distribution.findIndex(d => d.label === type);
      if (distribution.findIndex(d => d.label === type) !== -1) {
        distribution[index].value = `${
          parseFloat(distribution[index].value) +
          (asset.currentValue || 0) / currentTotal
        }`;
      } else {
        distribution.push({
          label: type,
          value: `${(asset.currentValue || 0) / currentTotal}`,
        });
      }
    });

    return distribution;
  }

  calculateSingleAssetOverTime(asset: Asset) {
    const assetOverTime: TuiPoint[] = [];
    const rate = asset.rate || 0;
    const term = asset.term || 0;
    const initialValue = asset.initialValue || 0;
    const startingYear = asset.yearAcquired || 0;
    let currentValue = initialValue;
    for (let i = 0; i <= term; i++) {
      if (startingYear + i === new Date().getFullYear()) {
        currentValue = asset.currentValue || currentValue;
      }
      currentValue = currentValue * (1 + rate / 100);
      assetOverTime.push([startingYear + i, currentValue]);
    }
    return assetOverTime;
  }

  calculateAssetsOverTime(assets: Asset[]) {
    const assetValue: TuiPoint[][] = [];
    assets.forEach(asset => {
      assetValue.push(this.calculateSingleAssetOverTime(asset));
    });
    return assetValue;
  }

  getXMin(assets: Asset[]) {
    return assets.reduce(
      (acc, asset) =>
        Math.min(
          acc,
          asset.yearAcquired ? asset.yearAcquired : new Date().getFullYear()
        ),
      new Date().getFullYear()
    );
  }

  getXMax(assets: Asset[]) {
    const maxPoints = 13;
    return Math.min(
      maxPoints,
      assets.reduce((acc, asset) => Math.max(acc, asset.term || 0), 0)
    );
  }

  getAssetYMax(assets: Asset[]) {
    return assets.reduce(
      (acc, asset) =>
        Math.max(
          acc,
          this.calculateFutureValueDollars(asset) || 0,
          asset.currentValue || 0
        ),
      0
    );
  }

  getAssetLegend(assets: Asset[]) {
    const legendItems: LegendItem[] = [];
    assets.forEach((asset, index) => {
      legendItems.push({
        color: getColor(index),
        label: asset.name || `Asset ${index + 1}`,
      });
    });
    return legendItems;
  }

  getAssetTypeLegend(assets: Asset[]) {
    const legendItems: LegendItem[] = [];
    assets.forEach((asset, index) => {
      const type = asset.type || ASSET_TYPE.OTHER;
      if (legendItems.findIndex(d => d.label === type) === -1) {
        legendItems.push({
          color: getColor(index),
          label: type || `Unknown`,
        });
      }
    });
    return legendItems;
  }

  color(index: number) {
    return getColor(index);
  }

  readonly axisXLabels = (assets: Asset[]) => {
    const min = this.getXMin(assets);
    const max = this.getXMax(assets);
    return createYearAxisXLabels(max, min);
  };

  readonly axisAssetYLabels = (assets: Asset[]) => {
    const min = 0;
    const max = this.getAssetYMax(assets);
    const steps = 4;
    return createAxisYLabels(min, max, steps);
  };
}
