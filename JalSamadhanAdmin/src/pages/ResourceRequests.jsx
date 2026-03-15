import { GitPullRequestArrow, Package, Truck } from 'lucide-react'
import { useEffect, useState } from 'react'
import { fetchResourceRequests, updateResourceRequest } from '../api/firebase.js'

export default function ResourceRequests() {
  const [requests, setRequests] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [updatingId, setUpdatingId] = useState(null)

  useEffect(() => {
    let cancelled = false

    async function load() {
      if (cancelled) return
      setError('')
      try {
        const data = await fetchResourceRequests()
        if (!cancelled) {
          setRequests(data)
          setLoading(false)
        }
      } catch {
        if (!cancelled) {
          setError('Unable to load resource requests.')
          setLoading(false)
        }
      }
    }

    load()
    const intervalId = setInterval(load, 7000)

    return () => {
      cancelled = true
      clearInterval(intervalId)
    }
  }, [])

  async function handleUpdate(id, solvedValue) {
    try {
      setUpdatingId(id)
      await updateResourceRequest(id, solvedValue)
      setRequests((prev) =>
        prev.map((r) => (r.id === id ? { ...r, solved: solvedValue } : r)),
      )
    } catch {
      setError('Failed to update request.')
    } finally {
      setUpdatingId(null)
    }
  }

  return (
    <div className="flex h-full flex-col gap-4">
      <header className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h1 className="flex items-center gap-2 text-lg font-semibold text-slate-50 sm:text-xl">
            <GitPullRequestArrow className="h-5 w-5 text-cyan-300" />
            Resource Requests
          </h1>
          <p className="max-w-xl text-sm text-slate-400">
            View and resolve requests for food, water, shelter, and medical assistance
            submitted from the JalSamadhan user app.
          </p>
        </div>
      </header>

      <section className="glass-panel glass-panel-hover flex min-h-[260px] flex-col overflow-hidden">
        <div className="flex items-center justify-between border-b border-slate-800/80 px-4 py-2.5 text-xs text-slate-400">
          <div className="flex items-center gap-2">
            <Package className="h-4 w-4 text-sky-300" />
            <span>Logistics queue</span>
          </div>
          <span className="chip-muted">
            {requests.filter((r) => !r.solved).length} open
          </span>
        </div>

        <div className="flex-1 overflow-auto">
          {loading && (
            <div className="flex h-40 items-center justify-center text-xs text-slate-400">
              Loading requests…
            </div>
          )}
          {!loading && error && (
            <div className="flex h-40 items-center justify-center text-xs text-rose-300">
              {error}
            </div>
          )}
          {!loading && !error && requests.length === 0 && (
            <div className="flex h-40 items-center justify-center text-xs text-slate-400">
              No requests received yet.
            </div>
          )}
          {!loading && !error && requests.length > 0 && (
            <table className="min-w-full text-left text-[11px] sm:text-xs">
              <thead className="sticky top-0 bg-slate-950/95 text-[10px] uppercase tracking-[0.18em] text-slate-500">
                <tr>
                  <th className="px-4 py-2 font-medium">Location</th>
                  <th className="px-2 py-2 font-medium">Category</th>
                  <th className="px-2 py-2 font-medium">Details</th>
                  <th className="px-2 py-2 font-medium">Status</th>
                  <th className="px-2 py-2 font-medium text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/80">
                {requests.map((req) => (
                  <tr key={req.id} className="hover:bg-slate-900/60">
                    <td className="px-4 py-2.5">
                      <div className="flex flex-col">
                        <span className="text-xs font-medium text-slate-100">
                          {req.add || 'No address'}
                        </span>
                        <span className="text-[11px] text-slate-500">
                          Lat {req.latitude?.toFixed?.(3) ?? 'n/a'}, Lng{' '}
                          {req.longitude?.toFixed?.(3) ?? 'n/a'}
                        </span>
                      </div>
                    </td>
                    <td className="px-2 py-2.5">
                      <span className="chip-muted">
                        {String(req.cat || 'general').toUpperCase()}
                      </span>
                    </td>
                    <td className="px-2 py-2.5">
                      <span className="text-xs text-slate-200">
                        {req.details || 'n/a'}
                      </span>
                    </td>
                    <td className="px-2 py-2.5">
                      <span
                        className={
                          'inline-flex rounded-full px-2 py-0.5 text-[11px] ' +
                          (req.solved
                            ? 'bg-emerald-500/10 text-emerald-300 border border-emerald-400/40'
                            : 'bg-amber-500/10 text-amber-300 border border-amber-400/40')
                        }
                      >
                        {req.solved ? 'FULFILLED' : 'PENDING'}
                      </span>
                    </td>
                    <td className="px-2 py-2.5 text-right">
                      <div className="flex justify-end gap-1.5">
                        {!req.solved && (
                          <button
                            type="button"
                            onClick={() => handleUpdate(req.id, 1)}
                            disabled={updatingId === req.id}
                            className="rounded-full border border-emerald-400/40 bg-emerald-500/10 px-2 py-0.5 text-[11px] text-emerald-100 hover:border-emerald-300/70 disabled:opacity-50"
                          >
                            Fulfilled
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

