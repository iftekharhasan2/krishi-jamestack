import { Link } from 'react-router-dom'
import { GraduationCap, Twitter, Linkedin, Github } from 'lucide-react'

export default function Footer() {
  return (
    <footer className="bg-slate-900 text-slate-300 py-16 mt-20">
      <div className="max-w-7xl mx-auto px-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 pb-12 border-b border-slate-800">
          <div className="col-span-1 md:col-span-2">
            <Link to="/" className="flex items-center gap-2.5 mb-4">
              <div className="w-8 h-8 bg-white rounded-lg flex items-center justify-center">
                <GraduationCap size={18} className="text-slate-900" />
              </div>
              <span className="font-display font-bold text-xl text-white">LearnFlow</span>
            </Link>
            <p className="text-sm text-slate-400 max-w-xs leading-relaxed">
              Transform your skills with world-class courses from expert instructors. Learn at your own pace, anywhere.
            </p>
            <div className="flex gap-3 mt-6">
              {[Twitter, Linkedin, Github].map((Icon, i) => (
                <a key={i} href="#" className="w-9 h-9 rounded-lg bg-slate-800 hover:bg-slate-700 flex items-center justify-center transition-colors">
                  <Icon size={15} />
                </a>
              ))}
            </div>
          </div>
          <div>
            <h4 className="text-white font-semibold text-sm mb-4">Platform</h4>
            <ul className="space-y-2.5">
              {['Browse Courses', 'For Instructors', 'Pricing', 'Blog'].map(item => (
                <li key={item}><a href="#" className="text-sm text-slate-400 hover:text-white transition-colors">{item}</a></li>
              ))}
            </ul>
          </div>
          <div>
            <h4 className="text-white font-semibold text-sm mb-4">Company</h4>
            <ul className="space-y-2.5">
              {['About', 'Careers', 'Privacy', 'Terms'].map(item => (
                <li key={item}><a href="#" className="text-sm text-slate-400 hover:text-white transition-colors">{item}</a></li>
              ))}
            </ul>
          </div>
        </div>
        <div className="pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-xs text-slate-500">© 2024 LearnFlow. All rights reserved.</p>
          <p className="text-xs text-slate-500">Built with ❤️ for learners worldwide</p>
        </div>
      </div>
    </footer>
  )
}
