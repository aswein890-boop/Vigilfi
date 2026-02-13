/**
 * SURVIVAL CALCULATION ENGINE
 * 
 * Principles:
 * - Never oversimplify survival logic
 * - Always show assumptions and calculations
 * - Distinguish between mandatory and optional expenses
 * - Provide transparent, auditable results
 */

export interface IncomeSource {
  id: string;
  sourceName: string;
  incomeType: 'w2' | '1099' | 'business' | 'investment' | 'government';
  grossAmount: number;
  frequency: 'daily' | 'weekly' | 'bi-weekly' | 'monthly' | 'annual';
  isTaxable: boolean;
  isPreTax: boolean;
  selfEmploymentTax?: boolean;
  stability: 'stable' | 'variable' | 'seasonal';
}

export interface Expense {
  id: string;
  name: string;
  category: 'housing' | 'utilities' | 'food' | 'transportation' | 'healthcare' | 'education' | 'insurance' | 'subscriptions' | 'lifestyle' | 'miscellaneous';
  amount: number;
  frequency: 'daily' | 'weekly' | 'bi-weekly' | 'monthly' | 'annual';
  mandatoryOrOptional: 'mandatory' | 'optional';
  taxDeductible: boolean;
}

export interface Savings {
  emergencyFund: number;
  cashBalance: number;
  liquidInvestments: number;
  retirementAccounts: number;
}

export interface Debt {
  id: string;
  type: 'credit-card' | 'student-loan' | 'mortgage' | 'personal-loan';
  balance: number;
  apr: number;
  minimumPayment: number;
}

export interface UserProfile {
  filingStatus: 'single' | 'married-jointly' | 'married-separately' | 'head-of-household';
  state: string;
  age: number;
  dependents: number;
  studentStatus: 'full-time' | 'part-time' | 'not-student';
}

export interface MonthlyCashFlow {
  grossIncome: number;
  totalTaxes: number;
  netTakeHome: number;
  mandatoryExpenses: number;
  optionalExpenses: number;
  debtPayments: number;
  netCashFlow: number;
  discretionaryIncome: number;
}

export interface SurvivalScenario {
  name: string;
  description: string;
  monthlyNetCashFlow: number;
  mandatoryExpenses: number;
  liquidSavings: number;
  survivalMonths: number;
  survivalDays: number;
  survivalUntilDate: Date;
  isNegativeCashFlow: boolean;
  riskLevel: 'healthy' | 'caution' | 'critical';
}

export interface RiskFactor {
  category: 'housing-burden' | 'income-volatility' | 'debt-pressure' | 'low-savings' | 'tax-inefficiency' | 'negative-cash-flow';
  severity: 'low' | 'medium' | 'high' | 'critical';
  description: string;
  affectedValue?: number;
  recommendation?: string;
}

export interface Assumption {
  category: 'tax' | 'expense' | 'income' | 'savings' | 'location' | 'inflation';
  assumption: string;
  source: string;
  year?: number;
  confidence: 'high' | 'medium' | 'low';
  note?: string;
}

export interface CalculationDetail {
  step: string;
  inputs: Record<string, any>;
  output: number;
  formula?: string;
  source?: string;
}

export interface SurvivalAnalysis {
  userProfile: UserProfile;
  monthlyCashFlow: MonthlyCashFlow;
  currentScenario: SurvivalScenario;
  zeroIncomeScenario: SurvivalScenario;
  riskFactors: RiskFactor[];
  assumptions: Assumption[];
  calculationDetails: CalculationDetail[];
  timestamp: Date;
}

// Frequency conversion factors to annual
const FREQUENCY_MULTIPLIERS = {
  'daily': 365,
  'weekly': 52,
  'bi-weekly': 26,
  'monthly': 12,
  'annual': 1
};

export function convertToAnnual(amount: number, frequency: string): number {
  return amount * (FREQUENCY_MULTIPLIERS[frequency as keyof typeof FREQUENCY_MULTIPLIERS] || 1);
}

export function convertToMonthly(amount: number, frequency: string): number {
  return convertToAnnual(amount, frequency) / 12;
}

