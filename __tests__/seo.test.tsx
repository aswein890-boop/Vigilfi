import React from 'react';
import { render } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import SeoHead from '../app/components/SeoHead';

describe('SEO head', () => {
  it('renders critical meta tags and structured data', () => {
    const { container } = render(<SeoHead /> as any);
    expect(container.querySelector('title')?.textContent).toMatch(/VigilFi/);
    expect(container.querySelector('meta[name="description"]')).toBeTruthy();
    expect(container.querySelector('script[type="application/ld+json"]')).toBeTruthy();
  });
});
