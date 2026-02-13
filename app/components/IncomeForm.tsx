"use client";

import { useState } from "react";

interface IncomeSource {
  id: string;
  sourceName: string;
  incomeType: "w2" | "1099" | "business" | "investment" | "government";
  grossAmount: number;
  frequency: "daily" | "weekly" | "bi-weekly" | "monthly" | "annual";
  isTaxable: boolean;
  isPreTax: boolean;
  stability: "stable" | "variable" | "seasonal";
}

interface IncomeFormProps {
  onIncomeComplete: (incomeSources: IncomeSource[]) => void;
}

export function IncomeForm({ onIncomeComplete }: IncomeFormProps) {
  const [incomeSources, setIncomeSources] = useState<IncomeSource[]>([
    {
      id: "1",
      sourceName: "",
      incomeType: "w2",
      grossAmount: 0,
      frequency: "monthly",
      isTaxable: true,
      isPreTax: false,
      stability: "stable"
    }
  ]);

  const addIncomeSource = () => {
    const newSource: IncomeSource = {
      id: Date.now().toString(),
      sourceName: "",
      incomeType: "w2",
      grossAmount: 0,
      frequency: "monthly",
      isTaxable: true,
      isPreTax: false,
      stability: "stable"
    };
    setIncomeSources([...incomeSources, newSource]);
  };

  const updateIncomeSource = (id: string, field: keyof IncomeSource, value: any) => {
    setIncomeSources(incomeSources.map(source => 
      source.id === id ? { ...source, [field]: value } : source
    ));
  };

  const removeIncomeSource = (id: string) => {
    setIncomeSources(incomeSources.filter(source => source.id !== id));
  };

  const handleSubmit = () => {
    const validSources = incomeSources.filter(source => 
      source.sourceName && source.grossAmount > 0
    );
    onIncomeComplete(validSources);
  };

  return (
    <div className="p-8 max-w-4xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Income Sources</h1>
        <p className="text-gray-600">Add all sources of income. Each will be treated independently for tax purposes.</p>
      </div>

      <div className="space-y-6">
        {incomeSources.map((source, index) => (
          <div key={source.id} className="bg-white rounded-lg border border-gray-200 p-6">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold text-gray-900">Income Source {index + 1}</h3>
              {incomeSources.length > 1 && (
                <button
                  onClick={() => removeIncomeSource(source.id)}
                  className="text-red-600 hover:text-red-700 font-medium"
                >
                  Remove
                </button>
              )}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Source Name
                </label>
                <input
                  type="text"
                  value={source.sourceName}
                  onChange={(e) => updateIncomeSource(source.id, 'sourceName', e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="e.g., Main Job, Freelance Work"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Income Type
                </label>
                <select
                  value={source.incomeType}
                  onChange={(e) => updateIncomeSource(source.id, 'incomeType', e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="w2">W-2 (Salary)</option>
                  <option value="1099">1099 (Freelance/Contract)</option>
                  <option value="business">Business Income</option>
                  <option value="investment">Investment Income</option>
                  <option value="government">Government Benefits</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Gross Amount
                </label>
                <input
                  type="number"
                  value={source.grossAmount}
                  onChange={(e) => updateIncomeSource(source.id, 'grossAmount', parseFloat(e.target.value) || 0)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="0.00"
                  min="0"
                  step="0.01"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Frequency
                </label>
                <select
                  value={source.frequency}
                  onChange={(e) => updateIncomeSource(source.id, 'frequency', e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="daily">Daily</option>
                  <option value="weekly">Weekly</option>
                  <option value="bi-weekly">Bi-weekly</option>
                  <option value="monthly">Monthly</option>
                  <option value="annual">Annual</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Income Stability
                </label>
                <select
                  value={source.stability}
                  onChange={(e) => updateIncomeSource(source.id, 'stability', e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="stable">Stable</option>
                  <option value="variable">Variable</option>
                  <option value="seasonal">Seasonal</option>
                </select>
              </div>

              <div className="flex items-center space-x-4">
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    checked={source.isTaxable}
                    onChange={(e) => updateIncomeSource(source.id, 'isTaxable', e.target.checked)}
                    className="mr-2"
                  />
                  <span className="text-sm font-medium text-gray-700">Taxable</span>
                </label>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="mt-6 flex justify-between">
        <button
          onClick={addIncomeSource}
          className="px-6 py-3 border border-gray-300 text-gray-700 font-medium rounded-lg hover:bg-gray-50 transition-colors"
        >
          + Add Income Source
        </button>

        <button
          onClick={handleSubmit}
          className="px-6 py-3 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition-colors"
        >
          Next Step →
        </button>
      </div>
    </div>
  );
}