export function calculateAnnualIncome(incomeSources: IncomeSource[]): {
  grossIncome: number;
  taxableIncome: number;
  socialSecurityWages: number;
  medicareWages: number;
  selfEmploymentIncome: number;
} {
  let grossIncome = 0;
  let taxableIncome = 0;
  let socialSecurityWages = 0;
  let medicareWages = 0;
  let selfEmploymentIncome = 0;

  for (const income of incomeSources) {
    const annualAmount = convertToAnnual(income.grossAmount, income.frequency);
    grossIncome += annualAmount;

    if (income.isTaxable) {
      taxableIncome += annualAmount;
    }

    // W-2 income contributes to FICA wages
    if (income.incomeType === 'w2') {
      socialSecurityWages += annualAmount;
      medicareWages += annualAmount;
    }

    // 1099 and business income contributes to self-employment tax
    if (income.selfEmploymentTax && (income.incomeType === '1099' || income.incomeType === 'business')) {
      selfEmploymentIncome += annualAmount;
      socialSecurityWages += annualAmount;
      medicareWages += annualAmount;
    }

    // Investment income may have different treatment
    if (income.incomeType === 'investment') {
      // For now, treat as taxable income (simplified)
      taxableIncome += annualAmount;
    }
  }

  return {
    grossIncome,
    taxableIncome,
    socialSecurityWages,
    medicareWages,
    selfEmploymentIncome
  };
}

export function calculateMonthlyExpenses(expenses: Expense[], debts: Debt[]): {
  mandatoryExpenses: number;
  optionalExpenses: number;
  totalExpenses: number;
  debtPayments: number;
} {
  let mandatoryExpenses = 0;
  let optionalExpenses = 0;
  let debtPayments = 0;

  // Calculate expense totals
  for (const expense of expenses) {
    const monthlyAmount = convertToMonthly(expense.amount, expense.frequency);
    
    if (expense.mandatoryOrOptional === 'mandatory') {
      mandatoryExpenses += monthlyAmount;
    } else {
      optionalExpenses += monthlyAmount;
    }
  }

  // Calculate debt payments (always mandatory)
  for (const debt of debts) {
    debtPayments += debt.minimumPayment;
  }

  const totalExpenses = mandatoryExpenses + optionalExpenses + debtPayments;

  return {
    mandatoryExpenses,
    optionalExpenses,
    totalExpenses,
    debtPayments
  };
}

export function calculateLiquidSavings(savings: Savings): number {
  // Only include liquid assets for survival calculations
  return savings.emergencyFund + savings.cashBalance + savings.liquidInvestments;
}

export function calculateSurvivalMonths(
  liquidSavings: number,
  monthlyNetCashFlow: number,
  mandatoryExpenses: number
): {
  months: number;
  days: number;
  survivalUntilDate: Date;
} {
  let months: number;
  let days: number;

  if (monthlyNetCashFlow < 0) {
    // Burning through savings at rate of |negative cash flow|
    months = liquidSavings / Math.abs(monthlyNetCashFlow);
  } else if (monthlyNetCashFlow === 0) {
    // If income exactly matches expenses, survival depends on mandatory expenses only
    months = liquidSavings / mandatoryExpenses;
  } else {
    // Positive cash flow - financially stable
    months = Infinity;
  }

  days = months * 30.44; // Average days per month
  const survivalUntilDate = new Date();
  survivalUntilDate.setMonth(survivalUntilDate.getMonth() + Math.floor(months));
  survivalUntilDate.setDate(survivalUntilDate.getDate() + Math.floor((months % 1) * 30));

  return { months, days, survivalUntilDate };
}

