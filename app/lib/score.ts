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
  // Calculate monthly net cash flow
  const monthlyNetCashFlow = inputs.monthlyIncome - inputs.monthlyEssentials - inputs.monthlyDebt;
  
  // Calculate survival months
  const monthlyBurnRate = inputs.monthlyEssentials + inputs.monthlyDebt;
  const survivalMonths = inputs.liquidSavings / monthlyBurnRate;
  const survivalDays = Math.round(survivalMonths * 30.44);
  
  // Calculate component scores (0-100 scale)
  const emergencyCoverageScore = Math.min(100, (survivalMonths / 12) * 40); // 40% weight
  const debtPressureScore = Math.max(0, 100 - (inputs.monthlyDebt / inputs.monthlyIncome) * 100 * 20); // 20% weight
  const savingsHealthScore = Math.min(100, (monthlyNetCashFlow / inputs.monthlyIncome) * 100 * 15); // 15% weight
  const incomeStabilityScore = inputs.jobStability === 'stable' ? 100 : inputs.jobStability === 'variable' ? 60 : 40; // 10% weight
  const costRiskScore = Math.max(0, 100 - (inputs.cityIndex - 1) * 100 * 10); // 10% weight
  const dependentsImpactScore = Math.max(0, 100 - inputs.dependents * 10); // 5% weight
  
  // Calculate overall score
  const breakdown: Breakdown = {
    emergencyCoverage: Math.round(emergencyCoverageScore),
    debtPressure: Math.round(debtPressureScore),
    savingsHealth: Math.round(savingsHealthScore),
    incomeStability: Math.round(incomeStabilityScore),
    costRisk: Math.round(costRiskScore),
    dependentsImpact: Math.round(dependentsImpactScore)
  };
  
  const score = Math.round(
    (breakdown.emergencyCoverage * 0.40) +
    (breakdown.debtPressure * 0.20) +
    (breakdown.savingsHealth * 0.15) +
    (breakdown.incomeStability * 0.10) +
    (breakdown.costRisk * 0.10) +
    (breakdown.dependentsImpact * 0.05)
  );
  
  // Determine tier
  let tier: Result['tier'];
  if (score >= 85) tier = 'Excellent';
  else if (score >= 70) tier = 'Good';
  else if (score >= 50) tier = 'Moderate';
  else if (score >= 30) tier = 'Caution';
  else tier = 'Critical';
  
  // Generate recommendations
  const recommendations: string[] = [];
  
  if (survivalMonths < 3) {
    recommendations.push('Build emergency fund to cover at least 6 months of expenses');
  }
  if (inputs.monthlyDebt / inputs.monthlyIncome > 0.3) {
    recommendations.push('High debt burden - focus on debt reduction');
  }
  if (monthlyNetCashFlow < 0) {
    recommendations.push('Negative cash flow - reduce expenses or increase income');
  }
  if (inputs.cityIndex > 1.5) {
    recommendations.push('Consider relocating to lower cost area');
  }
  if (recommendations.length === 0) {
    recommendations.push('Maintain current financial strategy and monitor changes');
  }
  
  return {
    score,
    tier,
    survivalMonths: Math.round(survivalMonths * 10) / 10, // Round to 1 decimal
    survivalDays,
    breakdown,
    recommendations
  };
}
