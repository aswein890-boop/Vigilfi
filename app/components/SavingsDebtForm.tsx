"use client";

import { useState } from "react";

interface Savings {
  emergencyFund: number;
  cashBalance: number;
  liquidInvestments: number;
  retirementAccounts: number;
}

interface Debt {
  id: string;
  type: "credit-card" | "student-loan" | "mortgage" | "personal-loan";
  balance: number;
  apr: number;
  minimumPayment: number;
}

interface SavingsDebtFormProps {
  onSavingsDebtComplete: (savings: Savings, debts: Debt[]) => void;
}

export function SavingsDebtForm({ onSavingsDebtComplete }: SavingsDebtFormProps) {
  const [savings, setSavings] = useState<Savings>({
    emergencyFund: 0,
    cashBalance: 0,
    liquidInvestments: 0,
    retirementAccounts: 0
  });

  const [debts, setDebts] = useState<Debt[]>([
    {
      id: "1",
      type: "credit-card",
      balance: 0,
      apr: 0,
      minimumPayment: 0
    }
  ]);

  const updateSavings = (field: keyof Savings, value: number) => {
    setSavings(prev => ({ ...prev, [field]: value }));
  };

  const addDebt = () => {
    const newDebt: Debt = {
      id: Date.now().toString(),
      type: "credit-card",
      balance: 0,
      apr: 0,
      minimumPayment: 0
    };
    setDebts([...debts, newDebt]);
  };

  const updateDebt = (id: string, field: keyof Debt, value: any) => {
    setDebts(debts.map(debt => 
      debt.id === id ? { ...debt, [field]: value } : debt
    ));
  };

  const removeDebt = (id: string) => {
    setDebts(debts.filter(debt => debt.id !== id));
  };

  const handleSubmit = () => {
    onSavingsDebtComplete(savings, debts);
  };

  const totalLiquidSavings = savings.emergencyFund + savings.cashBalance + savings.liquidInvestments;

  return (
    <div className="p-8 max-w-4xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Savings & Debt</h1>
        <p className="text-gray-600">Tell us about your savings and debt obligations.</p>
      </div>

      {/* Savings Section */}
      <div className="bg-white rounded-lg border border-gray-200 p-6 mb-6">
        <h2 className="text-xl font-semibold text-gray-900 mb-4">Liquid Savings</h2>
        <p className="text-sm text-gray-600 mb-4">
          These funds will be used for survival calculations. Retirement accounts are shown for information only.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Emergency Fund
            </label>
            <div className="relative">
              <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500">$</span>
              <input
                type="number"
                value={savings.emergencyFund}
                onChange={(e) => updateSavings('emergencyFund', parseFloat(e.target.value) || 0)}
                className="w-full pl-8 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="0.00"
                min="0"
                step="0.01"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Cash Balance (Checking/Savings)
            </label>
            <div className="relative">
              <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500">$</span>
              <input
                type="number"
                value={savings.cashBalance}
                onChange={(e) => updateSavings('cashBalance', parseFloat(e.target.value) || 0)}
                className="w-full pl-8 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="0.00"
                min="0"
                step="0.01"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Liquid Investments (Stocks, Bonds, etc.)
            </label>
            <div className="relative">
              <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500">$</span>
              <input
                type="number"
                value={savings.liquidInvestments}
                onChange={(e) => updateSavings('liquidInvestments', parseFloat(e.target.value) || 0)}
                className="w-full pl-8 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="0.00"
                min="0"
                step="0.01"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Retirement Accounts (401k, IRA) - Information Only
            </label>
            <div className="relative">
              <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500">$</span>
              <input
                type="number"
                value={savings.retirementAccounts}
                onChange={(e) => updateSavings('retirementAccounts', parseFloat(e.target.value) || 0)}
                className="w-full pl-8 pr-4 py-2 border border-gray-300 rounded-lg bg-gray-50"
                placeholder="0.00"
                min="0"
                step="0.01"
                disabled
              />
            </div>
            <p className="text-xs text-gray-500 mt-1">Not included in survival calculations</p>
          </div>
        </div>

        <div className="mt-4 p-4 bg-blue-50 rounded-lg">
          <div className="flex justify-between items-center">
            <span className="font-semibold text-blue-900">Total Liquid Savings:</span>
            <span className="text-xl font-bold text-blue-900">
              ${totalLiquidSavings.toLocaleString()}
            </span>
          </div>
        </div>
      </div>

      {/* Debt Section */}
      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <h2 className="text-xl font-semibold text-gray-900 mb-4">Debt Obligations</h2>
        <p className="text-sm text-gray-600 mb-4">
          Minimum payments are treated as mandatory expenses in survival calculations.
        </p>

        <div className="space-y-4">
          {debts.map((debt, index) => (
            <div key={debt.id} className="border border-gray-200 rounded-lg p-4">
              <div className="flex justify-between items-center mb-3">
                <h3 className="font-semibold text-gray-900">Debt {index + 1}</h3>
                {debts.length > 1 && (
                  <button
                    onClick={() => removeDebt(debt.id)}
                    className="text-red-600 hover:text-red-700 font-medium text-sm"
                  >
                    Remove
                  </button>
                )}
              </div>

              <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Debt Type
                  </label>
                  <select
                    value={debt.type}
                    onChange={(e) => updateDebt(debt.id, 'type', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
                  >
                    <option value="credit-card">Credit Card</option>
                    <option value="student-loan">Student Loan</option>
                    <option value="mortgage">Mortgage</option>
                    <option value="personal-loan">Personal Loan</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Balance
                  </label>
                  <div className="relative">
                    <span className="absolute left-2 top-1/2 transform -translate-y-1/2 text-gray-500 text-sm">$</span>
                    <input
                      type="number"
                      value={debt.balance}
                      onChange={(e) => updateDebt(debt.id, 'balance', parseFloat(e.target.value) || 0)}
                      className="w-full pl-6 pr-2 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
                      placeholder="0.00"
                      min="0"
                      step="0.01"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    APR (%)
                  </label>
                  <input
                    type="number"
                    value={debt.apr}
                    onChange={(e) => updateDebt(debt.id, 'apr', parseFloat(e.target.value) || 0)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
                    placeholder="0.00"
                    min="0"
                    max="100"
                    step="0.01"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Monthly Minimum Payment
                  </label>
                  <div className="relative">
                    <span className="absolute left-2 top-1/2 transform -translate-y-1/2 text-gray-500 text-sm">$</span>
                    <input
                      type="number"
                      value={debt.minimumPayment}
                      onChange={(e) => updateDebt(debt.id, 'minimumPayment', parseFloat(e.target.value) || 0)}
                      className="w-full pl-6 pr-2 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
                      placeholder="0.00"
                      min="0"
                      step="0.01"
                    />
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-4">
          <button
            onClick={addDebt}
            className="px-4 py-2 border border-gray-300 text-gray-700 font-medium rounded-lg hover:bg-gray-50 transition-colors text-sm"
          >
            + Add Debt
          </button>
        </div>
      </div>

      <div className="mt-6 flex justify-end">
        <button
          onClick={handleSubmit}
          className="px-6 py-3 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition-colors"
        >
          Complete Analysis →
        </button>
      </div>
    </div>
  );
}
