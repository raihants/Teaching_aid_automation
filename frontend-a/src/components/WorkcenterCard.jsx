export default function WorkcenterCard({ name, status, cycle, ok, ng }) {

  const statusColor =
    status === "RUNNING"
      ? "bg-green-100 text-green-600"
      : status === "IDLE"
      ? "bg-yellow-100 text-yellow-600"
      : "bg-red-100 text-red-600"

  return (
    <div className="bg-white rounded-2xl shadow-sm p-6 hover:shadow-md transition">

      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-semibold text-gray-800">
          {name}
        </h3>

        <span className={`px-3 py-1 text-xs rounded-full ${statusColor}`}>
          {status}
        </span>
      </div>

      <div className="space-y-2 text-gray-600">
        <p>Cycle Time: <span className="font-medium">{cycle}</span></p>
        <p>OK: <span className="text-green-600 font-medium">{ok}</span></p>
      </div>

    </div>
  )
}