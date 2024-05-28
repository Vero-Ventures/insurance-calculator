import { AsyncPipe, CurrencyPipe, NgFor, NgForOf, NgIf } from '@angular/common';
import { Component, Input, OnInit, OnDestroy } from '@angular/core';
import { FormArray, FormBuilder, ReactiveFormsModule } from '@angular/forms';
import { TuiNotificationModule, tuiNumberFormatProvider } from '@taiga-ui/core';
import {
  TuiInputModule,
  TuiInputNumberModule,
  TuiInputSliderModule,
  TuiTabsModule,
} from '@taiga-ui/kit';
import { CalculatorComponent } from '../calculator/calculator.component';
import { ActivatedRoute } from '@angular/router';
import { ClientStore } from '../client/client.store';
import { TotalNeedsStore } from './total-needs.store';
import { AssetsStore } from '../assets/assets.store';
import { DebtsStore } from '../debts/debts.store';
import { GoalsStore } from '../goals/goals.store';
import { BusinessesStore } from '../businesses/businesses.store';
import { take } from 'rxjs';
import {
  ShareholderNeeds,
  TotalNeeds,
} from 'app/core/models/total-needs.model';
import { BeneficiariesStore } from '../beneficiaries/beneficiaries.store';
import { Client } from 'app/core/models/client.model';
import { Asset } from 'app/core/models/asset.model';
import { Beneficiary } from 'app/core/models/beneficiary.model';
import {
  calculateDebtFutureLiability,
  calculateEqualization,
  calculateEstateTaxLiability,
  calculateGoalShortfall,
  calculateIncomeReplacement,
  calculateShareholderEbitdaNeed,
  calculateShareholderShareNeed,
} from 'app/core/utils/totals.utils';
import { Debt } from 'app/core/models/debt.model';
import { Goal } from 'app/core/models/goal.model';
import { Business } from 'app/core/models/business.model';
import { ValueCardComponent } from 'app/core/components/value-card/value-card.component';

@Component({
  selector: 'app-total-needs',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    TuiInputModule,
    TuiInputNumberModule,
    TuiInputSliderModule,
    TuiTabsModule,
    TuiNotificationModule,
    ValueCardComponent,
    CalculatorComponent,
    CurrencyPipe,
    AsyncPipe,
    NgIf,
    NgFor,
    NgForOf,
  ],
  templateUrl: './total-needs.component.html',
  styleUrl: './total-needs.component.scss',
  providers: [
    TotalNeedsStore,
    ClientStore,
    AssetsStore,
    BeneficiariesStore,
    DebtsStore,
    GoalsStore,
    BusinessesStore,
    tuiNumberFormatProvider({
      decimalSeparator: '.',
      thousandSeparator: ',',
    }),
  ],
})
export class TotalNeedsComponent implements OnInit, OnDestroy {
  @Input() clientId: number = 0;
  activeItemIndex = 0;
  vm$ = this.totalNeedsStore.vm$;
  clientVm$ = this.clientStore.vm$;
  assetsVm$ = this.assetsStore.vm$;
  beneficiariesVm$ = this.beneficiariesStore.vm$;
  debtsVm$ = this.debtsStore.vm$;
  goalsVm$ = this.goalsStore.vm$;
  businessesVm$ = this.businessesStore.vm$;
  readonly totalNeedsForm = this.fb.group({
    incomeReplacement: this.fb.group({
      need: 0,
      want: 0,
      priority: 50,
    }),
    estateTaxLiability: this.fb.group({
      need: 0,
      want: 0,
      priority: 50,
    }),
    equalization: this.fb.group({
      need: 0,
      want: 0,
      priority: 50,
    }),
    debtFutureLiability: this.fb.group({
      need: 0,
      want: 0,
      priority: 50,
    }),
    goalShortfall: this.fb.group({
      need: 0,
      want: 0,
      priority: 50,
    }),
    keyMan: this.fb.array<ShareholderNeeds>([]),
    shareholderAgreement: this.fb.array<ShareholderNeeds>([]),
  });

