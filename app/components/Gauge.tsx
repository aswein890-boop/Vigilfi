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

  return (
    <div className="flex items-center justify-center flex-col">
      <svg width="180" height="120" viewBox="0 0 220 150">
        <g transform="translate(110,120) rotate(-90)">
          <circle r={radius} strokeWidth={stroke} className="gauge-track" fill="transparent" cx="0" cy="0" />
          <motion.circle
            r={radius}
            strokeWidth={stroke}
            className="gauge-fill"
            fill="transparent"
            strokeDasharray={`${dash} ${circumference - dash}`}
            initial={{ strokeDashoffset: circumference }}
            animate={{ strokeDashoffset: 0 }}
            transition={{ duration: 0.6, ease: 'easeOut' }}
            style={{ transform: 'rotate(90deg)' }}
            cx="0"
            cy="0"
          />
        </g>
      </svg>
      <motion.div
        initial={{ opacity: 0, y: 6 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="mt-2 text-center"
      >
        <div className="text-4xl font-extrabold">{display}</div>
        <div className="small">Financial Resilience Score</div>
      </motion.div>
    </div>
  );
}
