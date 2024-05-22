import { Beneficiary } from 'app/core/models/beneficiary.model';

export interface BeneficiariesState {
  isLoading: boolean;
  error: string | null;
  beneficiaries: Beneficiary[];
}

export const initialBeneficiariesState: BeneficiariesState = {
  isLoading: false,
  error: null,
  beneficiaries: [],
};
