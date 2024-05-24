import { AsyncPipe, CurrencyPipe, NgIf } from '@angular/common';
import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { TuiDataListModule, tuiNumberFormatProvider } from '@taiga-ui/core';
import {
  TuiDataListWrapperModule,
  TuiInputDateModule,
  TuiInputModule,
  TuiInputNumberModule,
  TuiSelectModule,
  TuiTabsModule,
} from '@taiga-ui/kit';
import { ValueCardComponent } from 'app/core/components/value-card/value-card.component';
import { ClientStore } from './client.store';
import { Client } from 'app/core/models/client.model';
import { CA_PROVINCES } from 'app/core/enums/ca-provinces.enum';
import { TUI_DATE_FORMAT, TUI_DATE_SEPARATOR, TuiDay } from '@taiga-ui/cdk';
import { BirthDateAgePipe } from 'app/shared/pipes/age.pipe';
import { NonNegativePipe } from 'app/shared/pipes/non-negative.pipe';
import { CalculatorComponent } from '../calculator/calculator.component';
import { take } from 'rxjs';
import { ActivatedRoute } from '@angular/router';
import { PROVINCE_TAX_BRACKETS } from 'app/core/constants/tax.constant';
import { TaxBracketPipe } from 'app/shared/pipes/tax-bracket.pipe';
import { MultiValueCardComponent } from 'app/core/components/multi-value-card/multi-value-card.component';

@Component({
  selector: 'app-client',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    TuiInputModule,
    TuiInputDateModule,
    TuiInputNumberModule,
    TuiSelectModule,
    TuiDataListModule,
    TuiDataListWrapperModule,
    TuiTabsModule,
    ValueCardComponent,
    MultiValueCardComponent,
    CalculatorComponent,
    NgIf,
    AsyncPipe,
    CurrencyPipe,
    BirthDateAgePipe,
    NonNegativePipe,
    TaxBracketPipe,
  ],
  templateUrl: './client.component.html',
  styleUrl: './client.component.scss',
  providers: [
    ClientStore,
    tuiNumberFormatProvider({
      decimalSeparator: '.',
      thousandSeparator: ',',
    }),
    { provide: TUI_DATE_FORMAT, useValue: 'YMD' },
    { provide: TUI_DATE_SEPARATOR, useValue: '/' },
  ],
})
export class ClientComponent implements OnInit, OnDestroy {
  @Input() clientId: number = 0;
  activeItemIndex = 0;
  vm$ = this.clientStore.vm$;
  readonly provinceOptions = Object.values(CA_PROVINCES);
  readonly maxDate = TuiDay.currentLocal();
  readonly clientForm = new FormGroup({
    name: new FormControl(),
    birthdate: new FormControl(),
    province: new FormControl(),
    annualIncome: new FormControl(),
    incomeReplacementMultiplier: new FormControl(),
    expectedRetirementAge: new FormControl(),
  });

  constructor(
    private readonly clientStore: ClientStore,
    private route: ActivatedRoute
  ) {
    this.route.params.subscribe(params => {
      this.clientId = +params['clientId'];
      this.clientStore.getClient(this.clientId);
      // This is necessary to first populate the form with the initial state and then the data from the db
      this.vm$.pipe(take(2)).subscribe(state => {
        this.clientForm.patchValue(state.client);
      });
    });
  }

  ngOnInit() {
    this.clientForm.valueChanges.subscribe(formData => {
      this.clientStore.setClient(formData as Client);
    });
  }

  ngOnDestroy() {
    this.clientStore.updateClient(this.clientId);
  }

  onBlur() {
    this.clientStore.updateClient(this.clientId);
  }

  calculateTaxBracket(
    province: CA_PROVINCES | null,
    annualIncome: number | null
  ) {
    if (!province || !annualIncome) {
      return null;
    }

    const brackets = PROVINCE_TAX_BRACKETS[province];
    let selectedBracket = brackets[0];
    for (const bracket of brackets) {
      if (annualIncome >= bracket.minIncome) {
        selectedBracket = bracket;
      }
    }
    return selectedBracket;
  }
}
