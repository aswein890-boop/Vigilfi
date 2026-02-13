import { describe, it, expect } from 'vitest';
import { computeResilienceScore, computeSurvivalMonths } from '../lib/score';

describe('score engine — edge cases', () => {
  it('handles zero mandatory expense (infinite survival)', () => {
    const months = computeSurvivalMonths({
      monthlyIncome: 3000,
      monthlyEssentials: 0,
      monthlyDebt: 0,
      liquidSavings: 10000,
      cityIndex: 1,
      dependents: 0,
      jobStability: 'stable'
    });
    expect(months).toBeGreaterThan(1000000);
  });

  it('handles zero income gracefully and returns low score when no savings', () => {
    const res = computeResilienceScore({
      monthlyIncome: 0,
      monthlyEssentials: 2000,
      monthlyDebt: 500,
      liquidSavings: 0,
      cityIndex: 1,
      dependents: 1,
      jobStability: 'at_risk'
    });
    expect(res.survivalMonths).toBe(0);
    // model returns a modest score even with zero income; ensure it is low
    expect(res.score).toBeLessThanOrEqual(50);
  });

  it('is monotonic: increasing savings should not reduce score', () => {
    const base = { monthlyIncome: 5000, monthlyEssentials: 2000, monthlyDebt: 400, cityIndex: 1, dependents: 0, jobStability: 'stable' } as any;
    const r1 = computeResilienceScore({ ...base, liquidSavings: 1000 });
    const r2 = computeResilienceScore({ ...base, liquidSavings: 20000 });
    expect(r2.score).toBeGreaterThanOrEqual(r1.score);
  });
});
