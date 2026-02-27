import React, { useState, useEffect } from 'react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';

// five machines/workcenters as per request
const workcenters = ['WC1', 'WC2', 'WC3', 'WC4', 'WC5'];

function randomPct() {
  // give integer percentage 0–100
  return Math.floor(Math.random() * 101);
}

function computeOEE(a, p, q) {
  // each component is a percent; convert to fraction and multiply
  // OEE = (A/100) × (P/100) × (Q/100) × 100
  // simplifies to (A * P * Q) / 10000
  const value = (a / 100) * (p / 100) * (q / 100) * 100;
  return parseFloat(value.toFixed(2));
}

export default function OEEChart() {
  const [data, setData] = useState(
    workcenters.map((name) => ({
      name,
      availability: randomPct(),
      performance: randomPct(),
      quality: randomPct(),
    }))
  );

  useEffect(() => {
    const interval = setInterval(() => {
      setData(
        workcenters.map((name) => {
          const a = randomPct();
          const p = randomPct();
          const q = randomPct();
          return {
            name,
            availability: a,
            performance: p,
            quality: q,
            oee: computeOEE(a, p, q),
          };
        })
      );
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="oee-chart">
      <h2>OEE Chart</h2>
      <ResponsiveContainer width="100%" height={300}>
        <BarChart data={data} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="name" />
          <YAxis />
          <Tooltip formatter={(value) => `${value}%`} />
          <Legend />
          <Bar dataKey="availability" fill="#8884d8" />
          <Bar dataKey="performance" fill="#82ca9d" />
          <Bar dataKey="quality" fill="#ffc658" />
          <Bar dataKey="oee" fill="#333" />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
