import { Activity, AlertTriangle, GitPullRequestArrow, ShieldCheck, Users } from 'lucide-react'
import { useEffect, useState } from 'react'
import {
  fetchAnnouncements,
  fetchContributors,
  fetchResourceRequests,
  fetchSOSAlerts,
} from '../api/firebase.js'

const metricCardBase =
  'glass-panel glass-panel-hover border border-slate-800/80 flex flex-col justify-between rounded-2xl p-4 sm:p-5'

export default function Dashboard() {
  const [stats, setStats] = useState({
    sosOpen: 0,
    requestsOpen: 0,
    responders: 0,
    pendingKYC: 0,
    announcements: 0,
  })

  useEffect(() => {
    let cancelled = false

    async function load() {
      if (cancelled) return
      try {
        const [sos, requests, contributors, announcements] = await Promise.all([
          fetchSOSAlerts(),
          fetchResourceRequests(),
          fetchContributors(),
          fetchAnnouncements(),
        ])

        if (!cancelled) {
          setStats({
            sosOpen: sos.filter((s) => s.status !== 'resolved').length,
            requestsOpen: requests.filter((r) => !r.solved).length,
            responders: contributors.filter((c) => c.approved).length,
            pendingKYC: contributors.filter((c) => !c.approved).length,
            announcements: announcements.length,
          })
        }
      } catch {
        // Fail quietly; cards are only a summary.
      }
    }

    load()
    const intervalId = setInterval(load, 8000)

    return () => {
      cancelled = true
      clearInterval(intervalId)
    }
  }, [])

  return (
    <div className="flex h-full flex-col gap-4">
      <div className="flex flex-col gap-2">
        <h1 className="text-lg font-semibold text-slate-50 sm:text-xl">
          Command Overview
        </h1>
        <p className="max-w-xl text-sm text-slate-400">
          Monitor live SOS alerts, resource requests, and responder readiness from a single
          glassy control surface.
        </p>
      </div>

      <section className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <MetricCard
          icon={AlertTriangle}
          label="Open SOS alerts"
          value={stats.sosOpen}
          accent="text-amber-300"
          chip="Requires triage"
        />
        <MetricCard
          icon={GitPullRequestArrow}
          label="Open resource requests"
          value={stats.requestsOpen}
          accent="text-cyan-300"
          chip="Logistics"
        />
        <MetricCard
          icon={Users}
          label="Verified responders"
          value={stats.responders}
          accent="text-emerald-300"
          chip="Field ready"
        />
        <MetricCard
          icon={ShieldCheck}
          label="KYC pending"
          value={stats.pendingKYC}
          accent="text-sky-300"
          chip="Review queue"
        />
      </section>

      <section className="grid gap-4 lg:grid-cols-3">
        <div className={metricCardBase + ' lg:col-span-2'}>
          <header className="mb-3 flex items-center justify-between gap-2">
            <div className="flex items-center gap-2">
              <div className="inline-flex h-7 w-7 items-center justify-center rounded-xl bg-cyan-500/15">
                <Activity className="h-4 w-4 text-cyan-300" />
              </div>
              <div>
                <p className="text-xs font-medium uppercase tracking-[0.22em] text-slate-500">
                  Today&apos;s Load
                </p>
                <p className="text-sm text-slate-200">Incident distribution</p>
              </div>
            </div>
          </header>
          <p className="text-xs text-slate-400">
            Use the left navigation to drill into live SOS alerts, logistics, and responder
            onboarding. This surface stays intentionally simple as a quick-glance heartbeat.
          </p>
        </div>

        <div className={metricCardBase}>
          <header className="mb-3 flex items-center justify-between">
            <p className="text-xs font-medium uppercase tracking-[0.22em] text-slate-500">
              Broadcast
            </p>
            <span className="chip-muted">{stats.announcements} announcements</span>
          </header>
          <p className="text-sm text-slate-200">
            Use the Announcements view to push updated instructions, weather bulletins, or
            evacuation info to all users of the JalSamadhan mobile app.
          </p>
        </div>
      </section>
    </div>
  )
}

function MetricCard({ icon: Icon, label, value, accent, chip }) {
  return (
    <article className={metricCardBase}>
      <div className="flex items-center justify-between gap-2">
        <div className="flex flex-col gap-1">
          <p className="text-xs font-medium uppercase tracking-[0.22em] text-slate-500">
            {label}
          </p>
          <p className="flex items-baseline gap-2">
            <span className="text-2xl font-semibold text-slate-50">{value}</span>
          </p>
        </div>
        <div
          className={
            'inline-flex h-9 w-9 items-center justify-center rounded-2xl bg-slate-900/90 ring-1 ring-slate-700/80 ' +
            accent
          }
        >
          <Icon className="h-4 w-4" />
        </div>
      </div>

      <div className="mt-3 flex items-center justify-between gap-2 text-[11px]">
        <span className="chip-muted">{chip}</span>
      </div>
    </article>
  )
}

