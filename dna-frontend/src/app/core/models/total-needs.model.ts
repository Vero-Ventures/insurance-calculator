export interface TotalNeedsItem {
  need: number | null;
  want: number | null;
  priority: number | null;
}

export interface ShareholderNeeds {
  name: string | null;
  need: number | null;
  want: number | null;
  priority: number | null;
}

export interface TotalNeedsBusiness {
  id: number;
  name: string | null;
  shareholders: ShareholderNeeds[];
}

export interface TotalNeeds {
  incomeReplacement: TotalNeedsItem;
  estateTaxLiability: TotalNeedsItem;
  equalization: TotalNeedsItem;
  debtFutureLiability: TotalNeedsItem;
  goalShortfall: TotalNeedsItem;
  keyMan: TotalNeedsBusiness[];
  shareholderAgreement: TotalNeedsBusiness[];
}
