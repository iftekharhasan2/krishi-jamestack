import { useState, useEffect } from 'react'
import { useParams, Link, useNavigate } from 'react-router-dom'
import ReactPlayer from 'react-player'
import { useAuth } from '../context/AuthContext'
import api from '../api/axios'
import { formatDuration, formatPrice, formatFileSize } from '../utils/helpers'
import {
  Play, Lock, ChevronDown, ChevronUp, Clock, Users, BookOpen,
  Download, FileText, CheckCircle2, Star, Globe, Award, Loader2
} from 'lucide-react'
import toast from 'react-hot-toast'

export default function CourseDetailPage() {
  const { courseId } = useParams()
  const { user } = useAuth()
  const navigate = useNavigate()
  const [course, setCourse] = useState(null)
  const [loading, setLoading] = useState(true)
  const [enrolling, setEnrolling] = useState(false)
  const [activeLesson, setActiveLesson] = useState(null)
  const [expandedSections, setExpandedSections] = useState({})
  const [progress, setProgress] = useState({})

  useEffect(() => {
    api.get(`/courses/${courseId}`)
      .then(res => {
        setCourse(res.data.course)
        // Auto-expand first section
        if (res.data.course.sections?.length > 0) {
          setExpandedSections({ [res.data.course.sections[0].section_id]: true })
        }
      })
      .catch(() => navigate('/courses'))
      .finally(() => setLoading(false))
  }, [courseId])

  const handleEnroll = async () => {
    if (!user) { navigate('/login'); return }
    setEnrolling(true)
    try {
      await api.post(`/courses/${courseId}/enroll`)
      toast.success('Enrolled successfully! Happy learning!')
      const res = await api.get(`/courses/${courseId}`)
      setCourse(res.data.course)
    } catch (err) {
      toast.error(err.response?.data?.error || 'Enrollment failed')
    } finally {
      setEnrolling(false)
    }
  }

  const handleLessonComplete = async (lessonId) => {
    try {
      const res = await api.post(`/courses/${courseId}/progress`, { lesson_id: lessonId })
      setProgress(p => ({ ...p, [lessonId]: true }))
    } catch {}
  }

  const canPlayLesson = (lesson, sectionIndex, lessonIndex) => {
    if (!lesson) return false
    if (lesson.is_free) return true
    if (course?.is_enrolled || course?.is_instructor) return true
    return false
  }

  if (loading) return (
    <div className="min-h-screen pt-16 flex items-center justify-center">
      <Loader2 size={32} className="animate-spin text-violet-500" />
    </div>
  )

  if (!course) return null

  const totalLessons = course.sections?.reduce((acc, s) => acc + s.lessons?.length, 0) || 0
  const canAccess = course.is_enrolled || course.is_instructor

  return (
    <div className="min-h-screen bg-white pt-16">
      {/* Hero */}
      <div className="bg-gradient-to-br from-slate-900 to-slate-800 py-12">
        <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 text-white">
            <div className="flex items-center gap-2 mb-3">
              <span className="badge bg-white/10 text-white border-0">{course.category}</span>
              <span className="badge bg-white/10 text-white border-0">{course.level}</span>
            </div>
            <h1 className="font-display text-3xl lg:text-4xl font-bold mb-4">{course.title}</h1>
            <p className="text-slate-300 text-base leading-relaxed mb-6">{course.short_description || course.description?.slice(0, 200)}</p>
            
            <div className="flex items-center gap-6 text-sm text-slate-300 flex-wrap">
              <div className="flex items-center gap-2">
                {course.instructor_avatar ? (
                  <img src={course.instructor_avatar} alt="" className="w-7 h-7 rounded-full object-cover" />
                ) : (
                  <div className="w-7 h-7 rounded-full bg-violet-500 flex items-center justify-center text-white text-xs">
                    {course.instructor_name?.[0]}
                  </div>
                )}
                <span>by <strong className="text-white">{course.instructor_name}</strong></span>
              </div>
              <div className="flex items-center gap-1.5"><Users size={14} /> {course.total_students} students</div>
              <div className="flex items-center gap-1.5"><BookOpen size={14} /> {totalLessons} lessons</div>
              {course.total_duration > 0 && <div className="flex items-center gap-1.5"><Clock size={14} /> {formatDuration(course.total_duration)}</div>}
              <div className="flex items-center gap-1.5"><Globe size={14} /> {course.language}</div>
            </div>
          </div>

          {/* Enrollment Card */}
          <div className="card p-6 shadow-2xl self-start sticky top-20">
            <div className="h-40 bg-slate-100 rounded-xl overflow-hidden mb-4">
              {course.thumbnail ? (
                <img src={course.thumbnail} alt="" className="w-full h-full object-cover" />
              ) : (
                <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-violet-50 to-blue-50">
                  <Play size={36} className="text-violet-300" />
                </div>
              )}
            </div>
            <div className="mb-4">
              <p className="font-display text-3xl font-bold text-slate-900">{formatPrice(course.price)}</p>
            </div>
            
            {canAccess ? (
              <div className="space-y-2">
                <div className="flex items-center gap-2 text-emerald-600 text-sm font-medium bg-emerald-50 px-3 py-2 rounded-xl">
                  <CheckCircle2 size={16} /> {course.is_instructor ? 'You own this course' : 'You are enrolled'}
                </div>
                {activeLesson?.video_url && (
                  <button onClick={() => {}} className="btn-accent w-full justify-center">
                    <Play size={16} /> Continue Watching
                  </button>
                )}
              </div>
            ) : (
              <button onClick={handleEnroll} disabled={enrolling} className="btn-primary w-full justify-center py-3 text-base">
                {enrolling ? <Loader2 size={16} className="animate-spin" /> : 'Enroll Now — ' + formatPrice(course.price)}
              </button>
            )}

            <div className="mt-4 space-y-2 text-sm text-slate-600">
              {[
                ['Full lifetime access', CheckCircle2],
                ['Certificate of completion', Award],
                [`${totalLessons} lessons`, BookOpen],
                [formatDuration(course.total_duration) + ' of content', Clock],
              ].map(([text, Icon]) => (
                <div key={text} className="flex items-center gap-2">
                  <Icon size={14} className="text-emerald-500" />
                  <span>{text}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-7xl mx-auto px-6 py-12 grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-8">
          {/* Video Player */}
          {activeLesson && (
            <div className="animate-fade-in">
              <div className="rounded-2xl overflow-hidden bg-black shadow-xl aspect-video">
                {activeLesson.video_url ? (
                  <ReactPlayer
                    url={activeLesson.video_url}
                    width="100%"
                    height="100%"
                    controls
                    onEnded={() => handleLessonComplete(activeLesson.lesson_id)}
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-white/30">
                    <Play size={48} />
                  </div>
                )}
              </div>
              <div className="mt-4">
                <h2 className="font-display text-xl font-bold text-slate-900">{activeLesson.title}</h2>
                {activeLesson.description && <p className="text-slate-500 mt-2 text-sm">{activeLesson.description}</p>}
                
                {/* Notes */}
                {activeLesson.notes?.length > 0 && (
                  <div className="mt-4">
                    <h3 className="text-sm font-semibold text-slate-700 mb-3">Lesson Materials</h3>
                    <div className="space-y-2">
                      {activeLesson.notes.map(note => (
                        <a key={note.note_id} href={note.url} target="_blank" rel="noopener noreferrer"
                          className="flex items-center gap-3 p-3 rounded-xl border border-slate-100 hover:border-violet-200 hover:bg-violet-50 transition-all group">
                          <div className="w-9 h-9 bg-slate-100 rounded-lg flex items-center justify-center group-hover:bg-violet-100">
                            <FileText size={16} className="text-slate-500 group-hover:text-violet-600" />
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="text-sm font-medium text-slate-800 truncate">{note.name}</p>
                            <p className="text-xs text-slate-400">{formatFileSize(note.size)}</p>
                          </div>
                          <Download size={15} className="text-slate-400 group-hover:text-violet-600" />
                        </a>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* What you'll learn */}
          {course.what_you_learn?.length > 0 && (
            <div className="card p-6">
              <h2 className="font-display text-xl font-bold text-slate-900 mb-4">What you'll learn</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {course.what_you_learn.map((item, i) => (
                  <div key={i} className="flex items-start gap-2.5 text-sm text-slate-700">
                    <CheckCircle2 size={15} className="text-emerald-500 flex-shrink-0 mt-0.5" />
                    {item}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* About Instructor */}
          <div className="card p-6">
            <h2 className="font-display text-xl font-bold text-slate-900 mb-4">Your Instructor</h2>
            <div className="flex items-start gap-4">
              {course.instructor_avatar ? (
                <img src={course.instructor_avatar} alt="" className="w-16 h-16 rounded-2xl object-cover" />
              ) : (
                <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-violet-500 to-blue-500 flex items-center justify-center text-white text-xl font-bold">
                  {course.instructor_name?.[0]}
                </div>
              )}
              <div>
                <h3 className="font-semibold text-slate-900">{course.instructor_name}</h3>
                {course.instructor_bio && <p className="text-sm text-slate-500 mt-1">{course.instructor_bio}</p>}
              </div>
            </div>
          </div>
        </div>

        {/* Curriculum Sidebar */}
        <div className="space-y-4">
          <h2 className="font-display text-xl font-bold text-slate-900">Course Content</h2>
          <p className="text-sm text-slate-500">{course.sections?.length} sections • {totalLessons} lessons</p>

          <div className="space-y-2">
            {course.sections?.map((section, sIdx) => (
              <div key={section.section_id} className="card overflow-hidden">
                <button
                  onClick={() => setExpandedSections(p => ({...p, [section.section_id]: !p[section.section_id]}))}
                  className="w-full flex items-center justify-between p-4 hover:bg-slate-50 transition-colors text-left"
                >
                  <div>
                    <p className="font-semibold text-sm text-slate-800">{section.title}</p>
                    <p className="text-xs text-slate-400 mt-0.5">{section.lessons?.length || 0} lessons</p>
                  </div>
                  {expandedSections[section.section_id] ? <ChevronUp size={16} className="text-slate-400 flex-shrink-0" /> : <ChevronDown size={16} className="text-slate-400 flex-shrink-0" />}
                </button>

                {expandedSections[section.section_id] && (
                  <div className="border-t border-slate-50">
                    {section.lessons?.map((lesson, lIdx) => {
                      const playable = canPlayLesson(lesson, sIdx, lIdx)
                      const isActive = activeLesson?.lesson_id === lesson.lesson_id
                      const isCompleted = progress[lesson.lesson_id]
                      
                      return (
                        <button
                          key={lesson.lesson_id}
                          onClick={() => playable ? setActiveLesson(lesson) : toast.error('Enroll to access this lesson')}
                          className={`w-full flex items-center gap-3 px-4 py-3 text-left transition-colors ${
                            isActive ? 'bg-violet-50' : 'hover:bg-slate-50'
                          } ${!playable ? 'opacity-60 cursor-not-allowed' : ''}`}
                        >
                          <div className={`w-7 h-7 rounded-full flex items-center justify-center flex-shrink-0 ${
                            isCompleted ? 'bg-emerald-100' : isActive ? 'bg-violet-100' : 'bg-slate-100'
                          }`}>
                            {isCompleted ? (
                              <CheckCircle2 size={13} className="text-emerald-500" />
                            ) : !playable ? (
                              <Lock size={11} className="text-slate-400" />
                            ) : (
                              <Play size={11} className={isActive ? 'text-violet-600 fill-violet-600' : 'text-slate-500'} />
                            )}
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className={`text-xs font-medium truncate ${isActive ? 'text-violet-700' : 'text-slate-700'}`}>
                              {lesson.title}
                              {lesson.is_free && <span className="ml-1.5 text-[10px] bg-emerald-100 text-emerald-700 px-1.5 py-0.5 rounded-full">FREE</span>}
                            </p>
                            {lesson.duration > 0 && (
                              <p className="text-[10px] text-slate-400 mt-0.5">{formatDuration(lesson.duration)}</p>
                            )}
                          </div>
                          {lesson.notes?.length > 0 && (
                            <FileText size={12} className="text-slate-300 flex-shrink-0" />
                          )}
                        </button>
                      )
                    })}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
