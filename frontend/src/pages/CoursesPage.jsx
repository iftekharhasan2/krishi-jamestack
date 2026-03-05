import { useState, useEffect } from 'react'
import { useSearchParams } from 'react-router-dom'
import { Search, SlidersHorizontal, X, BookOpen } from 'lucide-react'
import api from '../api/axios'
import CourseCard from '../components/course/CourseCard'
import { CATEGORIES, LEVELS } from '../utils/helpers'

export default function CoursesPage() {
  const [searchParams, setSearchParams] = useSearchParams()
  const [courses, setCourses] = useState([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState(searchParams.get('search') || '')
  const [selectedCategory, setSelectedCategory] = useState(searchParams.get('category') || '')
  const [selectedLevel, setSelectedLevel] = useState('')
  const [showFilters, setShowFilters] = useState(false)

  useEffect(() => {
    fetchCourses()
  }, [selectedCategory, selectedLevel])

  const fetchCourses = async (searchTerm = search) => {
    setLoading(true)
    try {
      const params = new URLSearchParams()
      if (searchTerm) params.set('search', searchTerm)
      if (selectedCategory) params.set('category', selectedCategory)
      if (selectedLevel) params.set('level', selectedLevel)
      
      const res = await api.get(`/courses?${params}`)
      setCourses(res.data.courses || [])
    } catch (err) {
      setCourses([])
    } finally {
      setLoading(false)
    }
  }

  const handleSearch = (e) => {
    e.preventDefault()
    fetchCourses(search)
  }

  const clearFilters = () => {
    setSelectedCategory('')
    setSelectedLevel('')
    setSearch('')
    fetchCourses('')
  }

  const hasFilters = selectedCategory || selectedLevel || search

  return (
    <div className="min-h-screen bg-white pt-16">
      {/* Header */}
      <div className="bg-gradient-to-b from-slate-50 to-white border-b border-slate-100 py-12">
        <div className="max-w-7xl mx-auto px-6">
          <h1 className="font-display text-4xl font-bold text-slate-900 mb-2">All Courses</h1>
          <p className="text-slate-500 mb-8">Explore our library of expert-led courses</p>
          
          {/* Search bar */}
          <form onSubmit={handleSearch} className="flex gap-3 max-w-xl">
            <div className="flex-1 relative">
              <Search size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                className="input-field pl-10"
                placeholder="Search courses..."
                value={search}
                onChange={e => setSearch(e.target.value)}
              />
            </div>
            <button type="submit" className="btn-primary">Search</button>
            <button type="button" onClick={() => setShowFilters(!showFilters)} className="btn-secondary">
              <SlidersHorizontal size={15} /> Filters
            </button>
          </form>

          {/* Filter Panel */}
          {showFilters && (
            <div className="mt-4 p-4 bg-white rounded-2xl border border-slate-100 shadow-sm animate-slide-up">
              <div className="flex gap-8 flex-wrap">
                <div>
                  <p className="text-xs font-semibold text-slate-500 uppercase tracking-wide mb-2">Category</p>
                  <div className="flex flex-wrap gap-2">
                    {CATEGORIES.map(cat => (
                      <button key={cat} onClick={() => setSelectedCategory(selectedCategory === cat ? '' : cat)}
                        className={`px-3 py-1.5 rounded-lg text-xs font-medium border transition-all ${
                          selectedCategory === cat ? 'bg-slate-900 text-white border-slate-900' : 'border-slate-200 text-slate-600 hover:border-slate-300'
                        }`}>
                        {cat}
                      </button>
                    ))}
                  </div>
                </div>
                <div>
                  <p className="text-xs font-semibold text-slate-500 uppercase tracking-wide mb-2">Level</p>
                  <div className="flex gap-2">
                    {LEVELS.map(lvl => (
                      <button key={lvl} onClick={() => setSelectedLevel(selectedLevel === lvl ? '' : lvl)}
                        className={`px-3 py-1.5 rounded-lg text-xs font-medium border transition-all ${
                          selectedLevel === lvl ? 'bg-slate-900 text-white border-slate-900' : 'border-slate-200 text-slate-600 hover:border-slate-300'
                        }`}>
                        {lvl}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Active filters */}
          {hasFilters && (
            <div className="flex items-center gap-2 mt-4 flex-wrap">
              {selectedCategory && (
                <span className="badge bg-violet-50 text-violet-700 border border-violet-100">
                  {selectedCategory}
                  <button onClick={() => setSelectedCategory('')}><X size={12} /></button>
                </span>
              )}
              {selectedLevel && (
                <span className="badge bg-blue-50 text-blue-700 border border-blue-100">
                  {selectedLevel}
                  <button onClick={() => setSelectedLevel('')}><X size={12} /></button>
                </span>
              )}
              {search && (
                <span className="badge bg-slate-100 text-slate-700">
                  "{search}"
                  <button onClick={() => { setSearch(''); fetchCourses('') }}><X size={12} /></button>
                </span>
              )}
              <button onClick={clearFilters} className="text-xs text-slate-500 hover:text-slate-700 underline">
                Clear all
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Course Grid */}
      <div className="max-w-7xl mx-auto px-6 py-12">
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {Array(8).fill(0).map((_, i) => (
              <div key={i} className="card overflow-hidden">
                <div className="skeleton h-40 rounded-none" />
                <div className="p-4 space-y-3">
                  <div className="skeleton h-3 w-20" />
                  <div className="skeleton h-5 w-full" />
                  <div className="skeleton h-4 w-3/4" />
                </div>
              </div>
            ))}
          </div>
        ) : courses.length > 0 ? (
          <>
            <p className="text-sm text-slate-500 mb-6">{courses.length} course{courses.length !== 1 ? 's' : ''} found</p>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {courses.map(course => <CourseCard key={course.course_id} course={course} />)}
            </div>
          </>
        ) : (
          <div className="text-center py-24">
            <BookOpen size={56} className="text-slate-200 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-slate-700 mb-2">No courses found</h3>
            <p className="text-slate-400 mb-6">Try adjusting your search or filters</p>
            <button onClick={clearFilters} className="btn-secondary">Clear filters</button>
          </div>
        )}
      </div>
    </div>
  )
}
