/**
 * US TAX CALCULATION ENGINE
 * 
 * Principles:
 * - Never use flat tax shortcuts
 * - Always show tax breakdown
 * - Use real tax brackets and rates
 * - Calculate annually first, then convert to monthly
 */

// 2024 Federal Tax Brackets (inflation-adjusted)
interface TaxBracket {
  min: number;
  max: number | null;
  rate: number;
}

interface FederalTaxBrackets {
  [key: string]: TaxBracket[];
}

const FEDERAL_TAX_BRACKETS_2024: FederalTaxBrackets = {
  'single': [
    { min: 0, max: 11000, rate: 0.10 },
    { min: 11000, max: 44725, rate: 0.12 },
    { min: 44725, max: 95375, rate: 0.22 },
    { min: 95375, max: 182050, rate: 0.24 },
    { min: 182050, max: 231250, rate: 0.32 },
    { min: 231250, max: 578125, rate: 0.35 },
    { min: 578125, max: null, rate: 0.37 }
  ],
  'married-jointly': [
    { min: 0, max: 22000, rate: 0.10 },
    { min: 22000, max: 89450, rate: 0.12 },
    { min: 89450, max: 190750, rate: 0.22 },
    { min: 190750, max: 364200, rate: 0.24 },
    { min: 364200, max: 462500, rate: 0.32 },
    { min: 462500, max: 693750, rate: 0.35 },
    { min: 693750, max: null, rate: 0.37 }
  ],
  'married-separately': [
    { min: 0, max: 11000, rate: 0.10 },
    { min: 11000, max: 44725, rate: 0.12 },
    { min: 44725, max: 95375, rate: 0.22 },
    { min: 95375, max: 182050, rate: 0.24 },
    { min: 182050, max: 231250, rate: 0.32 },
    { min: 231250, max: 346875, rate: 0.35 },
    { min: 346875, max: null, rate: 0.37 }
  ],
  'head-of-household': [
    { min: 0, max: 15700, rate: 0.10 },
    { min: 15700, max: 59850, rate: 0.12 },
    { min: 59850, max: 95350, rate: 0.22 },
    { min: 95350, max: 182050, rate: 0.24 },
    { min: 182050, max: 231250, rate: 0.32 },
    { min: 231250, max: 578100, rate: 0.35 },
    { min: 578100, max: null, rate: 0.37 }
  ]
};

// 2024 Standard Deductions
const STANDARD_DEDUCTIONS_2024 = {
  'single': 13850,
  'married-jointly': 27700,
  'married-separately': 13850,
  'head-of-household': 20800
};

// FICA Tax Rates (2024)
const SOCIAL_SECURITY_RATE = 0.062;
const SOCIAL_SECURITY_WAGE_BASE = 168600; // 2024 limit
const MEDICARE_RATE = 0.0145;
const ADDITIONAL_MEDICARE_RATE = 0.009; // For income > $200k (single) / $250k (married)
const ADDITIONAL_MEDICARE_THRESHOLD = {
  'single': 200000,
  'married-jointly': 250000,
  'married-separately': 125000,
  'head-of-household': 200000
};

// State Tax Data (simplified for MVP - expand with real data)
interface StateTaxConfig {
  hasIncomeTax: boolean;
  brackets?: TaxBracket[];
  flatRate?: number;
  standardDeduction?: number;
}

const STATE_TAX_CONFIGS: { [key: string]: StateTaxConfig } = {
  'CA': {
    hasIncomeTax: true,
    brackets: [
      { min: 0, max: 10099, rate: 0.01 },
      { min: 10099, max: 23942, rate: 0.02 },
      { min: 23942, max: 37658, rate: 0.04 },
      { min: 37658, max: 52308, rate: 0.06 },
      { min: 52308, max: 66295, rate: 0.08 },
      { min: 66295, max: 338639, rate: 0.093 },
      { min: 338639, max: 406364, rate: 0.103 },
      { min: 406364, max: 677278, rate: 0.113 },
      { min: 677278, max: null, rate: 0.123 }
    ],
    standardDeduction: 4853
  },
  'TX': {
    hasIncomeTax: false
  },
  'FL': {
    hasIncomeTax: false
  },
  'NY': {
    hasIncomeTax: true,
    brackets: [
      { min: 0, max: 8500, rate: 0.04 },
      { min: 8500, max: 11700, rate: 0.045 },
      { min: 11700, max: 13900, rate: 0.0525 },
      { min: 13900, max: 21400, rate: 0.059 },
      { min: 21400, max: 80650, rate: 0.0597 },
      { min: 80650, max: 215400, rate: 0.0633 },
      { min: 215400, max: 1077550, rate: 0.0685 },
      { min: 1077550, max: null, rate: 0.109 }
    ],
    standardDeduction: 8000
  }
};

export interface TaxCalculationInputs {
  filingStatus: string;
  taxableIncome: number;
  socialSecurityWages: number;
  medicareWages: number;
  selfEmploymentIncome: number;
  state: string;
  localTaxRate?: number;
}

export interface TaxBreakdown {
  federal: {
    incomeTax: number;
    socialSecurityTax: number;
    medicareTax: number;
    additionalMedicareTax: number;
    total: number;
  };
  state: {
    incomeTax: number;
    total: number;
  };
  local: {
    incomeTax: number;
    total: number;
  };
  total: number;
  effectiveRate: number;
  marginalRate: number;
}

