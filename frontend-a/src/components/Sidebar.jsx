import { NavLink, useLocation } from "react-router-dom"
import logo from "../assets/logopolman.svg"

const navItems = [
  { label: "Assembly Line A", icon: "precision_manufacturing", to: "/" },
  { label: "Assembly Line B", icon: "factory", to: "#" },
  { label: "Quality Control", icon: "verified_user", to: "#" },
  { label: "Storage Hub", icon: "inventory_2", to: "#" },
  { label: "Power Grid", icon: "bolt", to: "#" },
]

const footerItems = [
  { label: "Support", icon: "headset_mic", to: "#" },
  { label: "Logs", icon: "terminal", to: "/history" },
]

export default function Sidebar() {
  const location = useLocation()

  return (
    <aside className="bg-white text-blue-900 font-sans h-screen w-64 border-r border-slate-200 flex flex-col py-6 shrink-0 sticky top-0 z-40">
      {/* Header */}
      <div className="px-6 pb-6 border-b border-slate-200 mb-6">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-10 h-10 rounded-lg flex items-center justify-center shrink-0">
            <img src={logo} alt="Logo" />
          </div>
          <div>
            <h1 className="text-primary font-bold text-sm tracking-normal">Main Plant</h1>
            <p className="text-slate-500 text-[10px] tracking-wide uppercase">Operational Center</p>
          </div>
        </div>
        <div className="bg-surface-container-low text-primary py-2 px-3 rounded-lg flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-secondary animate-pulse-dot"></span>
          <span className="text-[10px] uppercase tracking-wider font-semibold">System Status: Active</span>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-4 space-y-1">
        {navItems.map(item => {
          const isActive = item.to !== "#" && location.pathname === item.to
          return (
            <NavLink
              key={item.label}
              to={item.to}
              className={`cursor-pointer select-none flex items-center gap-3 px-4 py-3 rounded-l text-sm font-semibold transition-all duration-200 ${isActive
                ? "bg-slate-100 text-primary border-r-4 border-primary"
                : "text-slate-500 hover:bg-slate-50 hover:text-primary"
                }`}
            >
              <span className="material-symbols-outlined text-[20px]"
                style={isActive ? { fontVariationSettings: "'FILL' 1" } : {}}>
                {item.icon}
              </span>
              <span>{item.label}</span>
            </NavLink>
          )
        })}
      </nav>

      {/* Footer */}
      <div className="px-4 mt-auto border-t border-slate-200 pt-4 space-y-1">
        {footerItems.map(item => {
          const isActive = item.to !== "#" && location.pathname === item.to
          return (
            <NavLink
              key={item.label}
              to={item.to}
              className={`cursor-pointer select-none flex items-center gap-3 px-4 py-2.5 rounded-l text-sm font-semibold transition-all duration-200 ${isActive
                ? "bg-slate-100 text-primary border-r-4 border-primary"
                : "text-slate-500 hover:bg-slate-50 hover:text-primary"
                }`}
            >
              <span className="material-symbols-outlined text-[20px]">{item.icon}</span>
              <span>{item.label}</span>
            </NavLink>
          )
        })}
      </div>
    </aside>
  )
}
