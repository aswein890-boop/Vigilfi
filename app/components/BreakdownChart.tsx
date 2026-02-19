'use client';
import React from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer } from 'recharts';
import type { Inputs, ScoreResult } from '../../lib/score';

type Entry = { name: string; value: number; metric?: string };

const WEIGHTS: Record<string, number> = {
  Emergency: 0.4,
  Debt: 0.2,
  Savings: 0.15,
  Income: 0.1,
  Location: 0.1,
  Dependents: 0.05
};

const DESC: Record<string, string> = {
  Emergency: 'Months of mandatory expenses your liquid savings cover (higher is better).',
  Debt: 'Share of monthly income used for minimum debt payments (lower is better).',
  Savings: 'Combined buffer + monthly savings momentum (higher is better).',
  Income: 'Stability of your income source — stable income improves resilience.',
  Location: 'Local cost-of-living risk relative to baseline (higher index reduces effective buffer).',
  Dependents: 'Household dependents increase mandatory needs and reduce per-person buffer.'
};

const SUGGESTION: Record<string, string> = {
  Emergency: 'Increase liquid savings to reach a 3–6 month buffer; automate transfers to a high‑yield savings account.',
  Debt: 'Prioritize reducing high‑interest monthly debt or negotiate lower payments/refinance.',
  Savings: 'Raise monthly savings rate by cutting discretionary spend or redirecting bonuses.',
  Income: 'Stabilize income: pursue contract diversification or emergency income sources.',
  Location: 'Evaluate lower-cost housing or renegotiate rent/utility expenses.',
  Dependents: 'Review benefits, tax credits, and shared-cost strategies to reduce household burden.'
};

function currency(n?: number) {
  if (n == null) return '-';
  return `$${Math.round(n).toLocaleString()}`;
}

const PALETTE: Record<string, string> = {
  Emergency: '#D55E00',
  Debt: '#0072B2',
  Savings: '#009E73',
  Income: '#56B4E9',
  Location: '#CC79A7',
  Dependents: '#F0E442'
};

