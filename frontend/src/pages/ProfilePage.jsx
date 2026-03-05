import { useState, useRef } from 'react'
import { useAuth } from '../context/AuthContext'
import api from '../api/axios'
import { getInitials, timeAgo } from '../utils/helpers'
import { Camera, Save, Key, User, Loader2, Shield, Link as LinkIcon } from 'lucide-react'
import toast from 'react-hot-toast'

export default function ProfilePage() {
  const { user, updateUser } = useAuth()
  const [tab, setTab] = useState('profile')
  const [saving, setSaving] = useState(false)
  const [form, setForm] = useState({
    full_name: user?.full_name || '',
    bio: user?.bio || '',
    phone: user?.phone || '',
    website: user?.website || '',
    social_links: { twitter: '', linkedin: '', github: '', ...(user?.social_links || {}) }
  })
  const [passForm, setPassForm] = useState({ current_password: '', new_password: '', confirm_password: '' })
  const fileRef = useRef()

  const handleProfileSave = async (e) => {
    e.preventDefault()
    setSaving(true)
    try {
      const res = await api.put('/auth/update-profile', form)
      updateUser(res.data.user)
      toast.success('Profile updated successfully!')
    } catch (err) {
      toast.error(err.response?.data?.error || 'Update failed')
    } finally {
      setSaving(false)
    }
  }

  const handleAvatarUpload = async (e) => {
    const file = e.target.files[0]
    if (!file) return
    const formData = new FormData()
    formData.append('avatar', file)
    try {
      const res = await api.post('/auth/upload-avatar', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      })
      updateUser({ ...user, avatar: res.data.avatar })
      toast.success('Avatar updated!')
    } catch (err) {
      toast.error('Failed to upload avatar')
    }
  }

  const handlePasswordChange = async (e) => {
    e.preventDefault()
    if (passForm.new_password !== passForm.confirm_password) {
      toast.error('Passwords do not match')
      return
    }
    setSaving(true)
    try {
      await api.put('/auth/change-password', {
        current_password: passForm.current_password,
        new_password: passForm.new_password
      })
      toast.success('Password changed!')
      setPassForm({ current_password: '', new_password: '', confirm_password: '' })
    } catch (err) {
      toast.error(err.response?.data?.error || 'Failed to change password')
    } finally {
      setSaving(false)
    }
  }

  const TABS = [
    { id: 'profile', icon: User, label: 'Profile' },
    { id: 'security', icon: Key, label: 'Security' },
  ]

  return (
    <div className="min-h-screen bg-slate-50/40 pt-20 pb-12">
      <div className="max-w-3xl mx-auto px-6">
        {/* Header Card */}
        <div className="card p-6 mb-6">
          <div className="flex items-start gap-5">
            <div className="relative group cursor-pointer" onClick={() => fileRef.current?.click()}>
              {user?.avatar ? (
                <img src={user.avatar} alt="" className="w-20 h-20 rounded-2xl object-cover ring-4 ring-slate-100" />
              ) : (
                <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-violet-500 to-blue-500 flex items-center justify-center text-white text-2xl font-bold ring-4 ring-slate-100">
                  {getInitials(user?.full_name)}
                </div>
              )}
              <div className="absolute inset-0 bg-black/40 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                <Camera size={18} className="text-white" />
              </div>
              <input ref={fileRef} type="file" className="hidden" accept="image/*" onChange={handleAvatarUpload} />
            </div>

            <div className="flex-1">
              <h1 className="font-display text-2xl font-bold text-slate-900">{user?.full_name}</h1>
              <p className="text-slate-500 text-sm mt-0.5">{user?.email}</p>
              <div className="flex items-center gap-3 mt-2">
                <span className="badge bg-violet-50 text-violet-700 border border-violet-100 capitalize">{user?.role}</span>
                <span className="badge bg-slate-100 text-slate-600">ID: {user?.user_id}</span>
                {user?.is_approved && <span className="badge bg-emerald-50 text-emerald-700 border border-emerald-100"><Shield size={10} /> Verified</span>}
              </div>
              <p className="text-xs text-slate-400 mt-2">Member since {timeAgo(user?.created_at)}</p>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex gap-1 mb-6 bg-slate-100 p-1 rounded-xl w-fit">
          {TABS.map(t => (
            <button key={t.id} onClick={() => setTab(t.id)}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                tab === t.id ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-500 hover:text-slate-700'
              }`}>
              <t.icon size={14} /> {t.label}
            </button>
          ))}
        </div>

        {/* Profile Tab */}
        {tab === 'profile' && (
          <form onSubmit={handleProfileSave} className="card p-6 space-y-5 animate-fade-in">
            <h2 className="font-display text-lg font-bold text-slate-900">Personal Information</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <div>
                <label className="label">Full Name</label>
                <input type="text" className="input-field" value={form.full_name}
                  onChange={e => setForm({...form, full_name: e.target.value})} />
              </div>
              <div>
                <label className="label">Phone Number</label>
                <input type="tel" className="input-field" placeholder="+1 234 567 8900"
                  value={form.phone} onChange={e => setForm({...form, phone: e.target.value})} />
              </div>
            </div>

            <div>
              <label className="label">Bio</label>
              <textarea className="input-field resize-none" rows={3} placeholder="Tell us about yourself..."
                value={form.bio} onChange={e => setForm({...form, bio: e.target.value})} />
            </div>

            <div>
              <label className="label">Website</label>
              <input type="url" className="input-field" placeholder="https://yourwebsite.com"
                value={form.website} onChange={e => setForm({...form, website: e.target.value})} />
            </div>

            <div>
              <label className="label flex items-center gap-1.5"><LinkIcon size={13} /> Social Links</label>
              <div className="space-y-3">
                {['twitter', 'linkedin', 'github'].map(platform => (
                  <div key={platform} className="flex items-center gap-2">
                    <span className="text-xs text-slate-500 capitalize w-16">{platform}</span>
                    <input type="url" className="input-field" placeholder={`https://${platform}.com/username`}
                      value={form.social_links[platform] || ''}
                      onChange={e => setForm({...form, social_links: {...form.social_links, [platform]: e.target.value}})} />
                  </div>
                ))}
              </div>
            </div>

            <button type="submit" disabled={saving} className="btn-primary">
              {saving ? <Loader2 size={15} className="animate-spin" /> : <Save size={15} />}
              Save Changes
            </button>
          </form>
        )}

        {/* Security Tab */}
        {tab === 'security' && (
          <form onSubmit={handlePasswordChange} className="card p-6 space-y-5 animate-fade-in">
            <h2 className="font-display text-lg font-bold text-slate-900">Change Password</h2>
            
            {[
              { key: 'current_password', label: 'Current Password' },
              { key: 'new_password', label: 'New Password' },
              { key: 'confirm_password', label: 'Confirm New Password' },
            ].map(({ key, label }) => (
              <div key={key}>
                <label className="label">{label}</label>
                <input type="password" className="input-field" placeholder="••••••••"
                  value={passForm[key]} onChange={e => setPassForm({...passForm, [key]: e.target.value})} required minLength={6} />
              </div>
            ))}

            <button type="submit" disabled={saving} className="btn-primary">
              {saving ? <Loader2 size={15} className="animate-spin" /> : <Key size={15} />}
              Update Password
            </button>
          </form>
        )}
      </div>
    </div>
  )
}
