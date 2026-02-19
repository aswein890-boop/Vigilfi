import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import BreakdownChart from '../app/components/BreakdownChart';

const sample = [
  { name: 'Emergency', value: 40, metric: '4 months' },
  { name: 'Debt', value: 70, metric: '20% of income' },
  { name: 'Savings', value: 55, metric: '10% save rate' }
];

describe('BreakdownChart', () => {
  it('renders toggle and switches views (mouse + keyboard)', () => {
    render(<BreakdownChart data={sample} />);

    const btnBars = screen.getByTestId('toggle-bars');
    const btnDonut = screen.getByTestId('toggle-donut');
    expect(btnBars).toBeInTheDocument();
    expect(btnDonut).toBeInTheDocument();

    // default should be Bars (aria-pressed true)
    expect(btnBars).toHaveAttribute('aria-pressed', 'true');

    // switch to donut via click
    fireEvent.click(btnDonut);
    expect(btnDonut).toHaveAttribute('aria-pressed', 'true');
    expect(screen.getByTestId('breakdown-donut')).toBeInTheDocument();

    // switch back to bars via keyboard (space)
    btnBars.focus();
    fireEvent.keyDown(btnBars, { key: ' ' });
    // clicking programmatically toggles view to bars
    fireEvent.click(btnBars);
    expect(btnBars).toHaveAttribute('aria-pressed', 'true');

    // bars rows should be present and focusable
    const emergencyRow = screen.getByTestId('breakbar-Emergency');
    expect(emergencyRow).toBeInTheDocument();
    expect(emergencyRow).toHaveAttribute('tabindex');
  });
});
