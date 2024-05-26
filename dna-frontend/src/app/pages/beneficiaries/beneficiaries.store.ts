import { HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ComponentStore } from '@ngrx/component-store';
import { Beneficiary } from 'app/core/models/beneficiary.model';
import { SupabaseService } from 'app/core/services/supabase.service';
import {
  BeneficiariesState,
  initialBeneficiariesState,
} from 'app/states/beneficiaries.state';
import { take } from 'rxjs';

@Injectable()
export class BeneficiariesStore extends ComponentStore<BeneficiariesState> {
  readonly isLoading$ = this.select(state => state.isLoading);
  readonly error$ = this.select(state => state.error);
  readonly beneficiaries$ = this.select(state => state.beneficiaries);

  readonly vm$ = this.select({
    isLoading: this.isLoading$,
    error: this.error$,
    beneficiaries: this.beneficiaries$,
  });

  readonly setIsLoading = this.updater(state => ({
    ...state,
    isLoading: true,
  }));

  readonly setError = this.updater((state, error: HttpErrorResponse) => ({
    ...state,
    isLoading: false,
    error: error.message,
  }));

  readonly setBeneficiaries = this.updater(
    (state, beneficiaries: Beneficiary[]) => ({
      ...state,
      isLoading: false,
      beneficiaries,
    })
  );

  constructor(private supabaseService: SupabaseService) {
    super(initialBeneficiariesState);
  }

  getBeneficiaries(clientId: number) {
    this.supabaseService.getBeneficiaries(clientId).then(response => {
      if (response.error) {
        throw response.error;
      } else {
        this.setBeneficiaries(response.data.beneficiaries);
      }
    });
  }

  updateBeneficiaries(clientId: number) {
    this.beneficiaries$.pipe(take(1)).subscribe(beneficiaries => {
      this.supabaseService
        .updateBeneficiaries(clientId, beneficiaries)
        .then(response => {
          if (response.error) {
            throw response.error;
          }
        });
    });
  }
}
