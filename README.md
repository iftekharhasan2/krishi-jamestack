# 🎓 LearnFlow LMS — Vercel Deployment Guide

Full-stack LMS: **Flask + MongoDB + Cloudinary** backend (Vercel Serverless) + **React Vite** frontend.

---

## 📁 Project Structure

```
lms-platform/
├── vercel.json              ← Vercel config (routes API + SPA)
├── .env.example             ← Add these to Vercel dashboard
├── api/
│   ├── index.py             ← Serverless entry (imports Flask app)
│   └── requirements.txt     ← Python deps for Vercel
├── backend/                 ← Flask app (config, models, routes)
└── frontend/                ← React Vite app
```

---

## 🚀 Deploy to Vercel

### 1. Get free services
| Service | URL | What you need |
|---------|-----|---------------|
| MongoDB Atlas | https://mongodb.com/atlas | Connection string |
| Cloudinary | https://cloudinary.com | Cloud name, API key, secret |

### 2. Push to GitHub
```bash
git init && git add . && git commit -m "init"
git remote add origin https://github.com/YOU/lms-platform.git
git push -u origin main
```

### 3. Deploy on Vercel
1. https://vercel.com → **Add New Project** → import your repo
2. Before deploying, set **Environment Variables** (from `.env.example`):
   - `MONGO_URI`
   - `JWT_SECRET_KEY`
   - `CLOUDINARY_CLOUD_NAME`
   - `CLOUDINARY_API_KEY`
   - `CLOUDINARY_API_SECRET`
   - `ADMIN_EMAIL`
   - `ADMIN_PASSWORD`
3. Click **Deploy** ✅

---

## 💻 Local Dev

```bash
# Backend (Terminal 1)
cd backend
python -m venv venv && source venv/bin/activate
pip install -r ../api/requirements.txt
cp ../.env.example .env  # fill in values
python app.py            # http://localhost:5000

# Frontend (Terminal 2)
cd frontend
npm install && npm run dev   # http://localhost:5173 (proxies /api -> :5000)
```

---

## 🔐 Default Admin
Auto-created from env vars on first deploy.
- Email: value of `ADMIN_EMAIL`
- Password: value of `ADMIN_PASSWORD`
