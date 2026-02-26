import { useEffect, useState } from "react"
import WorkcenterCard from "../components/WorkcenterCard"
import OEECard from "../components/OEECard"
import ImgConveyor1 from "../assets/Robot Images/Conveyor 1.png"
import ImgArmRobot from "../assets/Robot Images/Arm Robot.png"
import ImgAGV from "../assets/Robot Images/AGV.png"
import ImgConveyor2 from "../assets/Robot Images/Conveyor 2.png"
import ImgDeltaRobot from "../assets/Robot Images/Delta Robot.png"

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

  const getWcStatus = (searchName) => {
    const entry = Object.entries(production.workcenters).find(
      ([key]) => key.toLowerCase() === searchName.toLowerCase()
    )
    return entry ? entry[1].status : "IDLE"
  }

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
      <div className="grid grid-cols-3 gap-6 mb-8">
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

      {/* Process Illustration */}
      <h2 className="text-2xl font-semibold text-gray-800 mb-4">
        Live Production Flow
      </h2>
      <div className="bg-white rounded-2xl shadow-sm p-8 flex items-center justify-between overflow-x-auto">
        <ProcessImage
          name="Conveyor 1"
          src={ImgConveyor1}
          status={getWcStatus("conveyor1") || getWcStatus("conveyor 1")}
        />
        <div className="text-gray-300 w-8 h-8 flex-shrink-0 animate-pulse">➔</div>

        <ProcessImage
          name="Arm Robot"
          src={ImgArmRobot}
          status={getWcStatus("arm robot") || getWcStatus("robot arm")}
        />
        <div className="text-gray-300 w-8 h-8 flex-shrink-0 animate-pulse">➔</div>

        <ProcessImage
          name="AGV Mobile"
          src={ImgAGV}
          status={getWcStatus("agv mobile") || getWcStatus("agv")}
        />
        <div className="text-gray-300 w-8 h-8 flex-shrink-0 animate-pulse">➔</div>

        <ProcessImage
          name="Conveyor 2"
          src={ImgConveyor2}
          status={getWcStatus("conveyor2") || getWcStatus("conveyor 2")}
        />
        <div className="text-gray-300 w-8 h-8 flex-shrink-0 animate-pulse">➔</div>

        <ProcessImage
          name="Robot Delta"
          src={ImgDeltaRobot}
          status={getWcStatus("robot delta") || getWcStatus("delta robot")}
        />
      </div>

    </div>
  )
}

function ProcessImage({ name, src, status }) {
  const isWorking = status === "RUNNING"
  return (
    <div className="flex flex-col items-center space-y-3 min-w-[120px]">
      <div
        className={`relative transition-all duration-500 ease-in-out p-2 rounded-xl border-2 ${isWorking
            ? "border-green-400 bg-green-50 shadow-[0_0_15px_rgba(34,197,94,0.6)] scale-110"
            : "border-gray-100 bg-gray-50 opacity-60 grayscale-[50%]"
          }`}
      >
        <img src={src} alt={name} className="w-24 h-24 object-contain" />

        {/* Glow indicator dot */}
        {isWorking && (
          <span className="absolute -top-2 -right-2 flex h-4 w-4">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-4 w-4 bg-green-500 border-2 border-white"></span>
          </span>
        )}
      </div>

      <div className="text-center mt-4">
        <p className={`font-semibold ${isWorking ? "text-green-600" : "text-gray-700"}`}>
          {name}
        </p>
        <p className="text-xs text-gray-400 font-medium uppercase tracking-wider mt-1">
          {status}
        </p>
      </div>
    </div>
  )
}