import { useState } from 'react'
import { Toaster } from 'react-hot-toast'
import AppLayout from './layouts/AppLayout'
import type { NavKey } from './components/layout/Sidebar'
import DashboardPage from './pages/DashboardPage'

export default function App() {
  const [activePage, setActivePage] = useState<NavKey>('dashboard')

  return (
    <AppLayout activePage={activePage} onNavigate={setActivePage}>
      <Toaster position="top-right" />
      <DashboardPage activePage={activePage} />
    </AppLayout>
  )
}
