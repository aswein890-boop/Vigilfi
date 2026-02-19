'use client';
import React from 'react';
import { motion } from 'framer-motion';

export default function Gauge({ value }: { value: number }) {
  const radius = 70;
  const stroke = 12;
  const normalized = Math.max(0, Math.min(100, value));
  const circumference = 2 * Math.PI * radius;
  const dash = (normalized / 100) * circumference;

  // animate numeric value smoothly using framer-motion motion value + spring
  const mv = React.useMemo(() => ({ current: value }), [] as any) as any;
  // Use a motion value + spring for smooth transitions
  const motionValue = ((): any => {
    const mv = require('framer-motion').useMotionValue(value);
    const spring = require('framer-motion').useSpring(mv, { stiffness: 120, damping: 18 });
    React.useEffect(() => mv.set(value), [value, mv]);
    return { mv, spring };
  })();

  const [display, setDisplay] = React.useState(Math.round(value));
  React.useEffect(() => {
    const unsub = motionValue.spring.on('change', (v: number) => setDisplay(Math.round(v)));
    return () => unsub();
  }, [motionValue.spring]);

  const prevRef = React.useRef<number>(value);
  const [pulse, setPulse] = React.useState(false);
  React.useEffect(() => {
    if (value > prevRef.current) {
      setPulse(true);
      const t = setTimeout(() => setPulse(false), 450);
      return () => clearTimeout(t);
    }
    prevRef.current = value;
  }, [value]);

  return (
    <div className="flex items-center justify-center flex-col">
      <svg width="180" height="120" viewBox="0 0 220 150">
        <defs>
          <linearGradient id="gaugeGradient" x1="0%" x2="100%">
            <stop offset="0%" stopColor="#F59E0B" />
            <stop offset="100%" stopColor="#FFB86B" />
          </linearGradient>
          <filter id="gaugeGlow" x="-50%" y="-50%" width="200%" height="200%">
            <feGaussianBlur stdDeviation="6" result="coloredBlur" />
            <feMerge>
              <feMergeNode in="coloredBlur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>
        <g transform="translate(110,120) rotate(-90)">
          <circle r={radius} strokeWidth={stroke} className="gauge-track" fill="transparent" cx="0" cy="0" />
          <motion.circle
            r={radius}
            strokeWidth={stroke}
            stroke="url(#gaugeGradient)"
            fill="transparent"
            strokeDasharray={`${dash} ${circumference - dash}`}
            initial={{ strokeDashoffset: circumference }}
            animate={{ strokeDashoffset: 0 }}
            transition={{ duration: 0.8, ease: 'easeOut' }}
            style={{ transform: 'rotate(90deg)', filter: 'url(#gaugeGlow)' }}
            cx="0"
            cy="0"
          />
        </g>
      </svg>
      <motion.div
        initial={{ opacity: 0, y: 6 }}
        animate={pulse ? { scale: 1.04, opacity: 1, y: 0 } : { scale: 1, opacity: 1, y: 0 }}
        transition={{ type: 'spring', stiffness: 300, damping: 20 }}
        className="mt-2 text-center"
      >
        <div className="text-4xl font-extrabold">{display}</div>
        <div className="small">Financial Resilience Score</div>
      </motion.div>
    </div>
  );
}
