import { Asset } from 'app/core/models/asset.model';

export interface AssetsState {
  isLoading: boolean;
  error: string | null;
  assets: Asset[];
}

export const initialAssetsState: AssetsState = {
  isLoading: false,
  error: null,
  assets: [],
};
