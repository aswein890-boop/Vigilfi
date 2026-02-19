import React from 'react';
import { render, screen } from '@testing-library/react';
import Report from '../app/components/Report';

const inputs = { monthlyIncome: 4000, monthlyEssentials: 1500, monthlyDebt: 300, liquidSavings: 8000, cityIndex: 1.1, dependents: 1, jobStability: 'variable' } as any;
const result = {
  survivalMonths: 4,
  survivalDays: 120,
  score: 62,
  tier: 'Fair',
  breakdown: { emergencyCoverage: 60, debtPressure: 40, savingsHealth: 65, incomeStability: 65, costRisk: 80, dependentsImpact: 85 },
  recommendations: ['Increase savings']
} as any;

describe('Report component', () => {
  it('renders key report sections', () => {
    render(<Report inputs={inputs} result={result} />);
    expect(screen.getByText(/Financial Resilience Report/i)).toBeDefined();
    expect(screen.getByText(/4\s*months/i)).toBeDefined();
    expect(screen.getByText(/Increase savings/i)).toBeDefined();
    // printable report and UI should not show legacy "points/pts" — we use visual sub-scores instead
    expect(screen.queryByText(/pts|points/i)).toBeNull();
  });
});
