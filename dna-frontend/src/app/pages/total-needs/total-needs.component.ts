import { NgFor, NgIf } from '@angular/common';
import { Component, Input, OnInit, OnDestroy } from '@angular/core';
import { FormGroup, ReactiveFormsModule } from '@angular/forms';
import { TuiNotificationModule, tuiNumberFormatProvider } from '@taiga-ui/core';
import {
  TuiInputModule,
  TuiInputNumberModule,
  TuiInputSliderModule,
  TuiTabsModule,
} from '@taiga-ui/kit';
import { CalculatorComponent } from '../calculator/calculator.component';
import { MultiValueCardComponent } from 'app/core/components/multi-value-card/multi-value-card.component';
import { ActivatedRoute } from '@angular/router';
import { ClientStore } from '../client/client.store';
import { TotalNeedsStore } from './total-needs.store';
import { AssetsStore } from '../assets/assets.store';
import { DebtsStore } from '../debts/debts.store';
import { GoalsStore } from '../goals/goals.store';
import { BusinessesStore } from '../businesses/businesses.store';
import { take } from 'rxjs';
import {
  TotalNeeds,
  TotalNeedsBusiness,
} from 'app/core/models/total-needs.model';
import { BeneficiariesStore } from '../beneficiaries/beneficiaries.store';

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
    NgIf,
    NgFor,
    MultiValueCardComponent,
    CalculatorComponent,
  ],
  templateUrl: './total-needs.component.html',
  styleUrl: './total-needs.component.scss',
  providers: [
    TotalNeedsStore,
    ClientStore,
    AssetsStore,
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
  readonly totalNeedsForm = new FormGroup({});

  constructor(
    private readonly totalNeedsStore: TotalNeedsStore,
    private readonly clientStore: ClientStore,
    private readonly assetsStore: AssetsStore,
    private readonly beneficiariesStore: BeneficiariesStore,
    private readonly debtsStore: DebtsStore,
    private readonly goalsStore: GoalsStore,
    private readonly businessesStore: BusinessesStore,
    private route: ActivatedRoute
  ) {
    this.route.params.subscribe(params => {
      this.clientId = +params['clientId'];
      this.totalNeedsStore.getTotalNeeds(this.clientId);
      this.clientStore.getClient(this.clientId);
      this.assetsStore.getAssets(this.clientId);
      this.beneficiariesStore.getBeneficiaries(this.clientId);
      this.debtsStore.getDebts(this.clientId);
      this.goalsStore.getGoals(this.clientId);
      this.businessesStore.getBusinesses(this.clientId);
      this.vm$.pipe(take(2)).subscribe(state => {
        this.initialSetup(state.totalNeeds);
        this.clientVm$.pipe(take(2)).subscribe(clientState => {
          // Patch income replacement
          console.log(clientState);
          this.assetsVm$.pipe(take(2)).subscribe(assetsState => {
            // Patch estate liability
            console.log(assetsState);
            this.beneficiariesVm$
              .pipe(take(2))
              .subscribe(beneficiariesState => {
                // Patch equalization
                console.log(beneficiariesState);
                this.debtsVm$.pipe(take(2)).subscribe(debtsState => {
                  // Patch debt future liability
                  console.log(debtsState);
                  this.goalsVm$.pipe(take(2)).subscribe(goalsState => {
                    // Patch goal shortfall
                    console.log(goalsState);
                    this.businessesVm$
                      .pipe(take(2))
                      .subscribe(businessesState => {
                        // Patch all the business stuff
                        console.log(businessesState);
                      });
                  });
                });
              });
          });
        });
      });
    });
  }

  ngOnInit() {
    this.totalNeedsForm.valueChanges.subscribe(formData => {
      this.totalNeedsStore.setTotalNeeds(formData as TotalNeeds);
    });
  }

  ngOnDestroy() {
    this.totalNeedsStore.updateTotalNeeds(this.clientId);
  }

  onBlur() {
    this.calculateWantFromPriority();
    this.totalNeedsStore.updateTotalNeeds(this.clientId);
  }

  onWantBlur() {
    this.calculatePriorityFromWant();
    this.totalNeedsStore.updateTotalNeeds(this.clientId);
  }

  initialSetup(totalNeeds: TotalNeeds) {
    // Set up static form controls
    // Set up business dynamic form controls
    console.log(totalNeeds);
  }

  setupIncomeReplacement() {}

  setupEstateTaxLiability() {}

  setupEqualization() {}

  setupDebtFutureLiability() {}

  setupGoalShortfall() {}

  setupBusinesses() {}

  addBusiness(business: TotalNeedsBusiness) {
    // Add dynamic form controls for business
    // Add other thing dopnt rmeembemr
    // Add shareholder
    console.log(business);
  }

  calculateWantFromPriority() {
    // Calculate need from want
  }

  calculatePriorityFromWant() {
    // Calculate want from need
  }
}
