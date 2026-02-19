"use client";

import { useState } from "react";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";

export function Dashboard() {
  const [selectedTab, setSelectedTab] = useState("overview");

  // Mock data for demonstration
  const metrics = {
    liquidRunway: 999.0,
    monthlyFreeCash: 0,
    monthlyBurn: 0,
    effectiveTaxRate: 0.0,
    annualTax: 0,
  };

  const runwayProjectionData = [
    { month: 0, balance: 100000 },
    { month: 6, balance: 94000 },
    { month: 12, balance: 88000 },
    { month: 18, balance: 82000 },
    { month: 24, balance: 76000 },
  ];

  const cashFlowRealityData = [
    { month: "Jan", netIncome: 5000, spending: 3500 },
    { month: "Feb", netIncome: 5200, spending: 3300 },
    { month: "Mar", netIncome: 4800, spending: 3600 },
    { month: "Apr", netIncome: 5500, spending: 3200 },
    { month: "May", netIncome: 5100, spending: 3400 },
    { month: "Jun", netIncome: 5300, spending: 3100 },
  ];

  const formatNumericValue = (value: any) => {
    let v: any = value;
    if (Array.isArray(v)) v = v[0];
    if (v == null) return 0;
    if (typeof v === "number") return v;
    const parsed = Number(v);
    return Number.isNaN(parsed) ? 0 : parsed;
  };

  return (
    <div className="p-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Financial Dashboard</h1>
        <p className="text-gray-600">Track your financial survival metrics and projections</p>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div className="card p-6">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium text-slate-500">LIQUID RUNWAY</span>
            <div className="w-2 h-2 bg-green-500 rounded-full"></div>
          </div>
          <div className="text-2xl font-bold text-green-600">
            {metrics.liquidRunway.toFixed(1)} Months
          </div>
          <div className="text-sm text-slate-400 mt-1">Time until $0 balance</div>
        </div>

        <div className="card p-6">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium text-slate-500">MONTHLY FREE CASH</span>
            <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
          </div>
          <div className="text-2xl font-bold text-gray-900">
            ${metrics.monthlyFreeCash.toLocaleString()}
          </div>
          <div className="text-sm text-slate-400 mt-1">Discretionary Income</div>
        </div>

        <div className="card p-6">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium text-slate-500">MONTHLY BURN</span>
            <div className="w-2 h-2 bg-orange-500 rounded-full"></div>
          </div>
          <div className="text-2xl font-bold text-gray-900">
            ${metrics.monthlyBurn.toLocaleString()}
          </div>
          <div className="text-sm text-slate-400 mt-1">Mandatory Survival Cost</div>
        </div>

        <div className="card p-6">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium text-slate-500">EFFECTIVE TAX RATE</span>
            <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
          </div>
          <div className="text-2xl font-bold text-gray-900">
            {metrics.effectiveTaxRate.toFixed(1)}%
          </div>
          <div className="text-sm text-slate-400 mt-1">${metrics.annualTax.toLocaleString()} Annual Tax</div>
        </div>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Runway Projection</h3>
          <p className="text-sm text-gray-500 mb-6">
            Estimated liquid asset depletion if income stops today
          </p>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={runwayProjectionData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis 
                dataKey="month" 
                tick={{ fontSize: 12 }}
                tickFormatter={(value) => `${value}m`}
              />
              <YAxis 
                tick={{ fontSize: 12 }}
                tickFormatter={(value) => `$${(value / 1000).toFixed(1)}k`}
              />
              <Tooltip 
                formatter={(value: any) => [`$${formatNumericValue(value).toLocaleString()}`, "Balance"]}
                labelFormatter={(label) => `Month ${label}`}
              />
              <Line 
                type="monotone" 
                dataKey="balance" 
                stroke="#3b82f6" 
                strokeWidth={2}
                dot={false}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>

        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Cash Flow Reality</h3>
          <p className="text-sm text-gray-500 mb-6">
            Net Income vs Spending
          </p>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={cashFlowRealityData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis 
                dataKey="month" 
                tick={{ fontSize: 12 }}
              />
              <YAxis 
                tick={{ fontSize: 12 }}
                tickFormatter={(value) => `$${(value / 1000).toFixed(1)}k`}
              />
              <Tooltip 
                formatter={(value: any) => [`$${formatNumericValue(value).toLocaleString()}`, ""]}
              />
              <Line 
                type="monotone" 
                dataKey="netIncome" 
                stroke="#10b981" 
                strokeWidth={2}
                name="Net Income"
              />
              <Line 
                type="monotone" 
                dataKey="spending" 
                stroke="#ef4444" 
                strokeWidth={2}
                name="Spending"
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}
