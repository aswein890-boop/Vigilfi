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
    <div className="bg-slate-800 rounded-lg p-4 text-white">
      <div className="text-center mb-4">
        <h3 className="text-lg font-semibold mb-2">Monthly take in home</h3>
        <p className="text-sm text-slate-300">Enter your financial information to calculate your resilience score</p>
      </div>
      
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-slate-300 mb-2">Monthly Income</label>
          <input
            type="number"
            value={monthlyIncome || ''}
            onChange={(e) => {
              const newInputs = { ...inputs, monthlyIncome: parseFloat(e.target.value) || 0 };
              setInputs(newInputs);
              // Save to localStorage
              localStorage.setItem('vigilfi:inputs', JSON.stringify(newInputs));
            }}
            className="w-full px-3 py-2 bg-slate-700 border border-slate-600 rounded-md text-white"
            placeholder="6000"
          />
        </div>
        
        <div>
          <label className="block text-sm font-medium text-slate-300 mb-2">Monthly Essentials</label>
          <input
            type="number"
            value={monthlyEssentials || ''}
            onChange={(e) => {
              const newInputs = { ...inputs, monthlyEssentials: parseFloat(e.target.value) || 0 };
              setInputs(newInputs);
              localStorage.setItem('vigilfi:inputs', JSON.stringify(newInputs));
            }}
            className="w-full px-3 py-2 bg-slate-700 border border-slate-600 rounded-md text-white"
            placeholder="2500"
          />
        </div>
        
        <div>
          <label className="block text-sm font-medium text-slate-300 mb-2">Monthly Debt</label>
          <input
            type="number"
            value={monthlyDebt || ''}
            onChange={(e) => {
              const newInputs = { ...inputs, monthlyDebt: parseFloat(e.target.value) || 0 };
              setInputs(newInputs);
              localStorage.setItem('vigilfi:inputs', JSON.stringify(newInputs));
            }}
            className="w-full px-3 py-2 bg-slate-700 border border-slate-600 rounded-md text-white"
            placeholder="300"
          />
        </div>
        
        <div>
          <label className="block text-sm font-medium text-slate-300 mb-2">Liquid Savings</label>
          <input
            type="number"
            value={liquidSavings || ''}
            onChange={(e) => {
              const newInputs = { ...inputs, liquidSavings: parseFloat(e.target.value) || 0 };
              setInputs(newInputs);
              localStorage.setItem('vigilfi:inputs', JSON.stringify(newInputs));
            }}
            className="w-full px-3 py-2 bg-slate-700 border border-slate-600 rounded-md text-white"
            placeholder="12000"
          />
        </div>
      </div>
    </div>
  );
}
