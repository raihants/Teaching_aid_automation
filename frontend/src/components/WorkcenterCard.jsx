export default function WorkcenterCard({ name, status, cycle, ok, ng }) {
  const isRunning = status === "RUNNING"
  const isIdle = status === "IDLE"

  const statusBg = isRunning
    ? "bg-green-100 text-green-700 border border-green-200"
    : isIdle
    ? "bg-yellow-100 text-yellow-700 border border-yellow-200"
    : "bg-red-100 text-red-700 border border-red-200"

  const dotColor = isRunning ? "bg-green-500" : isIdle ? "bg-yellow-400" : "bg-red-500"

  return (
    <div className="bg-white border border-outline-variant rounded-xl p-5 hover:shadow-md transition-shadow">
      {/* Header */}
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-sm font-bold text-primary uppercase tracking-wide">{name}</h3>
        <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${statusBg}`}>
          <span className={`w-1.5 h-1.5 rounded-full ${dotColor} ${isRunning ? "animate-pulse" : ""}`} />
          {status}
        </span>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-3">
        <div className="bg-surface-container-low rounded-lg p-3 text-center">
          <p className="text-[10px] uppercase tracking-wider text-on-surface-variant mb-1">Cycle</p>
          <p className="text-base font-semibold text-primary font-mono">{cycle ?? "—"}</p>
        </div>
        <div className="bg-surface-container-low rounded-lg p-3 text-center">
          <p className="text-[10px] uppercase tracking-wider text-on-surface-variant mb-1">OK</p>
          <p className="text-base font-semibold text-secondary font-mono">{ok ?? 0}</p>
        </div>
        <div className="bg-surface-container-low rounded-lg p-3 text-center">
          <p className="text-[10px] uppercase tracking-wider text-on-surface-variant mb-1">NG</p>
          <p className="text-base font-semibold text-error font-mono">{ng ?? 0}</p>
        </div>
      </div>
    </div>
  )
}