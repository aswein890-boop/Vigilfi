/**
 * FINANCIAL RESILIENCE SCORE CALCULATOR
 * 
 * Principles:
 * - Transparent, auditable scoring methodology
 * - Conservative assumptions
 * - Clear risk indicators
 * - Actionable recommendations
 */

export interface Inputs {
  monthlyIncome: number;
  monthlyEssentials: number;
  monthlyDebt: number;
  liquidSavings: number;
  cityIndex: number;
  dependents: number;
  jobStability: 'stable' | 'variable' | 'seasonal';
}

export interface Breakdown {
  emergencyCoverage: number;
  debtPressure: number;
  savingsHealth: number;
  incomeStability: number;
  costRisk: number;
  dependentsImpact: number;
}

export interface Result {
  score: number;
  tier: 'Critical' | 'Caution' | 'Moderate' | 'Good' | 'Excellent';
  survivalMonths: number;
  survivalDays: number;
  breakdown: Breakdown;
  recommendations: string[];
}

export function computeResilienceScore(inputs: Inputs): Result {
  const monthlyNetCashFlow = inputs.monthlyIncome - inputs.monthlyEssentials - inputs.monthlyDebt;
  const monthlyBurnRate = inputs.monthlyEssentials + inputs.monthlyDebt;
  const survivalMonths = monthlyBurnRate <= 0 ? Infinity : inputs.liquidSavings / monthlyBurnRate;
  const survivalDays = Math.round(survivalMonths * 30.44);

  // local helpers (non-linear, conservative, auditable)
  const scoreEmergencyCoverage = (months: number) => {
    if (!isFinite(months)) return 100;
    if (months <= 0) return 0;
    if (months < 3) return Math.round((months / 3) * 60);
    if (months < 6) return Math.round(60 + ((months - 3) / 3) * 30);
    if (months < 12) return Math.round(90 + ((months - 6) / 6) * 10);
    return 100;
  };

  const scoreDebtPressure = (income: number, debt: number) => {
    const inc = Math.max(0, income);
    if (inc === 0) return debt > 0 ? 0 : 75;
    const dti = (debt / inc) * 100;
    return Math.round(Math.max(0, Math.min(100, 100 - dti * 1.25)));
  };

  const scoreSavingsHealth = (income: number, essentials: number, debt: number, liquid: number) => {
    const mandatory = Math.max(1, essentials + debt);
    const bufferMonths = liquid / mandatory;
    let bufferScore: number;
    if (!isFinite(bufferMonths)) bufferScore = 100;
    else if (bufferMonths <= 0) bufferScore = 10;
    else if (bufferMonths < 1) bufferScore = Math.round(10 + bufferMonths * 20);
    else if (bufferMonths < 3) bufferScore = Math.round(30 + ((bufferMonths - 1) / 2) * 40);
    else if (bufferMonths < 6) bufferScore = Math.round(70 + ((bufferMonths - 3) / 3) * 20);
    else if (bufferMonths < 12) bufferScore = Math.round(90 + ((bufferMonths - 6) / 6) * 10);
    else bufferScore = 100;

    const disposable = income - essentials - debt;
    const momentumRate = income > 0 ? Math.max(-1, disposable / income) : 0;
    const momentumScore = momentumRate <= 0 ? 0 : Math.round(Math.min(1, momentumRate / 0.5) * 100);

    return Math.round(bufferScore * 0.65 + momentumScore * 0.35);
  };

  const scoreIncomeStability = (st: Inputs['jobStability']) => {
    if (st === 'stable') return 100;
    if (st === 'variable') return 65;
    return 30; // 'seasonal' or others
  };

  const scoreCostRisk = (cityIndex: number) => {
    const idx = cityIndex ?? 1.0;
    return Math.round(Math.max(0, Math.min(100, 100 - (idx - 1) * 60)));
  };

  const scoreDependents = (d: number) => {
    const dep = Math.max(0, d || 0);
    if (dep === 0) return 100;
    if (dep === 1) return 90;
    if (dep === 2) return 75;
    if (dep === 3) return 60;
    return 40;
  };

  const emergencyCoverage = scoreEmergencyCoverage(survivalMonths);
  const debtPressure = scoreDebtPressure(inputs.monthlyIncome, inputs.monthlyDebt);
  const savingsHealth = scoreSavingsHealth(inputs.monthlyIncome, inputs.monthlyEssentials, inputs.monthlyDebt, inputs.liquidSavings);
  const incomeStability = scoreIncomeStability(inputs.jobStability);
  const costRisk = scoreCostRisk(inputs.cityIndex ?? 1);
  const dependentsImpact = scoreDependents(inputs.dependents ?? 0);

  const breakdown: Breakdown = {
    emergencyCoverage: Math.round(emergencyCoverage),
    debtPressure: Math.round(debtPressure),
    savingsHealth: Math.round(savingsHealth),
    incomeStability: Math.round(incomeStability),
    costRisk: Math.round(costRisk),
    dependentsImpact: Math.round(dependentsImpact)
  };

  const score = Math.round(
    breakdown.emergencyCoverage * 0.4 +
      breakdown.debtPressure * 0.2 +
      breakdown.savingsHealth * 0.15 +
      breakdown.incomeStability * 0.1 +
      breakdown.costRisk * 0.1 +
      breakdown.dependentsImpact * 0.05
  );

  let tier: Result['tier'];
  if (score >= 85) tier = 'Excellent';
  else if (score >= 70) tier = 'Good';
  else if (score >= 50) tier = 'Moderate';
  else if (score >= 30) tier = 'Caution';
  else tier = 'Critical';

  const recommendations: string[] = [];
  if (survivalMonths < 3) recommendations.push('Build emergency fund to cover at least 6 months of expenses');
  if ((inputs.monthlyDebt / Math.max(1, inputs.monthlyIncome)) > 0.4) recommendations.push('Reduce high-interest debt or refinance to lower monthly obligations');
  if (savingsHealth < 60) recommendations.push('Increase savings rate and reduce optional spending');
  if (incomeStability < 50) recommendations.push('Diversify income and build contingency plan');
  if ((inputs.cityIndex ?? 1) > 1.25) recommendations.push('Evaluate housing/relocation options to lower cost-of-living');
  if (recommendations.length === 0) recommendations.push('Maintain current strategy and continue monitoring');

  return {
    score,
    tier,
    survivalMonths: Math.round(survivalMonths * 10) / 10,
    survivalDays,
    breakdown,
    recommendations
  };
}
