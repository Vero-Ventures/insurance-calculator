import { Location, NgIf } from '@angular/common';
import { Component, Input, NgZone, OnInit } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { TuiButtonModule, tuiNumberFormatProvider } from '@taiga-ui/core';
import { TuiInputModule, TuiInputNumberModule } from '@taiga-ui/kit';
import { HorizontalDividerComponent } from 'app/core/components/horizontal-divider/horizontal-divider.component';
import { HeaderBarComponent } from 'app/core/components/header-bar/header-bar.component';
import { ActionBarComponent } from 'app/core/components/action-bar/action-bar.component';
import { BottomBarComponent } from 'app/core/components/bottom-bar/bottom-bar.component';
import { ActivatedRoute } from '@angular/router';
import { DebtsStore } from '../debts/debts.store';
import { take } from 'rxjs';

@Component({
  selector: 'app-debt-edit',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    TuiInputModule,
    TuiInputNumberModule,
    TuiButtonModule,
    HorizontalDividerComponent,
    HeaderBarComponent,
    ActionBarComponent,
    BottomBarComponent,
    NgIf,
  ],
  templateUrl: './debt-edit.component.html',
  styleUrl: './debt-edit.component.scss',
  providers: [
    DebtsStore,
    tuiNumberFormatProvider({
      decimalSeparator: '.',
      thousandSeparator: ',',
    }),
  ],
})
export class DebtEditComponent implements OnInit {
  @Input() debtId: number = 0;
  @Input() clientId: number = 0;
  vm$ = this.debtsStore.vm$;
  readonly debtEditInformationForm = new FormGroup({
    name: new FormControl(),
    initialValue: new FormControl(),
    yearAcquired: new FormControl(),
    rate: new FormControl(),
    term: new FormControl(),
    annualPayment: new FormControl(),
  });

  constructor(
    private readonly debtsStore: DebtsStore,
    private readonly zone: NgZone,
    private readonly route: ActivatedRoute,
    private readonly location: Location
  ) {
    this.route.params.subscribe(params => {
      this.debtId = +params['debtId'];
      this.clientId = +params['clientId'];
      this.debtsStore.getDebts(this.clientId);
      // This is necessary to first populate the form with the initial state and then the data from the db
      this.vm$.pipe(take(2)).subscribe(state => {
        const debt = state.debts.find(
          debt => parseInt(debt.id) === this.debtId
        );
        if (debt) {
          this.debtEditInformationForm.patchValue(debt);
        }
      });
    });
  }

  ngOnInit() {
    this.debtEditInformationForm.valueChanges.subscribe(debt => {
      this.vm$.pipe(take(1)).subscribe(state => {
        const foundDebt = state.debts.find(d => parseInt(d.id) === this.debtId);
        if (foundDebt) {
          foundDebt.name = debt.name;
          foundDebt.initialValue = debt.initialValue;
          foundDebt.yearAcquired = debt.yearAcquired;
          foundDebt.rate = debt.rate;
          foundDebt.term = debt.term;
          foundDebt.annualPayment = debt.annualPayment;
          this.debtsStore.setDebts(state.debts);
        }
      });
    });
  }

  onBlur() {
    // This can be modified to do something on blur, but for now we will only use the save button
    // this.debtsStore.updateDebts(this.clientId);
  }

  cancel() {
    this.zone.run(() => {
      this.location.back();
    });
  }

  save() {
    this.debtsStore.updateDebts(this.clientId);
    this.zone.run(() => {
      this.location.back();
    });
  }
}
