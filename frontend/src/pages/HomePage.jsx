import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { ArrowRight, BookOpen, Users, Award, TrendingUp, Play, Star, CheckCircle2, Sparkles } from 'lucide-react'
import api from '../api/axios'
import CourseCard from '../components/course/CourseCard'
import { CATEGORIES } from '../utils/helpers'

const STATS = [
  { icon: BookOpen, label: 'Courses', value: '500+' },
  { icon: Users, label: 'Students', value: '12K+' },
  { icon: Award, label: 'Instructors', value: '80+' },
  { icon: TrendingUp, label: 'Completion Rate', value: '94%' },
]

const FEATURES = [
  'Learn from industry experts',
  'Lifetime access to materials',
  'Certificate of completion',
  'Community support',
  'Project-based learning',
  'Mobile-friendly platform',
]

export default function HomePage() {
  const [courses, setCourses] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    api.get('/courses?limit=6').then(res => {
      setCourses(res.data.courses?.slice(0, 6) || [])
    }).catch(() => {}).finally(() => setLoading(false))
  }, [])

  return (
    <div className="min-h-screen">
      {/* HERO */}
      <section className="relative min-h-[92vh] flex items-center overflow-hidden bg-white">
        {/* Background decorations */}
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-20 right-0 w-[600px] h-[600px] bg-gradient-to-bl from-violet-50/80 to-transparent rounded-full blur-3xl" />
          <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-gradient-to-tr from-blue-50/60 to-transparent rounded-full blur-3xl" />
          {/* Grid dots */}
          <div className="absolute inset-0" style={{
            backgroundImage: 'radial-gradient(circle, #e2e8f0 1px, transparent 1px)',
            backgroundSize: '40px 40px',
            opacity: 0.4
          }} />
        </div>

        <div className="relative max-w-7xl mx-auto px-6 py-24 grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          <div className="animate-fade-in">
            <div className="inline-flex items-center gap-2 bg-violet-50 text-violet-700 px-4 py-2 rounded-full text-sm font-medium mb-8 border border-violet-100">
              <Sparkles size={14} />
              New courses added every week
            </div>
            <h1 className="font-display text-5xl lg:text-6xl xl:text-7xl font-bold text-slate-900 leading-[1.08] mb-6">
              Learn skills that
              <span className="block italic text-violet-600"> actually matter</span>
            </h1>
            <p className="text-lg text-slate-500 leading-relaxed mb-10 max-w-lg">
              Access world-class courses taught by industry experts. Build real-world skills, earn certificates, and advance your career.
            </p>

            <div className="flex flex-wrap gap-3 mb-12">
              <Link to="/courses" className="btn-primary text-base px-8 py-3.5">
                Explore Courses <ArrowRight size={16} />
              </Link>
              <Link to="/register?role=instructor" className="btn-secondary text-base px-8 py-3.5">
                <Play size={16} /> Become Instructor
              </Link>
            </div>

            <div className="grid grid-cols-2 gap-3">
              {FEATURES.map(f => (
                <div key={f} className="flex items-center gap-2 text-sm text-slate-600">
                  <CheckCircle2 size={15} className="text-emerald-500 flex-shrink-0" />
                  {f}
                </div>
              ))}
            </div>
          </div>

          {/* Right side visual */}
          <div className="relative hidden lg:flex items-center justify-center animate-fade-in">
            <div className="relative w-full max-w-md">
              {/* Main card */}
              <div className="card p-6 shadow-2xl">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-12 h-12 bg-violet-100 rounded-xl flex items-center justify-center">
                    <Play size={20} className="text-violet-600 fill-violet-600" />
                  </div>
                  <div>
                    <p className="font-semibold text-slate-800 text-sm">Now Playing</p>
                    <p className="text-xs text-slate-500">Introduction to React Hooks</p>
                  </div>
                </div>
                <div className="h-32 bg-gradient-to-br from-slate-800 to-slate-900 rounded-xl flex items-center justify-center mb-4">
                  <Play size={32} className="text-white/70" />
                </div>
                <div className="w-full h-1.5 bg-slate-100 rounded-full">
                  <div className="w-2/5 h-full bg-violet-500 rounded-full" />
                </div>
                <div className="flex justify-between text-xs text-slate-400 mt-1.5">
                  <span>14:23</span><span>35:00</span>
                </div>
              </div>

              {/* Floating cards */}
              <div className="absolute -top-8 -right-8 card p-3.5 shadow-lg animate-bounce-slow">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 bg-amber-100 rounded-lg flex items-center justify-center">
                    <Star size={14} className="text-amber-500 fill-amber-500" />
                  </div>
                  <div>
                    <p className="text-xs font-bold text-slate-800">4.9 Rating</p>
                    <p className="text-[10px] text-slate-400">Top Rated</p>
                  </div>
                </div>
              </div>

              <div className="absolute -bottom-6 -left-8 card p-3.5 shadow-lg">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 bg-emerald-100 rounded-lg flex items-center justify-center">
                    <Users size={14} className="text-emerald-600" />
                  </div>
                  <div>
                    <p className="text-xs font-bold text-slate-800">+2.4k</p>
                    <p className="text-[10px] text-slate-400">New students</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* STATS */}
      <section className="py-12 bg-slate-900">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {STATS.map(({ icon: Icon, label, value }) => (
              <div key={label} className="flex flex-col items-center text-center">
                <Icon size={22} className="text-violet-400 mb-2" />
                <p className="font-display text-3xl font-bold text-white">{value}</p>
                <p className="text-sm text-slate-400">{label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CATEGORIES */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-12">
            <h2 className="section-title mb-3">Browse by Category</h2>
            <p className="text-slate-500">Find the perfect course for your goals</p>
          </div>
          <div className="flex flex-wrap gap-3 justify-center">
            {CATEGORIES.slice(0, 10).map(cat => (
              <Link
                key={cat}
                to={`/courses?category=${encodeURIComponent(cat)}`}
                className="px-4 py-2 rounded-xl border border-slate-200 text-sm font-medium text-slate-600 hover:border-violet-300 hover:text-violet-700 hover:bg-violet-50 transition-all duration-200"
              >
                {cat}
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* FEATURED COURSES */}
      <section className="py-20 bg-slate-50/50">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex items-end justify-between mb-12">
            <div>
              <h2 className="section-title mb-2">Featured Courses</h2>
              <p className="text-slate-500">Handpicked courses to get you started</p>
            </div>
            <Link to="/courses" className="btn-secondary text-sm">
              View all <ArrowRight size={14} />
            </Link>
          </div>

          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {Array(6).fill(0).map((_, i) => (
                <div key={i} className="card overflow-hidden">
                  <div className="skeleton h-44 rounded-none" />
                  <div className="p-4 space-y-3">
                    <div className="skeleton h-3 w-20" />
                    <div className="skeleton h-5 w-full" />
                    <div className="skeleton h-4 w-3/4" />
                  </div>
                </div>
              ))}
            </div>
          ) : courses.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {courses.map(course => <CourseCard key={course.course_id} course={course} />)}
            </div>
          ) : (
            <div className="text-center py-20">
              <BookOpen size={48} className="text-slate-200 mx-auto mb-4" />
              <p className="text-slate-500">No courses published yet. Check back soon!</p>
              <Link to="/register?role=instructor" className="btn-primary mt-6">Become an Instructor</Link>
            </div>
          )}
        </div>
      </section>

      {/* CTA */}
      <section className="py-24 bg-white">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <div className="bg-gradient-to-br from-slate-900 to-slate-800 rounded-3xl p-12 relative overflow-hidden">
            <div className="absolute inset-0 opacity-10" style={{
              backgroundImage: 'radial-gradient(circle at 70% 50%, #8b5cf6 0%, transparent 50%)',
            }} />
            <div className="relative">
              <h2 className="font-display text-4xl font-bold text-white mb-4">Ready to start learning?</h2>
              <p className="text-slate-300 text-lg mb-8 max-w-xl mx-auto">
                Join thousands of learners building skills for the future. Your first lesson is always free.
              </p>
              <div className="flex gap-3 justify-center">
                <Link to="/register" className="bg-violet-600 hover:bg-violet-500 text-white px-8 py-3.5 rounded-xl font-medium inline-flex items-center gap-2 transition-colors">
                  Get Started Free <ArrowRight size={16} />
                </Link>
                <Link to="/courses" className="bg-white/10 hover:bg-white/20 text-white px-8 py-3.5 rounded-xl font-medium transition-colors">
                  Browse Courses
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
