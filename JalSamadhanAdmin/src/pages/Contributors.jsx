import { Check, ShieldCheck, ShieldX, UserRound } from 'lucide-react'
import { useEffect, useState } from 'react'
import { approveContributor, fetchContributors } from '../api/firebase.js'

export default function Contributors() {
  const [rows, setRows] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [updatingId, setUpdatingId] = useState(null)

  useEffect(() => {
    let cancelled = false

    async function load() {
      if (cancelled) return
      setError('')
      try {
        const data = await fetchContributors()
        if (!cancelled) {
          setRows(data)
          setLoading(false)
        }
      } catch {
        if (!cancelled) {
          setError('Unable to load responder KYC data.')
          setLoading(false)
        }
      }
    }

    load()
    const intervalId = setInterval(load, 10000)

    return () => {
      cancelled = true
      clearInterval(intervalId)
    }
  }, [])

  async function handleApprove(id, approved) {
    try {
      setUpdatingId(id)
      await approveContributor(id, approved)
      setRows((prev) =>
        prev.map((c) => (c.id === id ? { ...c, approved } : c)),
      )
    } catch {
      setError('Failed to update KYC status.')
    } finally {
      setUpdatingId(null)
    }
  }

  return (
    <div className="flex h-full flex-col gap-4">
      <header className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h1 className="flex items-center gap-2 text-lg font-semibold text-slate-50 sm:text-xl">
            <ShieldCheck className="h-5 w-5 text-emerald-300" />
            Responders &amp; KYC
          </h1>
          <p className="max-w-xl text-sm text-slate-400">
            Approve verified first responders, NGOs, and volunteers before they are allowed to
            act on SOS alerts and requests in JalSamadhan.
          </p>
        </div>
      </header>

      <section className="glass-panel glass-panel-hover flex min-h-[260px] flex-col overflow-hidden">
        <div className="flex items-center justify-between border-b border-slate-800/80 px-4 py-2.5 text-xs text-slate-400">
          <div className="flex items-center gap-2">
            <UserRound className="h-4 w-4 text-sky-300" />
            <span>Responder roster</span>
          </div>
          <span className="chip-muted">
            {rows.filter((c) => !c.approved).length} pending review
          </span>
        </div>

        <div className="flex-1 overflow-auto">
          {loading && (
            <div className="flex h-40 items-center justify-center text-xs text-slate-400">
              Loading responders…
            </div>
          )}
          {!loading && error && (
            <div className="flex h-40 items-center justify-center text-xs text-rose-300">
              {error}
            </div>
          )}
          {!loading && !error && rows.length === 0 && (
            <div className="flex h-40 items-center justify-center text-xs text-slate-400">
              No responders registered yet.
            </div>
          )}
          {!loading && !error && rows.length > 0 && (
            <table className="min-w-full text-left text-[11px] sm:text-xs">
              <thead className="sticky top-0 bg-slate-950/95 text-[10px] uppercase tracking-[0.18em] text-slate-500">
                <tr>
                  <th className="px-4 py-2 font-medium">Name</th>
                  <th className="px-2 py-2 font-medium">Category / State</th>
                  <th className="px-2 py-2 font-medium">Status</th>
                  <th className="px-2 py-2 font-medium text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/80">
                {rows.map((row) => (
                  <tr key={row.id} className="hover:bg-slate-900/60">
                    <td className="px-4 py-2.5">
                      <div className="flex flex-col">
                        <span className="text-xs font-medium text-slate-100">
                          {row.name || 'Unknown'}
                        </span>
                        <span className="text-[11px] text-slate-500">
                          {row.phone || row.email || 'No contact'}
                        </span>
                      </div>
                    </td>
                    <td className="px-2 py-2.5">
                      <span className="chip-muted">
                        {row.organization || row.role || 'Responder'} ·{' '}
                        {row.state || '—'}
                      </span>
                    </td>
                    <td className="px-2 py-2.5">
                      <span
                        className={
                          'inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[11px] ' +
                          (row.approved
                            ? 'bg-emerald-500/10 text-emerald-300 border border-emerald-400/40'
                            : 'bg-amber-500/10 text-amber-300 border border-amber-400/40')
                        }
                      >
                        {row.approved ? (
                          <>
                            <Check className="h-3 w-3" />
                            Approved
                          </>
                        ) : (
                          'Pending'
                        )}
                      </span>
                    </td>
                    <td className="px-2 py-2.5 text-right">
                      <div className="flex justify-end gap-1.5">
                        {!row.approved && (
                          <button
                            type="button"
                            onClick={() => handleApprove(row.id, true)}
                            disabled={updatingId === row.id}
                            className="rounded-full border border-emerald-400/40 bg-emerald-500/10 px-2 py-0.5 text-[11px] text-emerald-100 hover:border-emerald-300/70 disabled:opacity-50"
                          >
                            Approve
                          </button>
                        )}
                        {row.approved && (
                          <button
                            type="button"
                            onClick={() => handleApprove(row.id, false)}
                            disabled={updatingId === row.id}
                            className="rounded-full border border-rose-400/40 bg-rose-500/10 px-2 py-0.5 text-[11px] text-rose-100 hover:border-rose-300/70 disabled:opacity-50"
                          >
                            <ShieldX className="mr-1 h-3 w-3 inline-flex" />
                            Revoke
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </section>
    </div>
  )
}

