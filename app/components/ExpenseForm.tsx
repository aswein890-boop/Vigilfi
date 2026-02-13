"use client";

import { useState } from "react";

interface Expense {
  id: string;
  name: string;
  category: "housing" | "utilities" | "food" | "transportation" | "healthcare" | "education" | "insurance" | "subscriptions" | "lifestyle" | "miscellaneous";
  amount: number;
  frequency: "daily" | "weekly" | "bi-weekly" | "monthly" | "annual";
  mandatoryOrOptional: "mandatory" | "optional";
  taxDeductible: boolean;
}

interface ExpenseFormProps {
  onExpensesComplete: (expenses: Expense[]) => void;
}

export function ExpenseForm({ onExpensesComplete }: ExpenseFormProps) {
  const [expenses, setExpenses] = useState<Expense[]>([
    {
      id: "1",
      name: "",
      category: "housing",
      amount: 0,
      frequency: "monthly",
      mandatoryOrOptional: "mandatory",
      taxDeductible: false
    }
  ]);

  const expenseCategories = [
    { value: "housing", label: "Housing" },
    { value: "utilities", label: "Utilities" },
    { value: "food", label: "Food" },
    { value: "transportation", label: "Transportation" },
    { value: "healthcare", label: "Healthcare" },
    { value: "education", label: "Education" },
    { value: "insurance", label: "Insurance" },
    { value: "subscriptions", label: "Subscriptions" },
    { value: "lifestyle", label: "Lifestyle" },
    { value: "miscellaneous", label: "Miscellaneous" }
  ];

  const addExpense = () => {
    const newExpense: Expense = {
      id: Date.now().toString(),
      name: "",
      category: "housing",
      amount: 0,
      frequency: "monthly",
      mandatoryOrOptional: "mandatory",
      taxDeductible: false
    };
    setExpenses([...expenses, newExpense]);
  };

  const updateExpense = (id: string, field: keyof Expense, value: any) => {
    setExpenses(expenses.map(expense => 
      expense.id === id ? { ...expense, [field]: value } : expense
    ));
  };

  const removeExpense = (id: string) => {
    setExpenses(expenses.filter(expense => expense.id !== id));
  };

  const handleSubmit = () => {
    const validExpenses = expenses.filter(expense => 
      expense.name && expense.amount > 0
    );
    onExpensesComplete(validExpenses);
  };

  return (
    <div className="p-8 max-w-4xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Monthly Expenses</h1>
        <p className="text-gray-600">List all your expenses. Distinguish between mandatory and optional costs.</p>
      </div>

      <div className="mb-6 bg-blue-50 border border-blue-200 rounded-lg p-4">
        <h3 className="font-semibold text-blue-900 mb-2">Important Notes:</h3>
        <ul className="text-sm text-blue-800 space-y-1">
          <li>• <strong>Mandatory expenses</strong> are essential costs you cannot avoid (rent, utilities, groceries)</li>
          <li>• <strong>Optional expenses</strong> are discretionary costs you could reduce if needed (entertainment, dining out)</li>
          <li>• Be thorough - accuracy of your survival analysis depends on complete expense data</li>
        </ul>
      </div>

      <div className="space-y-6">
        {expenses.map((expense, index) => (
          <div key={expense.id} className="bg-white rounded-lg border border-gray-200 p-6">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold text-gray-900">Expense {index + 1}</h3>
              {expenses.length > 1 && (
                <button
                  onClick={() => removeExpense(expense.id)}
                  className="text-red-600 hover:text-red-700 font-medium"
                >
                  Remove
                </button>
              )}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Expense Name
                </label>
                <input
                  type="text"
                  value={expense.name}
                  onChange={(e) => updateExpense(expense.id, 'name', e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="e.g., Monthly Rent, Groceries, Netflix"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Category
                </label>
                <select
                  value={expense.category}
                  onChange={(e) => updateExpense(expense.id, 'category', e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                >
                  {expenseCategories.map(cat => (
                    <option key={cat.value} value={cat.value}>{cat.label}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Amount
                </label>
                <input
                  type="number"
                  value={expense.amount}
                  onChange={(e) => updateExpense(expense.id, 'amount', parseFloat(e.target.value) || 0)}
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
                  value={expense.frequency}
                  onChange={(e) => updateExpense(expense.id, 'frequency', e.target.value)}
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
                  Type
                </label>
                <select
                  value={expense.mandatoryOrOptional}
                  onChange={(e) => updateExpense(expense.id, 'mandatoryOrOptional', e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="mandatory">Mandatory</option>
                  <option value="optional">Optional</option>
                </select>
              </div>

              <div className="flex items-center">
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    checked={expense.taxDeductible}
                    onChange={(e) => updateExpense(expense.id, 'taxDeductible', e.target.checked)}
                    className="mr-2"
                  />
                  <span className="text-sm font-medium text-gray-700">Tax Deductible</span>
                </label>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="mt-6 flex justify-between">
        <button
          onClick={addExpense}
          className="px-6 py-3 border border-gray-300 text-gray-700 font-medium rounded-lg hover:bg-gray-50 transition-colors"
        >
          + Add Expense
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
