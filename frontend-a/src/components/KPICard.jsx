export default function KPICard({ title, value, unit, trend, trendLabel, icon, highlight, onClick }) {
  return (
    <div
      onClick={onClick}
      className={`relative overflow-hidden rounded-xl border p-6 flex flex-col justify-between transition-shadow hover:shadow-md ${
        onClick ? "cursor-pointer" : "cursor-default"
      } ${
        highlight
          ? "bg-primary-container border-primary-container text-on-primary"
          : "bg-white border-outline-variant"
      }`}
    >
      <div className="flex justify-between items-start mb-4">
        <span className={`text-[11px] uppercase tracking-widest font-semibold leading-tight max-w-[70%] ${
          highlight ? "text-on-primary-container" : "text-on-surface-variant"
        }`}>
          {title}
        </span>
        {icon && (
          <span className={`material-symbols-outlined text-[22px] ${
            highlight ? "text-on-primary-container" : "text-outline"
          }`}>
            {icon}
          </span>
        )}
      </div>

      <div className="flex items-baseline gap-2">
        <span className={`font-mono text-[38px] leading-none font-medium ${
          highlight ? "text-on-primary" : "text-primary"
        }`}>
          {value ?? "—"}
        </span>
        {unit && (
          <span className={`text-sm ${highlight ? "text-on-primary-container" : "text-on-surface-variant"}`}>
            {unit}
          </span>
        )}
      </div>

      {trend && (
        <div className="mt-4 flex items-center gap-1.5">
          <span className={`material-symbols-outlined text-[16px] ${
            trend === "up" ? "text-secondary" : trend === "down" ? "text-error" : "text-outline"
          }`}>
            {trend === "up" ? "trending_up" : trend === "down" ? "trending_down" : "remove"}
          </span>
          <span className={`text-xs font-medium ${
            trend === "up" ? "text-secondary" : trend === "down" ? "text-error" : "text-outline"
          }`}>
            {trendLabel}
          </span>
        </div>
      )}

      {/* Bottom accent line */}
      <div className={`absolute bottom-0 left-0 right-0 h-1 ${
        highlight ? "bg-surface-tint" : "bg-surface-container-highest"
      }`} />
    </div>
  )
}