export interface Shareholder {
  name: string | null;
  sharePercentage: number | null;
  insuranceCoverage: number | null;
  ebitdaContributionPercentage: number | null;
}

export interface Business {
  id: string;
  name: string | null;
  valuation: number | null;
  ebitda: number | null;
  appreciationRate: number | null;
  term: number | null;
  shareholders: Shareholder[];
}
