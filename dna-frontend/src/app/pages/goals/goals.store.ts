import { HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ComponentStore } from '@ngrx/component-store';
import { Goal } from 'app/core/models/goal.model';
import { SupabaseService } from 'app/core/services/supabase.service';
import { GoalsState, initialGoalsState } from 'app/states/goals.state';
import { take } from 'rxjs';

@Injectable()
export class GoalsStore extends ComponentStore<GoalsState> {
  readonly isLoading$ = this.select(state => state.isLoading);
  readonly error$ = this.select(state => state.error);
  readonly percentGoalLiquidity$ = this.select(
    state => state.percentGoalLiquidity
  );
  readonly goals$ = this.select(state => state.goals);

  readonly vm$ = this.select({
    isLoading: this.isLoading$,
    error: this.error$,
    percentGoalLiquidity: this.percentGoalLiquidity$,
    goals: this.goals$,
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

  readonly setPercentGoalLiquidity = this.updater(
    (state, percentGoalLiquidity: number) => ({
      ...state,
      percentGoalLiquidity,
    })
  );

  readonly setGoals = this.updater((state, goals: Goal[]) => ({
    ...state,
    isLoading: false,
    goals,
  }));

  constructor(private supabaseService: SupabaseService) {
    super(initialGoalsState);
  }

  getPercentGoalLiquidity(clientId: number) {
    this.supabaseService.getPercentGoalLiquidity(clientId).then(response => {
      if (response.error) {
        throw response.error;
      } else {
        this.setPercentGoalLiquidity(response.data.percent_goal_liquidity);
      }
    });
  }

  updatePercentGoalLiquidity(clientId: number) {
    this.percentGoalLiquidity$.pipe(take(1)).subscribe(percent => {
      this.supabaseService
        .updatePercentGoalLiquidity(clientId, percent || 0)
        .then(response => {
          if (response.error) {
            throw response.error;
          }
        });
    });
  }

  getGoals(clientId: number) {
    this.supabaseService.getGoals(clientId).then(response => {
      if (response.error) {
        throw response.error;
      } else {
        if (response.data.goals) {
          this.setGoals(response.data.goals);
        }
      }
    });
  }

  updateGoals(clientId: number) {
    this.goals$.pipe(take(1)).subscribe(goals => {
      this.supabaseService.updateGoals(clientId, goals).then(response => {
        if (response.error) {
          throw response.error;
        }
      });
    });
  }
}
