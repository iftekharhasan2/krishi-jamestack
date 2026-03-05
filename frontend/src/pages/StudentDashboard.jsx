import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import api from '../api/axios'
import { formatDuration, getInitials } from '../utils/helpers'
import { BookOpen, Clock, TrendingUp, Award, Play, ArrowRight, Loader2 } from 'lucide-react'

export default function StudentDashboard() {
  const { user } = useAuth()
  const [courses, setCourses] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    api.get('/courses/my/enrolled')
      .then(res => setCourses(res.data.courses || []))
      .catch(() => {})
      .finally(() => setLoading(false))
  }, [])

  const avgProgress = courses.length ? Math.round(courses.reduce((acc, c) => acc + (c.progress || 0), 0) / courses.length) : 0
  const completed = courses.filter(c => c.progress === 100).length

  const STATS = [
    { label: 'Enrolled Courses', value: courses.length, icon: BookOpen, color: 'text-blue-600 bg-blue-50' },
    { label: 'Avg Progress', value: `${avgProgress}%`, icon: TrendingUp, color: 'text-violet-600 bg-violet-50' },
    { label: 'Completed', value: completed, icon: Award, color: 'text-emerald-600 bg-emerald-50' },
    { label: 'Total Hours', value: `${Math.round(courses.reduce((a, c) => a + (c.total_duration || 0), 0) / 3600)}h`, icon: Clock, color: 'text-amber-600 bg-amber-50' },
  ]

  return (
    <div className="min-h-screen bg-slate-50/40 pt-20 pb-12">
      <div className="max-w-6xl mx-auto px-6">
        {/* Header */}
        <div className="mb-8">
          <h1 className="font-display text-3xl font-bold text-slate-900">
            Welcome back, {user?.full_name?.split(' ')[0]}! 👋
          </h1>
          <p className="text-slate-500 mt-1">Continue your learning journey</p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          {STATS.map(({ label, value, icon: Icon, color }) => (
            <div key={label} className="card p-5">
              <div className={`w-10 h-10 rounded-xl flex items-center justify-center mb-3 ${color}`}>
                <Icon size={18} />
              </div>
              <p className="font-display text-2xl font-bold text-slate-900">{value}</p>
              <p className="text-xs text-slate-500 mt-0.5">{label}</p>
            </div>
          ))}
        </div>

        {/* Courses */}
        <div className="card p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="font-display text-xl font-bold text-slate-900">My Courses</h2>
            <Link to="/courses" className="btn-secondary text-xs py-1.5 px-3">
              Browse more <ArrowRight size={12} />
            </Link>
          </div>

          {loading ? (
            <div className="flex items-center justify-center py-12">
              <Loader2 size={24} className="animate-spin text-violet-500" />
            </div>
          ) : courses.length === 0 ? (
            <div className="text-center py-16">
              <BookOpen size={48} className="text-slate-200 mx-auto mb-3" />
              <h3 className="font-semibold text-slate-700 mb-2">No courses yet</h3>
              <p className="text-slate-400 text-sm mb-6">Start learning by enrolling in a course</p>
              <Link to="/courses" className="btn-primary">Explore Courses</Link>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {courses.map(course => (
                <Link key={course.course_id} to={`/courses/${course.course_id}`}
                  className="group card p-4 hover:-translate-y-0.5 transition-all duration-200">
                  <div className="h-32 rounded-xl overflow-hidden bg-slate-100 mb-3">
                    {course.thumbnail ? (
                      <img src={course.thumbnail} alt="" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-violet-50 to-blue-50">
                        <Play size={28} className="text-violet-200" />
                      </div>
                    )}
                  </div>
                  <h3 className="font-semibold text-sm text-slate-800 line-clamp-2 mb-1 group-hover:text-violet-700 transition-colors">
                    {course.title}
                  </h3>
                  <p className="text-xs text-slate-400 mb-3">{course.instructor_name}</p>
                  
                  {/* Progress */}
                  <div>
                    <div className="flex justify-between text-xs text-slate-500 mb-1">
                      <span>Progress</span>
                      <span className="font-medium">{course.progress || 0}%</span>
                    </div>
                    <div className="h-1.5 bg-slate-100 rounded-full overflow-hidden">
                      <div
                        className="h-full rounded-full bg-gradient-to-r from-violet-500 to-blue-500 transition-all duration-500"
                        style={{ width: `${course.progress || 0}%` }}
                      />
                    </div>
                    {course.progress === 100 && (
                      <div className="flex items-center gap-1 mt-2 text-xs text-emerald-600">
                        <Award size={11} /> Completed!
                      </div>
                    )}
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
