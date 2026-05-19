# AtomGoals — Goal Setting & Tracking Portal
### AtomQuest Hackathon 1.0 Submission

A full-stack-ready, role-based Goal Management System built with React + Vite + Zustand.

---


## 🚀 Run Locally (3 commands)

```bash
cd atomgoals
npm install
npm run dev
```

Open → **[atom-goals-v1-0-8cf4y66vc-vaishnavi-s-projects8.vercel.app](https://atom-goals-v1-0-8cf4y66vc-vaishnavi-s-projects8.vercel.app/login)**

---

## 🔐 Demo Login Credentials

| Role | Email | Password |
|------|-------|----------|
| Employee | riya.kapoor@atomtech.in | emp123 |
| Manager | arjun.mehta@atomtech.in | mgr123 |
| Admin/HR | hr@atomtech.in | admin123 |

> Or click the **Quick access** buttons on the login page.

---

## 🏗️ Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend | React 18 + Vite |
| State Management | Zustand (with localStorage persistence) |
| Routing | React Router v6 |
| Charts | Recharts |
| Icons | Lucide React |
| Styling | Pure CSS (custom design system, no Tailwind) |
| Export | Native CSV generation |

---

## 👥 User Roles & Features

### Employee
- Dashboard with goal overview & progress scores
- Add goals (max 8, min 10% weight, total = 100%)
- Submit goal sheet for manager approval
- Q1 check-in — log actuals, see live scores
- View shared goals pushed by manager

### Manager (L1)
- Team dashboard with heatmap
- Inline goal editing before approval
- Approve / Return with comments
- Push shared goals to multiple team members
- Q1 check-in review with feedback

### Admin / HR
- Org-wide dashboard and heatmap
- Analytics with charts (bar, pie, horizontal bar)
- Audit log with full action trail
- Escalation management and resolution
- Cycle configuration (max goals, min weight, phases)
- CSV export (achievement report + audit log)

---

## 📐 Scoring Formulas (per BRD)

| UoM Type | Formula |
|----------|---------|
| Numeric Min (Higher is better) | Achievement ÷ Target × 100 |
| Numeric Max (Lower is better) | Target ÷ Achievement × 100 |
| % Min / % Max | Same as Numeric respectively |
| Timeline | On/before deadline = 100%, −10% per day late |
| Zero | Achievement = 0 → 100%, else → 0% |

---

## 🚢 Deploy to Vercel (free)

```bash
npm install -g vercel
vercel --prod
```

Or connect your GitHub repo to **vercel.com** → Import → Deploy.

---

## 📁 Project Structure

```
atomgoals/
├── public/
│   └── favicon.svg
├── src/
│   ├── components/
│   │   └── shared/
│   │       ├── AppShell.jsx      # Sidebar + topbar layout
│   │       └── Components.jsx    # Reusable UI components
│   ├── pages/
│   │   ├── LoginPage.jsx
│   │   ├── employee/
│   │   │   ├── Dashboard.jsx
│   │   │   ├── MyGoals.jsx
│   │   │   ├── AddGoal.jsx
│   │   │   └── CheckIn.jsx
│   │   ├── manager/
│   │   │   ├── Dashboard.jsx
│   │   │   ├── TeamGoals.jsx
│   │   │   ├── Approvals.jsx
│   │   │   ├── CheckIn.jsx
│   │   │   └── PushGoal.jsx
│   │   └── admin/
│   │       ├── Dashboard.jsx
│   │       ├── Analytics.jsx
│   │       ├── AuditLog.jsx
│   │       ├── Escalations.jsx
│   │       ├── CycleConfig.jsx
│   │       └── Export.jsx
│   ├── store/
│   │   └── useStore.js           # Zustand store + seed data + score logic
│   ├── App.jsx                   # Routes
│   ├── main.jsx
│   └── index.css                 # Design system
├── index.html
├── vite.config.js
└── package.json
```

---

## 🏆 Built for AtomQuest Hackathon 1.0
