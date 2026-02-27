import React from 'react';

export default function ProductionSummary() {
  // these would normally come from props or state
  const totals = {
    produced: 1200,
    reject: 25,
    runningWO: 3,
    activeMachine: 5,
  };

  return (
    <div className="production-summary">
      <h2>Production Summary Today</h2>
      <div className="metrics">
        <div className="metric">
          <strong>Total Produced</strong>
          <span>{totals.produced}</span>
        </div>
        <div className="metric">
          <strong>Total Reject</strong>
          <span>{totals.reject}</span>
        </div>
        <div className="metric">
          <strong>Running WO</strong>
          <span>{totals.runningWO}</span>
        </div>
        <div className="metric">
          <strong>Active Machine</strong>
          <span>{totals.activeMachine}</span>
        </div>
      </div>
    </div>
  );
}
