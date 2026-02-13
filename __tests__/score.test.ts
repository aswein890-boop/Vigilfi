import { describe, it, expect } from 'vitest';
import { computeResilienceScore } from '../lib/score';

describe('score engine', () => {
  it('gives high score for strong liquidity and low debt', () => {
    const res = computeResilienceScore({
      monthlyIncome: 8000,
      monthlyEssentials: 2000,
      monthlyDebt: 200,
      liquidSavings: 60000,
      cityIndex: 1,
      dependents: 0,
      jobStability: 'stable'
    });
    expect(res.score).toBeGreaterThanOrEqual(80);
  });

  it('gives low score for no savings and high debt', () => {
    const res = computeResilienceScore({
      monthlyIncome: 4000,
      monthlyEssentials: 2500,
      monthlyDebt: 1500,
      liquidSavings: 100,
      cityIndex: 1.5,
      dependents: 2,
      jobStability: 'at_risk'
    });
    expect(res.score).toBeLessThanOrEqual(40);
  });
});