export function calculateFederalIncomeTax(taxableIncome: number, filingStatus: string): number {
  const brackets = FEDERAL_TAX_BRACKETS_2024[filingStatus];
  if (!brackets) {
    throw new Error(`Invalid filing status: ${filingStatus}`);
  }

  let tax = 0;
  for (const bracket of brackets) {
    if (taxableIncome <= bracket.min) break;
    
    const taxableInThisBracket = Math.min(
      taxableIncome - bracket.min,
      bracket.max ? bracket.max - bracket.min : Infinity
    );
    
    tax += taxableInThisBracket * bracket.rate;
    
    if (bracket.max && taxableIncome <= bracket.max) break;
  }

  return tax;
}

export function calculateFICA(socialSecurityWages: number, medicareWages: number, filingStatus: string): {
  socialSecurityTax: number;
  medicareTax: number;
  additionalMedicareTax: number;
} {
  const socialSecurityTax = Math.min(socialSecurityWages, SOCIAL_SECURITY_WAGE_BASE) * SOCIAL_SECURITY_RATE;
  
  let medicareTax = medicareWages * MEDICARE_RATE;
  let additionalMedicareTax = 0;
  
  if (medicareWages > ADDITIONAL_MEDICARE_THRESHOLD[filingStatus as keyof typeof ADDITIONAL_MEDICARE_THRESHOLD]) {
    additionalMedicareTax = (medicareWages - ADDITIONAL_MEDICARE_THRESHOLD[filingStatus as keyof typeof ADDITIONAL_MEDICARE_THRESHOLD]) * ADDITIONAL_MEDICARE_RATE;
  }

  return { socialSecurityTax, medicareTax, additionalMedicareTax };
}

export function calculateStateTax(taxableIncome: number, state: string): number {
  const config = STATE_TAX_CONFIGS[state];
  if (!config || !config.hasIncomeTax) {
    return 0;
  }

  if (config.flatRate) {
    return taxableIncome * config.flatRate;
  }

  if (config.brackets) {
    let tax = 0;
    for (const bracket of config.brackets) {
      if (taxableIncome <= bracket.min) break;
      
      const taxableInThisBracket = Math.min(
        taxableIncome - bracket.min,
        bracket.max ? bracket.max - bracket.min : Infinity
      );
      
      tax += taxableInThisBracket * bracket.rate;
      
      if (bracket.max && taxableIncome <= bracket.max) break;
    }
    return tax;
  }

  return 0;
}

export function calculateSelfEmploymentTax(selfEmploymentIncome: number): number {
  if (selfEmploymentIncome <= 0) return 0;
  
  // Self-employment tax is 15.3% (12.4% Social Security + 2.9% Medicare)
  // Only 92.35% of net earnings are subject to SE tax
  const netEarnings = selfEmploymentIncome * 0.9235;
  const socialSecurityPortion = Math.min(netEarnings, SOCIAL_SECURITY_WAGE_BASE) * 0.124;
  const medicarePortion = netEarnings * 0.029;
  
  return socialSecurityPortion + medicarePortion;
}

export function calculateTaxes(inputs: TaxCalculationInputs): TaxBreakdown {
  // Federal Income Tax
  const federalIncomeTax = calculateFederalIncomeTax(inputs.taxableIncome, inputs.filingStatus);
  
  // FICA Taxes
  const fica = calculateFICA(inputs.socialSecurityWages, inputs.medicareWages, inputs.filingStatus);
  
  // Self-Employment Tax
  const selfEmploymentTax = calculateSelfEmploymentTax(inputs.selfEmploymentIncome);
  
  // State Tax
  const stateTaxableIncome = inputs.taxableIncome - (STATE_TAX_CONFIGS[inputs.state]?.standardDeduction || 0);
  const stateIncomeTax = calculateStateTax(stateTaxableIncome, inputs.state);
  
  // Local Tax
  const localIncomeTax = inputs.localTaxRate ? inputs.taxableIncome * inputs.localTaxRate : 0;
  
  // Calculate totals
  const federalTotal = federalIncomeTax + fica.socialSecurityTax + fica.medicareTax + fica.additionalMedicareTax;
  const stateTotal = stateIncomeTax;
  const localTotal = localIncomeTax;
  const total = federalTotal + stateTotal + localTotal;
  
  // Calculate effective rate
  const totalIncome = inputs.taxableIncome + inputs.socialSecurityWages + inputs.medicareWages + inputs.selfEmploymentIncome;
  const effectiveRate = totalIncome > 0 ? total / totalIncome : 0;
  
  // Get marginal rate (highest bracket rate)
  const federalBrackets = FEDERAL_TAX_BRACKETS_2024[inputs.filingStatus];
  const marginalRate = federalBrackets?.find(bracket => 
    inputs.taxableIncome >= bracket.min && 
    (!bracket.max || inputs.taxableIncome <= bracket.max)
  )?.rate || 0;

  return {
    federal: {
      incomeTax: federalIncomeTax,
      socialSecurityTax: fica.socialSecurityTax,
      medicareTax: fica.medicareTax,
      additionalMedicareTax: fica.additionalMedicareTax,
      total: federalTotal
    },
    state: {
      incomeTax: stateIncomeTax,
      total: stateTotal
    },
    local: {
      incomeTax: localIncomeTax,
      total: localTotal
    },
    total,
    effectiveRate,
    marginalRate
  };
}
