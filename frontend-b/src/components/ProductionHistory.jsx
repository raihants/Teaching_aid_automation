import React, { useState } from 'react';

const exampleRows = [
  { date: '2026-02-25', workcenter: 'WC1', product: 'P-100', qty: 500 },
  { date: '2026-02-25', workcenter: 'WC2', product: 'P-200', qty: 300 },
  { date: '2026-02-26', workcenter: 'WC1', product: 'P-100', qty: 450 },
];

export default function ProductionHistory() {
  const [filters, setFilters] = useState({ date: '', workcenter: '', product: '' });

  const filtered = exampleRows.filter((row) => {
    return (
      (!filters.date || row.date === filters.date) &&
      (!filters.workcenter || row.workcenter === filters.workcenter) &&
      (!filters.product || row.product === filters.product)
    );
  });

  function handleChange(e) {
    setFilters({ ...filters, [e.target.name]: e.target.value });
  }

  return (
    <div className="production-history">
      <h2>Production History</h2>
      <div className="filters">
        <input
          type="date"
          name="date"
          value={filters.date}
          onChange={handleChange}
          placeholder="Filter by date"
        />
        <input
          type="text"
          name="workcenter"
          value={filters.workcenter}
          onChange={handleChange}
          placeholder="Filter by workcenter"
        />
        <input
          type="text"
          name="product"
          value={filters.product}
          onChange={handleChange}
          placeholder="Filter by product"
        />
      </div>
      <table>
        <thead>
          <tr>
            <th>Date</th>
            <th>Workcenter</th>
            <th>Product</th>
            <th>Qty</th>
          </tr>
        </thead>
        <tbody>
          {filtered.map((row, idx) => (
            <tr key={idx}>
              <td>{row.date}</td>
              <td>{row.workcenter}</td>
              <td>{row.product}</td>
              <td>{row.qty}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
