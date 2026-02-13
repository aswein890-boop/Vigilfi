# Scoring Methodology

VigilFi uses a weighted Financial Resilience Score (0–100) assembled from auditable sub-scores:

- Emergency coverage (40%) — how many months of mandatory expenses your liquid savings cover.
- Debt pressure (20%) — monthly debt payment vs income (lower is better).
- Savings health (15%) — your effective savings rate from monthly disposable income.
- Income stability (10%) — categorical: stable / variable / at_risk.
- Cost risk (10%) — city cost-of-living index impact.
- Dependents (5%) — more dependents reduces available buffer.

All formulas are deterministic and stored in `lib/score.ts`. Each simulation run on the UI shows the exact numeric trace.
