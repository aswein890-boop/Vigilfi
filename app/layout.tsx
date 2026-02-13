import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "VigilFi — Financial Resilience Score",
  description: "Calculate your financial resilience score and understand your financial health.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <title>VigilFi — Financial Resilience Score</title>
        <meta name="description" content="Calculate your financial resilience score and understand your financial health." />
        <link rel="icon" href="/favicon.ico" />
      </head>
      <body className={inter.className}>
        <main className="container mx-auto p-4 pt-20">
          <div className="mb-8">
            <a href="/" className="inline-flex items-center gap-3 group hover:opacity-85 transition-all duration-200" aria-label="VigilFi home">
              <div className="text-left">
                <h1 className="text-xl md:text-2xl font-extrabold leading-tight wordmark uppercase tracking-tight">VigilFi</h1>
                <p className="text-xs text-slate-500">Financial Resilience Score — private & instant</p>
              </div>
            </a>
          </div>
          
          {children}
        </main>
      </body>
    </html>
  );
}
