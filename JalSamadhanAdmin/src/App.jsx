import { Outlet, Route, Routes, useLocation, Navigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { Sidebar } from './components/Sidebar.jsx'
import { Topbar } from './components/Topbar.jsx'
import Dashboard from './pages/Dashboard.jsx'
import SOSAlerts from './pages/SOSAlerts.jsx'
import ResourceRequests from './pages/ResourceRequests.jsx'
import Contributors from './pages/Contributors.jsx'
import Announcements from './pages/Announcements.jsx'

function AppShell() {
  const location = useLocation()

  return (
    <div className="flex min-h-screen w-full bg-slate-950 text-slate-100">
      <Sidebar />

      <div className="flex flex-1 flex-col min-h-0">
        <Topbar />
        <main className="relative flex-1 overflow-y-auto px-6 pb-6 pt-4 lg:px-8 lg:pb-8 lg:pt-6">
          <div className="pointer-events-none absolute inset-0 -z-10 bg-[radial-gradient(circle_at_top,_rgba(56,189,248,0.16),_transparent_60%),radial-gradient(circle_at_bottom,_rgba(59,130,246,0.15),_transparent_55%)] opacity-60" />

          <div className="mx-auto max-w-6xl">
            <AnimatePresence mode="wait">
              <motion.div
                key={location.pathname}
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -12 }}
                transition={{ duration: 0.25, ease: 'easeOut' }}
                className="w-full"
              >
                <Outlet />
              </motion.div>
            </AnimatePresence>
          </div>
        </main>
      </div>
    </div>
  )
}

function App() {
  return (
    <Routes>
      <Route element={<AppShell />}>
        <Route index element={<Dashboard />} />
        <Route path="/sos-alerts" element={<SOSAlerts />} />
        <Route path="/resource-requests" element={<ResourceRequests />} />
        <Route path="/contributors" element={<Contributors />} />
        <Route path="/announcements" element={<Announcements />} />
      </Route>
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  )
}

export default App