  constructor(
    private readonly totalNeedsStore: TotalNeedsStore,
    private readonly clientStore: ClientStore,
    private readonly assetsStore: AssetsStore,
    private readonly beneficiariesStore: BeneficiariesStore,
    private readonly debtsStore: DebtsStore,
    private readonly goalsStore: GoalsStore,
    private readonly businessesStore: BusinessesStore,
    private readonly fb: FormBuilder,
    private readonly route: ActivatedRoute
  ) {
    this.route.params.subscribe(params => {
      this.clientId = +params['clientId'];
      this.fetchInitial();
      this.vm$.pipe(take(2)).subscribe(state => {
        this.initialSetup(state.totalNeeds);
      });
    });
  }

  get keyMan(): FormArray {
    return this.totalNeedsForm.get('keyMan') as FormArray;
  }

  get shareholderAgreement(): FormArray {
    return this.totalNeedsForm.get('shareholderAgreement') as FormArray;
  }

  ngOnInit() {
    this.totalNeedsForm.valueChanges.subscribe(formData => {
      this.totalNeedsStore.setTotalNeeds(formData as TotalNeeds);
    });
  }

  ngOnDestroy() {
    this.totalNeedsStore.updateTotalNeeds(this.clientId);
  }

  onBlur(field: string) {
    this.calculateWantFromPriority(field);
    this.totalNeedsStore.updateTotalNeeds(this.clientId);
  }

  onWantBlur(field: string) {
    this.calculatePriorityFromWant(field);
    this.totalNeedsStore.updateTotalNeeds(this.clientId);
  }

  fetchInitial() {
    this.totalNeedsStore.getTotalNeeds(this.clientId);
    this.clientStore.getClient(this.clientId);
    this.assetsStore.getAssets(this.clientId);
    this.beneficiariesStore.getBeneficiaries(this.clientId);
    this.debtsStore.getDebts(this.clientId);
    this.goalsStore.getGoals(this.clientId);
    this.goalsStore.getPercentGoalLiquidity(this.clientId);
    this.businessesStore.getBusinesses(this.clientId);
  }

  initialSetup(totalNeeds: TotalNeeds) {
    this.debtsVm$.pipe(take(2)).subscribe(debtsState => {
      this.setupDebtFutureLiability(debtsState.debts);
    });
    this.clientVm$.pipe(take(2)).subscribe(clientState => {
      this.setupIncomeReplacement(clientState.client);
      this.assetsVm$.pipe(take(2)).subscribe(assetsState => {
        this.setupEstateTaxLiability(assetsState.assets, clientState.client);
        this.beneficiariesVm$.pipe(take(2)).subscribe(beneficiariesState => {
          this.setupEqualization(
            assetsState.assets,
            beneficiariesState.beneficiaries
          );
          this.goalsVm$.pipe(take(2)).subscribe(goalsState => {
            this.setupGoalShortfall(
              assetsState.assets,
              goalsState.goals,
              goalsState.percentGoalLiquidity || 0
            );
            this.businessesVm$.pipe(take(2)).subscribe(businessesState => {
              this.setupBusinesses(businessesState.businesses);
              this.setupInitialFields(totalNeeds);
            });
          });
        });
      });
    });
  }

  setupInitialFields(totalNeeds: TotalNeeds) {
    if (!totalNeeds) {
      return;
    }

    this.totalNeedsForm.patchValue(totalNeeds);
  }

  setupIncomeReplacement(client: Client) {
    const need = calculateIncomeReplacement(client);
    const priority =
      this.totalNeedsForm.get('incomeReplacement.priority')?.value || 0;
    const want = need * (priority / 100);
    this.totalNeedsForm.get('incomeReplacement.need')?.patchValue(need);
    this.totalNeedsForm.get('incomeReplacement.want')?.patchValue(want);
  }

  setupEstateTaxLiability(assets: Asset[], client: Client) {
    const need = calculateEstateTaxLiability(assets, client);
    const priority =
      this.totalNeedsForm.get('estateTaxLiability.priority')?.value || 0;
    const want = need * (priority / 100);
    this.totalNeedsForm.get('estateTaxLiability.need')?.patchValue(need);
    this.totalNeedsForm.get('estateTaxLiability.want')?.patchValue(want);
  }

