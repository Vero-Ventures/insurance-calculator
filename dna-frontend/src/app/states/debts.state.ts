import { Debt } from 'app/core/models/debt.model';

export interface DebtsState {
  isLoading: boolean;
  error: string | null;
  debts: Debt[];
}

export const initialDebtsState: DebtsState = {
  isLoading: false,
  error: null,
  debts: [],
};
