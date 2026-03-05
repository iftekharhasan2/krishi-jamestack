import { Link } from 'react-router-dom'
import { Star, Clock, Users, BookOpen, Lock } from 'lucide-react'
import { formatDuration, formatPrice } from '../../utils/helpers'

export default function CourseCard({ course }) {
  return (
    <Link to={`/courses/${course.course_id}`} className="group card overflow-hidden flex flex-col hover:-translate-y-0.5 transition-all duration-300">
      {/* Thumbnail */}
      <div className="relative h-44 bg-gradient-to-br from-slate-100 to-slate-200 overflow-hidden">
        {course.thumbnail ? (
          <img src={course.thumbnail} alt={course.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-violet-50 to-blue-50">
            <BookOpen size={40} className="text-violet-200" />
          </div>
        )}
        {/* Price Badge */}
        <div className={`absolute top-3 right-3 px-2.5 py-1 rounded-lg text-xs font-bold ${
          course.price === 0 ? 'bg-emerald-500 text-white' : 'bg-white text-slate-800 shadow-sm'
        }`}>
          {formatPrice(course.price)}
        </div>
        {/* Level Badge */}
        <div className="absolute top-3 left-3 px-2.5 py-1 bg-black/60 text-white rounded-lg text-xs font-medium">
          {course.level}
        </div>
      </div>

      {/* Content */}
      <div className="p-4 flex flex-col flex-1">
        {/* Category */}
        <span className="text-xs font-semibold text-violet-600 uppercase tracking-wide mb-1.5">{course.category}</span>
        
        {/* Title */}
        <h3 className="font-display font-semibold text-slate-900 text-base leading-snug line-clamp-2 mb-2 group-hover:text-violet-700 transition-colors">
          {course.title}
        </h3>

        {/* Instructor */}
        <div className="flex items-center gap-2 mb-3">
          {course.instructor_avatar ? (
            <img src={course.instructor_avatar} alt="" className="w-5 h-5 rounded-full object-cover" />
          ) : (
            <div className="w-5 h-5 rounded-full bg-violet-100 flex items-center justify-center">
              <span className="text-[9px] font-bold text-violet-600">
                {course.instructor_name?.[0] || '?'}
              </span>
            </div>
          )}
          <span className="text-xs text-slate-500">{course.instructor_name}</span>
        </div>

        {/* Stats */}
        <div className="flex items-center gap-3 mt-auto pt-3 border-t border-slate-50">
          <div className="flex items-center gap-1 text-xs text-slate-500">
            <Users size={12} className="text-slate-400" />
            <span>{course.total_students || 0}</span>
          </div>
          <div className="flex items-center gap-1 text-xs text-slate-500">
            <BookOpen size={12} className="text-slate-400" />
            <span>{course.total_lessons || 0} lessons</span>
          </div>
          {course.total_duration > 0 && (
            <div className="flex items-center gap-1 text-xs text-slate-500">
              <Clock size={12} className="text-slate-400" />
              <span>{formatDuration(course.total_duration)}</span>
            </div>
          )}
          {course.rating > 0 && (
            <div className="flex items-center gap-1 text-xs ml-auto">
              <Star size={11} className="text-amber-400 fill-amber-400" />
              <span className="font-medium text-slate-700">{course.rating.toFixed(1)}</span>
            </div>
          )}
        </div>
      </div>
    </Link>
  )
}
