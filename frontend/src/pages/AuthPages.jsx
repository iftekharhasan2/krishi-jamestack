import { useState } from 'react'
import { Link, useNavigate, useSearchParams } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { Eye, EyeOff, GraduationCap, Loader2 } from 'lucide-react'
import toast from 'react-hot-toast'

export function LoginPage() {
  const { login } = useAuth()
  const navigate = useNavigate()
  const [form, setForm] = useState({ email: '', password: '' })
  const [showPass, setShowPass] = useState(false)
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    try {
      const user = await login(form.email, form.password)
      toast.success(`Welcome back, ${user.full_name}!`)
      if (user.role === 'admin') navigate('/admin')
      else if (user.role === 'instructor') navigate('/instructor')
      else navigate('/dashboard')
    } catch (err) {
      toast.error(err.response?.data?.error || 'Login failed')
    } finally {
      setLoading(false)
    }
  }

  return (
    <AuthLayout title="Welcome back" subtitle="Sign in to continue learning">
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="label">Email address</label>
          <input type="email" className="input-field" placeholder="you@example.com"
            value={form.email} onChange={e => setForm({...form, email: e.target.value})} required />
        </div>
        <div>
          <label className="label">Password</label>
          <div className="relative">
            <input type={showPass ? 'text' : 'password'} className="input-field pr-10" placeholder="••••••••"
              value={form.password} onChange={e => setForm({...form, password: e.target.value})} required />
            <button type="button" onClick={() => setShowPass(!showPass)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600">
              {showPass ? <EyeOff size={16} /> : <Eye size={16} />}
            </button>
          </div>
        </div>
        <button type="submit" disabled={loading} className="btn-primary w-full justify-center py-3 text-base mt-2">
          {loading ? <Loader2 size={16} className="animate-spin" /> : 'Sign in'}
        </button>
      </form>
      <p className="text-center text-sm text-slate-500 mt-6">
        Don't have an account?{' '}
        <Link to="/register" className="text-violet-600 font-medium hover:text-violet-700">Create one free</Link>
      </p>
    </AuthLayout>
  )
}

export function RegisterPage() {
  const { register } = useAuth()
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()
  const [form, setForm] = useState({
    full_name: '', email: '', password: '',
    role: searchParams.get('role') || 'student'
  })
  const [showPass, setShowPass] = useState(false)
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    try {
      const res = await register(form)
      toast.success(res.message)
      if (form.role === 'instructor') {
        toast('Your instructor account is pending admin approval.', { icon: '⏳' })
      }
      navigate('/login')
    } catch (err) {
      toast.error(err.response?.data?.error || 'Registration failed')
    } finally {
      setLoading(false)
    }
  }

  return (
    <AuthLayout title="Create your account" subtitle="Start learning for free today">
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="label">Full name</label>
          <input type="text" className="input-field" placeholder="John Doe"
            value={form.full_name} onChange={e => setForm({...form, full_name: e.target.value})} required />
        </div>
        <div>
          <label className="label">Email address</label>
          <input type="email" className="input-field" placeholder="you@example.com"
            value={form.email} onChange={e => setForm({...form, email: e.target.value})} required />
        </div>
        <div>
          <label className="label">Password</label>
          <div className="relative">
            <input type={showPass ? 'text' : 'password'} className="input-field pr-10" placeholder="At least 6 characters"
              value={form.password} onChange={e => setForm({...form, password: e.target.value})} required minLength={6} />
            <button type="button" onClick={() => setShowPass(!showPass)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600">
              {showPass ? <EyeOff size={16} /> : <Eye size={16} />}
            </button>
          </div>
        </div>
        <div>
          <label className="label">I want to</label>
          <div className="grid grid-cols-2 gap-2">
            {['student', 'instructor'].map(r => (
              <button key={r} type="button"
                onClick={() => setForm({...form, role: r})}
                className={`p-3 rounded-xl border text-sm font-medium capitalize transition-all ${
                  form.role === r
                    ? 'border-violet-500 bg-violet-50 text-violet-700'
                    : 'border-slate-200 text-slate-600 hover:border-slate-300'
                }`}>
                {r === 'student' ? '🎓 Learn' : '👨‍🏫 Teach'}
                <span className="block text-xs font-normal mt-0.5 capitalize">{r}</span>
              </button>
            ))}
          </div>
          {form.role === 'instructor' && (
            <p className="text-xs text-amber-600 mt-2 bg-amber-50 rounded-lg px-3 py-2">
              ⚠️ Instructor accounts require admin approval before you can publish courses.
            </p>
          )}
        </div>
        <button type="submit" disabled={loading} className="btn-primary w-full justify-center py-3 text-base mt-2">
          {loading ? <Loader2 size={16} className="animate-spin" /> : 'Create account'}
        </button>
      </form>
      <p className="text-center text-sm text-slate-500 mt-6">
        Already have an account?{' '}
        <Link to="/login" className="text-violet-600 font-medium hover:text-violet-700">Sign in</Link>
      </p>
    </AuthLayout>
  )
}

function AuthLayout({ title, subtitle, children }) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-white flex">
      {/* Left Panel */}
      <div className="hidden lg:flex flex-1 bg-slate-900 items-center justify-center p-12 relative overflow-hidden">
        <div className="absolute inset-0 opacity-20" style={{
          backgroundImage: 'radial-gradient(circle at 30% 70%, #8b5cf6 0%, transparent 50%), radial-gradient(circle at 70% 30%, #3b82f6 0%, transparent 50%)'
        }} />
        <div className="relative text-center">
          <Link to="/" className="flex items-center justify-center gap-3 mb-12">
            <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center">
              <GraduationCap size={24} className="text-slate-900" />
            </div>
            <span className="font-display font-bold text-3xl text-white">LearnFlow</span>
          </Link>
          <blockquote className="text-2xl font-display font-medium text-white leading-relaxed italic max-w-sm">
            "Education is the most powerful weapon which you can use to change the world."
          </blockquote>
          <p className="text-slate-400 mt-4">— Nelson Mandela</p>
        </div>
      </div>

      {/* Right Panel */}
      <div className="flex-1 flex items-center justify-center p-6">
        <div className="w-full max-w-md">
          <Link to="/" className="flex items-center gap-2 mb-8 lg:hidden">
            <GraduationCap size={20} className="text-slate-900" />
            <span className="font-display font-bold text-xl text-slate-900">LearnFlow</span>
          </Link>
          <h1 className="font-display text-3xl font-bold text-slate-900 mb-1">{title}</h1>
          <p className="text-slate-500 mb-8">{subtitle}</p>
          {children}
        </div>
      </div>
    </div>
  )
}
