import React, { useState, useEffect } from 'react';

const names = ['Conveyor1', 'ArmRobot', 'AGV', 'Conveyor2', 'Delta'];
const statuses = ['RUNNING', 'IDLE', 'STOPPED'];

function randomCycleTime(status) {
  if (status !== 'RUNNING') return '-';
  const secs = (Math.random() * 5 + 1).toFixed(1);
  return `${secs}s`;
}

function randomOEE() {
  return `${Math.floor(Math.random() * 101)}%`;
}

export default function LiveStatusPanel() {
  const [data, setData] = useState(
    names.map((n) => ({
      name: n,
      status: statuses[Math.floor(Math.random() * statuses.length)],
      cycleTime: '-',
      oee: '0%',
    }))
  );

  useEffect(() => {
    const interval = setInterval(() => {
      setData((prev) =>
        prev.map((wc) => {
          const status = statuses[Math.floor(Math.random() * statuses.length)];
          return {
            ...wc,
            status,
            cycleTime: randomCycleTime(status),
            oee: randomOEE(),
          };
        })
      );
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="live-status-panel">
      <h2>Live Machine Status</h2>
      <div className="cards">
        {data.map((wc) => (
          <div key={wc.name} className="card">
            <h3>{wc.name}</h3>
            <p>Status: {wc.status}</p>
            <p>Cycle Time: {wc.cycleTime}</p>
            <p>OEE: {wc.oee}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
