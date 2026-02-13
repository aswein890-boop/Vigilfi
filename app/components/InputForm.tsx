'use client';
import React from 'react';

type Props = {
  values: {
    monthlyIncome: number;
    monthlyEssentials: number;
    monthlyDebt: number;
    liquidSavings: number;
    cityIndex: number;
    dependents: number;
    jobStability: string;
  };
  onChange: (next: any) => void;
};

export default function InputForm({ values, onChange }: Props) {
  return (
    <div className="card">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div>
          <label htmlFor="monthlyIncome" className="small font-semibold">Monthly take‑home income</label>
          <div className="mt-2 input-group">
            <span className="input-icon" aria-hidden="true">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M12 1v22" stroke="#F59E0B" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M17 5H9a3 3 0 000 6h6a3 3 0 010 6H7" stroke="#F59E0B" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </span>
            <input
              id="monthlyIncome"
              aria-label="Monthly take-home income"
              className="input with-icon"
              type="number"
              min={0}
              step={1}
              value={values.monthlyIncome}
              onChange={(e) => onChange({ ...values, monthlyIncome: Number(e.target.value) })}
            />
          </div>
          <div className="small mt-1 text-slate-400">Net take-home pay after taxes & benefits</div>
        </div>

        <div>
          <label htmlFor="monthlyEssentials" className="small font-semibold">Monthly essential expenses</label>
          <div className="mt-2 input-group">
            <span className="input-icon" aria-hidden>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M3 7h18M6 7v10a2 2 0 002 2h8a2 2 0 002-2V7" stroke="#F59E0B" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </span>
            <input
              id="monthlyEssentials"
              aria-label="Monthly essential expenses"
              className="input with-icon"
              type="number"
              min={0}
              step={1}
              value={values.monthlyEssentials}
              onChange={(e) => onChange({ ...values, monthlyEssentials: Number(e.target.value) })}
            />
          </div>
          <div className="small mt-1 text-slate-400">Housing, utilities, groceries, insurance</div>
        </div>

        <div>
          <label htmlFor="monthlyDebt" className="small font-semibold">Monthly debt payments</label>
          <div className="mt-2 input-group">
            <span className="input-icon" aria-hidden>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4" stroke="#F59E0B" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M7 10l5 5 5-5" stroke="#F59E0B" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </span>
            <input
              id="monthlyDebt"
              aria-label="Monthly debt payments"
              className="input with-icon"
              type="number"
              min={0}
              step={1}
              value={values.monthlyDebt}
              onChange={(e) => onChange({ ...values, monthlyDebt: Number(e.target.value) })}
            />
          </div>
          <div className="small mt-1 text-slate-400">Minimum payments (cards, loans, student)</div>
        </div>

        <div>
          <label htmlFor="liquidSavings" className="small font-semibold">Total liquid savings</label>
          <div className="mt-2 input-group">
            <span className="input-icon" aria-hidden>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <circle cx="12" cy="12" r="9" stroke="#F59E0B" strokeWidth="1.2"/>
                <path d="M8 12h8M12 8v8" stroke="#F59E0B" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </span>
            <input
              id="liquidSavings"
              aria-label="Total liquid savings"
              className="input with-icon"
              type="number"
              min={0}
              step={100}
              value={values.liquidSavings}
              onChange={(e) => onChange({ ...values, liquidSavings: Number(e.target.value) })}
            />
          </div>
          <div className="small mt-1 text-slate-400">Cash & easily accessible accounts</div>
        </div>

        <div>
          <label htmlFor="cityIndex" className="small font-semibold">City cost index</label>
          <input
            id="cityIndex"
            aria-label="City cost index"
            className="w-full mt-2"
            type="range"
            min={0.5}
            max={2}
            step={0.05}
            value={values.cityIndex}
            onChange={(e) => onChange({ ...values, cityIndex: Number(e.target.value) })}
          />
          <div className="small mt-1 text-slate-400">Index (0.5 = very cheap, 1 = baseline, 2 = very expensive)</div>
        </div>

        <div>
          <label htmlFor="dependents" className="small font-semibold">Dependents</label>
          <div className="mt-2 input-group">
            <span className="input-icon" aria-hidden>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M16 11a4 4 0 11-8 0 4 4 0 018 0zM2 21c1.5-4 5-6 10-6s8.5 2 10 6" stroke="#F59E0B" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </span>
            <input
              id="dependents"
              aria-label="Dependents"
              className="input with-icon"
              type="number"
              min={0}
              value={values.dependents}
              onChange={(e) => onChange({ ...values, dependents: Number(e.target.value) })}
            />
          </div>
          <div className="small mt-1 text-slate-400">Number of dependents (children, elders)</div>
        </div>

        <div className="md:col-span-2">
          <label htmlFor="jobStability" className="small font-semibold">Job stability</label>
          <div className="mt-2 relative">
            <select
              id="jobStability"
              aria-label="Job stability"
              className="input mt-0 select-with-icon"
              value={values.jobStability}
              onChange={(e) => onChange({ ...values, jobStability: e.target.value })}
            >
              <option value="stable">Stable</option>
              <option value="variable">Variable</option>
              <option value="at_risk">At risk</option>
            </select>
            <div className="absolute inset-y-0 right-3 flex items-center pointer-events-none">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M6 9l6 6 6-6" stroke="#94A3B8" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </div>
          </div>
          <div className="small mt-1 text-slate-400">Select how predictable your income is</div>
        </div>
      </div>
    </div>
  );
} 
