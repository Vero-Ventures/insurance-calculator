import { TotalNeeds } from 'app/core/models/total-needs.model';

export interface TotalNeedsState {
  isLoading: boolean;
  error: string | null;
  totalNeeds: TotalNeeds;
}

export const initialTotalNeedsState: TotalNeedsState = {
  isLoading: false,
  error: null,
  totalNeeds: {
    incomeReplacement: { need: null, want: null, priority: 50 },
    estateTaxLiability: { need: null, want: null, priority: 50 },
    equalization: { need: null, want: null, priority: 50 },
    debtFutureLiability: { need: null, want: null, priority: 50 },
    goalShortfall: { need: null, want: null, priority: 50 },
    keyMan: [],
    shareholderAgreement: [],
  },
};
