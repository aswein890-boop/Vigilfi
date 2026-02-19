"use client";

import React, { useState, useEffect } from 'react';

interface Inputs {
  monthlyIncome: number;
  monthlyEssentials: number;
  monthlyDebt: number;
  liquidSavings: number;
  cityIndex: number;
  dependents: number;
  jobStability: 'stable' | 'variable' | 'seasonal';
}

export default function HeaderSummary() {
  const [inputs, setInputs] = useState<Inputs | null>(null);
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
    
    // Load saved inputs from localStorage
    try {
      const saved = localStorage.getItem('vigilfi:inputs');
      if (saved) {
        setInputs(JSON.parse(saved));
      }
    } catch (e) {
      // Ignore errors
    }

    // Listen for input updates from other components
    const handleInputsUpdate = (event: CustomEvent) => {
      setInputs(event.detail);
    };

    window.addEventListener('vigilfi:inputs', handleInputsUpdate as EventListener);
    
    return () => {
      window.removeEventListener('vigilfi:inputs', handleInputsUpdate as EventListener);
    };
  }, []);

  if (!isClient || !inputs) {
    return null;
  }

  const { monthlyIncome, monthlyEssentials, monthlyDebt, liquidSavings, cityIndex, dependents, jobStability } = inputs;

  return (
    <aside className="card">
      <div className="mb-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-lg font-semibold">Quick inputs</h3>
            <p className="small mt-1">Enter core values to see your score and recommendations update instantly.</p>
          </div>
          <div className="text-right">
            <div className="text-sm text-slate-400">Preview</div>
            <div className="text-2xl font-extrabold">— /100</div>
          </div>
        </div>
      </div>

      <form className="space-y-4" role="form" aria-label="Quick inputs form" onSubmit={(e) => e.preventDefault()}>
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-2">Monthly Income</label>
          <input
            type="number"
            value={monthlyIncome || ''}
            onChange={(e) => {
              const newInputs = { ...inputs, monthlyIncome: parseFloat(e.target.value) || 0 };
              setInputs(newInputs);
              localStorage.setItem('vigilfi:inputs', JSON.stringify(newInputs));
              window.dispatchEvent(new CustomEvent('vigilfi:inputs', { detail: newInputs }));
            }}
            className="input"
            placeholder="6000"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-700 mb-2">Monthly Essentials</label>
          <input
            type="number"
            value={monthlyEssentials || ''}
            onChange={(e) => {
              const newInputs = { ...inputs, monthlyEssentials: parseFloat(e.target.value) || 0 };
              setInputs(newInputs);
              localStorage.setItem('vigilfi:inputs', JSON.stringify(newInputs));
              window.dispatchEvent(new CustomEvent('vigilfi:inputs', { detail: newInputs }));
            }}
            className="input"
            placeholder="2500"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-700 mb-2">Monthly Debt</label>
          <input
            type="number"
            value={monthlyDebt || ''}
            onChange={(e) => {
              const newInputs = { ...inputs, monthlyDebt: parseFloat(e.target.value) || 0 };
              setInputs(newInputs);
              localStorage.setItem('vigilfi:inputs', JSON.stringify(newInputs));
              window.dispatchEvent(new CustomEvent('vigilfi:inputs', { detail: newInputs }));
            }}
            className="input"
            placeholder="300"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-700 mb-2">Liquid Savings</label>
          <input
            type="number"
            value={liquidSavings || ''}
            onChange={(e) => {
              const newInputs = { ...inputs, liquidSavings: parseFloat(e.target.value) || 0 };
              setInputs(newInputs);
              localStorage.setItem('vigilfi:inputs', JSON.stringify(newInputs));
              window.dispatchEvent(new CustomEvent('vigilfi:inputs', { detail: newInputs }));
            }}
            className="input"
            placeholder="12000"
          />
        </div>
      </form>
    </aside>
  );
}
