import { NavLink, useLocation } from "react-router-dom"
import { useEffect, useRef, useState } from "react"
import { useDarkMode } from "../context/DarkModeContext"

const navLinks = [
  { label: "Dashboard", to: "/" },
  { label: "History",   to: "/history" },
]

const host = import.meta.env.VITE_BACK_HOST

export default function TopBar() {
  const location      = useLocation()
  const { dark, toggle } = useDarkMode()

  const [time, setTime]           = useState("")
  const [notifOpen, setNotifOpen] = useState(false)
  const [notifs, setNotifs]       = useState([])
  const [unreadCount, setUnreadCount] = useState(0)

  const notifRef = useRef(null)

  /* ── Live clock ── */
  useEffect(() => {
    const update = () => setTime(new Date().toLocaleTimeString())
    update()
    const id = setInterval(update, 1000)
    return () => clearInterval(id)
  }, [])

  /* ── Close notification panel when clicking outside ── */
  useEffect(() => {
    const handler = (e) => {
      if (notifRef.current && !notifRef.current.contains(e.target)) {
        setNotifOpen(false)
      }
    }
    document.addEventListener("mousedown", handler)
    return () => document.removeEventListener("mousedown", handler)
  }, [])

  /* ── Listen for local notifications (e.g. from Dashboard target achieved) ── */
  useEffect(() => {
    const handleAddNotif = (e) => {
      setNotifs(prev => [e.detail, ...prev])
      setUnreadCount(prev => prev + 1)
    }
    window.addEventListener('addNotification', handleAddNotif)
    return () => window.removeEventListener('addNotification', handleAddNotif)
  }, [])

  /* ── Toggle notifications panel ── */
  const openNotifications = () => {
    const next = !notifOpen
    setNotifOpen(next)
    if (next) {
      setUnreadCount(0)
    }
  }

  /* ── Helpers ── */
  const fmtTime = (t) => {
    if (!t) return "—"
    const d = new Date(t)
    return isNaN(d) ? t : d.toLocaleTimeString()
  }

  return (
    <header className="bg-white border-b border-slate-200 sticky top-0 z-50 flex justify-between items-center px-4 sm:px-8 h-14 md:h-16 shrink-0 transition-colors duration-300">

      {/* ── Left: Brand ── */}
      <div className="flex items-center gap-4 md:gap-8 min-w-0">
        <div className="text-sm sm:text-base font-black tracking-tighter text-primary uppercase select-none whitespace-nowrap">
          Teaching Aid Automation
        </div>

        {/* ── Centre nav (absolute so it doesn't push right icons) ── */}
        <nav className="hidden md:flex items-center gap-1 h-14 md:h-16 absolute left-1/2 -translate-x-1/2">
          {navLinks.map(link => {
            const isActive = location.pathname === link.to
            return (
              <NavLink
                key={link.to}
                to={link.to}
                className={`flex items-center h-full px-4 text-sm font-semibold border-b-2 transition-all duration-200 ${
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

      {/* ── Right: Clock + Icons ── */}
      <div className="flex items-center gap-3">

        {/* Live clock */}
        <div className="hidden sm:flex items-center gap-2 bg-surface-container-low text-primary px-3 py-1.5 rounded-lg text-xs font-semibold tracking-wider">
          <span className="material-symbols-outlined text-[15px]">schedule</span>
          {time}
        </div>

        <div className="flex items-center gap-1 border-l border-slate-200 pl-3">

          {/* ── Notification bell ── */}
          <div ref={notifRef} className="relative">
            <button
              onClick={openNotifications}
              className="p-2 text-slate-500 hover:bg-slate-100 rounded-lg transition-colors relative"
              title="Notifications"
            >
              <span className="material-symbols-outlined text-[20px]">notifications</span>
              {unreadCount > 0 && (
                <span className="absolute top-1.5 right-1.5 min-w-[16px] h-4 px-1 bg-error rounded-full text-[10px] flex items-center justify-center text-white font-bold">
                  {unreadCount}
                </span>
              )}
            </button>

            {/* Notification dropdown */}
            {notifOpen && (
              <div className="absolute right-0 top-full mt-2 w-80 bg-white border border-outline-variant rounded-xl shadow-2xl overflow-hidden z-[60] animate-fadeIn">
                {/* Panel header */}
                <div className="flex justify-between items-center px-4 py-3 border-b border-outline-variant">
                  <div className="flex items-center gap-2">
                    <span className="material-symbols-outlined text-primary text-[16px]">notifications</span>
                    <h3 className="text-sm font-bold text-primary">System Alerts</h3>
                  </div>
                  <span className="text-[10px] text-on-surface-variant font-semibold uppercase tracking-widest">
                    {notifs.length} records
                  </span>
                </div>

                {/* Items */}
                <div className="max-h-80 overflow-y-auto divide-y divide-outline-variant">
                  {notifs.length === 0 ? (
                    <div className="py-8 text-center text-on-surface-variant text-sm">No new alerts.</div>
                  ) : notifs.map((n, i) => {
                    return (
                      <div key={i} className="px-4 py-3 flex items-start gap-3 hover:bg-surface-container-low transition-colors">
                        <div className="mt-0.5 w-8 h-8 rounded-full flex items-center justify-center shrink-0 bg-primary-container">
                          <span className="material-symbols-outlined text-[16px] text-on-primary" style={{ fontVariationSettings: "'FILL' 1" }}>
                            emoji_events
                          </span>
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-bold text-primary truncate">{n.title}</p>
                          <p className="text-[12px] text-on-surface mt-0.5 leading-snug">
                            {n.message}
                          </p>
                          <p className="text-[10px] text-outline mt-1 font-semibold tracking-wide">
                            {fmtTime(n.timestamp)}
                          </p>
                        </div>
                      </div>
                    )
                  })}
                </div>

                {/* Footer */}
                <div className="px-4 py-2 border-t border-outline-variant bg-surface-container-low text-center">
                  <button
                    onClick={() => { setNotifOpen(false); setNotifs([]); setUnreadCount(0); }}
                    className="text-[11px] font-bold text-primary hover:underline uppercase tracking-widest"
                  >
                    Clear All
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* ── Settings / Dark mode toggle ── */}
          <button
            onClick={toggle}
            className="p-2 text-slate-500 hover:bg-slate-100 rounded-lg transition-colors"
            title={dark ? "Switch to Light Mode" : "Switch to Dark Mode"}
          >
            <span className="material-symbols-outlined text-[20px]" style={{ fontVariationSettings: "'FILL' 1" }}>
              {dark ? "light_mode" : "dark_mode"}
            </span>
          </button>

        </div>
      </div>
    </header>
  )
}
