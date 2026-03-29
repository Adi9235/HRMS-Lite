import './sidebar.css'
import { LayoutDashboard, Users, Clock, Building2 } from 'lucide-react'

export type NavKey = 'dashboard' | 'employees' | 'attendance'

const menu: { key: NavKey; label: string; icon: React.ReactNode; description: string }[] = [
  { key: 'dashboard', label: 'Dashboard', icon: <LayoutDashboard size={18} />, description: 'Overview & stats' },
  { key: 'employees', label: 'Employees', icon: <Users size={18} />, description: 'Manage your team' },
  { key: 'attendance', label: 'Attendance', icon: <Clock size={18} />, description: 'Track & record' },
]

export default function Sidebar({
  active,
  onChange,
}: {
  active: NavKey
  onChange: (key: NavKey) => void
}) {
  return (
    <div className="sidebar">
      <div className="sidebar-brand">
        <div className="brand-icon">
          <Building2 size={22} />
        </div>
        <div className="brand-text">
          <h2>HRMS Lite</h2>
          <p>Admin Portal</p>
        </div>
      </div>

      <nav className="sidebar-nav">
        <p className="nav-label">Navigation</p>
        {menu.map((item) => (
          <button
            key={item.key}
            className={`menu-item ${active === item.key ? 'active' : ''}`}
            onClick={() => onChange(item.key)}
          >
            <span className="menu-icon">{item.icon}</span>
            <span className="menu-content">
              <span className="menu-label">{item.label}</span>
              <span className="menu-desc">{item.description}</span>
            </span>
          </button>
        ))}
      </nav>

      <div className="sidebar-footer">
        <div className="sidebar-footer-info">
          <div className="footer-dot" />
          <span>System Online</span>
        </div>
      </div>
    </div>
  )
}
