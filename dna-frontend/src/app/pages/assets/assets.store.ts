import { HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ComponentStore } from '@ngrx/component-store';
import { Asset } from 'app/core/models/asset.model';
import { SupabaseService } from 'app/core/services/supabase.service';
import { AssetsState, initialAssetsState } from 'app/states/assets.state';
import { take } from 'rxjs';

@Injectable()
export class AssetsStore extends ComponentStore<AssetsState> {
  readonly isLoading$ = this.select(state => state.isLoading);
  readonly error$ = this.select(state => state.error);
  readonly assets$ = this.select(state => state.assets);

  readonly vm$ = this.select({
    isLoading: this.isLoading$,
    error: this.error$,
    assets: this.assets$,
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

  readonly setAssets = this.updater((state, assets: Asset[]) => ({
    ...state,
    isLoading: false,
    assets,
  }));

  constructor(private supabaseService: SupabaseService) {
    super(initialAssetsState);
  }

  getAssets(clientId: number) {
    this.supabaseService.getAssets(clientId).then(response => {
      if (response.error) {
        throw response.error;
      } else {
        this.setAssets(response.data.assets);
      }
    });
  }

  updateAssets(clientId: number) {
    this.assets$.pipe(take(1)).subscribe(assets => {
      this.supabaseService.updateAssets(clientId, assets).then(response => {
        if (response.error) {
          throw response.error;
        }
      });
    });
  }
}