export function identifyRiskFactors(
  monthlyCashFlow: MonthlyCashFlow,
  userProfile: UserProfile,
  incomeSources: IncomeSource[],
  expenses: Expense[],
  liquidSavings: number,
  debts: Debt[]
): RiskFactor[] {
  const riskFactors: RiskFactor[] = [];

  // Negative cash flow
  if (monthlyCashFlow.netCashFlow < 0) {
    riskFactors.push({
      category: 'negative-cash-flow',
      severity: 'critical',
      description: `Monthly expenses exceed income by $${Math.abs(monthlyCashFlow.netCashFlow).toLocaleString()}`,
      affectedValue: monthlyCashFlow.netCashFlow,
      recommendation: 'Reduce expenses or increase income immediately'
    });
  }

  // Housing burden (>35% of income)
  const housingExpenses = expenses
    .filter(e => e.category === 'housing')
    .reduce((sum, e) => sum + convertToMonthly(e.amount, e.frequency), 0);
  
  const housingBurden = monthlyCashFlow.grossIncome > 0 ? housingExpenses / monthlyCashFlow.grossIncome : 0;
  if (housingBurden > 0.35) {
    riskFactors.push({
      category: 'housing-burden',
      severity: housingBurden > 0.5 ? 'critical' : 'high',
      description: `Housing costs represent ${(housingBurden * 100).toFixed(1)}% of gross income`,
      affectedValue: housingBurden,
      recommendation: 'Consider downsizing or relocating to reduce housing costs'
    });
  }

  // Low savings
  const survivalMonths = liquidSavings / Math.abs(monthlyCashFlow.netCashFlow || monthlyCashFlow.mandatoryExpenses);
  if (survivalMonths < 3) {
    riskFactors.push({
      category: 'low-savings',
      severity: 'critical',
      description: `Only ${survivalMonths.toFixed(1)} months of savings available`,
      affectedValue: survivalMonths,
      recommendation: 'Build emergency fund to cover at least 6 months of expenses'
    });
  } else if (survivalMonths < 6) {
    riskFactors.push({
      category: 'low-savings',
      severity: 'high',
      description: `Only ${survivalMonths.toFixed(1)} months of savings available`,
      affectedValue: survivalMonths,
      recommendation: 'Increase emergency fund to 6+ months of expenses'
    });
  }

  // Income volatility
  const hasVariableIncome = incomeSources.some(income => 
    income.stability === 'variable' || income.stability === 'seasonal'
  );
  if (hasVariableIncome) {
    riskFactors.push({
      category: 'income-volatility',
      severity: 'medium',
      description: 'Income sources include variable or seasonal income',
      recommendation: 'Build larger emergency fund to account for income fluctuations'
    });
  }

  // Debt pressure
  const totalDebtPayments = debts.reduce((sum, debt) => sum + debt.minimumPayment, 0);
  const debtBurden = monthlyCashFlow.grossIncome > 0 ? totalDebtPayments / monthlyCashFlow.grossIncome : 0;
  if (debtBurden > 0.2) {
    riskFactors.push({
      category: 'debt-pressure',
      severity: debtBurden > 0.3 ? 'critical' : 'high',
      description: `Debt payments represent ${(debtBurden * 100).toFixed(1)}% of gross income`,
      affectedValue: debtBurden,
      recommendation: 'Focus on debt reduction to improve financial flexibility'
    });
  }

  return riskFactors;
}

export function generateAssumptions(): Assumption[] {
  return [
    {
      category: 'tax',
      assumption: 'Using 2024 tax brackets and rates',
      source: 'IRS Publication 15-T',
      year: 2024,
      confidence: 'high'
    },
    {
      category: 'expense',
      assumption: 'All expenses converted to monthly equivalents',
      source: 'Internal calculation',
      confidence: 'high'
    },
    {
      category: 'savings',
      assumption: 'Only liquid assets considered for survival calculations',
      source: 'Financial planning best practice',
      confidence: 'high'
    },
    {
      category: 'inflation',
      assumption: 'No inflation adjustment applied to projections',
      source: 'Simplification for MVP',
      confidence: 'medium',
      note: 'Future versions should include inflation adjustments'
    }
  ];
}

