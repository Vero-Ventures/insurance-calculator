import { AsyncPipe, NgFor, NgIf } from '@angular/common';
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
import { ValueListCardComponent } from 'app/core/components/value-list-card/value-list-card.component';
import { PieChartComponent } from 'app/core/components/pie-chart/pie-chart.component';
import { take } from 'rxjs';
import { ActivatedRoute, Router } from '@angular/router';
import { generateId } from 'app/core/utils/common.utils';
import { Asset } from 'app/core/models/asset.model';
import { AssetsStore } from './assets.store';

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
    HorizontalDividerComponent,
    ValueCardComponent,
    CalculatorComponent,
    LineChartComponent,
    ValueListCardComponent,
    PieChartComponent,
    NgIf,
    NgFor,
    AsyncPipe,
  ],
  templateUrl: './assets.component.html',
  styleUrl: './assets.component.scss',
  providers: [
    AssetsStore,
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
  readonly assetsForm = this.fb.group({
    assets: this.fb.array<Asset>([]),
  });

  constructor(
    @Inject(TuiDialogService)
    private readonly dialogs: TuiDialogService,
    private readonly assetsStore: AssetsStore,
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

  totalInitialValue = {
    label: 'Total Initial Value ($)',
    value: '$1,000,000',
  };
  totalInsurableFutureValue = {
    label: 'Total Insurable Future Value ($)',
    value: '$1,000,000',
  };

  beneficiary1 = [
    { label: 'Amount ($)', value: '$600,000.00' },
    { label: 'Percentage (%)', value: '30.00%' },
    { label: 'Ideal Distribution (%)', value: '30.00%' },
    { label: 'Additional Required ($)', value: '$0.00' },
  ];
  beneficiary2 = [
    { label: 'Amount ($)', value: '$600,000.00' },
    { label: 'Percentage (%)', value: '30.00%' },
    { label: 'Ideal Distribution (%)', value: '30.00%' },
    { label: 'Additional Required ($)', value: '$0.00' },
  ];
}
