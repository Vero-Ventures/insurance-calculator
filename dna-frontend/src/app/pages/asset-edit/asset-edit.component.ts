import { NgIf } from '@angular/common';
import { Component, Input, NgZone } from '@angular/core';
import {
  FormArray,
  FormControl,
  FormGroup,
  ReactiveFormsModule,
} from '@angular/forms';
import { TuiButtonModule, TuiDataListModule } from '@taiga-ui/core';
import {
  TuiCheckboxBlockModule,
  TuiDataListWrapperModule,
  TuiInputModule,
  TuiInputNumberModule,
  TuiSelectModule,
  TuiTabsModule,
} from '@taiga-ui/kit';
import { HorizontalDividerComponent } from 'app/core/components/horizontal-divider/horizontal-divider.component';
import { HeaderBarComponent } from 'app/core/components/header-bar/header-bar.component';
import { ActionBarComponent } from 'app/core/components/action-bar/action-bar.component';
import { ActivatedRoute, Router } from '@angular/router';
import { ClientStore } from '../client/client.store';

@Component({
  selector: 'app-asset-edit',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    TuiTabsModule,
    TuiInputModule,
    TuiInputNumberModule,
    TuiButtonModule,
    TuiSelectModule,
    TuiDataListModule,
    TuiDataListWrapperModule,
    TuiCheckboxBlockModule,
    HorizontalDividerComponent,
    NgIf,
    HeaderBarComponent,
    ActionBarComponent,
  ],
  templateUrl: './asset-edit.component.html',
  styleUrl: './asset-edit.component.scss',
  providers: [ClientStore],
})
export class AssetEditComponent {
  @Input() clientId: number = 0;
  @Input() assetId: number = 0;

  constructor(
    private router: Router,
    private zone: NgZone,
    private readonly clientStore: ClientStore,
    private route: ActivatedRoute
  ) {
    this.route.params.subscribe(params => {
      this.clientId = +params['clientId'];
      this.assetId = +params['assetId'];
    });
  }

  readonly assetEditInformationForm = new FormGroup({
    type: new FormControl(),
    assetName: new FormControl(),
    yearAcquired: new FormControl(),
    initialValue: new FormControl(),
    currentValue: new FormControl(),
    appreciationRate: new FormControl(),
    term: new FormControl(),
    taxable: new FormControl(),
    liquid: new FormControl(),
    toBeSold: new FormControl(),
    taxBracket: new FormControl(),
  });

  readonly assetEditBeneficiariesForm = new FormGroup({
    beneficiaries: new FormArray([]),
  });

  get beneficiaries(): FormArray {
    return this.assetEditBeneficiariesForm.get('beneficiaries') as FormArray;
  }

  createBeneficiary(): FormGroup {
    return new FormGroup({
      allocation: new FormControl(),
    });
  }

  addBeneficiary() {
    this.beneficiaries.push(this.createBeneficiary());
  }

  removeBeneficiary(index: number) {
    this.beneficiaries.removeAt(index);
  }

  activeItemIndex = 0;

  types = [
    'Cash',
    'Stocks',
    'Bonds',
    'Real Estate',
    'Mutual Funds',
    'Retirement Account',
    'Crypto',
    'Life Insurance',
  ];

  // TODO: Populate with brackets based on province
  taxBrackets = ['Populate me', 'with province tax data'];

  cancel() {
    this.zone.run(() => {
      this.router.navigate(['/assets']);
    });
  }

  save() {
    this.zone.run(() => {
      this.router.navigate(['/assets']);
    });
  }
}
