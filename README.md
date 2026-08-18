# 🍉 CareerPulse — Modern Job Application & Interview OS (MongoDB + Full-Stack)

**CareerPulse** is a production-ready, full-stack Job Application & Interview Management Command Center built with React 19, TypeScript, Express, and **MongoDB Atlas** with a local-first offline sync engine.

---

## 🚀 1-Click Vercel Deployment

CareerPulse is configured to deploy directly to **Vercel** with both the Frontend and Serverless MongoDB Backend in a single project.

### Steps to Deploy on Vercel:

1. Go to **[vercel.com](https://vercel.com)** and click **"Add New" ➔ "Project"**.
2. Import your GitHub repository: `https://github.com/wasaybuilds/CareerPulse`.
3. Under **Environment Variables**, add:
   - **Key**: `MONGODB_URI`
   - **Value**: `mongodb+srv://wasaya670_db_user:cocFh2zs7i5DGwAE@<YOUR_CLUSTER>.mongodb.net/jobapplied?retryWrites=true&w=majority`
4. Click **Deploy**! 🚀

---

## 🛠️ Step-by-Step GitHub Setup

```bash
# 1. Stage all changes (.env is safely ignored in .gitignore)
git add .

# 2. Commit changes
git commit -m "feat: add Vercel serverless deployment support"

# 3. Push to GitHub
git push origin main
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

## 💻 How to Run Locally

```bash
# Starts both the Express MongoDB API (Port 5000) and React Vite (Port 5173) concurrently
npm run dev
```

- **Frontend App**: `http://localhost:5173`
- **Backend API**: `http://localhost:5000/api/health`

---

## ✨ Features

- **📊 Applications Table View (Default)**: Spreadsheet grid with company avatars, in-line stage changers, salary badges, and quick actions.
- **📋 7-Stage Pipeline (Kanban Board)**: Drag & drop, 1-click status progression, offer celebration confetti.
- **📝 JD Vault & Skills Match Score**: Full Job Description archive with interactive matched skills checklist.
- **⚡ Smart Paste Auto-Extractor**: Paste any job description to extract Company, Role, Location, Salary, and Skills.
- **📅 Interview Timeline & Calendar**: Live countdowns and logs for technical screens, take-homes, and onsite rounds.
- **🔗 Shareable Updates**: Formatted summary generator for WhatsApp, Telegram, Discord, and LinkedIn.
- **📂 CSV & JSON Portability**: 1-click export/import for Google Sheets and Excel.
