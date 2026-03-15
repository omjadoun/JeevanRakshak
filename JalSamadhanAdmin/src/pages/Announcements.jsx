import { Megaphone, Send } from 'lucide-react'
import { useEffect, useState } from 'react'
import { createAnnouncement, fetchAnnouncements } from '../api/firebase.js'

export default function Announcements() {
  const [announcements, setAnnouncements] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const [form, setForm] = useState({
    title: '',
    body: '',
    audience: 'all',
  })

  useEffect(() => {
    async function load() {
      setLoading(true)
      setError('')
      try {
        const data = await fetchAnnouncements()
        const sorted = [...data].sort((a, b) =>
          String(b.createdAt || '').localeCompare(String(a.createdAt || '')),
        )
        setAnnouncements(sorted)
      } catch {
        setError('Unable to load announcements.')
      } finally {
        setLoading(false)
      }
    }

    load()
  }, [])

  function handleChange(e) {
    const { name, value } = e.target
    setForm((prev) => ({ ...prev, [name]: value }))
  }

  async function handleSubmit(e) {
    e.preventDefault()
    if (!form.title.trim() || !form.body.trim()) return
    try {
      setSubmitting(true)
      setError('')
      const payload = {
        title: form.title.trim(),
        body: form.body.trim(),
        audience: form.audience,
      }
      const created = await createAnnouncement(payload)
      setAnnouncements((prev) => [
        {
          id: created?.name || String(Date.now()),
          ...payload,
          createdAt: new Date().toISOString(),
        },
        ...prev,
      ])
      setForm({ title: '', body: '', audience: 'all' })
    } catch {
      setError('Failed to push announcement to Firebase.')
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className="flex h-full flex-col gap-4">
      <header className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h1 className="flex items-center gap-2 text-lg font-semibold text-slate-50 sm:text-xl">
            <Megaphone className="h-5 w-5 text-sky-300" />
            Announcements
          </h1>
          <p className="max-w-xl text-sm text-slate-400">
            Broadcast time-sensitive information to all JalSamadhan users. Messages are stored
            in Firebase and can be consumed by the mobile app.
          </p>
        </div>
      </header>

      <section className="grid gap-4 lg:grid-cols-[minmax(0,1.1fr)_minmax(0,1.2fr)]">
        <form
          onSubmit={handleSubmit}
          className="glass-panel glass-panel-hover flex flex-col gap-3 p-4 sm:p-5"
        >
          <div className="flex items-center justify-between gap-2">
            <p className="text-xs font-medium uppercase tracking-[0.22em] text-slate-500">
              New Announcement
            </p>
            <span className="chip-muted">Push to Firebase</span>
          </div>

          <label className="space-y-1">
            <span className="text-xs text-slate-300">Title</span>
            <input
              type="text"
              name="title"
              value={form.title}
              onChange={handleChange}
              placeholder="Short headline (e.g. &quot;Heavy rainfall alert&quot;)"
              className="w-full rounded-xl border border-slate-700/80 bg-slate-950/70 px-3 py-2 text-sm text-slate-100 outline-none ring-0 placeholder:text-slate-600 focus:border-cyan-400/70"
            />
          </label>

          <label className="space-y-1">
            <span className="text-xs text-slate-300">Message</span>
            <textarea
              name="body"
              rows={4}
              value={form.body}
              onChange={handleChange}
              placeholder="Clear, actionable information for affected users…"
              className="w-full resize-none rounded-xl border border-slate-700/80 bg-slate-950/70 px-3 py-2 text-sm text-slate-100 outline-none ring-0 placeholder:text-slate-600 focus:border-cyan-400/70"
            />
          </label>

          <label className="space-y-1">
            <span className="text-xs text-slate-300">Audience</span>
            <select
              name="audience"
              value={form.audience}
              onChange={handleChange}
              className="w-full rounded-xl border border-slate-700/80 bg-slate-950/70 px-3 py-2 text-sm text-slate-100 outline-none ring-0 focus:border-cyan-400/70"
            >
              <option value="all">All users</option>
              <option value="high-risk">High-risk zones</option>
              <option value="responders">Responders only</option>
            </select>
          </label>

          <button
            type="submit"
            disabled={submitting || !form.title.trim() || !form.body.trim()}
            className="mt-1 inline-flex items-center justify-center rounded-xl border border-cyan-400/60 bg-cyan-500/20 px-3 py-2 text-xs font-medium text-cyan-50 shadow-[0_18px_40px_rgba(8,47,73,0.9)] transition hover:border-cyan-300/80 hover:bg-cyan-500/25 disabled:opacity-60"
          >
            <Send className="mr-1.5 h-3.5 w-3.5" />
            Push announcement
          </button>

          {error && (
            <p className="mt-1 text-xs text-rose-300" aria-live="polite">
              {error}
            </p>
          )}
        </form>

        <div className="glass-panel glass-panel-hover flex min-h-[260px] flex-col overflow-hidden">
          <div className="flex items-center justify-between border-b border-slate-800/80 px-4 py-2.5 text-xs text-slate-400">
            <span>Recent announcements</span>
            <span className="chip-muted">{announcements.length} stored</span>
          </div>
          <div className="flex-1 space-y-2 overflow-auto p-3">
            {loading && (
              <div className="flex h-40 items-center justify-center text-xs text-slate-400">
                Loading announcements…
              </div>
            )}
            {!loading && !error && announcements.length === 0 && (
              <div className="flex h-40 items-center justify-center text-xs text-slate-400">
                Nothing broadcast yet.
              </div>
            )}
            {!loading &&
              announcements.map((a) => (
                <article
                  key={a.id}
                  className="rounded-2xl border border-slate-800/80 bg-slate-950/80 px-3 py-2.5 text-xs text-slate-200"
                >
                  <div className="mb-1 flex items-center justify-between gap-2">
                    <h2 className="text-[13px] font-medium text-slate-50">
                      {a.title || 'Untitled'}
                    </h2>
                    <span className="chip-muted">
                      {String(a.audience || 'all').toUpperCase()}
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-300">{a.body}</p>
                  <p className="mt-1 text-[10px] text-slate-500">
                    {a.createdAt
                      ? new Date(a.createdAt).toLocaleString()
                      : 'Timestamp missing'}
                  </p>
                </article>
              ))}
          </div>
        </div>
      </section>
    </div>
  )
}

