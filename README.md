# 🍉 CareerPulse — Full-Stack Job Application & JD Tracker (MongoDB + Watermelon UI)

**CareerPulse** is a production-ready, full-stack Job Application & JD Management Command Center built with a **Watermelon UI** design system (vibrant watermelon crimson/coral, fresh mint rind emerald, obsidian dark mode) and backed by **MongoDB Atlas** with a local-first offline sync engine.

---

## 💡 Recommended Repository Names
If you're creating a GitHub repository, here are recommended names ranked by impact:
1. **`career-pulse`** (⭐ **Recommended** — Clean, modern, SaaS-grade)
2. **`watermelon-job-tracker`** (Playful & memorable, matches your UI theme)
3. **`applied-pro`** (Concise & professional)
4. **`job-flow-hub`** (Focuses on workflow & pipeline)

---

## 🛠️ Step-by-Step GitHub Setup & Push

```bash
# 1. Initialize git (if not already initialized)
git init

# 2. Stage all files (.env is safely ignored in .gitignore)
git add .

# 3. Create your first commit
git commit -m "feat: initial release of CareerPulse with MongoDB & Watermelon UI"

# 4. Set main branch
git branch -M main

# 5. Link to your GitHub repo and push
git remote add origin https://github.com/<YOUR_USERNAME>/career-pulse.git
git push -u origin main
```

---

## 🗄️ MongoDB Atlas Setup

Your credentials are configured in `.env`:
```env
PORT=5000
MONGODB_URI=mongodb+srv://wasaya670_db_user:cocFh2zs7i5DGwAE@<YOUR_CLUSTER>.mongodb.net/jobapplied?retryWrites=true&w=majority
```

> **Note**: Replace `<YOUR_CLUSTER>` (e.g. `cluster0.abcde`) with your exact MongoDB Atlas cluster hostname from your Atlas Dashboard (`Connect` ➔ `Drivers`).
> The app features a **Local-First Architecture**, meaning it works instantly offline and automatically syncs to MongoDB once connected!

---

## 🚀 How to Run Locally

```bash
# Starts both the Express MongoDB API (Port 5000) and React Vite (Port 5173) concurrently
npm run dev
```

Visit: **`http://localhost:5173`**
API Health Check: **`http://localhost:5000/api/health`**

---

## ✨ Features

- **🍉 Watermelon UI Theme**: Vibrant crimson, mint/emerald accents, obsidian cards, neon glows.
- **📊 7-Stage Pipeline (Kanban + Table)**: Drag & drop, 1-click status progression, offer celebration confetti.
- **📝 JD Vault & Skills Match Score**: Full Job Description archive with interactive matched skills checklist.
- **⚡ Smart Paste Auto-Extractor**: Paste any job description to extract Company, Role, Location, Salary, and Skills.
- **📅 Interview Timeline & Calendar**: Live countdowns and logs for technical screens, take-homes, and onsite rounds.
- **🔗 Shareable Updates**: Formatted summary generator for WhatsApp, Telegram, Discord, and LinkedIn.
- **📂 CSV & JSON Portability**: 1-click export/import for Google Sheets and Excel.
