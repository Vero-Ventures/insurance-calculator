import { Location, NgFor, NgIf } from '@angular/common';
import { Component, Inject, Input, NgZone, OnInit } from '@angular/core';
import {
  FormArray,
  FormBuilder,
  FormControl,
  FormGroup,
  ReactiveFormsModule,
} from '@angular/forms';
import {
  TuiButtonModule,
  TuiDataListModule,
  TuiDialogService,
  tuiNumberFormatProvider,
} from '@taiga-ui/core';
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
import { AssetsStore } from '../assets/assets.store';
import { BeneficiariesStore } from '../beneficiaries/beneficiaries.store';
import { Beneficiary } from 'app/core/models/beneficiary.model';
import { take } from 'rxjs';
import { ASSET_TYPE } from 'app/core/enums/asset-type.enum';
import {
  AssetBeneficiary,
  AssetBeneficiaryItem,
} from 'app/core/models/asset.model';

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
    HeaderBarComponent,
    ActionBarComponent,
    NgIf,
    NgFor,
  ],
  templateUrl: './asset-edit.component.html',
  styleUrl: './asset-edit.component.scss',
  providers: [
    AssetsStore,
    BeneficiariesStore,
    tuiNumberFormatProvider({
      decimalSeparator: '.',
      thousandSeparator: ',',
    }),
  ],
})
export class AssetEditComponent implements OnInit {
  @Input() assetId: number = 0;
  @Input() clientId: number = 0;
  activeItemIndex = 0;
  assetVm$ = this.assetsStore.vm$;
  beneficiariesVm$ = this.beneficiariesStore.vm$;
  readonly typeOptions = Object.values(ASSET_TYPE);
  readonly assetEditInformationForm = new FormGroup({
    id: new FormControl(),
    name: new FormControl(),
    initialValue: new FormControl(),
    currentValue: new FormControl(),
    yearAcquired: new FormControl(),
    rate: new FormControl(),
    term: new FormControl(),
    type: new FormControl(),
    isTaxable: new FormControl(),
    isLiquid: new FormControl(),
    isToBeSold: new FormControl(),
  });
  readonly assetEditBeneficiariesForm = this.fb.group({
    beneficiaries: this.fb.array<AssetBeneficiaryItem>([]),
  });

  constructor(
    @Inject(TuiDialogService)
    private readonly dialogs: TuiDialogService,
    private readonly assetsStore: AssetsStore,
    private readonly beneficiariesStore: BeneficiariesStore,
    private readonly fb: FormBuilder,
    private readonly zone: NgZone,
    private readonly route: ActivatedRoute,
    private readonly location: Location,
    private readonly router: Router
  ) {
    this.route.params.subscribe(params => {
      this.assetId = +params['assetId'];
      this.clientId = +params['clientId'];
      this.initializeFields();
    });
  }

  get beneficiaries(): FormArray {
    return this.assetEditBeneficiariesForm.get('beneficiaries') as FormArray;
  }

  ngOnInit() {
    this.assetEditInformationForm.valueChanges.subscribe(asset => {
      this.assetVm$.pipe(take(1)).subscribe(state => {
        const foundAsset = state.assets.find(
          a => parseInt(a.id) === this.assetId
        );
        if (foundAsset) {
          foundAsset.name = asset.name;
          foundAsset.initialValue = asset.initialValue;
          foundAsset.currentValue = asset.currentValue;
          foundAsset.yearAcquired = asset.yearAcquired;
          foundAsset.rate = asset.rate;
          foundAsset.term = asset.term;
          foundAsset.type = asset.type;
          foundAsset.isTaxable = asset.isTaxable;
          foundAsset.isLiquid = asset.isLiquid;
          foundAsset.isToBeSold = asset.isToBeSold;
          this.assetsStore.setAssets(state.assets);
        }
      });
    });
    this.assetEditBeneficiariesForm.valueChanges.subscribe(beneficiaries => {
      this.assetVm$.pipe(take(1)).subscribe(state => {
        const foundAsset = state.assets.find(
          a => parseInt(a.id) === this.assetId
        );
        if (foundAsset) {
          const newBeneficiaries = beneficiaries.beneficiaries
            ?.filter(beneficiary => beneficiary?.isEnabled)
            .map(beneficiary => {
              return {
                id: beneficiary?.id,
                name: beneficiary?.name,
                allocation: beneficiary?.allocation,
              };
            });
          foundAsset.beneficiaries =
            (newBeneficiaries as AssetBeneficiary[]) || [];
          this.assetsStore.setAssets(state.assets);
        }
      });
    });
  }

  initializeFields() {
    this.beneficiariesStore.getBeneficiaries(this.clientId);
    this.beneficiariesVm$.pipe(take(2)).subscribe(state => {
      state.beneficiaries.forEach(beneficiary => {
        this.addBeneficiary(beneficiary);
      });
      this.initializeAssets();
    });
  }

  initializeAssets() {
    this.assetsStore.getAssets(this.clientId);
    // This is necessary to first populate the form with the initial state and then the data from the db
    this.assetVm$.pipe(take(2)).subscribe(state => {
      const asset = state.assets.find(
        asset => parseInt(asset.id) === this.assetId
      );
      if (asset) {
        this.assetEditInformationForm.patchValue(asset);
        if (asset.beneficiaries) {
          asset.beneficiaries.forEach(beneficiary => {
            // Update the form with isEnabled if the beneficiary id is present in the asset
            this.beneficiaries.controls
              .find(control => control.get('id')?.value === beneficiary.id)
              ?.patchValue({
                isEnabled: true,
                allocation: beneficiary.allocation,
              });
          });
        }
      }
    });
  }

  addBeneficiary(beneficiary: Beneficiary) {
    this.beneficiaries.push(
      this.fb.group({
        id: beneficiary.id,
        name: beneficiary.name,
        allocation: beneficiary.allocation,
        isEnabled: false,
      })
    );
  }

  cancel() {
    this.zone.run(() => {
      this.location.back();
    });
  }

  save() {
    this.assetsStore.updateAssets(this.clientId);
    this.zone.run(() => {
      this.router.navigate([`/assets/${this.clientId}`]);
    });
  }
}
