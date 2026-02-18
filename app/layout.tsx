import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "VigilFi — Financial Resilience Score Calculator",
  description: "Free financial resilience assessment tool. Calculate how long your savings will last, understand your financial health, and get personalized recommendations. Client-side calculator, no data stored.",
  keywords: "financial resilience, emergency fund, survival runway, financial assessment, budgeting tool",
  authors: [{ name: "VigilFi" }],
  creator: "VigilFi",
  publisher: "VigilFi",
  metadataBase: new URL("https://vigilfi.com"),
  applicationName: "VigilFi",
  robots: "index, follow",
  category: "Finance",
  openGraph: {
    type: "website",
    locale: "en_US",
    title: "VigilFi — Financial Resilience Score",
    description: "Calculate your financial resilience score and understand your survival runway.",
    siteName: "VigilFi",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <meta charSet="UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <meta name="theme-color" content="#081026" />
        <meta property="og:image" content="https://vigilfi.com/og-image.png" />
        <meta property="twitter:card" content="summary_large_image" />
        <meta property="twitter:title" content="VigilFi — Financial Resilience Score" />
        <meta property="twitter:description" content="Free financial resilience assessment tool" />
      </head>
      <body className={`${inter.className} bg-slate-950 text-slate-100`}>
        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="mb-12">
            <div className="card p-6 md:p-8 bg-gradient-to-b from-slate-800/50 to-slate-900/30">
              <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6">
                <div className="flex-1">
                  <h1 className="text-4xl md:text-5xl font-extrabold leading-tight tracking-tight mb-3">
                    VigilFi
                  </h1>
                  <p className="text-lg text-slate-300">
                    Your professional financial resilience assessment tool. Understand your survival runway and take control of your financial health.
                  </p>
                </div>
                <div className="flex-shrink-0">
                  <a 
                    href="#calculator" 
                    className="px-8 py-3 rounded-lg bg-accent text-slate-900 font-semibold hover:bg-yellow-400 transition-colors inline-block"
                  >
                    Start assessment
                  </a>
                </div>
              </div>
            </div>
          </div>

          {children}
        </main>

        {/* Footer */}
        <footer className="border-t border-slate-800 bg-slate-900/50 mt-20 py-12">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
              <div>
                <h4 className="font-semibold text-slate-100 mb-3">VigilFi</h4>
                <p className="text-sm text-slate-400">Professional financial resilience assessment tool for planning and decision-making.</p>
              </div>
              <div>
                <h4 className="font-semibold text-slate-100 mb-3">Links</h4>
                <ul className="space-y-2 text-sm">
                  <li><a href="#about" className="text-slate-400 hover:text-accent transition-colors">About</a></li>
                  <li><a href="#how" className="text-slate-400 hover:text-accent transition-colors">How it works</a></li>
                  <li><a href="#docs" className="text-slate-400 hover:text-accent transition-colors">Methodology</a></li>
                  <li><a href="#disclaimer" className="text-slate-400 hover:text-accent transition-colors">Disclaimer</a></li>
                </ul>
              </div>
              <div>
                <h4 className="font-semibold text-slate-100 mb-3">Contact</h4>
                <p className="text-sm text-slate-400">Questions or feedback?</p>
              </div>
            </div>
            <div className="border-t border-slate-800 pt-6 text-center text-sm text-slate-500">
              <p>&copy; {new Date().getFullYear()} VigilFi. All rights reserved.</p>
            </div>
          </div>
        </footer>
      </body>
    </html>
  );
}
