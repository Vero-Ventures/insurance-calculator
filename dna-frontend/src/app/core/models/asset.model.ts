import { ASSET_TYPE } from '../enums/asset-type.enum';
import { Beneficiary } from './beneficiary.model';

export interface Asset {
  id: string;
  name: string | null;
  initialValue: number | null;
  currentValue: number | null;
  yearAcquired: number | null;
  rate: number | null;
  term: number | null;
  type: ASSET_TYPE | null;
  isTaxable: boolean;
  isLiquid: boolean;
  isToBeSold: boolean;
  beneficiaries: Beneficiary[];
}
