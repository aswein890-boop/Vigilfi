'use client';

import React, { useMemo, useState, useCallback, useEffect } from 'react';
import { motion } from 'framer-motion';
import dynamic from 'next/dynamic';
import Gauge from './components/Gauge';
import BreakdownChart from './components/BreakdownChart';
import Report from './components/Report';
import InputForm from './components/InputForm';
import { computeResilienceScore, Inputs } from '../lib/score';

const DynamicReport = dynamic(() => import('./components/Report'), { ssr: false });

/**
 * VigilFi Main Financial Resilience Assessment Page
 * Client-side calculator with responsive UI, PDF export, and scoring breakdown
 */
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

  // Persist inputs to localStorage and broadcast to other components
  useEffect(() => {
    try {
      localStorage.setItem('vigilfi:inputs', JSON.stringify(values));
      window.dispatchEvent(new CustomEvent('vigilfi:inputs', { detail: values }));
    } catch {
      // Silently fail if localStorage is unavailable
    }
  }, [values]);

  const exportPdf = useCallback(async () => {
    const element = document.getElementById('report-full');
    if (!element) return;

    try {
      const [{ default: html2canvas }, { default: jsPDF }] = await Promise.all([
        import('html2canvas'),
        import('jspdf')
      ]);

      const canvas = await html2canvas(element as HTMLElement, {
        scale: 2,
        useCORS: true,
        backgroundColor: '#081026'
      });

      const imgData = canvas.toDataURL('image/png');
      const pdf = new jsPDF({
        orientation: 'portrait',
        unit: 'pt',
        format: 'letter'
      });

      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = pdf.internal.pageSize.getHeight();
      const imgWidth = canvas.width;
      const imgHeight = canvas.height;
      const renderedHeight = (imgHeight * pdfWidth) / imgWidth;

      if (renderedHeight <= pdfHeight) {
        pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, renderedHeight);
      } else {
        // Multi-page PDF for long reports
        const ratio = imgWidth / pdfWidth;
        const sliceHeight = Math.floor(pdfHeight * ratio);
        let yPosition = 0;

        while (yPosition < imgHeight) {
          const height = Math.min(sliceHeight, imgHeight - yPosition);
          const pageCanvas = document.createElement('canvas');
          pageCanvas.width = imgWidth;
          pageCanvas.height = height;

          const ctx = pageCanvas.getContext('2d');
          if (ctx) {
            ctx.drawImage(canvas, 0, yPosition, imgWidth, height, 0, 0, imgWidth, height);
            const pageData = pageCanvas.toDataURL('image/png');
            const pageHeight = height / ratio;
            pdf.addImage(pageData, 'PNG', 0, 0, pdfWidth, pageHeight);

            if (yPosition + height < imgHeight) {
              pdf.addPage();
            }
          }

          yPosition += height;
        }
      }

      const filename = `vigilfi-report-${new Date().toISOString().split('T')[0]}.pdf`;
      pdf.save(filename);
    } catch (error) {
      console.error('PDF export failed:', error);
    }
  }, []);

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8" id="calculator">
      {/* Main calculation section */}
      <section className="lg:col-span-2 space-y-6">
        <InputForm values={values} onChange={(next) => setValues(next)} />

        {/* Score display panel */}
        <div className="card flex flex-col md:flex-row items-center gap-6">
          <div className="w-36 md:w-56 flex-shrink-0">
            <Gauge value={result.score} />
          </div>

          <div className="flex-1">
            <h3 className="text-lg font-semibold">
              {result.tier} • {result.score}/100
            </h3>
            <p className="small mt-2">
              Survival: <strong>
                <motion.span
                  key={result.survivalMonths}
                  initial={{ opacity: 0.2 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.35 }}
                >
                  {result.survivalMonths}
                </motion.span>
                {' '}months
              </strong> ({result.survivalDays} days)
            </p>

            <div className="mt-4 grid grid-cols-2 gap-3 small text-slate-300">
              {[
                { label: 'Emergency', value: result.breakdown.emergencyCoverage },
                { label: 'Debt Pressure', value: result.breakdown.debtPressure },
                { label: 'Savings Health', value: result.breakdown.savingsHealth },
                { label: 'Income Stability', value: result.breakdown.incomeStability }
              ].map(({ label, value }) => (
                <motion.div
                  key={label}
                  layout
                  className="p-3 bg-[rgba(255,255,255,0.02)] rounded"
                >
                  {label}:{' '}
                  <motion.span
                    key={value}
                    initial={{ opacity: 0.2 }}
                    animate={{ opacity: 1 }}
                  >
                    {value}
                  </motion.span>
                </motion.div>
              ))}
            </div>

            <div className="mt-4 flex gap-3">
              <button
                onClick={exportPdf}
                className="px-4 py-2 rounded bg-accent text-black font-semibold hover:bg-yellow-400 transition-colors"
              >
                Export PDF
              </button>
              <a
                href="#docs"
                className="px-4 py-2 rounded border border-neutral-700 text-sm hover:border-accent transition-colors"
              >
                Read methodology
              </a>
            </div>
          </div>
        </div>

        {/* Personalized recommendations */}
        <div className="card">
          <h4 className="font-semibold">Personalized recommendations</h4>
          <ul className="mt-3 list-disc pl-5 small text-slate-300">
            {result.recommendations.length > 0 ? (
              result.recommendations.map((rec, idx) => <li key={idx}>{rec}</li>)
            ) : (
              <li>You're in a strong position — maintain liquidity and monitor debt.</li>
            )}
          </ul>
        </div>
      </section>

      {/* Sidebar with breakdown and details */}
      <aside>
        <div className="card mb-6">
          <h4 className="font-semibold mb-4">Score breakdown</h4>
          <BreakdownChart result={result} inputs={values} />
          <div className="mt-3 small text-slate-400">
            Interactive chart showing each component's sub-score and relative importance.
          </div>
        </div>

        <div className="card mb-6">
          <h4 className="font-semibold">Survival timeline</h4>
          <div className="mt-3 small text-slate-300">
            Your liquid savings would cover mandatory expenses for:
          </div>
          <div className="mt-4 text-2xl font-bold">{result.survivalMonths} months</div>
          <div className="mt-3 small text-slate-400">Tier: {result.tier}</div>
        </div>

        <div className="card">
          <h4 className="font-semibold">How we calculate this</h4>
          <p className="small mt-2 text-slate-300">
            All calculations run client-side. Your data is never stored or transmitted.
          </p>
        </div>

        {/* Hidden report for PDF export */}
        <div
          id="report-full"
          style={{
            position: 'absolute',
            left: -9999,
            top: 0,
            width: 800,
            display: 'block'
          }}
          aria-hidden="true"
        >
          <Report inputs={values} result={result} />
        </div>
      </aside>

      {/* How it works section */}
      <section className="lg:col-span-3 mt-6 card" id="how">
        <h3 className="text-lg font-bold">How VigilFi calculates your Financial Resilience Score</h3>
        <p className="small mt-2 text-slate-300">
          VigilFi combines survival runway with a weighted scoring model across six key financial indicators.
        </p>

        <article className="mt-4 prose prose-invert max-w-none text-slate-300 space-y-4">
          <h4>Why Financial Resilience Matters</h4>
          <p>
            Unexpected shocks—job loss, medical bills, vehicle repairs—are common. A clear assessment of how long your liquid savings can sustain you turns uncertainty into actionable planning.
          </p>

          <h4>Survival Runway Calculation</h4>
          <p>
            Your survival runway is calculated by dividing liquid savings by adjusted monthly mandatory expenses (housing, insurance, minimum debt payments, utilities). Adjustments account for local cost of living and conservative risk factors.
          </p>

          <h4>The Six Components</h4>
          <ul className="mt-2 space-y-2">
            <li><strong>Emergency coverage (40%):</strong> Months of mandatory expenses covered by liquid savings.</li>
            <li><strong>Debt pressure (20%):</strong> Percentage of income consumed by debt payments.</li>
            <li><strong>Savings health (15%):</strong> Your monthly savings rate and buffer momentum.</li>
            <li><strong>Income stability (10%):</strong> Job security and income predictability.</li>
            <li><strong>Cost risk (10%):</strong> Local cost of living relative to baseline.</li>
            <li><strong>Dependents (5%):</strong> Impact of household size on per-person buffer.</li>
          </ul>

          <h4>Scoring Formula</h4>
          <p>
            Each component is scored 0–100 on a non-linear scale emphasizing practical thresholds (3, 6, and 12 months of survival). The final score is a weighted average reflecting financial priorities.
          </p>

          <h4>Limitations</h4>
          <p>
            This tool is for planning purposes only. It assumes no new income, uses conservative assumptions, and does not account for investments or tax implications. Consult a financial advisor for complex situations.
          </p>
        </article>
      </section>

      {/* Disclaimer Section */}
      <section className="lg:col-span-3 mt-12" id="disclaimer">
        <div className="card">
          <h3 className="text-lg font-bold">Disclaimer</h3>
          <p className="mt-4 text-slate-300">
            VigilFi is an educational assessment tool provided for informational purposes only. It does not constitute financial, investment, or legal advice. Calculations are based on inputs you provide and use conservative assumptions. Actual financial outcomes may vary substantially. Consult a qualified financial advisor before making major financial decisions.
          </p>
        </div>
      </section>

      {/* Methodology Section */}
      <section className="lg:col-span-3 mt-6" id="docs">
        <div className="card">
          <h3 className="text-lg font-bold">Scoring Methodology</h3>
          <div className="mt-4 text-slate-300 space-y-3">
            <div>
              <strong>Emergency Coverage:</strong> Calculates months your liquid savings cover mandatory expenses using a non-linear scale. Longer runways receive exponentially higher scores.
            </div>
            <div>
              <strong>Debt Pressure:</strong> Measures debt-to-income ratio. Higher ratios reduce financial flexibility.
            </div>
            <div>
              <strong>Savings Health:</strong> Combines savings buffer (65% weight) with monthly savings momentum (35% weight).
            </div>
            <div>
              <strong>Income Stability:</strong> Categorical scoring based on employment type (stable/variable/at-risk).
            </div>
            <div>
              <strong>Cost Risk:</strong> Adjusts for local cost of living. Higher costs reduce runway for the same nominal savings.
            </div>
            <div>
              <strong>Dependents:</strong> Accounts for household size affecting per-person buffer and mandatory expenses.
            </div>
            <div className="mt-4 pt-4 border-t border-slate-800">
              <strong>Privacy:</strong> Your data never leaves your browser. All calculations run client-side. Close the tab and your information is gone.
            </div>
          </div>
        </div>
      </section>

      {/* About Section */}
      <section className="lg:col-span-3 mt-6" id="about">
        <div className="card">
          <h3 className="text-lg font-bold">About VigilFi</h3>
          <p className="mt-4 text-slate-300">
            VigilFi helps you understand your financial resilience in minutes. Whether you're building an emergency fund, managing debt, or planning for the future, our tool provides clear, actionable insights into your financial runway.
          </p>
          <p className="mt-3 text-slate-300">
            Financial planning doesn't require complex spreadsheets or expensive advisors. Our calculator answers the core questions: How long can my savings last? What's my biggest risk? What should I fix first?
          </p>
        </div>
      </section>
    </div>
  );
}

