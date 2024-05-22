import { HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ComponentStore } from '@ngrx/component-store';
import { Business } from 'app/core/models/business.model';
import { SupabaseService } from 'app/core/services/supabase.service';
import {
  BusinessesState,
  initialBusinessesState,
} from 'app/states/businesses.state';
import { take } from 'rxjs';

@Injectable()
export class BusinessesStore extends ComponentStore<BusinessesState> {
  readonly isLoading$ = this.select(state => state.isLoading);
  readonly error$ = this.select(state => state.error);
  readonly businesses$ = this.select(state => state.businesses);

  readonly vm$ = this.select({
    isLoading: this.isLoading$,
    error: this.error$,
    businesses: this.businesses$,
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

  readonly setBusinesses = this.updater((state, businesses: Business[]) => ({
    ...state,
    isLoading: false,
    businesses,
  }));

  constructor(private supabaseService: SupabaseService) {
    super(initialBusinessesState);
  }

  getBusinesses(clientId: number) {
    this.supabaseService.getBusinesses(clientId).then(response => {
      if (response.error) {
        throw response.error;
      } else {
        this.setBusinesses(response.data.businesses);
      }
    });
  }

  updateBusinesses(clientId: number) {
    this.businesses$.pipe(take(1)).subscribe(businesses => {
      this.supabaseService
        .updateBusinesses(clientId, businesses)
        .then(response => {
          if (response.error) {
            throw response.error;
          }
        });
    });
  }
}
