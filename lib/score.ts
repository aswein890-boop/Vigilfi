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
  // Non-linear, conservative mapping with diminishing returns:
  // 0 -> 0, 1 -> ~10, 3 -> 60, 6 -> 90, 12+ -> 100
  if (!isFinite(months)) return 100;
  if (months <= 0) return 0;
  if (months < 3) {
    // 0..3 => 0..60
    return clamp(Math.round((months / 3) * 60));
  }
  if (months < 6) {
    // 3..6 => 60..90
    return clamp(Math.round(60 + ((months - 3) / 3) * 30));
  }
  if (months < 12) {
    // 6..12 => 90..100
    return clamp(Math.round(90 + ((months - 6) / 6) * 10));
  }
  return 100;
}

function scoreDebtPressure(inputs: Inputs) {
  const income = Math.max(0, inputs.monthlyIncome);
  if (income === 0) {
    // No income -> debt pressure is severe if there is any debt
    return inputs.monthlyDebt > 0 ? 0 : 75;
  }
  const dti = (inputs.monthlyDebt / income) * 100; // percent
  // Smooth monotonic mapping: 0% -> 100, 40% -> ~50, 80% -> ~0
  const score = Math.round(clamp(100 - dti * 1.25));
  return score;
}

function scoreSavingsRate(inputs: Inputs) {
  const mandatory = Math.max(1, inputs.monthlyEssentials + inputs.monthlyDebt);
  const bufferMonths = inputs.liquidSavings / mandatory;

  // Buffer score (non-linear): 0->10, 1->30, 3->70, 6->90, 12->100
  let bufferScore: number;
  if (!isFinite(bufferMonths)) bufferScore = 100;
  else if (bufferMonths <= 0) bufferScore = 10;
  else if (bufferMonths < 1) bufferScore = Math.round(10 + bufferMonths * 20);
  else if (bufferMonths < 3) bufferScore = Math.round(30 + ((bufferMonths - 1) / 2) * 40);
  else if (bufferMonths < 6) bufferScore = Math.round(70 + ((bufferMonths - 3) / 3) * 20);
  else if (bufferMonths < 12) bufferScore = Math.round(90 + ((bufferMonths - 6) / 6) * 10);
  else bufferScore = 100;

  // Momentum = monthly savings rate (disposable / income)
  const disposable = Math.max(-Infinity, inputs.monthlyIncome - inputs.monthlyEssentials - inputs.monthlyDebt);
  const momentumRate = inputs.monthlyIncome > 0 ? disposable / inputs.monthlyIncome : 0;
  let momentumScore: number;
  if (momentumRate <= 0) momentumScore = 0;
  else if (momentumRate >= 0.5) momentumScore = 100;
  else momentumScore = Math.round((momentumRate / 0.5) * 100);

  // Weighted: buffer (65%) + momentum (35%)
  const combined = Math.round(bufferScore * 0.65 + momentumScore * 0.35);
  return clamp(combined);
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
  const idx = inputs.cityIndex ?? 1.0;
  // 1.0 => 100, 1.5 => ~70, 2.0 => ~40 (linear penalty above baseline)
  const score = Math.round(clamp(100 - (idx - 1) * 60));
  return score;
}

function scoreDependents(inputs: Inputs) {
  const d = Math.max(0, inputs.dependents ?? 0);
  if (d === 0) return 100;
  if (d === 1) return 90;
  if (d === 2) return 75;
  if (d === 3) return 60;
  return 40;
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

  // Weighted composition (debtPressure is a "goodness" score so used directly)
  const score = clamp(
    Math.round(
      emergencyCoverage * 0.4 +
        debtPressure * 0.2 +
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
