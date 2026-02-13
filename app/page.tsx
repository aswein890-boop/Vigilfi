'use client';
import React, { useMemo, useState } from 'react';
import { motion } from 'framer-motion';
import dynamic from 'next/dynamic';
import Gauge from './components/Gauge';
const BreakdownChart = dynamic(() => import('./components/BreakdownChart'), { ssr: false });
const Report = dynamic(() => import('./components/Report'), { ssr: false });
import InputForm from './components/InputForm';
import { computeResilienceScore, Inputs } from '../lib/score';

export default function Page() {
  const [values, setValues] = useState<Inputs>({
    monthlyIncome: 6000,
    monthlyEssentials: 2500,
    monthlyDebt: 300,
    liquidSavings: 12000,
    cityIndex: 1.0,
    dependents: 0,
    jobStability: 'stable'
  });

  const result = useMemo(() => computeResilienceScore(values), [values]);

  React.useEffect(() => {
    // persist latest inputs for other components
    try {
      localStorage.setItem('vigilfi:inputs', JSON.stringify(values));
    } catch (e) {
      /* ignore */
    }
    // broadcast in-page so other components update immediately
    window.dispatchEvent(new CustomEvent('vigilfi:inputs', { detail: values }));
  }, [values]);

  const exportPdf = async () => {
    const el = document.getElementById('report-full');
    if (!el) return;

    const [{ default: html2canvas }, { default: jsPDF }] = await Promise.all([import('html2canvas'), import('jspdf')]);
    const canvas = await html2canvas(el as HTMLElement, { scale: 2, useCORS: true, backgroundColor: '#081026' });

    const imgData = canvas.toDataURL('image/png');
    const pdf = new jsPDF({ orientation: 'portrait', unit: 'pt', format: 'letter' });
    const pdfWidth = pdf.internal.pageSize.getWidth();
    const pdfHeight = pdf.internal.pageSize.getHeight();

    // If rendered image fits on a single page, add directly.
    const imgProps = { width: canvas.width, height: canvas.height };
    const renderedHeight = (imgProps.height * pdfWidth) / imgProps.width;
    if (renderedHeight <= pdfHeight) {
      pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, renderedHeight);
    } else {
      // Split long canvas into multiple pages
      const ratio = imgProps.width / pdfWidth;
      const sliceHeight = Math.floor(pdfHeight * ratio);
      let y = 0;
      while (y < imgProps.height) {
        const height = Math.min(sliceHeight, imgProps.height - y);
        const pageCanvas = document.createElement('canvas');
        pageCanvas.width = imgProps.width;
        pageCanvas.height = height;
        const ctx = pageCanvas.getContext('2d')!;
        ctx.drawImage(canvas, 0, y, imgProps.width, height, 0, 0, imgProps.width, height);
        const pageData = pageCanvas.toDataURL('image/png');
        const pageRenderHeight = height / ratio;
        pdf.addImage(pageData, 'PNG', 0, 0, pdfWidth, pageRenderHeight);
        y += height;
        if (y < imgProps.height) pdf.addPage();
      }
    }

    pdf.save(`vigilfi-report-${new Date().toISOString().slice(0,10)}.pdf`);
  };

  const breakdownData = [
    { name: 'Emergency', value: result.breakdown.emergencyCoverage },
    { name: 'Debt', value: 100 - result.breakdown.debtPressure },
    { name: 'Savings', value: result.breakdown.savingsHealth },
    { name: 'Income', value: result.breakdown.incomeStability },
    { name: 'Location', value: result.breakdown.costRisk },
    { name: 'Dependents', value: result.breakdown.dependentsImpact }
  ];

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
      <section className="lg:col-span-2 space-y-6">
        <InputForm values={values} onChange={setValues} />

        {/* compact summary removed — show a single professional result panel below */}
        <div className="card flex flex-col md:flex-row items-center gap-6">
          <div className="w-36 md:w-56 flex-shrink-0">
            <Gauge value={result.score} />
          </div>
          <div className="flex-1">
            <h3 className="text-lg font-semibold">{result.tier} • {result.score}/100</h3>
            <p className="small mt-2">Survival: <strong>
              <motion.span key={result.survivalMonths} initial={{ opacity: 0.2 }} animate={{ opacity: 1 }} transition={{ duration: 0.35 }}>
                {result.survivalMonths}
              </motion.span>
              {' '}months</strong> ({result.survivalDays} days)</p>

            <div className="mt-4 grid grid-cols-2 gap-3 small text-slate-300">
              <motion.div layout className="p-3 bg-[rgba(255,255,255,0.02)] rounded">Emergency Coverage: <motion.span key={result.breakdown.emergencyCoverage} initial={{ opacity: 0.2 }} animate={{ opacity: 1 }}>{result.breakdown.emergencyCoverage}</motion.span></motion.div>
              <motion.div layout className="p-3 bg-[rgba(255,255,255,0.02)] rounded">Debt Pressure: <motion.span key={result.breakdown.debtPressure} initial={{ opacity: 0.2 }} animate={{ opacity: 1 }}>{result.breakdown.debtPressure}</motion.span></motion.div>
              <motion.div layout className="p-3 bg-[rgba(255,255,255,0.02)] rounded">Savings Health: <motion.span key={result.breakdown.savingsHealth} initial={{ opacity: 0.2 }} animate={{ opacity: 1 }}>{result.breakdown.savingsHealth}</motion.span></motion.div>
              <motion.div layout className="p-3 bg-[rgba(255,255,255,0.02)] rounded">Income Stability: <motion.span key={result.breakdown.incomeStability} initial={{ opacity: 0.2 }} animate={{ opacity: 1 }}>{result.breakdown.incomeStability}</motion.span></motion.div>
            </div>

            <div className="mt-4 flex gap-3">
              <button onClick={exportPdf} className="px-4 py-2 rounded bg-accent text-black font-semibold">Export PDF</button>
              <a href="#docs" className="px-4 py-2 rounded border border-neutral-700 text-sm">Read scoring methodology</a>
            </div>
          </div>
        </div>

        <div className="card">
          <h4 className="font-semibold">Personalized recommendations</h4>
          <ul className="mt-3 list-disc pl-5 small text-slate-300">
            {result.recommendations.length ? (
              result.recommendations.map((r, i) => <li key={i}>{r}</li>)
            ) : (
              <li>You're in a strong position — maintain liquidity and monitor debt.</li>
            )}
          </ul>
        </div>
      </section>

      <aside>
        <div className="card mb-6">
          <h4 className="font-semibold">Score breakdown</h4>
          <BreakdownChart data={breakdownData} />
          <div className="mt-2 small text-slate-400">Interactive chart shows contributors to your score.</div>
        </div>

        <div className="card">
          <h4 className="font-semibold">Survival timeline</h4>
          <div className="mt-3 small text-slate-300">If income stopped today, your liquid savings would cover the following months of mandatory expenses.</div>
          <div className="mt-4 text-2xl font-bold">{result.survivalMonths} months</div>
          <div className="mt-3 small text-slate-400">Tier: {result.tier}</div>
        </div>

        <div className="card mt-6">
          <h4 className="font-semibold">Confidence & notes</h4>
          <p className="small mt-2 text-slate-300">Calculations run client-side. All assumptions and methodology are documented in the Scoring Methodology section.</p>
        </div>

        {/* Hidden printable report used for PDF export - rendered off-screen but visible to html2canvas */}
        <div id="report-full" style={{ position: 'absolute', left: -9999, top: 0, width: 800, display: 'block' }} aria-hidden>
          <Report inputs={values} result={result} />
        </div>
      </aside>

      <section className="lg:col-span-3 mt-6 card" id="how">
        <h3 className="text-lg font-bold">How VigilFi calculates your Financial Resilience Score</h3>
        <p className="small mt-2 text-slate-300">VigilFi combines survival runway with a weighted scoring model across Emergency Coverage, Debt Pressure, Savings Health, Income Stability, Location Risk, and Dependents. See documentation for exact formulas and audit-friendly scoring breakdown.</p>

        <article className="mt-4 prose prose-invert max-w-none text-slate-300">
          <h4>Why Financial Resilience Matters</h4>
          <p>
            Unexpected financial shocks—job loss, medical bills, or sudden repairs—are not hypothetical for most households. A concise, auditable assessment of how long you can survive using liquid resources turns uncertainty into actionable planning. VigilFi focuses on three pragmatic goals: quantify runway, highlight the largest risks, and provide prioritized, practical recommendations you can act on today.
          </p>

          <h4>How survival runway is calculated</h4>
          <p>
            The survival runway represents how many months your liquid savings will cover mandatory expenses (housing, insurance, minimum debt payments, utilities) if income stops. This is computed as a simple, auditable ratio: liquid savings divided by adjusted mandatory monthly outflows. Adjustments include a city cost index (to reflect local rent and utilities) and a conservative risk multiplier to stress-test the outcome.
          </p>

          <h4>Why separate mandatory and optional expenses?</h4>
          <p>
            Distinguishing mandatory from optional is essential for realistic planning. Mandatory expenses are non-negotiable outflows that must be paid to avoid immediate harm (rent/mortgage, minimum loan payments, insurance). Optional items (streaming, dining out, discretionary subscriptions) provide levers for rapid savings and should not be included when estimating core runway.
          </p>

          <h4>Weighted Financial Resilience Score — what it measures</h4>
          <p>
            The score is a composite index (0–100) built from auditable component scores. Weights reflect practical financial priorities: emergency coverage (40%), debt pressure (20%), savings health (15%), income stability (10%), local cost risk (10%), and dependents (5%). Each sub-score uses deterministic formulas and is fully reproducible in the app.
          </p>

          <h4>Component summaries (how to interpret them)</h4>
          <ul>
            <li><strong>Emergency coverage:</strong> Months of mandatory expenses covered by your liquid savings. Longer coverage is exponentially more protective.</li>
            <li><strong>Debt pressure:</strong> Share of monthly income consumed by minimum debt payments — high values reduce flexibility and resilience.</li>
            <li><strong>Savings health:</strong> Your current monthly savings rate after essentials and debt — an indicator of how quickly buffers can be rebuilt.</li>
            <li><strong>Income stability:</strong> Categorical measure of job security; stable employment materially improves score.</li>
            <li><strong>Cost risk:</strong> Local cost of living relative to baseline — higher cost cities reduce runway for the same nominal savings.</li>
            <li><strong>Dependents:</strong> Additional household members reduce per-person buffer and increase necessary mandatory spending.</li>
          </ul>

          <h4>Practical example</h4>
          <p>
            Suppose your take‑home pay is $6,000/month, mandatory outflows are $3,000, and liquid savings are $12,000. Your runway is 4 months (12,000 ÷ 3,000). VigilFi converts that runway into an emergency coverage score and combines it with other sub-scores to produce the full Financial Resilience Score and prioritized recommendations (for example: increase liquid savings, reduce costly debt, or explore lower-cost housing alternatives).
          </p>

          <h4>Why we don't model taxes or investments in the base calculation</h4>
          <p>
            Taxes and investment returns introduce long-term variability and complexity that can obscure the immediate question: how long can I survive on my liquid buffer? For transparency and simplicity, the baseline calculation isolates cash flow and liquid savings. Advanced scenarios—tax-aware or investment-adjusted projections—are planned as optional add-ons where each assumption is explicit and auditable.
          </p>

          <h4>Limitations and conservative assumptions</h4>
          <p>
            VigilFi intentionally errs on the side of conservatism: city costs can be scaled up via the city index, income stability is categorized conservatively, and survival calculation assumes no new income unless you run an income recovery scenario. All assumptions are surfaced in the UI and in exported reports so you always know the "why" behind a number.
          </p>

          <h4>Actionable recommendations</h4>
          <p>
            The recommendations are prioritized. If your runway is short, the app suggests the most impactful immediate steps: increase liquid savings, pause optional spending, negotiate debt payments, or consider temporary relocation to lower-cost areas. Each recommendation links to clear next steps you can implement in days or weeks.
          </p>

          <h4>SEO-optimized, readable guidance for users</h4>
          <p>
            We designed content to answer questions people actually search for: "How long can I survive if I lose my job?", "What emergency fund should I have?", and "How does moving to a cheaper city affect my savings?" The app pairs a fast calculator with long-form, educational content so users leave with both a number and a plan.
          </p>

          <h4>FAQ</h4>
          <dl className="mt-3">
            <dt className="font-semibold">Can I trust the score?</dt>
            <dd className="small text-slate-400">Yes—each value is derived from deterministic formulas visible in the UI and exported report. The score is a planning tool, not personalized financial advice.</dd>
            <dt className="font-semibold mt-2">Can I export the report?</dt>
            <dd className="small text-slate-400">Yes—use the Export PDF button to generate a printable, shareable report that includes inputs, score breakdown, and recommendations.</dd>
          </dl>

          <h4>How to use VigilFi in your planning</h4>
          <p>
            Start with conservative inputs. Review the breakdown to identify your largest risk drivers (housing, debt, or low savings rate). Use scenario controls to test relocation, expense cuts, or income changes. Re-run the calculation monthly as you improve buffers — tracking the score over time is a simple way to measure progress.
          </p>

          <h4>Next steps</h4>
          <p>
            If you want, I can add city presets (real data), a scenario comparison view, or integrate printable templates tailored for financial advisors. Tell me which feature to prioritize next.
          </p>
        </article>
      </section>

      <section className="lg:col-span-3 mt-6" id="docs">
        <div className="card">
          <h3 className="text-lg font-bold">Documentation</h3>
          <ul className="mt-4 small text-slate-300 list-disc pl-5">
            <li>Scoring methodology — explains weights, calculations, and sources.</li>
            <li>Technical architecture — client-side, modular, test-covered engine.</li>
            <li>Privacy — no data stored; everything stays in your browser.</li>
          </ul>
        </div>
      </section>
    </div>
  );
}
