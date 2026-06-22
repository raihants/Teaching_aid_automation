import { NavLink, useLocation } from "react-router-dom"
import { FiHome, FiClock } from "react-icons/fi"
import { useEffect, useState } from "react"

export default function Navbar() {
  const [time, setTime] = useState("")
  const location = useLocation()

  useEffect(() => {
    const interval = setInterval(() => {
      setTime(new Date().toLocaleTimeString())
    }, 1000)
    return () => clearInterval(interval)
  }, [])

  return (
    <nav className="bg-[#023881] shadow-md px-6 py-4 flex items-center justify-between">

      {/* LOGO */}
      <div className="text-white font-bold text-lg tracking-wide flex items-center gap-2">
        Teaching Aid
      </div>

      {/* MENU */}
      <div className="flex gap-6 text-sm font-medium">

        <NavLink
          to="/"
          className="relative flex items-center gap-2 px-3 py-2 text-white/80 hover:text-white"
        >
          <FiHome className="text-lg" />
          Dashboard

          <span
            className={`absolute left-0 bottom-0 h-[2px] bg-white transition-all duration-300 ${
              location.pathname === "/" ? "w-full" : "w-0"
            }`}
          />
        </NavLink>

        <NavLink
          to="/history"
          className="relative flex items-center gap-2 px-3 py-2 text-white/80 hover:text-white"
        >
          <FiClock className="text-lg" />
          History

          <span
            className={`absolute left-0 bottom-0 h-[2px] bg-white transition-all duration-300 ${
              location.pathname === "/history" ? "w-full" : "w-0"
            }`}
          />
        </NavLink>

      </div>

      {/* JAM */}
      <div className="text-white text-sm font-medium bg-white/10 px-4 py-2 rounded-lg">
        {time}
      </div>

    </nav>
  )
}