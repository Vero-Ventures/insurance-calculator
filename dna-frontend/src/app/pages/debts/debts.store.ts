import { HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ComponentStore } from '@ngrx/component-store';
import { Debt } from 'app/core/models/debt.model';
import { SupabaseService } from 'app/core/services/supabase.service';
import { DebtsState, initialDebtsState } from 'app/states/debts.state';
import { take } from 'rxjs';

@Injectable()
export class DebtsStore extends ComponentStore<DebtsState> {
  readonly isLoading$ = this.select(state => state.isLoading);
  readonly error$ = this.select(state => state.error);
  readonly debts$ = this.select(state => state.debts);

  readonly vm$ = this.select({
    isLoading: this.isLoading$,
    error: this.error$,
    debts: this.debts$,
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

  readonly setDebts = this.updater((state, debts: Debt[]) => ({
    ...state,
    isLoading: false,
    debts,
  }));

  constructor(private supabaseService: SupabaseService) {
    super(initialDebtsState);
  }

  getDebts(clientId: number) {
    this.supabaseService.getDebts(clientId).then(response => {
      if (response.error) {
        throw response.error;
      } else {
        this.setDebts(response.data.debts);
      }
    });
  }

  updateDebts(clientId: number) {
    this.debts$.pipe(take(1)).subscribe(debts => {
      this.supabaseService.updateDebts(clientId, debts).then(response => {
        if (response.error) {
          throw response.error;
        }
      });
    });
  }
}
