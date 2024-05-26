import { ASSET_TYPE } from '../enums/asset-type.enum';

export interface AssetBeneficiaryItem {
  id: string;
  name: string | null;
  allocation: number | null;
  isEnabled: boolean;
}

export interface AssetBeneficiary {
  id: string;
  name: string | null;
  allocation: number | null;
}

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
  beneficiaries: AssetBeneficiary[];
}
