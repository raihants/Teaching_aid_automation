import { useEffect, useState } from "react";

export default function History() {
  const [data, setData] = useState([]);

  useEffect(() => {
    fetch("http://localhost:8000/history?limit=50")
      .then(res => res.json())
      .then(res => setData(res.data))
      .then(() => console.log(res.data))
      .catch(err => console.error("❌ Fetch History Error:", err));
  }, []);

  return (
    <div style={{ padding: "20px" }}>
      <h2>Production History</h2>

      <table border="1" cellPadding="10">
        <thead>
          <tr>
            <th>Time</th>
            <th>Workcenter</th>
            <th>Status</th>
            <th>Result</th>
            <th>Cycle</th>
          </tr>
        </thead>
        <tbody>
          {data.map((item, i) => (
            <tr key={i}>
              <td>{new Date(item.timestamp).toLocaleTimeString()}</td>
              <td>{item.workcenter}</td>
              <td>{item.status}</td>
              <td>{item.result}</td>
              <td>{item.cycle_time}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}