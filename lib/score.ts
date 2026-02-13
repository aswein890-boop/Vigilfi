export type Inputs = {
  monthlyIncome: number; // take-home
  monthlyEssentials: number; // mandatory
  monthlyDebt: number; // debt minimums
  liquidSavings: number; // cash
  cityIndex?: number; // 0.5 - 2.0 (0.5 = very cheap, 1 = baseline, 2 = twice as expensive)
  dependents?: number; // integer
  jobStability?: 'stable' | 'variable' | 'at_risk';
};

export type ScoreResult = {
  survivalMonths: number;
  survivalDays: number;
  score: number; // 0-100
  tier: 'Excellent' | 'Good' | 'Fair' | 'Weak' | 'Critical';
  breakdown: {
    emergencyCoverage: number; // 0-100
    debtPressure: number; // 0-100
    savingsHealth: number; // 0-100
    incomeStability: number; // 0-100
    costRisk: number; // 0-100
    dependentsImpact: number; // 0-100
  };
  recommendations: string[];
};

function clamp(n: number, a = 0, b = 100) {
  return Math.max(a, Math.min(b, n));
}

/**
 * Compute survival months given inputs and a conservative risk multiplier.
 * - Adjusted mandatory monthly = essentials + debt
 * - CityIndex increases burn proportionally
 */
export function computeSurvivalMonths(inputs: Inputs, riskMultiplier = 1.0): number {
  const cityIndex = inputs.cityIndex ?? 1.0;
  const mandatory = (inputs.monthlyEssentials + inputs.monthlyDebt) * cityIndex * riskMultiplier;

  if (mandatory <= 0) return Infinity;

  // If user still receives net positive cash, survival is longer; but core "survival if income stops" uses liquid savings only
  const months = inputs.liquidSavings / mandatory;
  return Math.max(0, months);
}

function scoreEmergencyCoverage(months: number) {
  // 0 months => 0, 3 months => 60, 6 months => 90, 12+ => 100
  if (!isFinite(months)) return 100;
  const v = months >= 12 ? 100 : Math.round((months / 12) * 100);
  return clamp(v);
}

function scoreDebtPressure(inputs: Inputs) {
  const dti = (inputs.monthlyDebt / Math.max(1, inputs.monthlyIncome)) * 100; // percent
  // lower DTI is better. 0% -> 100, 20% -> 80, 40% -> 50, 60% -> 20, 100% -> 0
  if (dti <= 10) return 100;
  if (dti >= 100) return 0;
  const score = 100 - (dti * 1.1); // gentle decay
  return clamp(Math.round(score));
}

function scoreSavingsRate(inputs: Inputs) {
  // savings rate = (income - essentials - debt) / income
  const disposable = Math.max(0, inputs.monthlyIncome - inputs.monthlyEssentials - inputs.monthlyDebt);
  const rate = inputs.monthlyIncome > 0 ? disposable / inputs.monthlyIncome : 0;
  // rate 0.0 -> 50, 0.2 -> 80, 0.4 -> 95, >=0.5 -> 100
  if (rate >= 0.5) return 100;
  if (rate <= 0) return 40;
  return clamp(Math.round(50 + rate * 100));
}

function scoreIncomeStability(inputs: Inputs) {
  switch (inputs.jobStability) {
    case 'stable':
      return 100;
    case 'variable':
      return 65;
    case 'at_risk':
      return 30;
    default:
      return 65;
  }
}

function scoreCostRisk(inputs: Inputs) {
  // cityIndex: 1 baseline, >1 more expensive => penalty
  const idx = inputs.cityIndex ?? 1.0;
  // 1.0 -> 90, 1.5 -> 60, 2.0 -> 30
  const score = Math.round(100 - (idx - 1) * 70);
  return clamp(score);
}

function scoreDependents(inputs: Inputs) {
  const d = Math.max(0, inputs.dependents ?? 0);
  // 0 dependents -> 100, 1 -> 85, 2 -> 70, 3 -> 50, 4+ -> 30
  if (d === 0) return 100;
  if (d === 1) return 85;
  if (d === 2) return 70;
  if (d === 3) return 50;
  return 30;
}

export function computeResilienceScore(inputs: Inputs, riskMultiplier = 1.0): ScoreResult {
  // Survival months uses conservative risk multiplier (user-configurable scenario)
  const survivalMonths = computeSurvivalMonths(inputs, riskMultiplier);
  const survivalDays = Math.floor(survivalMonths * 30.436875); // average month

  const emergencyCoverage = scoreEmergencyCoverage(survivalMonths);
  const debtPressure = scoreDebtPressure(inputs);
  const savingsHealth = scoreSavingsRate(inputs);
  const incomeStability = scoreIncomeStability(inputs);
  const costRisk = scoreCostRisk(inputs);
  const dependentsImpact = scoreDependents(inputs);

  // Weighted composition
  const score = clamp(
    Math.round(
      emergencyCoverage * 0.4 +
        (100 - debtPressure) * 0.2 +
        savingsHealth * 0.15 +
        incomeStability * 0.1 +
        costRisk * 0.1 +
        dependentsImpact * 0.05
    )
  );

  let tier: ScoreResult['tier'] = 'Fair';
  if (score >= 85) tier = 'Excellent';
  else if (score >= 70) tier = 'Good';
  else if (score >= 50) tier = 'Fair';
  else if (score >= 30) tier = 'Weak';
  else tier = 'Critical';

  const recommendations: string[] = [];
  if (survivalMonths < 3) recommendations.push('Increase liquid savings to cover at least 3 months of mandatory expenses.');
  if (inputs.monthlyDebt / Math.max(1, inputs.monthlyIncome) > 0.4) recommendations.push('Reduce high-interest debt or refinance to lower monthly obligations.');
  if (savingsHealth < 60) recommendations.push('Improve savings rate by cutting optional expenses or increasing income.');
  if (incomeStability < 50) recommendations.push('Build a contingency plan or diversify income sources.');
  if ((inputs.cityIndex ?? 1) > 1.25) recommendations.push('Evaluate lower-cost locations or negotiate housing costs.');
  if ((inputs.dependents ?? 0) >= 1) recommendations.push('Review benefits and tax credits available for dependents.');

  return {
    survivalMonths: Math.round(survivalMonths * 100) / 100,
    survivalDays,
    score,
    tier,
    breakdown: {
      emergencyCoverage,
      debtPressure,
      savingsHealth,
      incomeStability,
      costRisk,
      dependentsImpact
    },
    recommendations
  };
}
