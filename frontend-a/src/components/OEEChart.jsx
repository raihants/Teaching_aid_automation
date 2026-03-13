import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts"

export default function OEEChart({ production }) {

  // const calculateData = () => {

  //   const total = production.total || 0
  //   const ok = production.ok || 0
  //   const workcenters = production.workcenters || {}

  //   const wcList = Object.values(workcenters)

  //  if (wcList.length === 0) {
  //   return [{
  //       name: "Production Line",
  //       availability: 0,
  //       performance: 0,
  //       quality: 0,
  //       oee: 0
  //   }]
  //   }

  //   // QUALITY
  //   const quality = total > 0 ? (ok / total) * 100 : 0

  //   // AVAILABILITY
  //   const runningCount = wcList.filter(wc => wc.status === "RUNNING").length
  //   const availability = (runningCount / wcList.length) * 100

  //   // PERFORMANCE (pakai rata-rata cycle time)
  //   const idealCycle = 8 // kamu bisa ubah sesuai standar
  //   const avgCycle =
  //       wcList.length > 0
  //           ? wcList.reduce((sum, wc) => sum + (wc.cycle || wc.cycle_time || 0), 0) / wcList.length
  //           : 0

  //   const performance =
  //     avgCycle > 0 ? Math.min((idealCycle / avgCycle) * 100, 100) : 0

  //   const oee =
  //     (availability / 100) *
  //     (performance / 100) *
  //     (quality / 100) *
  //     100

  //   return [{
  //     name: "Production Line",
  //     availability: availability.toFixed(1),
  //     performance: performance.toFixed(1),
  //     quality: quality.toFixed(1),
  //     oee: oee.toFixed(1)
  //   }]
  // }
  const oee = production.oee || {}
  const data = [{
    name: "Production Line",
    availability: oee.availability || 0,
    performance: oee.performance || 0,
    quality: oee.quality || 0,
    oee: oee.oee || 0
  }]

  const wcData = Object.entries(production.oee_wc || {}).map(([name,val]) => ({
    name,
    oee: val.oee
  }))

  return (
    <div>
      <h2 className="text-xl font-semibold mb-4">Live OEE</h2>
      <ResponsiveContainer width="100%" height={300}>
        <BarChart data={data}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="name" />
          <YAxis />
          <Tooltip formatter={(value) => `${value}%`} />
          <Legend />
          <Bar dataKey="availability" fill="#6366f1" />
          <Bar dataKey="performance" fill="#22c55e" />
          <Bar dataKey="quality" fill="#f59e0b" />
          <Bar dataKey="oee" fill="#111827" />
        </BarChart>
      </ResponsiveContainer>

      <h2 className="text-xl font-semibold mt-10 mb-4">OEE per Station</h2>
      <ResponsiveContainer width="100%" height={300}>
        <BarChart data={wcData}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="name" />
          <YAxis />
          <Tooltip formatter={(value)=>`${value}%`} />
          <Bar dataKey="oee" fill="#6366f1" />
        </BarChart>
      </ResponsiveContainer>

    </div>
  )
}