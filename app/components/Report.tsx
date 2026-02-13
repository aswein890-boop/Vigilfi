'use client';
import React from 'react';
import { ScoreResult, Inputs } from '../../lib/score';

export default function Report({ inputs, result }: { inputs: Inputs; result: ScoreResult }) {
  return (
    <div style={{ width: '100%', padding: 20, color: '#e6eef8', background: '#081026' }}>
      <div style={{ maxWidth: 760, margin: '0 auto', fontFamily: 'Inter, system-ui' }}>
        <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
          <div>
            <h2 style={{ margin: 0, fontSize: 20 }}>VigilFi — Financial Resilience Report</h2>
            <div style={{ color: '#9aa6b2', fontSize: 12, marginTop: 6 }}>Client-side assessment — no data stored</div>
          </div>
          <div style={{ textAlign: 'right' }}>
            <div style={{ fontSize: 26, fontWeight: 800 }}>{result.score}</div>
            <div style={{ color: '#9aa6b2', fontSize: 12 }}>Score</div>
          </div>
        </header>

        <section style={{ marginTop: 6, pageBreakInside: 'avoid' }}>
          <h3 style={{ margin: '8px 0' }}>Summary</h3>
          <p style={{ color: '#9aa6b2', marginTop: 6 }}>
            If your income stopped today, your liquid savings of ${inputs.liquidSavings.toLocaleString()} would cover approximately{' '}
            <strong>{result.survivalMonths} months</strong> ({result.survivalDays} days) of mandatory expenses.
          </p>
        </section>

        <section style={{ marginTop: 12, display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, pageBreakInside: 'avoid' }}>
          <div style={{ background: 'rgba(255,255,255,0.02)', padding: 12, borderRadius: 8 }}>
            <strong>Monthly income</strong>
            <div style={{ marginTop: 6 }}>${inputs.monthlyIncome.toLocaleString()}</div>
          </div>
          <div style={{ background: 'rgba(255,255,255,0.02)', padding: 12, borderRadius: 8 }}>
            <strong>Mandatory monthly</strong>
            <div style={{ marginTop: 6 }}>${(inputs.monthlyEssentials + inputs.monthlyDebt).toLocaleString()}</div>
          </div>
          <div style={{ background: 'rgba(255,255,255,0.02)', padding: 12, borderRadius: 8 }}>
            <strong>City cost index</strong>
            <div style={{ marginTop: 6 }}>{(inputs.cityIndex ?? 1).toFixed(2)}</div>
          </div>
          <div style={{ background: 'rgba(255,255,255,0.02)', padding: 12, borderRadius: 8 }}>
            <strong>Dependents</strong>
            <div style={{ marginTop: 6 }}>{inputs.dependents ?? 0}</div>
          </div>
        </section>

        <section style={{ marginTop: 18, pageBreakAfter: 'always' }}>
          <h4 style={{ marginBottom: 8 }}>Detailed breakdown</h4>
          <table style={{ width: '100%', borderCollapse: 'collapse', color: '#e6eef8' }}>
            <thead>
              <tr style={{ textAlign: 'left', color: '#9aa6b2' }}>
                <th style={{ padding: '6px 0' }}>Component</th>
                <th style={{ padding: '6px 0' }}>Value</th>
                <th style={{ padding: '6px 0' }}>Weight</th>
                <th style={{ padding: '6px 0' }}>Contribution</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td style={{ padding: '8px 0' }}>Emergency coverage</td>
                <td style={{ padding: '8px 0' }}>{result.breakdown.emergencyCoverage} months</td>
                <td style={{ padding: '8px 0' }}>40%</td>
                <td style={{ padding: '8px 0' }}>{Math.round(result.breakdown.emergencyCoverage * 0.4 * 10) / 10} pts</td>
              </tr>
              <tr>
                <td style={{ padding: '8px 0' }}>Debt pressure</td>
                <td style={{ padding: '8px 0' }}>{result.breakdown.debtPressure}% of income</td>
                <td style={{ padding: '8px 0' }}>20%</td>
                <td style={{ padding: '8px 0' }}>{Math.round((100 - result.breakdown.debtPressure) * 0.2 * 10) / 10} pts</td>
              </tr>
              <tr>
                <td style={{ padding: '8px 0' }}>Savings health</td>
                <td style={{ padding: '8px 0' }}>{result.breakdown.savingsHealth}</td>
                <td style={{ padding: '8px 0' }}>15%</td>
                <td style={{ padding: '8px 0' }}>{Math.round(result.breakdown.savingsHealth * 0.15 * 10) / 10} pts</td>
              </tr>
              <tr>
                <td style={{ padding: '8px 0' }}>Income stability</td>
                <td style={{ padding: '8px 0' }}>{result.breakdown.incomeStability}</td>
                <td style={{ padding: '8px 0' }}>10%</td>
                <td style={{ padding: '8px 0' }}>{Math.round(result.breakdown.incomeStability * 0.1 * 10) / 10} pts</td>
              </tr>
              <tr>
                <td style={{ padding: '8px 0' }}>Location cost risk</td>
                <td style={{ padding: '8px 0' }}>{result.breakdown.costRisk}</td>
                <td style={{ padding: '8px 0' }}>10%</td>
                <td style={{ padding: '8px 0' }}>{Math.round(result.breakdown.costRisk * 0.1 * 10) / 10} pts</td>
              </tr>
              <tr>
                <td style={{ padding: '8px 0' }}>Dependents impact</td>
                <td style={{ padding: '8px 0' }}>{result.breakdown.dependentsImpact}</td>
                <td style={{ padding: '8px 0' }}>5%</td>
                <td style={{ padding: '8px 0' }}>{Math.round(result.breakdown.dependentsImpact * 0.05 * 10) / 10} pts</td>
              </tr>
            </tbody>
          </table>
        </section>

        <section style={{ pageBreakInside: 'avoid' }}>
          <h4>Inputs (as entered)</h4>
          <ul>
            <li>Monthly take‑home income: ${inputs.monthlyIncome.toLocaleString()}</li>
            <li>Monthly essentials: ${inputs.monthlyEssentials.toLocaleString()}</li>
            <li>Monthly debt: ${inputs.monthlyDebt.toLocaleString()}</li>
            <li>Liquid savings: ${inputs.liquidSavings.toLocaleString()}</li>
            <li>City cost index: {(inputs.cityIndex ?? 1).toFixed(2)}</li>
            <li>Dependents: {inputs.dependents}</li>
            <li>Job stability: {inputs.jobStability}</li>
          </ul>
        </section>

        <section style={{ marginTop: 16 }}>
          <h4>Recommendations</h4>
          <ul>
            {result.recommendations.length ? (
              result.recommendations.map((r, i) => <li key={i}>{r}</li>)
            ) : (
              <li>Maintain liquidity and continue monitoring.</li>
            )}
          </ul>
        </section>

        <footer style={{ marginTop: 22, color: '#9aa6b2', fontSize: 12 }}>
          <div>Methodology: See Scoring Methodology in the app — results are estimates and intended for planning only.</div>
        </footer>
      </div>
    </div>
  );
}
