"use client";

import { useState } from "react";
import Link from "next/link";

export default function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const toggleMobileMenu = () => {
    setMobileMenuOpen(!mobileMenuOpen);
  };

  const scrollToSection = (id: string) => {
    setMobileMenuOpen(false);
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <header className="fixed inset-x-0 top-0 z-50 border-b border-slate-800 bg-slate-950/95 backdrop-blur-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between h-16">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2 flex-shrink-0 hover:opacity-80 transition-opacity">
          <div className="w-8 h-8 bg-accent rounded-lg flex items-center justify-center text-slate-950 font-extrabold">
            V
          </div>
          <span className="hidden sm:inline font-bold text-lg text-white">VigilFi</span>
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center gap-8">
          <button
            onClick={() => scrollToSection("calculator")}
            className="text-slate-300 hover:text-accent transition-colors text-sm font-medium"
          >
            Calculator
          </button>
          <button
            onClick={() => scrollToSection("how")}
            className="text-slate-300 hover:text-accent transition-colors text-sm font-medium"
          >
            How it works
          </button>
          <button
            onClick={() => scrollToSection("about")}
            className="text-slate-300 hover:text-accent transition-colors text-sm font-medium"
          >
            About
          </button>
          <button
            onClick={() => scrollToSection("docs")}
            className="text-slate-300 hover:text-accent transition-colors text-sm font-medium"
          >
            Methodology
          </button>
        </nav>

        {/* Mobile Menu Button */}
        <button
          onClick={toggleMobileMenu}
          className="md:hidden p-2 hover:bg-slate-800 rounded-lg transition-colors"
          aria-label="Toggle menu"
          aria-expanded={mobileMenuOpen}
        >
          <svg
            className={`w-6 h-6 transition-transform duration-300 ${mobileMenuOpen ? "rotate-90" : ""}`}
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
          </svg>
        </button>
      </div>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-slate-800 bg-slate-900/98 px-4 py-4 animate-in fade-in slide-in-from-top-2">
          <nav className="flex flex-col gap-4">
            <button
              onClick={() => scrollToSection("calculator")}
              className="text-slate-300 hover:text-accent transition-colors text-sm font-medium text-left py-2"
            >
              Calculator
            </button>
            <button
              onClick={() => scrollToSection("how")}
              className="text-slate-300 hover:text-accent transition-colors text-sm font-medium text-left py-2"
            >
              How it works
            </button>
            <button
              onClick={() => scrollToSection("about")}
              className="text-slate-300 hover:text-accent transition-colors text-sm font-medium text-left py-2"
            >
              About
            </button>
            <button
              onClick={() => scrollToSection("docs")}
              className="text-slate-300 hover:text-accent transition-colors text-sm font-medium text-left py-2"
            >
              Methodology
            </button>
            <div className="border-t border-slate-800 pt-4 mt-2">
              <a href="#disclaimer" className="text-slate-400 hover:text-slate-200 transition-colors text-xs py-2 block">
                Disclaimer
              </a>
              <a href="#privacy" className="text-slate-400 hover:text-slate-200 transition-colors text-xs py-2 block">
                Privacy Policy
              </a>
              <a href="#terms" className="text-slate-400 hover:text-slate-200 transition-colors text-xs py-2 block">
                Terms of Service
              </a>
            </div>
          </nav>
        </div>
      )}
    </header>
  );
}
