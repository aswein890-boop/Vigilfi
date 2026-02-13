'use client';
import React from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer } from 'recharts';

const COLORS = ['#7c3aed', '#06b6d4', '#f97316', '#10b981', '#f59e0b', '#ef4444'];

export default function BreakdownChart({ data }: { data: { name: string; value: number }[] }) {
  return (
    <div style={{ width: '100%', height: 240 }}>
      <ResponsiveContainer>
        <PieChart>
          <Pie data={data} dataKey="value" innerRadius={50} outerRadius={80} paddingAngle={3}>
            {data.map((entry, idx) => (
              <Cell key={entry.name} fill={COLORS[idx % COLORS.length]} />
            ))}
          </Pie>
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
}
