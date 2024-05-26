import {
  Component,
  Inject,
  Input,
  NgZone,
  OnDestroy,
  OnInit,
} from '@angular/core';
import { CalculatorComponent } from '../calculator/calculator.component';
import { AsyncPipe, NgFor, NgIf } from '@angular/common';
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
  tuiNumberFormatProvider,
} from '@taiga-ui/core';
import { LineChartComponent } from 'app/core/components/line-chart/line-chart.component';
import { ValueCardComponent } from 'app/core/components/value-card/value-card.component';
import { ValueListCardComponent } from 'app/core/components/value-list-card/value-list-card.component';
import { FormArray, FormBuilder, ReactiveFormsModule } from '@angular/forms';
import { BusinessesStore } from './businesses.store';
import { ActivatedRoute, Router } from '@angular/router';
import { take } from 'rxjs';
import { Business } from 'app/core/models/business.model';
import { generateId } from 'app/core/utils/common.utils';

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
    LineChartComponent,
    ValueCardComponent,
    ValueListCardComponent,
    AsyncPipe,
    ReactiveFormsModule,
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

  valueList = [
    { label: 'EBITDA Contribution ($CAD)', value: '$600,000.00' },
    { label: 'Share Value ($CAD)', value: '$1,000,000' },
    { label: 'Liquidation Disparity ($CAD)', value: '$1,000,000' },
  ];
}