function Donut({ items }: { items: { name: string; value: number }[] }) {
  if (!items || items.length === 0) return null;
  const data = items.map((i) => ({ name: i.name, value: Math.max(0, i.value) }));
  return (
    <div data-testid="breakdown-donut" className="w-full flex justify-center mb-4">
      <div style={{ width: 280, height: 280 }}>
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie data={data} dataKey="value" nameKey="name" cx="50%" cy="50%" innerRadius={60} outerRadius={100} paddingAngle={2} startAngle={90} endAngle={-270}>
              {data.map((entry) => (
                <Cell key={entry.name} fill={PALETTE[entry.name] ?? '#94a3b8'} />
              ))}
            </Pie>
          </PieChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}

export default function BreakdownChart({ data, result, inputs }: { data?: Entry[]; result?: ScoreResult; inputs?: Inputs }) {
  const [view, setView] = React.useState<'bars' | 'donut'>(() => {
    try {
      return (localStorage.getItem('vigilfi:breakdownView') as 'bars' | 'donut') || 'bars';
    } catch (e) {
      return 'bars';
    }
  });

  React.useEffect(() => {
    try {
      localStorage.setItem('vigilfi:breakdownView', view);
    } catch (e) {
      /* ignore */
    }
  }, [view]);

  const entries = React.useMemo(() => {
    if (data) return data;
    if (result) return [
      { name: 'Emergency', value: result.breakdown.emergencyCoverage },
      { name: 'Debt', value: 100 - result.breakdown.debtPressure },
      { name: 'Savings', value: result.breakdown.savingsHealth },
      { name: 'Income', value: result.breakdown.incomeStability },
      { name: 'Location', value: result.breakdown.costRisk },
      { name: 'Dependents', value: result.breakdown.dependentsImpact }
    ];
    return [];
  }, [data, result]);

  const riskDrivers = React.useMemo(() => [...entries].sort((a, b) => a.value - b.value).slice(0, 3), [entries]);

  const sorted = React.useMemo(() => [...entries].sort((a, b) => a.value - b.value), [entries]);
  // bars display the sub-score (0-100); list is sorted ascending so lowest (worst) appears first

  const displayMetric = (r: Entry) => {
    if (r.metric) return r.metric;
    if (!result || !inputs) return '-';

    switch (r.name) {
      case 'Emergency':
        return `${result.survivalMonths} months`;
      case 'Debt':
        return `${Math.round((inputs.monthlyDebt / Math.max(1, inputs.monthlyIncome)) * 100)}% of income`;
      case 'Savings':
        return `${Math.round(((inputs.monthlyIncome - inputs.monthlyEssentials - inputs.monthlyDebt) / Math.max(1, inputs.monthlyIncome)) * 100)}% save rate`;
      case 'Income':
        return inputs.jobStability ?? '-';
      case 'Location':
        return (inputs.cityIndex ?? 1).toFixed(2);
      case 'Dependents':
        return String(inputs.dependents ?? 0);
      default:
        return '-';
    }
  };

  const mandatoryMonthly = React.useMemo(() => {
    if (!inputs) return 0;
    const idx = inputs.cityIndex ?? 1;
    return (inputs.monthlyEssentials + inputs.monthlyDebt) * idx;
  }, [inputs]);

  const emergencyGap = React.useMemo(() => {
    if (!inputs || !result) return null;
    const target = 6; // conservative target months
    const need = Math.max(0, Math.ceil(target * mandatoryMonthly - inputs.liquidSavings));
    const disposable = Math.max(0, inputs.monthlyIncome - inputs.monthlyEssentials - inputs.monthlyDebt);
    const monthsToSave = disposable > 0 ? Math.ceil(need / disposable) : null;
    return { need, monthsToSave };
  }, [inputs, result, mandatoryMonthly]);



  const iconFor = (name: string) => {
    switch (name) {
      case 'Emergency':
        return (<svg width="20" height="20" viewBox="0 0 24 24" fill="none" aria-hidden><path d="M12 2l7 4v6c0 5-4 9-7 10-3-1-7-5-7-10V6l7-4z" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round"/></svg>);
      case 'Debt':
        return (<svg width="20" height="20" viewBox="0 0 24 24" fill="none" aria-hidden><path d="M3 6h18M6 6v12a2 2 0 0 0 2 2h8a2 2 0 0 0 2-2V6" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round"/></svg>);
      case 'Savings':
        return (<svg width="20" height="20" viewBox="0 0 24 24" fill="none" aria-hidden><path d="M4 7h16v10a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V7z" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round"/><path d="M8 11h8M12 7v2" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round"/></svg>);
      case 'Income':
        return (<svg width="20" height="20" viewBox="0 0 24 24" fill="none" aria-hidden><path d="M12 2v6l4-2" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round"/><path d="M4 12h16M6 20h12" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round"/></svg>);
      case 'Location':
        return (<svg width="20" height="20" viewBox="0 0 24 24" fill="none" aria-hidden><path d="M12 21s7-4.5 7-11a7 7 0 1 0-14 0c0 6.5 7 11 7 11z" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round"/></svg>);
      case 'Dependents':
        return (<svg width="20" height="20" viewBox="0 0 24 24" fill="none" aria-hidden><path d="M16 11a4 4 0 1 0-8 0" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round"/><path d="M2 21c2-4 6-6 10-6s8 2 10 6" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round"/></svg>);
      default:
        return null;
    }
  };

  return (
    <div className="space-y-5">
      {/* Clear one-line takeaway */}
      {result && inputs ? (
        <div className="p-3 rounded border border-slate-800 bg-gradient-to-r from-slate-900/40 to-slate-900/30">
          <div className="flex items-center justify-between gap-4">
            <div>
              <div className="text-xs text-slate-400">Key takeaway</div>
              <div className="mt-1 text-sm font-semibold text-slate-100">{riskDrivers[0].name} is your primary risk — {Math.round(riskDrivers[0].value)} on the component score.</div>
              <div className="text-xs text-slate-400 mt-1">Recommended first step: <span className="text-slate-200">{SUGGESTION[riskDrivers[0].name]}</span></div>
            </div>

            <div className="text-right">
              <div className="text-xs text-slate-400">Primary action</div>
              <div className="text-sm text-slate-200">Improve this component first to raise your overall resilience.</div>
            </div>
          </div>

          {/* emergency quick action */}
          {riskDrivers[0].name === 'Emergency' && emergencyGap ? (
            <div className="mt-3 text-xs text-slate-300">To reach a conservative 6‑month buffer you need <strong>{currency(emergencyGap.need)}</strong>{emergencyGap.monthsToSave ? ` (≈ ${emergencyGap.monthsToSave} months at current disposable savings)` : ' — increase savings rate or income to shorten this time'}.</div>
          ) : null}
        </div>
      ) : null}

      {/* Visual chart + compact table (responsive) */}

      {/* Toggle control at top (keyboard accessible) */}
      <div className="flex items-center gap-2 mb-4" role="tablist" aria-label="Breakdown view toggle">
        <button
          data-testid="toggle-bars"
          aria-pressed={view === 'bars'}
          className={`px-3 py-1 rounded ${view === 'bars' ? 'bg-slate-700 text-white' : 'bg-transparent text-slate-400'}`}
          onClick={() => setView('bars')}
          onKeyDown={(e) => { if (e.key === 'ArrowRight' || e.key === 'ArrowLeft') setView('donut'); }}
        >
          📊 Bars
        </button>
        <button
          data-testid="toggle-donut"
          aria-pressed={view === 'donut'}
          className={`px-3 py-1 rounded ${view === 'donut' ? 'bg-slate-700 text-white' : 'bg-transparent text-slate-400'}`}
          onClick={() => setView('donut')}
          onKeyDown={(e) => { if (e.key === 'ArrowLeft' || e.key === 'ArrowRight') setView('bars'); }}
        >
          🍩 Donut
        </button>
      </div>

      {view === 'donut' ? (
        <div className="space-y-6">
          <div className="card p-6 bg-slate-900/40 flex flex-col items-center">
            <h3 className="text-lg font-semibold text-slate-100 mb-4">Component Breakdown</h3>
            <Donut items={sorted.map(s => ({ name: s.name, value: Math.max(0, s.value) }))} />

            {/* Legend beneath donut */}
            <div className="mt-6 w-full max-w-xs">
              <div className="text-xs font-semibold text-slate-200 mb-3">Legend</div>
              <div className="space-y-2">
                {sorted.map((r) => (
                  <div key={r.name} className="flex items-center gap-3 text-sm text-slate-300">
                    <div className="w-4 h-4 rounded" style={{ backgroundColor: PALETTE[r.name] }} />
                    <span className="flex-1">{r.name}</span>
                    <span className="font-semibold text-slate-200">{Math.round(r.value)}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Details section */}
          <div className="card p-4 bg-slate-900/40">
            <h3 className="text-sm font-semibold text-slate-100 mb-4">Detailed metrics</h3>
            {sorted.map((r) => (
              <div key={r.name} className="mb-4 pb-4 border-b border-slate-800 last:border-b-0">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-semibold text-slate-100">{r.name}</span>
                  <span className="text-sm font-bold" style={{ color: PALETTE[r.name] }}>{Math.round(r.value)}/100</span>
                </div>
                <div className="flex items-center gap-2 mb-2">
                  <div className="flex-1 h-3 bg-slate-800 rounded overflow-hidden">
                    <div className="h-3" style={{ width: `${r.value}%`, backgroundColor: PALETTE[r.name] }} />
                  </div>
                  <span className="text-xs text-slate-400 w-12 text-right">{Math.round((WEIGHTS[r.name] ?? 0) * 100)}%</span>
                </div>
                <div className="text-xs text-slate-400">{displayMetric(r)}</div>
              </div>
            ))}
          </div>
        </div>
      ) : (
        <div>
          <div className="card p-3 bg-slate-900/40 mb-4">
            <div className="text-sm font-semibold text-slate-200 mb-3">Component breakdown — sub‑scores</div>
            {sorted.map((r) => (
              <div key={r.name} data-testid={`breakbar-${r.name}`} tabIndex={0} role="button" aria-label={`${r.name} — ${Math.round(r.value)} out of 100. ${displayMetric(r)}`} className="relative flex items-center gap-4 py-3 group hover:scale-[1.01] transition-transform duration-200" onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') e.currentTarget.click(); }}>
                <div className="w-48 text-sm font-medium text-slate-100">{r.name}</div>

                <div className="flex-1">
                  <div className="relative h-6 bg-slate-800 rounded overflow-hidden">
                    <div className="h-6 rounded flex items-center justify-center" style={{ width: `${r.value}%`, transition: 'width .4s ease', backgroundColor: PALETTE[r.name] }}>
                      {r.value > 30 && <span className="text-xs font-semibold text-slate-900">{Math.round(r.value)}</span>}
                    </div>

                    {/* visible on hover/focus for keyboard users */}
                    <div className="absolute -top-8 left-0 hidden group-hover:block group-focus:block rounded bg-slate-800/90 px-2 py-1 text-xs text-slate-100 shadow z-10">
                      {displayMetric(r)} • {Math.round(r.value)} / 100
                    </div>
                  </div>

                  <div className="mt-2 flex items-center justify-between text-xs text-slate-400">
                    <div>{displayMetric(r)}</div>
                    <div className="text-right"><strong>{Math.round((WEIGHTS[r.name] ?? 0) * 100)}%</strong> weight</div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="card p-3">
            <div className="text-sm font-semibold text-slate-200 mb-3">Summary table</div>
            <div className="overflow-x-auto">
              <table className="w-full text-xs">
                <thead>
                  <tr className="text-slate-400 border-b border-slate-700">
                    <th className="text-left py-2">Component</th>
                    <th className="text-left py-2">Metric</th>
                    <th className="text-center py-2">Score</th>
                    <th className="text-center py-2">Weight</th>
                  </tr>
                </thead>
                <tbody>
                  {sorted.map((r) => (
                    <tr key={r.name} className="text-slate-300 border-b border-slate-800">
                      <td className="py-2">{r.name}</td>
                      <td className="py-2">{displayMetric(r)}</td>
                      <td className="text-center py-2 font-semibold">{Math.round(r.value)}</td>
                      <td className="text-center py-2">{Math.round((WEIGHTS[r.name] ?? 0) * 100)}%</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          <div className="text-xs text-slate-400 mt-2">Fix the longest bar first — biggest visual impact on your score.</div>
        </div>
      )}
    </div>
  );
}
