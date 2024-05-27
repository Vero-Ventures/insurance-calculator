import {
  Component,
  Inject,
  Input,
  NgZone,
  OnDestroy,
  OnInit,
} from '@angular/core';
import { CalculatorComponent } from '../calculator/calculator.component';
import {
  AsyncPipe,
  CurrencyPipe,
  NgFor,
  NgIf,
  PercentPipe,
} from '@angular/common';
import {
  TUI_PROMPT,
  TuiInputModule,
  TuiInputNumberModule,
  TuiTabsModule,
} from '@taiga-ui/kit';
import { HorizontalDividerComponent } from 'app/core/components/horizontal-divider/horizontal-divider.component';
import {
  TuiButtonModule,
  TuiDialogService,
  TuiPoint,
  tuiNumberFormatProvider,
} from '@taiga-ui/core';
import { ValueCardComponent } from 'app/core/components/value-card/value-card.component';
import { ValueListCardComponent } from 'app/core/components/value-list-card/value-list-card.component';
import { FormArray, FormBuilder, ReactiveFormsModule } from '@angular/forms';
import { BusinessesStore } from './businesses.store';
import { ActivatedRoute, Router } from '@angular/router';
import { take } from 'rxjs';
import { Business, Shareholder } from 'app/core/models/business.model';
import { generateId } from 'app/core/utils/common.utils';
import { MultiValueCardComponent } from 'app/core/components/multi-value-card/multi-value-card.component';
import { ChartIslandComponent } from 'app/core/components/chart-island/chart-island.component';
import { TuiAxesModule, TuiLineChartModule } from '@taiga-ui/addon-charts';
import {
  createYearAxisXLabels,
  createAxisYLabels,
  horizontalLinesHandler,
  getColor,
} from 'app/core/utils/charts.utils';
import { LegendComponent } from 'app/core/components/legend/legend.component';
import { LegendItem } from 'app/core/models/legend.model';

@Component({
  selector: 'app-businesses',
  standalone: true,
  imports: [
    CalculatorComponent,
    TuiInputModule,
    TuiInputNumberModule,
    HorizontalDividerComponent,
    TuiTabsModule,
    TuiButtonModule,
    TuiLineChartModule,
    TuiAxesModule,
    ChartIslandComponent,
    ValueCardComponent,
    ValueListCardComponent,
    MultiValueCardComponent,
    LegendComponent,
    ReactiveFormsModule,
    AsyncPipe,
    PercentPipe,
    CurrencyPipe,
    NgIf,
    NgFor,
  ],
  templateUrl: './businesses.component.html',
  styleUrl: './businesses.component.scss',
  providers: [
    BusinessesStore,
    tuiNumberFormatProvider({
      decimalSeparator: '.',
      thousandSeparator: ',',
    }),
  ],
})
export class BusinessesComponent implements OnInit, OnDestroy {
  @Input() clientId: number = 0;
  activeItemIndex = 0;
  vm$ = this.businessesStore.vm$;
  readonly businessesForm = this.fb.group({
    businesses: this.fb.array<Business>([]),
  });
  readonly horizontalLinesHandler = horizontalLinesHandler;

  constructor(
    @Inject(TuiDialogService)
    private readonly dialogs: TuiDialogService,
    private readonly businessesStore: BusinessesStore,
    private readonly fb: FormBuilder,
    private readonly zone: NgZone,
    private readonly router: Router,
    private readonly route: ActivatedRoute
  ) {
    this.route.params.subscribe(params => {
      this.clientId = +params['clientId'];
      this.businessesStore.getBusinesses(this.clientId);
      // This is necessary to first populate the form with the initial state and then the data from the db
      this.vm$.pipe(take(2)).subscribe(state => {
        state.businesses.forEach(business => {
          this.addBusiness(business);
        });
      });
    });
  }

  get businesses() {
    return this.businessesForm.controls['businesses'] as FormArray;
  }

  // This will need modifications
  get businessesChart() {
    return this.businesses.value.map((business: Business) => ({
      name: business.name,
      value: business.valuation,
    }));
  }

  ngOnInit() {
    this.businessesForm.valueChanges.subscribe(formData => {
      this.businessesStore.setBusinesses(
        (formData.businesses as Business[]) || []
      );
    });
  }

  ngOnDestroy() {
    this.businessesStore.updateBusinesses(this.clientId);
  }

  onBlur() {
    this.businessesStore.updateBusinesses(this.clientId);
  }

  addBusiness(business: Business | null = null) {
    this.businesses.push(
      this.fb.group({
        id: [business?.id || this.generateId()],
        name: [business?.name || ''],
        valuation: [business?.valuation || 0],
        ebitda: [business?.ebitda || 0],
        appreciationRate: [business?.appreciationRate || 0],
        term: [business?.term || 0],
        shareholders: [business?.shareholders || []],
      })
    );
  }

  editBusiness(index: number) {
    const id = this.businesses.at(index).value.id;
    this.zone.run(() => {
      this.router.navigate([`/business/${this.clientId}/${id}`]);
    });
  }

  deleteBusiness(index: number) {
    this.businesses.removeAt(index);
    this.businessesStore.updateBusinesses(this.clientId);
  }

  generateId() {
    let id = generateId();
    while (
      this.businesses.value.find(
        (business: Business) => parseInt(business.id) === id
      )
    ) {
      id++;
    }
    return id.toString();
  }

  openDeleteDialog(index: number) {
    const businessName = this.businesses.at(index).value.name;
    this.dialogs
      .open<boolean>(TUI_PROMPT, {
        data: {
          content: `Do you want to delete ${businessName}? This action cannot be undone.`,
          yes: 'Delete',
          no: 'Cancel',
        },
      })
      .subscribe(result => {
        if (result) {
          this.deleteBusiness(index);
        }
      });
  }

