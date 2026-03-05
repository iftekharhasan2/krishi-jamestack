import { Routes, Route, Navigate } from 'react-router-dom'
import { AuthProvider, useAuth } from './context/AuthContext'
import Navbar from './components/layout/Navbar'
import Footer from './components/layout/Footer'
import HomePage from './pages/HomePage'
import { LoginPage, RegisterPage } from './pages/AuthPages'
import CoursesPage from './pages/CoursesPage'
import CourseDetailPage from './pages/CourseDetailPage'
import StudentDashboard from './pages/StudentDashboard'
import InstructorDashboard from './pages/InstructorDashboard'
import AdminDashboard from './pages/AdminDashboard'
import ProfilePage from './pages/ProfilePage'
import { Loader2 } from 'lucide-react'

function ProtectedRoute({ children, roles }) {
  const { user, loading } = useAuth()
  
  if (loading) return (
    <div className="min-h-screen flex items-center justify-center">
      <Loader2 size={32} className="animate-spin text-violet-500" />
    </div>
  )
  
  if (!user) return <Navigate to="/login" replace />
  if (roles && !roles.includes(user.role)) return <Navigate to="/" replace />
  
  return children
}

function AppLayout({ children, noFooter }) {
  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      <main className="flex-1">{children}</main>
      {!noFooter && <Footer />}
    </div>
  )
}

function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<AppLayout><HomePage /></AppLayout>} />
      <Route path="/login" element={<LoginPage />} />
      <Route path="/register" element={<RegisterPage />} />
      <Route path="/courses" element={<AppLayout><CoursesPage /></AppLayout>} />
      <Route path="/courses/:courseId" element={<AppLayout><CourseDetailPage /></AppLayout>} />
      
      <Route path="/dashboard" element={
        <ProtectedRoute roles={['student']}>
          <AppLayout noFooter><StudentDashboard /></AppLayout>
        </ProtectedRoute>
      } />
      
      <Route path="/instructor" element={
        <ProtectedRoute roles={['instructor']}>
          <AppLayout noFooter><InstructorDashboard /></AppLayout>
        </ProtectedRoute>
      } />
      
      <Route path="/admin" element={
        <ProtectedRoute roles={['admin']}>
          <AppLayout noFooter><AdminDashboard /></AppLayout>
        </ProtectedRoute>
      } />
      
      <Route path="/profile" element={
        <ProtectedRoute>
          <AppLayout noFooter><ProfilePage /></AppLayout>
        </ProtectedRoute>
      } />
      
      <Route path="*" element={
        <AppLayout>
          <div className="min-h-screen flex items-center justify-center">
            <div className="text-center">
              <h1 className="font-display text-6xl font-bold text-slate-200 mb-4">404</h1>
              <p className="text-slate-500 mb-6">Page not found</p>
              <a href="/" className="btn-primary">Go Home</a>
            </div>
          </div>
        </AppLayout>
      } />
    </Routes>
  )
}

export default function App() {
  return (
    <AuthProvider>
      <AppRoutes />
    </AuthProvider>
  )
}
