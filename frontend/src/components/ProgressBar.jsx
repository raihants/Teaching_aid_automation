export default function ProgressBar({ value, target, label }) {
  const percentage = target > 0 ? Math.min(Math.round((value / target) * 100), 100) : 0
  const isComplete = percentage >= 100

  return (
    <div className="w-full">
      {/* Header row */}
      <div className="flex justify-between items-end mb-3">
        <div>
          <p className="text-[11px] uppercase tracking-widest font-semibold text-on-surface-variant mb-1">
            {label ?? "Progress"}
          </p>
          <div className="flex items-baseline gap-2">
            <span className="text-[32px] leading-none font-medium font-mono text-primary">
              {value.toLocaleString()}
            </span>
            <span className="text-sm text-on-surface-variant">
              / {target.toLocaleString()} pcs
            </span>
          </div>
        </div>
        <div className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider ${
          isComplete
            ? "bg-secondary/10 text-secondary"
            : "bg-surface-container text-on-surface-variant"
        }`}>
          {isComplete && <span className="material-symbols-outlined text-[14px]">check_circle</span>}
          {percentage}%
        </div>
      </div>

      {/* Progress track */}
      <div className="w-full h-3 bg-surface-container-highest rounded-full overflow-hidden">
        <div
          className={`h-full rounded-full transition-all duration-700 ease-out ${
            isComplete ? "bg-secondary" : "bg-primary"
          }`}
          style={{ width: `${percentage}%` }}
        />
      </div>

      {/* Footer */}
      <div className="flex justify-between mt-2">
        <span className="text-xs text-on-surface-variant">{value.toLocaleString()} collected</span>
        <span className="text-xs text-on-surface-variant">{target.toLocaleString()} target</span>
      </div>
    </div>
  )
}