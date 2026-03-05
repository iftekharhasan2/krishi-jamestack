import { useState, useEffect, useRef } from 'react'
import { Link } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import api from '../api/axios'
import { formatDuration, formatPrice, CATEGORIES, LEVELS } from '../utils/helpers'
import {
  PlusCircle, BookOpen, Users, DollarSign, TrendingUp, Edit3, Eye,
  Upload, X, ChevronDown, ChevronUp, Trash2, Plus, Loader2, CheckCircle2,
  FileText, Video, Save
} from 'lucide-react'
import toast from 'react-hot-toast'

export default function InstructorDashboard() {
  const { user } = useAuth()
  const [courses, setCourses] = useState([])
  const [loading, setLoading] = useState(true)
  const [view, setView] = useState('list') // list | create | edit
  const [editingCourse, setEditingCourse] = useState(null)

  useEffect(() => { fetchCourses() }, [])

  const fetchCourses = async () => {
    setLoading(true)
    try {
      const res = await api.get('/courses/my/teaching')
      setCourses(res.data.courses || [])
    } finally { setLoading(false) }
  }

  const totalStudents = courses.reduce((a, c) => a + c.total_students, 0)

  const STATS = [
    { label: 'Courses', value: courses.length, icon: BookOpen, color: 'text-blue-600 bg-blue-50' },
    { label: 'Students', value: totalStudents, icon: Users, color: 'text-violet-600 bg-violet-50' },
    { label: 'Published', value: courses.filter(c => c.is_published).length, icon: CheckCircle2, color: 'text-emerald-600 bg-emerald-50' },
  ]

  if (view === 'create' || view === 'edit') {
    return <CourseEditor
      course={editingCourse}
      onBack={() => { setView('list'); setEditingCourse(null); fetchCourses() }}
    />
  }

  return (
    <div className="min-h-screen bg-slate-50/40 pt-20 pb-12">
      <div className="max-w-6xl mx-auto px-6">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="font-display text-3xl font-bold text-slate-900">Instructor Dashboard</h1>
            <p className="text-slate-500 mt-1">Manage your courses and students</p>
          </div>
          <button onClick={() => { setEditingCourse(null); setView('create') }} className="btn-primary">
            <PlusCircle size={16} /> New Course
          </button>
        </div>

        <div className="grid grid-cols-3 gap-4 mb-8">
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

        <div className="card p-6">
          <h2 className="font-display text-xl font-bold text-slate-900 mb-6">My Courses</h2>
          {loading ? (
            <div className="flex items-center justify-center py-12"><Loader2 size={24} className="animate-spin text-violet-500" /></div>
          ) : courses.length === 0 ? (
            <div className="text-center py-16">
              <BookOpen size={48} className="text-slate-200 mx-auto mb-3" />
              <p className="text-slate-500 mb-4">You haven't created any courses yet</p>
              <button onClick={() => setView('create')} className="btn-primary">Create your first course</button>
            </div>
          ) : (
            <div className="space-y-3">
              {courses.map(course => (
                <div key={course.course_id} className="flex items-center gap-4 p-4 rounded-xl border border-slate-100 hover:border-violet-100 hover:bg-violet-50/20 transition-all">
                  <div className="w-20 h-14 rounded-xl overflow-hidden bg-slate-100 flex-shrink-0">
                    {course.thumbnail ? (
                      <img src={course.thumbnail} alt="" className="w-full h-full object-cover" />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center">
                        <BookOpen size={20} className="text-slate-300" />
                      </div>
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="font-semibold text-sm text-slate-800 truncate">{course.title}</h3>
                    <div className="flex items-center gap-4 mt-1 text-xs text-slate-400">
                      <span>{course.total_students} students</span>
                      <span>{course.total_lessons} lessons</span>
                      <span>{formatDuration(course.total_duration)}</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className={`badge text-xs ${course.is_published ? 'bg-emerald-50 text-emerald-700' : 'bg-amber-50 text-amber-700'}`}>
                      {course.is_published ? 'Published' : 'Draft'}
                    </span>
                    <Link to={`/courses/${course.course_id}`} className="btn-secondary py-1.5 px-3 text-xs">
                      <Eye size={12} /> Preview
                    </Link>
                    <button onClick={() => { setEditingCourse(course); setView('edit') }} className="btn-primary py-1.5 px-3 text-xs">
                      <Edit3 size={12} /> Edit
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

// ---- Course Editor Component ----

function CourseEditor({ course, onBack }) {
  const [step, setStep] = useState('info') // info | curriculum
  const [saving, setSaving] = useState(false)
  const [courseData, setCourseData] = useState(course || null)
  const [form, setForm] = useState({
    title: course?.title || '',
    description: course?.description || '',
    short_description: course?.short_description || '',
    price: course?.price || 0,
    category: course?.category || CATEGORIES[0],
    level: course?.level || LEVELS[0],
    language: course?.language || 'English',
    requirements: course?.requirements?.join('\n') || '',
    what_you_learn: course?.what_you_learn?.join('\n') || '',
    is_published: course?.is_published || false,
  })
  const thumbnailRef = useRef()

  const handleSaveInfo = async (e) => {
    e.preventDefault()
    setSaving(true)
    try {
      const payload = {
        ...form,
        price: parseFloat(form.price),
        requirements: form.requirements.split('\n').filter(Boolean),
        what_you_learn: form.what_you_learn.split('\n').filter(Boolean),
      }
      
      let res
      if (courseData?.course_id) {
        res = await api.put(`/courses/${courseData.course_id}`, payload)
      } else {
        res = await api.post('/courses', payload)
      }
      setCourseData(res.data.course)
      toast.success('Course saved!')
      setStep('curriculum')
    } catch (err) {
      toast.error(err.response?.data?.error || 'Save failed')
    } finally { setSaving(false) }
  }

  const handleThumbnail = async (e) => {
    if (!courseData?.course_id) { toast.error('Save course info first'); return }
    const file = e.target.files[0]
    if (!file) return
    const fd = new FormData()
    fd.append('thumbnail', file)
    try {
      const res = await api.post(`/courses/${courseData.course_id}/thumbnail`, fd, {
        headers: { 'Content-Type': 'multipart/form-data' }
      })
      setCourseData(p => ({ ...p, thumbnail: res.data.thumbnail }))
      toast.success('Thumbnail uploaded!')
    } catch { toast.error('Upload failed') }
  }

  return (
    <div className="min-h-screen bg-slate-50/40 pt-20 pb-12">
      <div className="max-w-4xl mx-auto px-6">
        <div className="flex items-center gap-3 mb-8">
          <button onClick={onBack} className="btn-secondary py-2 text-xs">← Back</button>
          <div className="h-5 w-px bg-slate-200" />
          <h1 className="font-display text-2xl font-bold text-slate-900">
            {course ? 'Edit Course' : 'Create New Course'}
          </h1>
        </div>

        {/* Steps */}
        <div className="flex gap-2 mb-8">
          {[['info', 'Course Info'], ['curriculum', 'Curriculum']].map(([id, label]) => (
            <button key={id} onClick={() => id === 'curriculum' && !courseData ? null : setStep(id)}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium transition-all ${
                step === id ? 'bg-slate-900 text-white' : 'bg-white text-slate-500 border border-slate-200'
              } ${id === 'curriculum' && !courseData ? 'opacity-50 cursor-not-allowed' : ''}`}>
              {id === 'info' ? '1' : '2'}. {label}
            </button>
          ))}
        </div>

        {step === 'info' && (
          <form onSubmit={handleSaveInfo} className="space-y-6 animate-fade-in">
            <div className="card p-6 space-y-5">
              <h2 className="font-display text-lg font-bold text-slate-800">Basic Information</h2>
              
              {/* Thumbnail */}
              <div>
                <label className="label">Course Thumbnail</label>
                <div onClick={() => thumbnailRef.current?.click()}
                  className="h-40 rounded-xl border-2 border-dashed border-slate-200 hover:border-violet-300 cursor-pointer flex items-center justify-center bg-slate-50 overflow-hidden transition-colors">
                  {courseData?.thumbnail ? (
                    <img src={courseData.thumbnail} alt="" className="w-full h-full object-cover" />
                  ) : (
                    <div className="text-center">
                      <Upload size={24} className="text-slate-300 mx-auto mb-2" />
                      <p className="text-sm text-slate-400">Click to upload thumbnail</p>
                    </div>
                  )}
                </div>
                <input ref={thumbnailRef} type="file" className="hidden" accept="image/*" onChange={handleThumbnail} />
              </div>

              <div>
                <label className="label">Course Title *</label>
                <input className="input-field" placeholder="e.g. Complete Web Development Bootcamp"
                  value={form.title} onChange={e => setForm({...form, title: e.target.value})} required />
              </div>
              <div>
                <label className="label">Short Description</label>
                <input className="input-field" placeholder="One-line summary..."
                  value={form.short_description} onChange={e => setForm({...form, short_description: e.target.value})} />
              </div>
              <div>
                <label className="label">Full Description</label>
                <textarea className="input-field resize-none" rows={4} placeholder="Describe your course in detail..."
                  value={form.description} onChange={e => setForm({...form, description: e.target.value})} />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="label">Category</label>
                  <select className="input-field" value={form.category} onChange={e => setForm({...form, category: e.target.value})}>
                    {CATEGORIES.map(c => <option key={c}>{c}</option>)}
                  </select>
                </div>
                <div>
                  <label className="label">Level</label>
                  <select className="input-field" value={form.level} onChange={e => setForm({...form, level: e.target.value})}>
                    {LEVELS.map(l => <option key={l}>{l}</option>)}
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="label">Price (USD)</label>
                  <input type="number" min="0" step="0.01" className="input-field"
                    value={form.price} onChange={e => setForm({...form, price: e.target.value})} />
                  <p className="text-xs text-slate-400 mt-1">Set 0 for free course</p>
                </div>
                <div>
                  <label className="label">Language</label>
                  <input className="input-field" value={form.language}
                    onChange={e => setForm({...form, language: e.target.value})} />
                </div>
              </div>

              <div>
                <label className="label">Requirements (one per line)</label>
                <textarea className="input-field resize-none" rows={3} placeholder="Basic HTML knowledge&#10;A computer with internet"
                  value={form.requirements} onChange={e => setForm({...form, requirements: e.target.value})} />
              </div>
              <div>
                <label className="label">What Students Will Learn (one per line)</label>
                <textarea className="input-field resize-none" rows={3} placeholder="Build real projects&#10;Land a job as a developer"
                  value={form.what_you_learn} onChange={e => setForm({...form, what_you_learn: e.target.value})} />
              </div>

              <div className="flex items-center gap-3">
                <button type="button" onClick={() => setForm({...form, is_published: !form.is_published})}
                  className={`relative w-12 h-6 rounded-full transition-colors ${form.is_published ? 'bg-emerald-500' : 'bg-slate-200'}`}>
                  <span className={`absolute top-1 w-4 h-4 bg-white rounded-full shadow transition-transform ${form.is_published ? 'translate-x-7' : 'translate-x-1'}`} />
                </button>
                <label className="text-sm font-medium text-slate-700">
                  {form.is_published ? 'Published (visible to students)' : 'Draft (not visible)'}
                </label>
              </div>
            </div>

            <div className="flex gap-3">
              <button type="submit" disabled={saving} className="btn-primary">
                {saving ? <Loader2 size={15} className="animate-spin" /> : <Save size={15} />}
                Save & Continue
              </button>
              {courseData && (
                <button type="button" onClick={() => setStep('curriculum')} className="btn-secondary">
                  Go to Curriculum →
                </button>
              )}
            </div>
          </form>
        )}

        {step === 'curriculum' && courseData && (
          <CurriculumEditor courseId={courseData.course_id} initialSections={courseData.sections || []} />
        )}
      </div>
    </div>
  )
}

// ---- Curriculum Editor ----

function CurriculumEditor({ courseId, initialSections }) {
  const [sections, setSections] = useState(initialSections)
  const [addingSectionTitle, setAddingSectionTitle] = useState('')
  const [expandedSections, setExpandedSections] = useState({})
  const [addingLesson, setAddingLesson] = useState(null) // section_id
  const [lessonForm, setLessonForm] = useState({ title: '', description: '' })
  const [lessonFile, setLessonFile] = useState(null)
  const [noteFiles, setNoteFiles] = useState([])
  const [uploading, setUploading] = useState(false)
  const videoRef = useRef()
  const notesRef = useRef()

  const refreshCourse = async () => {
    const res = await api.get(`/courses/${courseId}`)
    setSections(res.data.course.sections || [])
  }

  const addSection = async () => {
    if (!addingSectionTitle.trim()) return
    try {
      await api.post(`/courses/${courseId}/sections`, { title: addingSectionTitle })
      setAddingSectionTitle('')
      await refreshCourse()
      toast.success('Section added!')
    } catch { toast.error('Failed to add section') }
  }

  const addLesson = async (sectionId) => {
    if (!lessonForm.title.trim()) { toast.error('Lesson title required'); return }
    setUploading(true)
    try {
      const fd = new FormData()
      fd.append('title', lessonForm.title)
      fd.append('description', lessonForm.description)
      if (lessonFile) fd.append('video', lessonFile)
      noteFiles.forEach(f => fd.append('notes', f))

      await api.post(`/courses/${courseId}/sections/${sectionId}/lessons`, fd, {
        headers: { 'Content-Type': 'multipart/form-data' }
      })
      
      setAddingLesson(null)
      setLessonForm({ title: '', description: '' })
      setLessonFile(null)
      setNoteFiles([])
      await refreshCourse()
      toast.success('Lesson added!')
    } catch (err) {
      toast.error(err.response?.data?.error || 'Failed to add lesson')
    } finally { setUploading(false) }
  }

  return (
    <div className="animate-fade-in space-y-4">
      <div className="card p-6">
        <h2 className="font-display text-lg font-bold text-slate-800 mb-2">Course Curriculum</h2>
        <p className="text-sm text-slate-500">Note: The very first lesson across all sections is always free for preview.</p>
      </div>

      {/* Sections */}
      {sections.map((section, si) => (
        <div key={section.section_id} className="card overflow-hidden">
          <div className="flex items-center justify-between p-4 bg-slate-50 cursor-pointer"
            onClick={() => setExpandedSections(p => ({...p, [section.section_id]: !p[section.section_id]}))}>
            <div className="flex items-center gap-3">
              <span className="w-7 h-7 rounded-lg bg-slate-800 text-white text-xs flex items-center justify-center font-bold">{si + 1}</span>
              <div>
                <p className="font-semibold text-sm text-slate-800">{section.title}</p>
                <p className="text-xs text-slate-400">{section.lessons?.length || 0} lessons</p>
              </div>
            </div>
            {expandedSections[section.section_id] ? <ChevronUp size={16} className="text-slate-400" /> : <ChevronDown size={16} className="text-slate-400" />}
          </div>

          {expandedSections[section.section_id] && (
            <div className="p-4 space-y-3 border-t border-slate-100">
              {section.lessons?.map((lesson, li) => {
                const isFirst = si === 0 && li === 0
                return (
                  <div key={lesson.lesson_id} className="flex items-center gap-3 p-3 rounded-xl bg-slate-50 border border-slate-100">
                    <div className="w-8 h-8 rounded-lg bg-white border border-slate-200 flex items-center justify-center flex-shrink-0">
                      <Video size={14} className="text-violet-500" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-slate-700 truncate">{lesson.title}</p>
                      <div className="flex items-center gap-3 mt-0.5">
                        {lesson.duration > 0 && <span className="text-xs text-slate-400">{formatDuration(lesson.duration)}</span>}
                        {lesson.notes?.length > 0 && <span className="text-xs text-slate-400 flex items-center gap-1"><FileText size={10} />{lesson.notes.length} files</span>}
                      </div>
                    </div>
                    {isFirst && <span className="badge bg-emerald-50 text-emerald-700 text-[10px]">FREE</span>}
                  </div>
                )
              })}

              {/* Add Lesson Form */}
              {addingLesson === section.section_id ? (
                <div className="p-4 rounded-xl border-2 border-dashed border-violet-200 bg-violet-50/30 space-y-3">
                  <input className="input-field bg-white" placeholder="Lesson title *"
                    value={lessonForm.title} onChange={e => setLessonForm({...lessonForm, title: e.target.value})} />
                  <textarea className="input-field bg-white resize-none" rows={2} placeholder="Description (optional)"
                    value={lessonForm.description} onChange={e => setLessonForm({...lessonForm, description: e.target.value})} />
                  
                  <div className="grid grid-cols-2 gap-3">
                    {/* Video Upload */}
                    <div>
                      <p className="text-xs font-medium text-slate-600 mb-1.5">Video File</p>
                      <div onClick={() => videoRef.current?.click()}
                        className="flex items-center gap-2 p-3 rounded-lg border border-dashed border-slate-300 hover:border-violet-400 cursor-pointer bg-white transition-colors">
                        <Video size={16} className="text-slate-400" />
                        <span className="text-xs text-slate-500 truncate">
                          {lessonFile ? lessonFile.name : 'Upload video'}
                        </span>
                      </div>
                      <input ref={videoRef} type="file" className="hidden" accept="video/*"
                        onChange={e => setLessonFile(e.target.files[0])} />
                    </div>
                    
                    {/* Notes Upload */}
                    <div>
                      <p className="text-xs font-medium text-slate-600 mb-1.5">Notes/Files (any type)</p>
                      <div onClick={() => notesRef.current?.click()}
                        className="flex items-center gap-2 p-3 rounded-lg border border-dashed border-slate-300 hover:border-violet-400 cursor-pointer bg-white transition-colors">
                        <FileText size={16} className="text-slate-400" />
                        <span className="text-xs text-slate-500 truncate">
                          {noteFiles.length > 0 ? `${noteFiles.length} file(s)` : 'Add notes'}
                        </span>
                      </div>
                      <input ref={notesRef} type="file" className="hidden" multiple
                        onChange={e => setNoteFiles(Array.from(e.target.files))} />
                    </div>
                  </div>

                  <div className="flex gap-2">
                    <button onClick={() => addLesson(section.section_id)} disabled={uploading} className="btn-primary text-xs py-2 px-4">
                      {uploading ? <><Loader2 size={13} className="animate-spin" /> Uploading...</> : <><Plus size={13} /> Add Lesson</>}
                    </button>
                    <button onClick={() => setAddingLesson(null)} className="btn-secondary text-xs py-2 px-4">Cancel</button>
                  </div>
                </div>
              ) : (
                <button onClick={() => setAddingLesson(section.section_id)}
                  className="w-full flex items-center justify-center gap-2 p-3 rounded-xl border border-dashed border-slate-200 hover:border-violet-300 hover:bg-violet-50/30 text-sm text-slate-500 hover:text-violet-600 transition-all">
                  <Plus size={15} /> Add Lesson
                </button>
              )}
            </div>
          )}
        </div>
      ))}

      {/* Add Section */}
      <div className="card p-4">
        <div className="flex gap-3">
          <input className="input-field flex-1" placeholder="New section title (e.g. Getting Started)"
            value={addingSectionTitle} onChange={e => setAddingSectionTitle(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && addSection()} />
          <button onClick={addSection} className="btn-primary">
            <Plus size={15} /> Add Section
          </button>
        </div>
      </div>
    </div>
  )
}
