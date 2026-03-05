export function formatDuration(seconds) {
  if (!seconds) return '0m'
  const h = Math.floor(seconds / 3600)
  const m = Math.floor((seconds % 3600) / 60)
  const s = Math.floor(seconds % 60)
  if (h > 0) return `${h}h ${m}m`
  if (m > 0) return `${m}m ${s}s`
  return `${s}s`
}

export function formatFileSize(bytes) {
  if (!bytes) return '0 B'
  if (bytes < 1024) return `${bytes} B`
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`
}

export function formatPrice(price) {
  if (!price || price === 0) return 'Free'
  return `$${Number(price).toFixed(2)}`
}

export function getInitials(name) {
  if (!name) return '?'
  return name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2)
}

export function timeAgo(date) {
  if (!date) return ''
  const now = new Date()
  const d = new Date(date)
  const diff = Math.floor((now - d) / 1000)
  if (diff < 60) return 'just now'
  if (diff < 3600) return `${Math.floor(diff / 60)}m ago`
  if (diff < 86400) return `${Math.floor(diff / 3600)}h ago`
  if (diff < 2592000) return `${Math.floor(diff / 86400)}d ago`
  return d.toLocaleDateString()
}

export const CATEGORIES = [
  'Web Development', 'Mobile Development', 'Data Science', 'Machine Learning',
  'Design', 'Business', 'Marketing', 'Photography', 'Music', 'Finance',
  'Health & Fitness', 'Personal Development', 'Language', 'IT & Software', 'Other'
]

export const LEVELS = ['Beginner', 'Intermediate', 'Advanced', 'All Levels']
