import { MapContainer, Marker, Popup, TileLayer } from 'react-leaflet'
import L from 'leaflet'
import { AlertTriangle, Clock, MapPin, Trash2 } from 'lucide-react'
import { useEffect, useMemo, useState } from 'react'
import { fetchSOSAlerts, updateSOSAlertStatus, deleteSOSAlert } from '../api/firebase.js'

// Fix default Leaflet marker path for bundlers
const DefaultIcon = new L.Icon({
  iconUrl:
    'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon.png',
  shadowUrl:
    'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41],
})
L.Marker.prototype.options.icon = DefaultIcon

export default function SOSAlerts() {
  const [alerts, setAlerts] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [updatingId, setUpdatingId] = useState(null)
  const [selectedAlert, setSelectedAlert] = useState(null)
  const [deleteConfirm, setDeleteConfirm] = useState(null)

  // Debug: Log alerts count changes
  console.log('Alerts count:', alerts.length)

  useEffect(() => {
    let cancelled = false

    async function load() {
      if (cancelled) return
      setError('')
      try {
        const data = await fetchSOSAlerts()
        if (!cancelled) {
          console.log('Fetched alerts:', data.length, 'alerts')
          setAlerts(data)
          setLoading(false)
        }
      } catch (e) {
        if (!cancelled) {
          setError('Unable to load SOS alerts from Firebase.')
          setLoading(false)
        }
      }
    }

    // initial load
    load()
    // lightweight polling for near realtime updates
    const intervalId = setInterval(load, 5000)

    return () => {
      cancelled = true
      clearInterval(intervalId)
    }
  }, [])

  const center = useMemo(() => {
    const firstWithCoords = alerts.find((a) => a.lat && a.lng)
    if (firstWithCoords) return [firstWithCoords.lat, firstWithCoords.lng]
    return [22.5937, 78.9629] // India centroid fallback
  }, [alerts])

  async function handleStatusChange(id, nextStatus) {
    try {
      setUpdatingId(id)
      await updateSOSAlertStatus(id, nextStatus)
      setAlerts((prev) =>
        prev.map((a) => (a.id === id ? { ...a, status: nextStatus } : a)),
      )
    } catch {
      setError('Failed to update alert status.')
    } finally {
      setUpdatingId(null)
    }
  }

  async function handleDelete(id) {
    try {
      setUpdatingId(id)
      const result = await deleteSOSAlert(id)
      if (result.success) {
        setAlerts((prev) => prev.filter((a) => a.id !== id))
        setDeleteConfirm(null)
        setError('') // Clear any previous errors
      }
    } catch (error) {
      console.error('Delete failed:', error)
      setError('Failed to delete alert. Please try again.')
    } finally {
      setUpdatingId(null)
    }
  }

  return (
    <div className="flex flex-col gap-4">
      <header className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h1 className="flex items-center gap-2 text-lg font-semibold text-slate-50 sm:text-xl">
            <AlertTriangle className="h-5 w-5 text-amber-300" />
            SOS Alerts
          </h1>
          <p className="max-w-xl text-sm text-slate-400">
            Live distress calls from the field. Use this view to see location, severity, and
            quickly mark cases as acknowledged or resolved.
          </p>
        </div>
      </header>

      <section className="flex gap-6">
        <div className="flex-1">
          <div className="glass-panel glass-panel-hover flex flex-col">
            <div className="flex items-center justify-between border-b border-slate-800/80 px-4 py-2.5 text-xs text-slate-400">
              <span>Active alerts</span>
              <span className="chip-muted">
                {alerts.filter((a) => a.status !== 'resolved').length} open
              </span>
            </div>

            <div className="min-h-[200px]">
              {loading && (
                <div className="flex h-40 items-center justify-center text-xs text-slate-400">
                  Loading SOS alerts…
                </div>
              )}
              {!loading && error && (
                <div className="flex h-40 items-center justify-center text-xs text-rose-300">
                  {error}
                </div>
              )}
              {!loading && !error && alerts.length === 0 && (
                <div className="flex h-40 items-center justify-center text-xs text-slate-400">
                  No alerts received yet.
                </div>
              )}
              {!loading && !error && alerts.length > 0 && (
                <table className="min-w-full text-left text-[11px] sm:text-xs">
                  <thead className="sticky top-0 bg-slate-950/95 text-[10px] uppercase tracking-[0.18em] text-slate-500">
                    <tr>
                      <th className="px-4 py-2 font-medium">User</th>
                      <th className="px-2 py-2 font-medium">Severity</th>
                      <th className="px-2 py-2 font-medium">Status</th>
                      <th className="px-2 py-2 font-medium">Time</th>
                      <th className="px-2 py-2 font-medium text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-800/80">
                    {alerts.map((alert) => (
                      <tr key={alert.id} className="hover:bg-slate-900/60">
                        <td className="px-4 py-2.5">
                          <div className="flex flex-col">
                            <span className="text-xs font-medium text-slate-100">
                              {alert.name || 'Unknown user'}
                            </span>
                            <span className="text-[11px] text-slate-500">
                              {alert.phone || alert.id}
                            </span>
                          </div>
                        </td>
                        <td className="px-2 py-2.5">
                          <span className="chip-muted">
                            {String(alert.category || alert.severity || 'N/A').toUpperCase()}
                          </span>
                        </td>
                        <td className="px-2 py-2.5">
                          <span
                            className={
                              'inline-flex rounded-full px-2 py-0.5 text-[11px] ' +
                              (alert.status === 'resolved'
                                ? 'bg-emerald-500/10 text-emerald-300 border border-emerald-400/40'
                                : alert.status === 'acknowledged'
                                ? 'bg-amber-500/10 text-amber-300 border border-amber-400/40'
                                : 'bg-rose-500/10 text-rose-300 border border-rose-400/40')
                            }
                          >
                            {String(alert.status || 'new').toUpperCase()}
                          </span>
                        </td>
                        <td className="px-2 py-2.5">
                          <div className="flex items-center gap-1 text-[11px] text-slate-400">
                            <Clock className="h-3 w-3" />
                            <span>
                              {alert.timestamp
                                ? new Date(alert.timestamp).toLocaleTimeString([], {
                                    hour: '2-digit',
                                    minute: '2-digit',
                                  })
                                : 'n/a'}
                            </span>
                          </div>
                        </td>
                        <td className="px-2 py-2.5 text-right">
                          <div className="flex justify-end gap-1.5">
                            {alert.status !== 'acknowledged' && alert.status !== 'resolved' && (
                              <button
                                type="button"
                                onClick={() => {
                                  setSelectedAlert(alert)
                                  handleStatusChange(alert.id, 'acknowledged')
                                }}
                                disabled={updatingId === alert.id}
                                className="rounded-full border border-amber-400/40 bg-amber-500/10 px-2 py-0.5 text-[11px] text-amber-100 hover:border-amber-300/70 disabled:opacity-50"
                              >
                                Ack
                              </button>
                            )}
                            {alert.status !== 'resolved' && (
                              <button
                                type="button"
                                onClick={() => handleStatusChange(alert.id, 'resolved')}
                                disabled={updatingId === alert.id}
                                className="rounded-full border border-emerald-400/40 bg-emerald-500/10 px-2 py-0.5 text-[11px] text-emerald-100 hover:border-emerald-300/70 disabled:opacity-50"
                              >
                                Resolve
                              </button>
                            )}
                            <button
                              type="button"
                              onClick={() => setDeleteConfirm(alert.id)}
                              disabled={updatingId === alert.id}
                              className="rounded-full border border-rose-400/40 bg-rose-500/10 px-2 py-0.5 text-[11px] text-rose-100 hover:border-rose-300/70 disabled:opacity-50"
                              title="Delete alert"
                            >
                              <Trash2 className="h-3 w-3" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </div>

            {selectedAlert && (
              <div className="border-t border-slate-800/80 bg-slate-950/80 px-4 py-3 text-xs text-slate-200">
                <div className="flex items-start justify-between gap-3">
                  <div className="space-y-1">
                    <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-slate-500">
                      Additional details
                    </p>
                    <p className="text-sm text-slate-100">
                      {selectedAlert.details || 'No extra details provided.'}
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={() => setSelectedAlert(null)}
                    className="text-[11px] text-slate-400 hover:text-slate-200"
                  >
                    Close
                  </button>
                </div>
              </div>
            )}

            {deleteConfirm && (
              <div className="border-t border-slate-800/80 bg-slate-950/80 px-4 py-3 text-xs text-slate-200">
                <div className="flex items-start justify-between gap-3">
                  <div className="space-y-1">
                    <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-rose-400">
                      Confirm Delete
                    </p>
                    <p className="text-sm text-slate-100">
                      Are you sure you want to delete this SOS alert? This action cannot be undone.
                    </p>
                    <div className="flex gap-2 mt-2">
                      <button
                        type="button"
                        onClick={() => handleDelete(deleteConfirm)}
                        disabled={updatingId === deleteConfirm}
                        className="rounded-full border border-rose-400/40 bg-rose-500/20 px-3 py-1 text-[11px] text-rose-100 hover:border-rose-300/70 disabled:opacity-50"
                      >
                        {updatingId === deleteConfirm ? 'Deleting...' : 'Delete'}
                      </button>
                      <button
                        type="button"
                        onClick={() => setDeleteConfirm(null)}
                        className="rounded-full border border-slate-400/40 bg-slate-500/20 px-3 py-1 text-[11px] text-slate-100 hover:border-slate-300/70"
                      >
                        Cancel
                      </button>
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={() => setDeleteConfirm(null)}
                    className="text-[11px] text-slate-400 hover:text-slate-200"
                  >
                    ✕
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>

        <div className="w-[420px] flex flex-col">
          <div className="glass-panel glass-panel-hover flex flex-col flex-1">
            <div className="flex items-center justify-between border-b border-slate-800/80 px-4 py-2.5 text-xs text-slate-400">
              <div className="flex items-center gap-2">
                <MapPin className="h-4 w-4 text-cyan-300" />
                <span>Incident map</span>
              </div>
            </div>
            <div className="flex-1 rounded-lg overflow-hidden">
              <MapContainer
                center={center}
                zoom={5}
                className="h-full w-full"
                style={{ height: '100%', width: '100%' }}
                zoomControl={false}
              >
                <TileLayer
                  url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                  attribution="&copy; OpenStreetMap contributors"
                />
                {alerts
                  .filter((alert) => alert.lat && alert.lng)
                  .map((alert) => (
                    <Marker key={alert.id} position={[alert.lat, alert.lng]}>
                      <Popup>
                        <div className="space-y-1 text-xs">
                          <p className="font-semibold">{alert.name || 'Unknown user'}</p>
                          <p className="text-slate-500">{alert.phone}</p>
                          <p className="text-[11px] text-slate-400">
                            Category: {String(alert.category || alert.severity || 'N/A').toUpperCase()}
                          </p>
                        </div>
                      </Popup>
                    </Marker>
                  ))}
              </MapContainer>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}

