import { HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ComponentStore } from '@ngrx/component-store';
import { TotalNeeds } from 'app/core/models/total-needs.model';
import { SupabaseService } from 'app/core/services/supabase.service';
import {
  TotalNeedsState,
  initialTotalNeedsState,
} from 'app/states/total-needs.state';
import { take } from 'rxjs';

@Injectable()
export class TotalNeedsStore extends ComponentStore<TotalNeedsState> {
  readonly isLoading$ = this.select(state => state.isLoading);
  readonly error$ = this.select(state => state.error);
  readonly totalNeeds$ = this.select(state => state.totalNeeds);

  readonly vm$ = this.select({
    isLoading: this.isLoading$,
    error: this.error$,
    totalNeeds: this.totalNeeds$,
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

  readonly setTotalNeeds = this.updater((state, totalNeeds: TotalNeeds) => ({
    ...state,
    isLoading: false,
    totalNeeds,
  }));

  constructor(private supabaseService: SupabaseService) {
    super(initialTotalNeedsState);
  }

  getTotalNeeds(clientId: number) {
    this.supabaseService.getTotalNeeds(clientId).then(response => {
      if (response.error) {
        throw response.error;
      } else {
        this.setTotalNeeds(response.data.total_needs as TotalNeeds);
      }
    });
  }

  updateTotalNeeds(clientId: number) {
    this.totalNeeds$.pipe(take(1)).subscribe(totalNeeds => {
      this.supabaseService
        .updateTotalNeeds(clientId, totalNeeds)
        .then(response => {
          if (response.error) {
            throw response.error;
          }
        });
    });
  }
}
