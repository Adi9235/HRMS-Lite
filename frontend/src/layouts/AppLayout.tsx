import { useState } from 'react'
import type { PropsWithChildren } from 'react'
import Sidebar from '../components/layout/Sidebar'
import type { NavKey } from '../components/layout/Sidebar'

interface AppLayoutProps extends PropsWithChildren {
  activePage?: NavKey
  onNavigate?: (key: NavKey) => void
}

export default function AppLayout({ children, activePage = 'dashboard', onNavigate }: AppLayoutProps) {
  return (
    <div className="page-shell">
      <aside>
        <Sidebar active={activePage} onChange={onNavigate || (() => {})} />
      </aside>
      <main className="content">{children}</main>
    </div>
  )
}
