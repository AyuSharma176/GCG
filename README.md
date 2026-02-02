<div align="center">

#  GCG – GLA Coding Group Website

A modern, open-access **SaaS platform** for the coding community at **GLA University** — featuring curated resources, a sleek UI, and an interactive leaderboard.

**Live Site:** [https://gcg.ayusharma.in/](https://gcg.ayusharma.in/)

</div>

---

##  Features

- **Resource Hub** — Browse tutorials, articles, videos, coding challenges, and projects, all presented in interactive glassy cards.
- **Community Leaderboard** — Live ranking system using real-time data from LeetCode and Codeforces APIs with optimized ranking algorithm.
- **Real-time Stats** — Automatically fetches questions solved and ratings from both platforms.
- **Informational Pages** — Explore the “About GCG” and “About GLA University” sections for context and community values.
- **Modern Aesthetic** — Clean, responsive UI enhanced with a glassmorphism style, gradient text, hover effects, and elegant blur overlays.
- **Global Accessibility** — No account needed — perfect for all students and visitors.

---

## 🌐 SaaS Architecture

GCG is built as a **Software as a Service (SaaS)** platform using **Progressive Web App (PWA)** technology:

- **🚀 Zero Installation Barriers** — Users can access instantly via browser or install as a native-like app
- **📱 Cross-Platform** — Single codebase works seamlessly on desktop, mobile, and tablets
- **🔄 Auto-Updates** — Service workers ensure users always have the latest version
- **⚡ Offline Capability** — Continue browsing resources even without internet connection
- **💾 Local Caching** — Fast load times with intelligent caching strategies
- **🌍 Universal Access** — No app store dependencies, accessible worldwide instantly

This PWA-based SaaS approach provides enterprise-grade features with minimal deployment friction, making coding resources accessible to everyone.

---

##  Tech Stack

| Layer       | Technology                                            |
|-------------|--------------------------------------------------------|
| Frontend    | React, Vite, Tailwind CSS, React Router               |
| PWA         | vite-plugin-pwa, Workbox, Service Workers             |
| Backend     | Node.js, Express, MongoDB, Axios                       |
| APIs        | alfa-leetcode-api, Codeforces REST API                |
| Deployment  | Vercel (Frontend), Render (Backend)                   |

---

## 🚀 Getting Started

Clone the project and launch it on your local machine with ease:

### Prerequisites

- Node.js v18 or newer  
- npm (comes bundled with Node.js)

```bash
git clone https://github.com/AyuSharma176/GCG.git
cd GCG
```

### Frontend Setup
```bash
cd GCG_frontend
npm install
```
Create a `.env` file in `GCG_frontend/` with:
```env
VITE_API_URL=http://localhost:5000/api/leaderboard
```
Start the development server:
```bash
npm run dev
```

**Build for Production (with PWA):**
```bash
npm run build
npm run preview  # Test production build locally
```

**Build for Production (with PWA):**
```bash
npm run build
npm run preview  # Test production build locally
```

### Backend Setup
```bash
cd backend_gcg    # or the actual backend folder
npm install
```
Create a `.env` file in `backend_gcg/` with:
```env
MONGO_URI=your_mongodb_connection_string
PORT=5000
```
Start the backend server:
```bash
npm start
```

---

##  Leaderboard Features

### Optimized Ranking Algorithm
The leaderboard uses an advanced ranking system that combines:
- **Total Questions Solved** (LeetCode + Codeforces)
- **LeetCode Contest Rating**
- **Codeforces Rating**

**Formula:**
```
rankScore = (totalQuestions × 10) + (totalRating × 0.25)
```

**Example:** User with 498 questions and 2800 total rating:
- Question Score: 498 × 10 = 4,980 points
- Rating Score: 2,800 × 0.25 = 700 points
- **Final Score: 5,680 points**

For detailed algorithm documentation, see [RANKING_ALGORITHM.md](backend_gcg/RANKING_ALGORITHM.md)

### API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/leaderboard` | Fetch all users sorted by rank |
| POST | `/api/leaderboard` | Add new user with live stats |
| PUT | `/api/leaderboard/:id/refresh` | Refresh user stats |
| PUT | `/api/leaderboard/refresh-all` | Batch refresh all users |
| DELETE | `/api/leaderboard/:id` | Remove user |

### Usage

1. **Add Your Profile:**
   - Click "Add Yourself" button
   - Enter your name
   - Provide your **LeetCode username** (e.g., `uwi`)
   - Provide your **Codeforces username** (e.g., `tourist`)
   - Submit and wait for stats to be fetched automatically

2. **Refresh Stats:**
   - Click the 🔄 icon next to any user to update their stats
   - Stats are fetched in real-time from both platforms

3. **View Rankings:**
   - Rankings are automatically sorted by rank score
   - See total questions, individual platform stats, and ratings


