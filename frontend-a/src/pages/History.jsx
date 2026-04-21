import { useEffect, useState } from "react"

export default function History() {
  const [logData, setLogData] = useState([])
  const [prodData, setProdData] = useState([])

  const [logLimit, setLogLimit] = useState(20)
  const [prodLimit, setProdLimit] = useState(20)

  const [loadingLog, setLoadingLog] = useState(false)
  const [loadingProd, setLoadingProd] = useState(false)
  const host = import.meta.env.VITE_BACK_HOST

  // ================= FETCH LOG =================
  const fetchLog = () => {
    setLoadingLog(true)

    fetch(`http://${host}:8000/history?limit=${logLimit}`)
      .then(res => res.json())
      .then(res => setLogData(res.data))
      .catch(err => console.error("❌ Log Error:", err))
      .finally(() => setLoadingLog(false))
  }

  // ================= FETCH PRODUCTION =================
  const fetchProd = () => {
    setLoadingProd(true)

    fetch(`http://${host}:8000/production_history?limit=${prodLimit}`)
      .then(res => res.json())
      .then(res => setProdData(res.data))
      .catch(err => console.error("❌ Production Error:", err))
      .finally(() => setLoadingProd(false))
  }

  useEffect(() => {
    fetchLog()
  }, [logLimit])

  useEffect(() => {
    fetchProd()
  }, [prodLimit])

  return (
    <div className="min-h-screen bg-[#f4f7fb] p-6">

      <h1 className="text-3xl font-bold text-[#023881] mb-6 tracking-wide">
        HISTORY
      </h1>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

        {/* ================= WORKCENTER LOG ================= */}
        <div className="bg-white border border-[#e3e8f0] rounded-2xl shadow-sm p-6">
          <h2 className="text-xl font-semibold text-[#023881] mb-4">
            Workcenter Log
          </h2>

          <div className="overflow-x-auto">
            <table className="min-w-full text-sm text-left">
              <thead>
                <tr className="bg-[#023881] text-white">
                  <th className="px-4 py-3">Time</th>
                  <th className="px-4 py-3">Product</th>
                  <th className="px-4 py-3">WC</th>
                  <th className="px-4 py-3">Status</th>
                  <th className="px-4 py-3">Result</th>
                  <th className="px-4 py-3">Cycle</th>
                </tr>
              </thead>

              <tbody>
                {logData.map((item, i) => (
                  <tr key={i} className="border-b hover:bg-gray-50">
                    <td className="px-4 py-3 text-[#000000]">
                      {new Date(item.timestamp).toLocaleString()}
                    </td>
                    <td className="px-4 py-3 font-medium text-[#023881]">
                      {item.product_id}
                    </td>
                    <td className="px-4 py-3 text-[#000000]">
                      {item.workcenter}
                    </td>
                    <td className="px-4 py-3 text-[#000000]">
                      <span className={`px-2 py-1 rounded text-xs font-semibold ${
                        item.status === "start"
                          ? "bg-blue-100 text-blue-600"
                          : "bg-green-100 text-green-600"
                      }`}>
                        {item.status}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-[#000000]">
                      <span className={`px-2 py-1 rounded text-xs font-semibold ${
                        item.result === "ok"
                          ? "bg-green-100 text-green-600"
                          : item.result === "ng"
                          ? "bg-red-100 text-red-600"
                          : "bg-gray-100 text-gray-500"
                      }`}>
                        {item.result || "-"}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-[#000000]">
                      {item.cycle_time || "-"}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* SEE MORE LOG */}
          <div className="mt-4 text-center">
            <button
              onClick={() => setLogLimit(prev => prev + 20)}
              className="px-4 py-2 bg-[#023881] text-white rounded-lg hover:bg-blue-700 transition"
            >
              {loadingLog ? "Loading..." : "See More"}
            </button>
          </div>
        </div>

        {/* ================= PRODUCTION HISTORY ================= */}
        <div className="bg-white border border-[#e3e8f0] rounded-2xl shadow-sm p-6">
          <h2 className="text-xl font-semibold text-[#023881] mb-4">
            Production History
          </h2>

          <div className="overflow-x-auto">
            <table className="min-w-full text-sm text-left">
              <thead>
                <tr className="bg-[#023881] text-white">
                  <th className="px-4 py-3">Start Time</th>
                  <th className="px-4 py-3">End Time</th>
                  <th className="px-4 py-3">Product</th>
                  <th className="px-4 py-3">MO</th>
                  <th className="px-4 py-3">Result</th>
                </tr>
              </thead>

              <tbody>
                {prodData.map((item, i) => (
                  <tr key={i} className="border-b hover:bg-gray-50">
                    <td className="px-4 py-3 text-[#000000]">
                      {new Date(item.start_time).toLocaleString()}
                    </td>
                    <td className="px-4 py-3 text-[#000000]">
                      {new Date(item.end_time).toLocaleString()}
                    </td>
                    <td className="px-4 py-3 font-medium text-[#023881]">
                      {item.product_id}
                    </td>
                    <td className="px-4 py-3 text-[#000000]">
                      {item.mo_id}
                    </td>
                    <td className="px-4 py-3 text-[#000000]">
                      <span className={`px-2 py-1 rounded text-xs font-semibold ${
                        item.result === "ok"
                          ? "bg-green-100 text-green-600"
                          : "bg-red-100 text-red-600"
                      }`}>
                        {item.result}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* SEE MORE PROD */}
          <div className="mt-4 text-center">
            <button
              onClick={() => setProdLimit(prev => prev + 20)}
              className="px-4 py-2 bg-[#023881] text-white rounded-lg hover:bg-blue-700 transition"
            >
              {loadingProd ? "Loading..." : "See More"}
            </button>
          </div>
        </div>

      </div>
    </div>
  )
}