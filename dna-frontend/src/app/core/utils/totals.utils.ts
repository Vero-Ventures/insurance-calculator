import { PROVINCE_TAX_BRACKETS } from '../constants/tax.constant';
import { CA_PROVINCES } from '../enums/ca-provinces.enum';
import { Asset } from '../models/asset.model';
import { Beneficiary } from '../models/beneficiary.model';
import { Business, Shareholder } from '../models/business.model';
import { Client } from '../models/client.model';
import { Debt } from '../models/debt.model';
import { Goal } from '../models/goal.model';

export function calculateTaxBracket(
  province: CA_PROVINCES | null,
  value: number | null
) {
  if (!province || !value) {
    return null;
  }

  const brackets = PROVINCE_TAX_BRACKETS[province];
  let selectedBracket = brackets[0];
  for (const bracket of brackets) {
    if (value >= bracket.minIncome) {
      selectedBracket = bracket;
    }
  }
  return selectedBracket;
}

export function getCapitalGainsTaxRate(value: number, client: Client) {
  const taxBracket = calculateTaxBracket(client.province, value);

  if (!taxBracket) {
    return 0;
  }
  return taxBracket.taxRate * 0.5;
}

export function calculateFutureValueDollars(asset: Asset) {
  return (
    (asset.currentValue || 0) *
    Math.pow(1 + (asset.rate || 0) / 100, asset.term || 0)
  );
}

export function calculateFutureTaxLiability(asset: Asset, client: Client) {
  if (!asset.isTaxable) {
    return 0;
  }
  const futureValueDollars = calculateFutureValueDollars(asset);
  return (
    (futureValueDollars - (asset.initialValue || 0)) *
    (getCapitalGainsTaxRate(futureValueDollars, client) / 100)
  );
}

export function calculateSingleBeneficiaryTotal(
  assets: Asset[],
  beneficiary: Beneficiary
) {
  return assets.reduce((acc, asset) => {
    const assetBeneficiary = asset.beneficiaries.find(
      b => b.id === beneficiary.id
    );

    if (!assetBeneficiary) {
      return acc;
    }

    return (
      acc +
      ((calculateFutureValueDollars(asset) *
        (assetBeneficiary?.allocation || 0)) /
        100 || 0)
    );
  }, 0);
}

export function calculateTotalDesiredValue(
  assets: Asset[],
  beneficiaries: Beneficiary[]
) {
  return beneficiaries.reduce((total, beneficiary) => {
    const currentAmount = calculateSingleBeneficiaryTotal(assets, beneficiary);
    const desiredPercent = (beneficiary.allocation || 0) / 100;
    const idealAmount = currentAmount / desiredPercent;
    return Math.max(total, idealAmount);
  }, 0);
}

export function calculateSingleAdditionalRequired(
  assets: Asset[],
  beneficiaries: Beneficiary[],
  beneficiary: Beneficiary
) {
  const totalDesiredValue = calculateTotalDesiredValue(assets, beneficiaries);
  const currentAmount = calculateSingleBeneficiaryTotal(assets, beneficiary);
  const desiredPercent = (beneficiary.allocation || 0) / 100;
  const realIdealAmount = totalDesiredValue * desiredPercent;
  return Math.max(0, realIdealAmount - currentAmount);
}

export function calculateYearsHeld(debt: Debt) {
  const currentYear = new Date().getFullYear();
  return currentYear - (debt.yearAcquired || currentYear);
}

export function calculateSingleFutureValue(debt: Debt) {
  const currentYearsHeld = calculateYearsHeld(debt);
  const amountPaidOffDollars = (debt.annualPayment || 0) * currentYearsHeld;
  const futureValueOfActualTermDebt =
    (debt.initialValue || 0) *
    Math.pow(1 + (debt.rate || 0) / 100, debt.term || 0);
  return futureValueOfActualTermDebt - amountPaidOffDollars;
}

export function calculateFutureValue(
  current: number,
  rate: number,
  term: number
) {
  return current * Math.pow(1 + rate / 100, term);
}

export function calculateFutureValueLiquid(assets: Asset[]) {
  return assets
    .filter(asset => asset.isLiquid)
    .reduce((acc, asset) => {
      return (
        acc +
        calculateFutureValue(
          asset.currentValue || 0,
          asset.rate || 0,
          asset.term || 0
        )
      );
    }, 0);
}

export function calculateLiquidityToGoal(assets: Asset[], allocation: number) {
  return calculateFutureValueLiquid(assets) * (allocation / 100);
}

export function calculateTotalSumGoals(goals: Goal[]) {
  return goals.reduce((acc, goal) => {
    return acc + (goal.amount || 0);
  }, 0);
}

export function calculateIncomeReplacement(client: Client) {
  return (client.annualIncome || 0) * (client.incomeReplacementMultiplier || 0);
}

export function calculateEstateTaxLiability(assets: Asset[], client: Client) {
  return assets
    .map(asset => calculateFutureTaxLiability(asset, client))
    .reduce((a, b) => a + b, 0);
}

export function calculateEqualization(
  assets: Asset[],
  beneficiaries: Beneficiary[]
) {
  const total = beneficiaries.reduce((acc, beneficiary) => {
    return (
      acc +
      calculateSingleAdditionalRequired(assets, beneficiaries, beneficiary)
    );
  }, 0);
  return Math.max(0, total);
}

export function calculateDebtFutureLiability(debts: Debt[]) {
  return debts.reduce((acc, debt) => acc + calculateSingleFutureValue(debt), 0);
}

export function calculateGoalShortfall(
  assets: Asset[],
  goals: Goal[],
  allocation: number
) {
  return (
    -1 *
    (calculateLiquidityToGoal(assets, allocation) -
      calculateTotalSumGoals(goals))
  );
}

export function calculateShareholderEbitdaNeed(
  business: Business,
  shareholder: Shareholder
) {
  return (
    ((shareholder.ebitdaContributionPercentage || 0) / 100) *
    (business.ebitda || 0) *
    Math.pow(1 + (business.appreciationRate || 0) / 100, business.term || 0)
  );
}

export function calculateShareholderShareNeed(
  business: Business,
  shareholder: Shareholder
) {
  return (
    ((shareholder.sharePercentage || 0) / 100) *
    (business.valuation || 0) *
    Math.pow(1 + (business.appreciationRate || 0) / 100, business.term || 0)
  );
}
