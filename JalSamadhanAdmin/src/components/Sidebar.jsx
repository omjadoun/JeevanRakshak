import { NavLink, useLocation } from 'react-router-dom'
import {
  Activity,
  AlertTriangle,
  Bell,
  GitPullRequestArrow,
  Map,
  ShieldCheck,
} from 'lucide-react'

const navItems = [
  { to: '/', label: 'Overview', icon: Activity, exact: true },
  { to: '/sos-alerts', label: 'SOS Alerts', icon: AlertTriangle },
  { to: '/resource-requests', label: 'Resource Requests', icon: GitPullRequestArrow },
  { to: '/contributors', label: 'Responders / KYC', icon: ShieldCheck },
  { to: '/announcements', label: 'Announcements', icon: Bell },
]

export function Sidebar() {
  const location = useLocation()

  return (
    <aside className="hidden w-64 shrink-0 border-r border-slate-800/80 bg-slate-950/80 px-4 pb-6 pt-4 backdrop-blur-xl lg:flex lg:flex-col">
      <div className="mb-6 flex items-center justify-between gap-2 px-1">
        <div className="flex items-center gap-2">
          <div className="inline-flex h-8 w-8 items-center justify-center rounded-2xl bg-cyan-500/10 ring-1 ring-cyan-400/40">
            <Map className="h-4 w-4 text-cyan-300" />
          </div>
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.22em] text-slate-500">
              JalSamadhan
            </p>
            <p className="text-sm font-medium text-slate-100">Admin Console</p>
          </div>
        </div>
        <span className="badge-soft">Live</span>
      </div>

      <nav className="flex-1 space-y-2">
        {navItems.map((item) => {
          const isActive =
            item.exact && location.pathname === '/'
              ? true
              : !item.exact && location.pathname.startsWith(item.to)

          const Icon = item.icon

          return (
            <NavLink
              key={item.to}
              to={item.to}
              className={({ isActive: routeActive }) =>
                [
                  'nav-pill glass-panel-hover border border-transparent',
                  (routeActive || isActive) && 'nav-pill-active',
                ]
                  .filter(Boolean)
                  .join(' ')
              }
              end={item.exact}
            >
              <Icon className="h-4 w-4" />
              <span>{item.label}</span>
            </NavLink>
          )
        })}
      </nav>

      <div className="mt-4 rounded-2xl border border-slate-800/90 bg-slate-900/80 p-3 text-xs text-slate-300/80 shadow-soft">
        <p className="mb-2 font-medium text-slate-100">Disaster Ops Snapshot</p>
        <div className="flex items-center justify-between">
          <span className="chip-muted">Realtime Firebase feed</span>
          <span className="text-[11px] text-emerald-400">Healthy</span>
        </div>
      </div>
    </aside>
  )
}