  setupEqualization(assets: Asset[], beneficiaries: Beneficiary[]) {
    const need = calculateEqualization(assets, beneficiaries);
    const priority =
      this.totalNeedsForm.get('equalization.priority')?.value || 0;
    const want = need * (priority / 100);
    this.totalNeedsForm.get('equalization.need')?.patchValue(need);
    this.totalNeedsForm.get('equalization.want')?.patchValue(want);
  }

  setupDebtFutureLiability(debts: Debt[]) {
    const need = calculateDebtFutureLiability(debts);
    const priority =
      this.totalNeedsForm.get('debtFutureLiability.priority')?.value || 0;
    const want = need * (priority / 100);
    this.totalNeedsForm.get('debtFutureLiability.need')?.patchValue(need);
    this.totalNeedsForm.get('debtFutureLiability.want')?.patchValue(want);
  }

  setupGoalShortfall(assets: Asset[], goals: Goal[], allocation: number) {
    const need = calculateGoalShortfall(assets, goals, allocation);
    const priority =
      this.totalNeedsForm.get('goalShortfall.priority')?.value || 0;
    const want = need * (priority / 100);
    this.totalNeedsForm.get('goalShortfall.need')?.patchValue(need);
    this.totalNeedsForm.get('goalShortfall.want')?.patchValue(want);
  }

  setupBusinesses(businesses: Business[]) {
    if (this.keyMan.length !== 0 || this.shareholderAgreement.length !== 0) {
      return;
    }

    businesses.forEach(business => {
      this.addBusiness(business);
    });
  }

  addBusiness(business: Business) {
    business.shareholders.forEach(shareholder => {
      const ebitdaNeed = calculateShareholderEbitdaNeed(business, shareholder);
      this.keyMan.push(
        this.fb.group({
          businessId: business.id,
          businessName: business.name,
          name: shareholder.name,
          need: ebitdaNeed,
          want: ebitdaNeed * 0.5,
          priority: 50,
        })
      );
      const shareNeed = calculateShareholderShareNeed(business, shareholder);
      this.shareholderAgreement.push(
        this.fb.group({
          businessId: business.id,
          businessName: business.name,
          name: shareholder.name,
          need: shareNeed,
          want: shareNeed * 0.5,
          priority: 50,
        })
      );
    });
  }

  calculateWantFromPriority(field: string) {
    const updatedFormGroup = this.totalNeedsForm.get(field);
    if (!updatedFormGroup) {
      return;
    }
    const need = updatedFormGroup.get('need')?.value || 0;
    const priority = updatedFormGroup.get('priority')?.value || 0;
    updatedFormGroup.get('want')?.patchValue(need * (priority / 100));
  }

  calculatePriorityFromWant(field: string) {
    const updatedFormGroup = this.totalNeedsForm.get(field);
    if (!updatedFormGroup) {
      return;
    }
    const need = updatedFormGroup.get('need')?.value || 0;
    const want = updatedFormGroup.get('want')?.value || 0;
    updatedFormGroup.get('priority')?.patchValue((want / need) * 100);
  }

  calculateTotalNeeds(totalNeeds: TotalNeeds) {
    return Math.max(
      0,
      (totalNeeds.incomeReplacement.need || 0) +
        (totalNeeds.estateTaxLiability.need || 0) +
        (totalNeeds.equalization.need || 0) +
        (totalNeeds.debtFutureLiability.need || 0) +
        (totalNeeds.goalShortfall.need || 0) +
        totalNeeds.keyMan.reduce(
          (acc, shareholder) => acc + (shareholder.need || 0),
          0
        ) +
        totalNeeds.shareholderAgreement.reduce(
          (acc, shareholder) => acc + (shareholder.need || 0),
          0
        )
    );
  }

  calculateTotalWants(totalNeeds: TotalNeeds) {
    return Math.max(
      0,
      (totalNeeds.incomeReplacement.want || 0) +
        (totalNeeds.estateTaxLiability.want || 0) +
        (totalNeeds.equalization.want || 0) +
        (totalNeeds.debtFutureLiability.want || 0) +
        (totalNeeds.goalShortfall.want || 0) +
        totalNeeds.keyMan.reduce(
          (acc, shareholder) => acc + (shareholder.want || 0),
          0
        ) +
        totalNeeds.shareholderAgreement.reduce(
          (acc, shareholder) => acc + (shareholder.want || 0),
          0
        )
    );
  }
}
