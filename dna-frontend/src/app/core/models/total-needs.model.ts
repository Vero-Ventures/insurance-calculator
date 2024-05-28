export interface TotalNeedsItem {
  need: number | null;
  want: number | null;
  priority: number | null;
}

export interface ShareholderNeeds {
  businessId: string | null;
  businessName: string | null;
  name: string | null;
  need: number | null;
  want: number | null;
  priority: number | null;
}

export interface TotalNeeds {
  incomeReplacement: TotalNeedsItem;
  estateTaxLiability: TotalNeedsItem;
  equalization: TotalNeedsItem;
  debtFutureLiability: TotalNeedsItem;
  goalShortfall: TotalNeedsItem;
  keyMan: ShareholderNeeds[];
  shareholderAgreement: ShareholderNeeds[];
}
