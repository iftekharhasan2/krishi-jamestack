import { useState, useEffect } from 'react'
import { useAuth } from '../context/AuthContext'
import api from '../api/axios'
import { getInitials, timeAgo } from '../utils/helpers'
import {
  Users, BookOpen, CheckCircle2, XCircle, Clock, Shield,
  Eye, TrendingUp, Loader2, RefreshCw, UserCheck, UserX
} from 'lucide-react'
import toast from 'react-hot-toast'

export default function AdminDashboard() {
  const { user } = useAuth()
  const [stats, setStats] = useState(null)
  const [users, setUsers] = useState([])
  const [courses, setCourses] = useState([])
  const [loading, setLoading] = useState(true)
  const [tab, setTab] = useState('pending') // pending | all_users | courses
  const [actionLoading, setActionLoading] = useState(null)

  useEffect(() => {
    fetchAll()
  }, [])

  const fetchAll = async () => {
    setLoading(true)
    try {
      const [statsRes, usersRes, coursesRes] = await Promise.all([
        api.get('/admin/stats'),
        api.get('/admin/users'),
        api.get('/admin/courses'),
      ])
      setStats(statsRes.data.stats)
      setUsers(usersRes.data.users || [])
      setCourses(coursesRes.data.courses || [])
    } catch (err) {
      toast.error('Failed to load data')
    } finally { setLoading(false) }
  }

  const handleApprove = async (userId) => {
    setActionLoading(userId)
    try {
      await api.put(`/admin/users/${userId}/approve`)
      toast.success('Instructor approved!')
      setUsers(u => u.map(usr => usr.user_id === userId ? {...usr, is_approved: true} : usr))
      setStats(s => ({ ...s, pending_instructors: Math.max(0, (s?.pending_instructors || 0) - 1) }))
    } catch { toast.error('Action failed') }
    finally { setActionLoading(null) }
  }

  const handleRevoke = async (userId) => {
    if (!confirm('Revoke this user\'s access?')) return
    setActionLoading(userId)
    try {
      await api.put(`/admin/users/${userId}/revoke`)
      toast.success('Access revoked')
      setUsers(u => u.map(usr => usr.user_id === userId ? {...usr, is_approved: false, is_active: false} : usr))
    } catch { toast.error('Action failed') }
    finally { setActionLoading(null) }
  }

  const handleActivate = async (userId) => {
    setActionLoading(userId)
    try {
      await api.put(`/admin/users/${userId}/activate`)
      toast.success('User activated')
      setUsers(u => u.map(usr => usr.user_id === userId ? {...usr, is_approved: true, is_active: true} : usr))
    } catch { toast.error('Action failed') }
    finally { setActionLoading(null) }
  }

  const pendingInstructors = users.filter(u => u.role === 'instructor' && !u.is_approved)
  const allInstructors = users.filter(u => u.role === 'instructor')
  const allStudents = users.filter(u => u.role === 'student')

  const STAT_CARDS = stats ? [
    { label: 'Total Users', value: stats.total_users, icon: Users, color: 'text-blue-600 bg-blue-50' },
    { label: 'Students', value: stats.total_students, icon: Users, color: 'text-violet-600 bg-violet-50' },
    { label: 'Instructors', value: stats.total_instructors, icon: Shield, color: 'text-emerald-600 bg-emerald-50' },
    { label: 'Pending Approvals', value: stats.pending_instructors, icon: Clock, color: stats.pending_instructors > 0 ? 'text-amber-600 bg-amber-50' : 'text-slate-500 bg-slate-50' },
    { label: 'Total Courses', value: stats.total_courses, icon: BookOpen, color: 'text-indigo-600 bg-indigo-50' },
    { label: 'Published', value: stats.published_courses, icon: CheckCircle2, color: 'text-teal-600 bg-teal-50' },
  ] : []

  const TABS = [
    { id: 'pending', label: `Pending (${pendingInstructors.length})`, icon: Clock },
    { id: 'instructors', label: `Instructors (${allInstructors.length})`, icon: Shield },
    { id: 'students', label: `Students (${allStudents.length})`, icon: Users },
    { id: 'courses', label: `Courses (${courses.length})`, icon: BookOpen },
  ]

  const UserTable = ({ users: tableUsers }) => (
    <div className="overflow-x-auto">
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b border-slate-100">
            {['User', 'ID', 'Role', 'Status', 'Joined', 'Actions'].map(h => (
              <th key={h} className="text-left py-3 px-4 text-xs font-semibold text-slate-500 uppercase tracking-wide">{h}</th>
            ))}
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-50">
          {tableUsers.map(u => (
            <tr key={u.user_id} className="hover:bg-slate-50/50 transition-colors">
              <td className="py-3 px-4">
                <div className="flex items-center gap-3">
                  {u.avatar ? (
                    <img src={u.avatar} alt="" className="w-8 h-8 rounded-full object-cover" />
                  ) : (
                    <div className="w-8 h-8 rounded-full bg-gradient-to-br from-violet-400 to-blue-400 flex items-center justify-center text-white text-xs font-bold">
                      {getInitials(u.full_name)}
                    </div>
                  )}
                  <div>
                    <p className="font-medium text-slate-800">{u.full_name}</p>
                    <p className="text-xs text-slate-400">{u.email}</p>
                  </div>
                </div>
              </td>
              <td className="py-3 px-4"><span className="badge bg-slate-100 text-slate-600 font-mono">{u.user_id}</span></td>
              <td className="py-3 px-4"><span className={`badge capitalize ${u.role === 'admin' ? 'bg-red-50 text-red-700' : u.role === 'instructor' ? 'bg-violet-50 text-violet-700' : 'bg-blue-50 text-blue-700'}`}>{u.role}</span></td>
              <td className="py-3 px-4">
                <span className={`badge ${u.is_active && u.is_approved ? 'bg-emerald-50 text-emerald-700' : 'bg-amber-50 text-amber-700'}`}>
                  {!u.is_active ? 'Revoked' : u.is_approved ? 'Active' : 'Pending'}
                </span>
              </td>
              <td className="py-3 px-4 text-xs text-slate-400">{timeAgo(u.created_at)}</td>
              <td className="py-3 px-4">
                {u.role !== 'admin' && (
                  <div className="flex gap-1.5">
                    {!u.is_approved && (
                      <button onClick={() => handleApprove(u.user_id)} disabled={actionLoading === u.user_id}
                        className="flex items-center gap-1 px-2.5 py-1.5 bg-emerald-50 hover:bg-emerald-100 text-emerald-700 rounded-lg text-xs font-medium transition-colors">
                        {actionLoading === u.user_id ? <Loader2 size={11} className="animate-spin" /> : <UserCheck size={11} />}
                        Approve
                      </button>
                    )}
                    {u.is_active && u.is_approved && (
                      <button onClick={() => handleRevoke(u.user_id)} disabled={actionLoading === u.user_id}
                        className="flex items-center gap-1 px-2.5 py-1.5 bg-red-50 hover:bg-red-100 text-red-600 rounded-lg text-xs font-medium transition-colors">
                        {actionLoading === u.user_id ? <Loader2 size={11} className="animate-spin" /> : <UserX size={11} />}
                        Revoke
                      </button>
                    )}
                    {!u.is_active && (
                      <button onClick={() => handleActivate(u.user_id)} disabled={actionLoading === u.user_id}
                        className="flex items-center gap-1 px-2.5 py-1.5 bg-blue-50 hover:bg-blue-100 text-blue-600 rounded-lg text-xs font-medium transition-colors">
                        {actionLoading === u.user_id ? <Loader2 size={11} className="animate-spin" /> : <UserCheck size={11} />}
                        Restore
                      </button>
                    )}
                  </div>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      {tableUsers.length === 0 && (
        <div className="text-center py-12 text-slate-400 text-sm">No users found</div>
      )}
    </div>
  )

  return (
    <div className="min-h-screen bg-slate-50/40 pt-20 pb-12">
      <div className="max-w-7xl mx-auto px-6">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="font-display text-3xl font-bold text-slate-900">Admin Panel</h1>
            <p className="text-slate-500 mt-1">Manage users, courses and platform settings</p>
          </div>
          <button onClick={fetchAll} className="btn-secondary text-xs py-2">
            <RefreshCw size={13} /> Refresh
          </button>
        </div>

        {/* Stats Grid */}
        {loading ? (
          <div className="flex items-center justify-center py-16"><Loader2 size={28} className="animate-spin text-violet-500" /></div>
        ) : (
          <>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 mb-8">
              {STAT_CARDS.map(({ label, value, icon: Icon, color }) => (
                <div key={label} className="card p-4 text-center">
                  <div className={`w-9 h-9 rounded-xl flex items-center justify-center mb-2 mx-auto ${color}`}>
                    <Icon size={16} />
                  </div>
                  <p className="font-display text-2xl font-bold text-slate-900">{value}</p>
                  <p className="text-[11px] text-slate-500 mt-0.5 leading-tight">{label}</p>
                </div>
              ))}
            </div>

            {/* Pending Alerts */}
            {pendingInstructors.length > 0 && (
              <div className="bg-amber-50 border border-amber-200 rounded-2xl p-4 mb-6 flex items-center gap-3">
                <Clock size={20} className="text-amber-500 flex-shrink-0" />
                <p className="text-sm text-amber-800">
                  <strong>{pendingInstructors.length}</strong> instructor{pendingInstructors.length > 1 ? 's' : ''} waiting for approval
                </p>
              </div>
            )}

            {/* Tabs */}
            <div className="card overflow-hidden">
              <div className="flex border-b border-slate-100 overflow-x-auto">
                {TABS.map(t => (
                  <button key={t.id} onClick={() => setTab(t.id)}
                    className={`flex items-center gap-2 px-5 py-3.5 text-sm font-medium whitespace-nowrap border-b-2 transition-colors ${
                      tab === t.id ? 'border-slate-900 text-slate-900' : 'border-transparent text-slate-500 hover:text-slate-700'
                    }`}>
                    <t.icon size={14} /> {t.label}
                  </button>
                ))}
              </div>

              <div className="p-4">
                {tab === 'pending' && <UserTable users={pendingInstructors} />}
                {tab === 'instructors' && <UserTable users={allInstructors} />}
                {tab === 'students' && <UserTable users={allStudents} />}
                {tab === 'courses' && (
                  <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                      <thead>
                        <tr className="border-b border-slate-100">
                          {['Course', 'Instructor', 'Students', 'Status', 'Price'].map(h => (
                            <th key={h} className="text-left py-3 px-4 text-xs font-semibold text-slate-500 uppercase tracking-wide">{h}</th>
                          ))}
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-50">
                        {courses.map(c => (
                          <tr key={c.course_id} className="hover:bg-slate-50/50">
                            <td className="py-3 px-4">
                              <div className="flex items-center gap-3">
                                <div className="w-10 h-7 rounded-lg overflow-hidden bg-slate-100 flex-shrink-0">
                                  {c.thumbnail ? <img src={c.thumbnail} alt="" className="w-full h-full object-cover" /> : <div className="w-full h-full flex items-center justify-center"><BookOpen size={12} className="text-slate-300" /></div>}
                                </div>
                                <p className="font-medium text-slate-800 truncate max-w-[200px]">{c.title}</p>
                              </div>
                            </td>
                            <td className="py-3 px-4 text-slate-500 text-xs">{c.instructor_name}</td>
                            <td className="py-3 px-4 text-slate-700">{c.total_students}</td>
                            <td className="py-3 px-4">
                              <span className={`badge ${c.is_published ? 'bg-emerald-50 text-emerald-700' : 'bg-slate-100 text-slate-500'}`}>
                                {c.is_published ? 'Published' : 'Draft'}
                              </span>
                            </td>
                            <td className="py-3 px-4 font-medium text-slate-800">{c.price === 0 ? 'Free' : `$${c.price}`}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                    {courses.length === 0 && <div className="text-center py-12 text-slate-400 text-sm">No courses found</div>}
                  </div>
                )}
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  )
}
