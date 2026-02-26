import { useEffect, useState } from "react"
import WorkcenterCard from "../components/WorkcenterCard"
import OEECard from "../components/OEECard"

export default function Dashboard() {

  const [production, setProduction] = useState({
    total: 0,
    ok: 0,
    ng: 0,
    workcenters: {}
  })

  useEffect(() => {
    const ws = new WebSocket("ws://localhost:8000/ws")

    ws.onmessage = (event) => {
      const data = JSON.parse(event.data)
      setProduction(data)   // langsung replace full state
    }

    ws.onclose = () => {
      console.log("WebSocket disconnected")
    }

    return () => ws.close()
  }, [])

  const oee =
    production.total > 0
      ? ((production.ok / production.total) * 100).toFixed(1) + "%"
      : "--"

  return (
    <div className="min-h-screen bg-gray-100 p-6">

      <h1 className="text-3xl font-semibold text-gray-800 mb-6">
        Production Dashboard
      </h1>

      {/* KPI */}
      <div className="grid grid-cols-4 gap-6 mb-8">
        <OEECard title="Production Today" value={production.total} />
        <OEECard title="Reject Today" value={production.ng} />
        <OEECard title="OEE" value={oee} />
        <OEECard
          title="Active Workcenter"
          value={Object.keys(production.workcenters).length}
        />
      </div>

      {/* Workcenters */}
      <div className="grid grid-cols-3 gap-6">
        {Object.entries(production.workcenters).map(([name, wc]) => (
          <WorkcenterCard
            key={name}
            name={name}
            status={wc.status}
            cycle={`${wc.cycle_time}s`}
            ok={wc.ok}
            ng={wc.ng}
          />
        ))}
      </div>

    </div>
  )
}