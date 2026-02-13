'use client';
import React from 'react';

export default function SeoHead() {
  const faqJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    'mainEntity': [
      {
        '@type': 'Question',
        'name': 'What is the Financial Resilience Score?',
        'acceptedAnswer': {
          '@type': 'Answer',
          'text': 'The Financial Resilience Score (0–100) is a weighted index combining emergency coverage, debt pressure, savings health, income stability, location risk, and dependents to estimate how long you could survive if your income stopped.'
        }
      },
      {
        '@type': 'Question',
        'name': 'Is my data stored?',
        'acceptedAnswer': { '@type': 'Answer', 'text': 'No — all calculations run client-side and nothing is stored or sent to any server.' }
      },
      {
        '@type': 'Question',
        'name': 'How accurate are the results?',
        'acceptedAnswer': { '@type': 'Answer', 'text': 'Results are deterministic and auditable, but they are estimates. See the Scoring Methodology for exact formulas and assumptions.' }
      }
    ]
  };

  return (
    <>
      <title>VigilFi — Financial Resilience Score | Survival Runway & Action Plan</title>
      <meta name="description" content="Calculate your Financial Resilience Score and survival months if income stops — private, client-side, and audit-friendly." />
      <meta name="theme-color" content="#0B1020" />
      <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
      <meta property="og:title" content="VigilFi — Financial Resilience Score" />
      <meta property="og:description" content="Estimate how long you can survive if income stops; receive a resilience score and personalized recommendations." />
      <meta property="og:type" content="website" />
      <meta property="og:locale" content="en_US" />
      <meta name="twitter:card" content="summary_large_image" />
      <link rel="canonical" href="https://vigilfi.com/" />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }} />
    </>
  );
}
