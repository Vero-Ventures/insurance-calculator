import { Business } from 'app/core/models/business.model';

export interface BusinessesState {
  isLoading: boolean;
  error: string | null;
  businesses: Business[];
}

export const initialBusinessesState: BusinessesState = {
  isLoading: false,
  error: null,
  businesses: [],
};
