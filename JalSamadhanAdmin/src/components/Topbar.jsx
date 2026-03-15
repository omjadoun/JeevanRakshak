import { ShieldCheck, Signal, UserCircle2 } from 'lucide-react'

export function Topbar() {
  return (
    <header className="flex items-center justify-between gap-4 border-b border-slate-800/80 bg-slate-950/70 px-4 py-3 backdrop-blur-xl lg:px-6">
      <div className="flex items-center gap-3">
        <div className="inline-flex items-center gap-2 rounded-full border border-emerald-400/40 bg-emerald-500/10 px-2.5 py-1">
          <span className="inline-flex h-1.5 w-1.5 rounded-full bg-emerald-400 shadow-[0_0_0_4px_rgba(34,197,94,0.35)]" />
          <span className="text-[11px] font-medium uppercase tracking-[0.18em] text-emerald-100">
            Monitoring live incident stream
          </span>
        </div>
      </div>

      <div className="flex items-center gap-3">
        <div className="hidden items-center gap-2 rounded-full border border-slate-700/70 bg-slate-900/80 px-3 py-1.5 text-xs text-slate-300/80 md:flex">
          <Signal className="h-3.5 w-3.5 text-cyan-300" />
          <span>Firebase link</span>
          <span className="h-1 w-1 rounded-full bg-emerald-400" />
          <span className="text-emerald-300">Stable</span>
        </div>

        <div className="flex items-center gap-2 rounded-full border border-slate-700/70 bg-slate-900/80 px-2.5 py-1.5 text-xs text-slate-200">
          <ShieldCheck className="h-3.5 w-3.5 text-cyan-300" />
          <span className="hidden md:inline">Logged in as</span>
          <span className="font-medium">Command Ops</span>
          <span className="mx-1 h-3 w-px bg-slate-700/80" />
          <UserCircle2 className="h-4 w-4 text-slate-300" />
        </div>
      </div>
    </header>
  )
}

