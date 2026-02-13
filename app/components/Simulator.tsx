"use client";

import { useState } from "react";

export function Simulator() {
  const [scenarios, setScenarios] = useState([
    {
      id: "job-loss",
      name: "Job Loss",
      description: "What if I lose my primary income?",
      active: false,
    },
    {
      id: "income-reduction",
      name: "Income Reduction",
      description: "What if my income decreases by 25%?",
      active: false,
    },
    {
      id: "expense-increase",
      name: "Expense Increase",
      description: "What if my rent increases by 20%?",
      active: false,
    },
    {
      id: "city-relocation",
      name: "City Relocation",
      description: "What if I move to a different city?",
      active: false,
    },
  ]);

  const toggleScenario = (id: string) => {
    setScenarios(prev =>
      prev.map(scenario =>
        scenario.id === id
          ? { ...scenario, active: !scenario.active }
          : scenario
      )
    );
  };

  return (
    <div className="p-8 max-w-4xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Financial Simulator</h1>
        <p className="text-gray-600">Test different scenarios to understand your financial resilience</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {scenarios.map((scenario) => (
          <div
            key={scenario.id}
            className={`bg-white rounded-lg border-2 p-6 cursor-pointer transition-all ${
              scenario.active
                ? "border-blue-500 bg-blue-50"
                : "border-gray-200 hover:border-gray-300"
            }`}
            onClick={() => toggleScenario(scenario.id)}
          >
            <div className="flex items-start justify-between mb-3">
              <h3 className="text-lg font-semibold text-gray-900">{scenario.name}</h3>
              <div
                className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${
                  scenario.active
                    ? "border-blue-500 bg-blue-500"
                    : "border-gray-300"
                }`}
              >
                {scenario.active && (
                  <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                    <path
                      fillRule="evenodd"
                      d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                      clipRule="evenodd"
                    />
                  </svg>
                )}
              </div>
            </div>
            <p className="text-gray-600 text-sm">{scenario.description}</p>
          </div>
        ))}
      </div>

      <div className="mt-8 bg-gray-50 rounded-lg p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Scenario Results</h3>
        <p className="text-gray-600">
          Select scenarios above to see how they would impact your financial runway and survival metrics.
        </p>
      </div>
    </div>
  );
}
