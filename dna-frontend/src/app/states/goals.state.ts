import { Goal } from 'app/core/models/goal.model';

export interface GoalsState {
  isLoading: boolean;
  error: string | null;
  percentGoalLiquidity: number | null;
  goals: Goal[];
}

export const initialGoalsState: GoalsState = {
  isLoading: false,
  error: null,
  percentGoalLiquidity: null,
  goals: [],
};