export function calculateSurvivalAnalysis(
  userProfile: UserProfile,
  incomeSources: IncomeSource[],
  expenses: Expense[],
  savings: Savings,
  debts: Debt[],
  taxBreakdown: any
): SurvivalAnalysis {
  // Calculate income
  const incomeData = calculateAnnualIncome(incomeSources);
  const monthlyGrossIncome = incomeData.grossIncome / 12;
  const monthlyTaxes = taxBreakdown.total / 12;

  // Calculate expenses
  const expenseData = calculateMonthlyExpenses(expenses, debts);

  // Calculate cash flow
  const monthlyCashFlow: MonthlyCashFlow = {
    grossIncome: monthlyGrossIncome,
    totalTaxes: monthlyTaxes,
    netTakeHome: monthlyGrossIncome - monthlyTaxes,
    mandatoryExpenses: expenseData.mandatoryExpenses,
    optionalExpenses: expenseData.optionalExpenses,
    debtPayments: expenseData.debtPayments,
    netCashFlow: monthlyGrossIncome - monthlyTaxes - expenseData.totalExpenses,
    discretionaryIncome: monthlyGrossIncome - monthlyTaxes - expenseData.mandatoryExpenses - expenseData.debtPayments
  };

  // Calculate liquid savings
  const liquidSavings = calculateLiquidSavings(savings);

  // Calculate current scenario
  const currentSurvival = calculateSurvivalMonths(
    liquidSavings,
    monthlyCashFlow.netCashFlow,
    monthlyCashFlow.mandatoryExpenses + monthlyCashFlow.debtPayments
  );

  const currentScenario: SurvivalScenario = {
    name: 'Current Situation',
    description: 'Based on current income and expenses',
    monthlyNetCashFlow: monthlyCashFlow.netCashFlow,
    mandatoryExpenses: monthlyCashFlow.mandatoryExpenses + monthlyCashFlow.debtPayments,
    liquidSavings,
    survivalMonths: currentSurvival.months,
    survivalDays: currentSurvival.days,
    survivalUntilDate: currentSurvival.survivalUntilDate,
    isNegativeCashFlow: monthlyCashFlow.netCashFlow < 0,
    riskLevel: currentSurvival.months < 3 ? 'critical' : currentSurvival.months < 6 ? 'caution' : 'healthy'
  };

  // Calculate zero income scenario
  const zeroIncomeSurvival = calculateSurvivalMonths(
    liquidSavings,
    -monthlyCashFlow.mandatoryExpenses - monthlyCashFlow.debtPayments,
    monthlyCashFlow.mandatoryExpenses + monthlyCashFlow.debtPayments
  );

  const zeroIncomeScenario: SurvivalScenario = {
    name: 'Zero Income',
    description: 'If all income stops immediately',
    monthlyNetCashFlow: -monthlyCashFlow.mandatoryExpenses - monthlyCashFlow.debtPayments,
    mandatoryExpenses: monthlyCashFlow.mandatoryExpenses + monthlyCashFlow.debtPayments,
    liquidSavings,
    survivalMonths: zeroIncomeSurvival.months,
    survivalDays: zeroIncomeSurvival.days,
    survivalUntilDate: zeroIncomeSurvival.survivalUntilDate,
    isNegativeCashFlow: true,
    riskLevel: zeroIncomeSurvival.months < 3 ? 'critical' : zeroIncomeSurvival.months < 6 ? 'caution' : 'healthy'
  };

  // Identify risk factors
  const riskFactors = identifyRiskFactors(monthlyCashFlow, userProfile, incomeSources, expenses, liquidSavings, debts);

  // Generate assumptions
  const assumptions = generateAssumptions();

  // Generate calculation details
  const calculationDetails: CalculationDetail[] = [
    {
      step: 'Annual Gross Income',
      inputs: { incomeSources },
      output: incomeData.grossIncome,
      formula: 'Sum of all income sources converted to annual'
    },
    {
      step: 'Monthly Net Cash Flow',
      inputs: { monthlyGrossIncome, monthlyTaxes, totalExpenses: expenseData.totalExpenses },
      output: monthlyCashFlow.netCashFlow,
      formula: 'Gross Income - Taxes - Total Expenses'
    },
    {
      step: 'Survival Months',
      inputs: { liquidSavings, monthlyNetCashFlow: monthlyCashFlow.netCashFlow },
      output: currentSurvival.months,
      formula: 'Liquid Savings ÷ |Monthly Net Cash Flow|'
    }
  ];

  return {
    userProfile,
    monthlyCashFlow,
    currentScenario,
    zeroIncomeScenario,
    riskFactors,
    assumptions,
    calculationDetails,
    timestamp: new Date()
  };
}