  calculateEbitdaContribution(business: Business, shareholder: Shareholder) {
    return (
      ((shareholder.ebitdaContributionPercentage || 0) / 100) *
      (business.ebitda || 0)
    );
  }

  calculateShareValue(business: Business, shareholder: Shareholder) {
    return (
      ((shareholder.sharePercentage || 0) / 100) * (business.valuation || 0)
    );
  }

  calculateLiquidationDisparity(business: Business, shareholder: Shareholder) {
    return (
      this.calculateShareValue(business, shareholder) -
      (shareholder.insuranceCoverage || 0)
    );
  }

  calculateTotalShareholderPercentage(business: Business) {
    return (
      business.shareholders.reduce(
        (acc, shareholder) => acc + (shareholder.sharePercentage || 0),
        0
      ) / 100
    );
  }

  calculateTotalEbitdaPercentage(business: Business) {
    return (
      business.shareholders.reduce(
        (acc, shareholder) =>
          acc + (shareholder.ebitdaContributionPercentage || 0),
        0
      ) / 100
    );
  }

  calculateTotalShareholderValue(business: Business) {
    return business.shareholders.reduce(
      (acc, shareholder) =>
        acc +
        ((shareholder.sharePercentage || 0) / 100) * (business.valuation || 0),
      0
    );
  }

  calculateTotalShareholderInsurance(business: Business) {
    return business.shareholders.reduce(
      (acc, shareholder) => acc + (shareholder.insuranceCoverage || 0),
      0
    );
  }

  calculateTotalShareholderDisparity(business: Business) {
    return (
      this.calculateTotalShareholderValue(business) -
      this.calculateTotalShareholderInsurance(business)
    );
  }

  calculateSingleCompoundedEbitda(
    business: Business,
    shareholder: Shareholder
  ) {
    const contributions: TuiPoint[] = [];
    const term = business.term || 0;
    const ebitda = business.ebitda || 0;
    const rate = business.appreciationRate || 0;
    const shareholderEbitda = shareholder.ebitdaContributionPercentage || 0;
    const currentYear = new Date().getFullYear();
    for (let year: number = 0; year <= term; year++) {
      const compounded: number =
        (shareholderEbitda / 100) * ebitda * Math.pow(1 + rate / 100, year);
      contributions.push([currentYear + year, compounded]);
    }
    return contributions;
  }

  calculateCompoundedEbitdaContribution(business: Business) {
    const ebitda: TuiPoint[][] = [];
    business.shareholders.forEach(shareholder => {
      ebitda.push(this.calculateSingleCompoundedEbitda(business, shareholder));
    });
    return ebitda;
  }

  calculateSingleCompoundedShareValue(
    business: Business,
    shareholder: Shareholder
  ) {
    const contributions: TuiPoint[] = [];
    const term = business.term || 0;
    const sharePercentage = shareholder.sharePercentage || 0;
    const valuation = business.valuation || 0;
    const rate = business.appreciationRate || 0;
    const currentYear = new Date().getFullYear();
    for (let year: number = 0; year <= term; year++) {
      const compounded =
        (sharePercentage / 100) * valuation * Math.pow(1 + rate / 100, year);
      contributions.push([currentYear + year, compounded]);
    }
    return contributions;
  }

  calculateCompoundedShareValue(business: Business) {
    const shareValue: TuiPoint[][] = [];
    business.shareholders.forEach(shareholder => {
      shareValue.push(
        this.calculateSingleCompoundedShareValue(business, shareholder)
      );
    });
    return shareValue;
  }

  getXMin() {
    return new Date().getFullYear();
  }

  getXMax(business: Business) {
    return business.term || 0;
  }

  getEbitdaYMax(business: Business) {
    const ebitdaPercent = business.shareholders.reduce(
      (acc, shareholder) =>
        Math.max(acc, shareholder.ebitdaContributionPercentage || 0),
      0
    );
    const rate = business.appreciationRate || 0;
    const term = business.term || 0;
    const ebitda = (business.ebitda || 0) * (ebitdaPercent / 100);
    const compoundedEbitda = ebitda * Math.pow(1 + rate / 100, term);
    return compoundedEbitda;
  }

  getShareYMax(business: Business) {
    const sharePercent = business.shareholders.reduce(
      (acc, shareholder) => Math.max(acc, shareholder.sharePercentage || 0),
      0
    );
    const rate = business.appreciationRate || 0;
    const term = business.term || 0;
    const shareValue = (business.valuation || 0) * (sharePercent / 100);
    const compoundedShareValue = shareValue * Math.pow(1 + rate / 100, term);
    return compoundedShareValue;
  }

  getShareholderLegend(shareholders: Shareholder[]) {
    const legendItems: LegendItem[] = [];
    shareholders.forEach((shareholder, index) => {
      legendItems.push({
        color: getColor(index),
        label: shareholder.name || `Shareholder ${index + 1}`,
      });
    });
    return legendItems;
  }

  color(index: number) {
    return getColor(index);
  }

  readonly axisXLabels = (business: Business) => {
    return createYearAxisXLabels(business.term || 0);
  };

  readonly axisEbitdaYLabels = (business: Business) => {
    const min = 0;
    const max = this.getEbitdaYMax(business);
    const steps = 4;
    return createAxisYLabels(min, max, steps);
  };

  readonly axisShareYLabels = (business: Business) => {
    const min = 0;
    const max = this.getShareYMax(business);
    const steps = 4;
    return createAxisYLabels(min, max, steps);
  };
}
