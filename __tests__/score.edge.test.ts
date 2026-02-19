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

  it('emergency coverage anchors are correct (0, 1, 3, 6, 12 months)', () => {
    const base = { monthlyIncome: 4000, monthlyEssentials: 1000, monthlyDebt: 0, cityIndex: 1, dependents: 0, jobStability: 'stable' } as any;

    const r0 = computeResilienceScore({ ...base, liquidSavings: 0 });
    expect(r0.breakdown.emergencyCoverage).toBe(0);

    const r1 = computeResilienceScore({ ...base, liquidSavings: 1000 }); // 1 month
    expect(r1.breakdown.emergencyCoverage).toBe(20);

    const r3 = computeResilienceScore({ ...base, liquidSavings: 3000 }); // 3 months
    expect(r3.breakdown.emergencyCoverage).toBe(60);

    const r6 = computeResilienceScore({ ...base, liquidSavings: 6000 }); // 6 months
    expect(r6.breakdown.emergencyCoverage).toBe(90);

    const r12 = computeResilienceScore({ ...base, liquidSavings: 12000 }); // 12 months
    expect(r12.breakdown.emergencyCoverage).toBe(100);
  });

  it('savingsHealth increases when disposable (monthly free cash) increases', () => {
    const a = { monthlyIncome: 5000, monthlyEssentials: 3000, monthlyDebt: 0, liquidSavings: 3000, cityIndex: 1, dependents: 0, jobStability: 'stable' } as any;
    const b = { ...a, monthlyEssentials: 2500 }; // more disposable
    const ra = computeResilienceScore(a);
    const rb = computeResilienceScore(b);
    expect(rb.breakdown.savingsHealth).toBeGreaterThanOrEqual(ra.breakdown.savingsHealth);
  });

  it('debtPressure is monotonic: more debt (relative to income) lowers the sub-score', () => {
    const base = { monthlyIncome: 5000, monthlyEssentials: 2000, cityIndex: 1, dependents: 0, jobStability: 'stable' } as any;
    const lowDebt = computeResilienceScore({ ...base, monthlyDebt: 100, liquidSavings: 2000 });
    const highDebt = computeResilienceScore({ ...base, monthlyDebt: 1500, liquidSavings: 2000 });
    expect(highDebt.breakdown.debtPressure).toBeLessThanOrEqual(lowDebt.breakdown.debtPressure);
  });
});
