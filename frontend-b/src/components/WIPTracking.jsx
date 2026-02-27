import React from 'react';

const wipData = [
  {
    order: 'MO-001',
    steps: [
      { name: 'Step 1', status: 'DONE' },
      { name: 'Step 2', status: 'RUNNING' },
      { name: 'Step 3', status: 'WAITING' },
    ],
  },
  {
    order: 'MO-002',
    steps: [
      { name: 'Step 1', status: 'DONE' },
      { name: 'Step 2', status: 'DONE' },
      { name: 'Step 3', status: 'WAITING' },
    ],
  },
];

export default function WIPTracking() {
  return (
    <div className="wip-tracking">
      <h2>WIP Tracking</h2>
      {wipData.map((mo) => (
        <div key={mo.order} className="mo-card">
          <h3>{mo.order}</h3>
          <ul>
            {mo.steps.map((step) => (
              <li key={step.name} className={step.status.toLowerCase()}>
                {step.name}: {step.status}
              </li>
            ))}
          </ul>
        </div>
      ))}
    </div>
  );
}
