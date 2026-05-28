import { Link, useLocation } from 'react-router-dom'
import { LayoutDashboard, Waves, HelpCircle, Plus, X, BarChart3, Database } from 'lucide-react'
import logo from '../assets/logo_black_cropped.png'

const NAV = [
  { icon: LayoutDashboard, label: 'Dashboard', to: '/dashboard' },
  { icon: Waves, label: 'Create Stream', to: '/create' },
  { icon: BarChart3, label: 'Metrics', to: '/metrics' },
  { icon: Database, label: 'History', to: '/history' },
  { icon: HelpCircle, label: 'How It Works', to: '/how-it-works' },
]

export default function Sidebar({ isOpen, onClose }) {
  const { pathname } = useLocation()

  return (
    <aside className={`app-sidebar ${isOpen ? 'is-open' : ''} bg-white border-r border-outline-variant/65`}>

      {/* Header Container for Logo + Close Button */}
      <div className="px-6 py-5 border-b border-outline-variant/40 flex items-center justify-between">
        <Link
          to="/"
          onClick={onClose}
          className="flex items-center no-underline"
        >
          <img src={logo} alt="LumensFlow" className="h-7 w-auto block filter dark:invert-0" />
        </Link>

        {/* Mobile Close Button */}
        <button
          className="show-mobile bg-none border-none text-on-surface-variant hover:text-primary cursor-pointer p-1"
          onClick={onClose}
        >
          <X size={20} />
        </button>
      </div>

      {/* Nav links */}
      <nav className="flex-1 px-3 py-6 flex flex-col gap-1.5 text-left">
        {NAV.map(({ icon: Icon, label, to }) => {
          const isActive = pathname === to || (to === '/dashboard' && pathname.startsWith('/stream'))
          return (
            <Link
              key={to}
              to={to}
              className={`flex items-center gap-3 px-4 py-3 rounded-xl font-label-sm text-sm font-semibold transition-all duration-200 no-underline border-l-4 ${
                isActive 
                  ? 'bg-secondary text-on-secondary border-secondary font-bold shadow-xs' 
                  : 'bg-transparent text-on-surface-variant border-transparent hover:bg-surface-container-low hover:text-primary'
              }`}
            >
              <Icon size={17} className={isActive ? 'text-on-secondary' : 'text-on-surface-variant/70'} />
              {label}
            </Link>
          )
        })}
      </nav>

      {/* CTA + footer */}
      <div className="p-4 border-t border-outline-variant/40 flex flex-col gap-3">
        <Link to="/create" className="no-underline">
          <button className="w-full bg-secondary text-on-secondary py-3 rounded-xl font-bold flex items-center justify-center gap-2 btn-hover-glow-neon transition-all active:scale-95 border-none cursor-pointer uppercase text-xs tracking-wider">
            <Plus size={15} /> Create
          </button>
        </Link>
      </div>
    </aside>
  )
}
