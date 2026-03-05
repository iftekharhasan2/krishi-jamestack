import { Link, useNavigate, useLocation } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import { getInitials } from '../../utils/helpers'
import { useState, useRef, useEffect } from 'react'
import { BookOpen, Bell, Menu, X, ChevronDown, LogOut, User, LayoutDashboard, Settings, GraduationCap } from 'lucide-react'

export default function Navbar() {
  const { user, logout } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()
  const [menuOpen, setMenuOpen] = useState(false)
  const [dropOpen, setDropOpen] = useState(false)
  const dropRef = useRef(null)

  useEffect(() => {
    function handler(e) {
      if (dropRef.current && !dropRef.current.contains(e.target)) setDropOpen(false)
    }
    document.addEventListener('mousedown', handler)
    return () => document.removeEventListener('mousedown', handler)
  }, [])

  const handleLogout = () => {
    logout()
    navigate('/')
    setDropOpen(false)
  }

  const getDashboardLink = () => {
    if (user?.role === 'admin') return '/admin'
    if (user?.role === 'instructor') return '/instructor'
    return '/dashboard'
  }

  const navLinks = [
    { label: 'Courses', to: '/courses' },
    { label: 'Categories', to: '/courses?category=' },
  ]

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-white/95 backdrop-blur-md border-b border-slate-100 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2.5 group">
            <div className="w-8 h-8 bg-slate-900 rounded-lg flex items-center justify-center group-hover:bg-violet-600 transition-colors duration-200">
              <GraduationCap className="w-4.5 h-4.5 text-white" size={18} />
            </div>
            <span className="font-display font-bold text-xl text-slate-900">LearnFlow</span>
          </Link>

          {/* Desktop Nav */}
          <div className="hidden md:flex items-center gap-6">
            {navLinks.map(link => (
              <Link
                key={link.label}
                to={link.to}
                className={`text-sm font-medium transition-colors duration-200 hover:text-slate-900 ${
                  location.pathname === link.to ? 'text-slate-900' : 'text-slate-500'
                }`}
              >
                {link.label}
              </Link>
            ))}
          </div>

          {/* Actions */}
          <div className="hidden md:flex items-center gap-3">
            {user ? (
              <div className="flex items-center gap-3">
                <Link to={getDashboardLink()} className="btn-secondary text-xs py-2 px-4">
                  <LayoutDashboard size={14} /> Dashboard
                </Link>
                <div className="relative" ref={dropRef}>
                  <button
                    onClick={() => setDropOpen(!dropOpen)}
                    className="flex items-center gap-2 hover:bg-slate-50 rounded-xl px-3 py-2 transition-colors"
                  >
                    {user.avatar ? (
                      <img src={user.avatar} alt="" className="w-8 h-8 rounded-full object-cover ring-2 ring-slate-100" />
                    ) : (
                      <div className="w-8 h-8 rounded-full bg-gradient-to-br from-violet-500 to-blue-500 flex items-center justify-center text-white text-xs font-bold">
                        {getInitials(user.full_name)}
                      </div>
                    )}
                    <span className="text-sm font-medium text-slate-700 max-w-[120px] truncate">{user.full_name}</span>
                    <ChevronDown size={14} className={`text-slate-400 transition-transform ${dropOpen ? 'rotate-180' : ''}`} />
                  </button>

                  {dropOpen && (
                    <div className="absolute right-0 top-full mt-2 w-56 bg-white rounded-2xl border border-slate-100 shadow-xl py-1.5 animate-slide-up">
                      <div className="px-4 py-3 border-b border-slate-50">
                        <p className="text-sm font-semibold text-slate-800">{user.full_name}</p>
                        <p className="text-xs text-slate-500 mt-0.5">{user.email}</p>
                        <span className="badge mt-1.5 bg-violet-50 text-violet-700 capitalize">{user.role}</span>
                      </div>
                      <Link to="/profile" className="flex items-center gap-2.5 px-4 py-2.5 text-sm text-slate-700 hover:bg-slate-50 transition-colors" onClick={() => setDropOpen(false)}>
                        <User size={15} className="text-slate-400" /> Profile
                      </Link>
                      <Link to={getDashboardLink()} className="flex items-center gap-2.5 px-4 py-2.5 text-sm text-slate-700 hover:bg-slate-50 transition-colors" onClick={() => setDropOpen(false)}>
                        <LayoutDashboard size={15} className="text-slate-400" /> Dashboard
                      </Link>
                      <div className="border-t border-slate-50 mt-1">
                        <button onClick={handleLogout} className="flex items-center gap-2.5 px-4 py-2.5 text-sm text-red-600 hover:bg-red-50 transition-colors w-full text-left">
                          <LogOut size={15} /> Logout
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <Link to="/login" className="btn-secondary py-2 px-4 text-xs">Sign in</Link>
                <Link to="/register" className="btn-primary py-2 px-4 text-xs">Get Started</Link>
              </div>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button className="md:hidden p-2 rounded-lg text-slate-600 hover:bg-slate-50" onClick={() => setMenuOpen(!menuOpen)}>
            {menuOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {menuOpen && (
        <div className="md:hidden border-t border-slate-100 bg-white px-4 py-4 space-y-2 animate-slide-up">
          {navLinks.map(link => (
            <Link key={link.label} to={link.to} className="block py-2.5 text-sm font-medium text-slate-600 hover:text-slate-900" onClick={() => setMenuOpen(false)}>
              {link.label}
            </Link>
          ))}
          <div className="pt-3 border-t border-slate-100 flex flex-col gap-2">
            {user ? (
              <>
                <Link to={getDashboardLink()} className="btn-secondary justify-center" onClick={() => setMenuOpen(false)}>Dashboard</Link>
                <Link to="/profile" className="btn-secondary justify-center" onClick={() => setMenuOpen(false)}>Profile</Link>
                <button onClick={handleLogout} className="btn-secondary justify-center text-red-600 border-red-100">Logout</button>
              </>
            ) : (
              <>
                <Link to="/login" className="btn-secondary justify-center" onClick={() => setMenuOpen(false)}>Sign in</Link>
                <Link to="/register" className="btn-primary justify-center" onClick={() => setMenuOpen(false)}>Get Started</Link>
              </>
            )}
          </div>
        </div>
      )}
    </nav>
  )
}
