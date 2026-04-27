import { NavLink, useLocation } from "react-router-dom"
import { useEffect, useState } from "react"

const navLinks = [
  { label: "Dashboard", to: "/" },
  { label: "History", to: "/history" },
]

export default function TopBar() {
  const location = useLocation()
  const [time, setTime] = useState("")

  useEffect(() => {
    const update = () => setTime(new Date().toLocaleTimeString())
    update()
    const id = setInterval(update, 1000)
    return () => clearInterval(id)
  }, [])

  return (
    <header className="bg-white border-b border-slate-200 sticky top-0 z-50 flex justify-between items-center px-4 sm:px-8 h-14 md:h-16 shrink-0">
      {/* Left: Brand + Nav */}
      <div className="flex items-center gap-4 md:gap-8 min-w-0">
        <div className="text-sm sm:text-base font-black tracking-tighter text-primary uppercase select-none whitespace-nowrap">
          IndustrialFlow
        </div>
        <nav className="hidden md:flex items-center gap-1 h-14 md:h-16">
          {navLinks.map(link => {
            const isActive = location.pathname === link.to
            return (
              <NavLink
                key={link.to}
                to={link.to}
                className={`flex items-center h-full px-3 text-sm font-semibold border-b-2 transition-all duration-200 ${
                  isActive
                    ? "text-primary border-primary"
                    : "text-slate-500 border-transparent hover:text-primary hover:bg-slate-50"
                }`}
              >
                {link.label}
              </NavLink>
            )
          })}
        </nav>
      </div>

      {/* Right: Search + Clock + Icons */}
      <div className="flex items-center gap-4">
        {/* Live clock badge */}
        <div className="hidden sm:flex items-center gap-2 bg-surface-container-low text-primary px-3 py-1.5 rounded-lg text-xs font-semibold tracking-wider">
          <span className="material-symbols-outlined text-[16px]">schedule</span>
          {time}
        </div>

        {/* Icon buttons */}
        <div className="flex items-center gap-1 border-l border-slate-200 pl-4">
          <button className="p-2 text-slate-500 hover:bg-slate-100 rounded-lg transition-colors relative">
            <span className="material-symbols-outlined text-[20px]">notifications</span>
            <span className="absolute top-2 right-2 w-1.5 h-1.5 bg-error rounded-full"></span>
          </button>
          <button className="p-2 text-slate-500 hover:bg-slate-100 rounded-lg transition-colors">
            <span className="material-symbols-outlined text-[20px]">settings</span>
          </button>
          <div className="w-8 h-8 rounded-full bg-surface-container-high ml-1 flex items-center justify-center border border-slate-200">
            <span className="material-symbols-outlined text-primary-container text-[18px]">person</span>
          </div>
        </div>
      </div>
    </header>
  )
}
