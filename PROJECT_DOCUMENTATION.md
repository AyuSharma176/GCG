# GCG – GLA Coding Group | Full-Stack Web Platform

> **Live URL:** [https://gcg.ayusharma.in](https://gcg.ayusharma.in)  
> **Type:** Full-Stack SaaS Web Application + Progressive Web App (PWA)  
> **Domain:** EdTech / Competitive Programming Community Platform

---

## Project Overview

**GCG (GLA Coding Group)** is a production-grade, full-stack web platform built for the competitive programming community at GLA University. The platform serves as a centralized hub that aggregates real-time data from LeetCode and Codeforces APIs, integrates Google Gemini AI to generate daily practice questions, and provides a live competitive leaderboard with a custom-built ranking algorithm.

The application is fully open-access — no login required — and is installable as a Progressive Web App (PWA), making it accessible across all devices including mobile, tablet, and desktop.

---

## Core Features

### 1. Live Competitive Leaderboard
- Fetches real-time statistics (questions solved, contest ratings) from **LeetCode's GraphQL API** and **Codeforces REST API** for each registered member.
- Implements a **custom ranking algorithm**: `rankScore = (totalQuestions × 10) + (totalRating × 0.25)` that rewards both problem-solving volume and contest performance.
- Supports manual per-user refresh and full leaderboard bulk refresh.
- All member data is persisted in **MongoDB Atlas** and served via a RESTful backend.

### 2. AI-Powered Daily Practice (Exam Module)
- Automatically generates **3 fresh LeetCode questions daily at 4:00 AM IST** using **Google Gemini AI**, curated based on the HackWithInfy syllabus.
- Questions are cached in MongoDB (keyed by IST date at midnight) to avoid redundant API calls — served from cache if already generated for the day.
- **Practice History Calendar** — users can navigate back through previous days' questions via an interactive date-picker UI.

### 3. Previous Year Interview Questions
- Stores and displays company-wise, year-wise interview problems (problem statement, examples, test cases, constraints, difficulty, topics, and detailed explanation).
- Questions are generated on-demand using **Gemini AI** and stored in MongoDB for future retrieval.

### 4. Contest Tracker
- Aggregates upcoming coding contests from both **LeetCode** and **Codeforces** in real time.
- Displays contest name, platform, start time, and duration in a unified view.

### 5. Resource Hub
- Curated collection of tutorials, articles, videos, coding challenges, and projects presented in interactive glassmorphism-styled cards.

### 6. Progressive Web App (PWA)
- Fully installable on Android, iOS, and desktop via browser.
- Service worker powered by **Workbox** handles offline caching with `CacheFirst` strategy for static assets and fonts, and `NetworkFirst` for API calls.
- Auto-updates on new deployment via `registerType: 'autoUpdate'`.

### 7. Theme System & Glassmorphism UI
- Global **dark/light theme** managed via React Context API with a custom themes configuration.
- UI styled with **Tailwind CSS v4**, featuring glassmorphism cards, gradient text effects, hover animations, and a **Vanta.js / Three.js** animated 3D background on the home page.

### 8. Wake-Up Screen
- A smart pre-loader component that handles the **Render cold-start delay** gracefully, showing a progress UI while the backend spins up — significantly improving perceived performance.

---

## Tech Stack

### Frontend

| Technology | Version | Purpose |
|---|---|---|
| **React** | v19 | Core UI library with Hooks and functional components |
| **Vite** | v7 | Lightning-fast build tool and dev server |
| **Tailwind CSS** | v4 | Utility-first CSS framework for all styling |
| **React Router DOM** | v7 | Client-side SPA routing |
| **Axios** | v1.13 | HTTP client for API communication |
| **Lucide React** | v0.542 | Icon library |
| **Monaco Editor** | v4.7 | Embedded VS Code-style code editor component |
| **Three.js** | v0.180 | 3D WebGL rendering engine |
| **Vanta.js** | v0.5 | Animated 3D background effects (uses Three.js) |
| **vite-plugin-pwa** | v1.2 | PWA generation (manifest + service worker injection) |
| **Workbox** | v7.4 | Service worker strategies for offline caching |
| **ESLint** | v9 | Code linting with React-specific plugins |

### Backend

| Technology | Version | Purpose |
|---|---|---|
| **Node.js** | LTS | JavaScript runtime |
| **Express** | v5 | RESTful API server framework |
| **Mongoose** | v8 | MongoDB ODM for schema definition and queries |
| **MongoDB Atlas** | Cloud | Primary NoSQL database for all persisted data |
| **Google Generative AI SDK** | v0.24 | Gemini AI integration for question generation |
| **Axios** | v1.13 | Server-side HTTP client for LeetCode & Codeforces APIs |
| **CORS** | v2.8 | Cross-origin request configuration |
| **dotenv** | v17 | Environment variable management |
| **uuid** | v11 | Unique ID generation |
| **nodemon** | v3.1 | Dev server auto-restart |

### External APIs & Services

| Service | Usage |
|---|---|
| **LeetCode GraphQL API** | Fetch user total questions solved and contest rating |
| **Codeforces REST API** | Fetch user submissions count and contest rating |
| **Google Gemini AI** | Generate daily practice questions and previous year problems |

### Infrastructure & Deployment

| Service | Usage |
|---|---|
| **Vercel** | Frontend hosting with custom domain, SPA rewrite rules, and aggressive asset caching |
| **Render** | Backend Node.js server hosting |
| **MongoDB Atlas** | Cloud-hosted NoSQL database |
| **Custom Domain** | `gcg.ayusharma.in` via DNS configuration |

---

## Architecture

```
┌─────────────────────────────────────────────────────┐
│                  CLIENT (Browser / PWA)              │
│                                                     │
│   React 19 + Vite 7 + Tailwind CSS 4               │
│   React Router DOM (SPA)                            │
│   Workbox Service Worker (Offline Cache)            │
└──────────────────────┬──────────────────────────────┘
                       │ HTTPS (Axios)
                       ▼
┌─────────────────────────────────────────────────────┐
│             BACKEND (Node.js / Express 5)           │
│             Hosted on Render                        │
│                                                     │
│  ┌─────────────────────────────────────────────┐   │
│  │  REST API Endpoints                          │   │
│  │  GET  /api/leaderboard                       │   │
│  │  POST /api/leaderboard                       │   │
│  │  PUT  /api/leaderboard/:id/refresh           │   │
│  │  PUT  /api/leaderboard/refresh-all           │   │
│  │  DELETE /api/leaderboard/:id                 │   │
│  │  GET  /api/contests/leetcode                 │   │
│  │  GET  /api/contests/codeforces               │   │
│  │  GET  /api/contests/all                      │   │
│  │  GET  /api/exam/generate-questions (Gemini)  │   │
│  │  GET  /api/exam/previous-questions           │   │
│  │  GET  /api/previous-year-questions           │   │
│  │  POST /api/previous-year-questions/generate  │   │
│  └─────────────────────────────────────────────┘   │
└──────┬────────────────────────┬────────────────────-┘
       │                        │
       ▼                        ▼
┌─────────────┐     ┌──────────────────────────────┐
│ MongoDB     │     │   External APIs               │
│ Atlas       │     │   - LeetCode GraphQL          │
│ (Mongoose)  │     │   - Codeforces REST           │
└─────────────┘     │   - Google Gemini AI          │
                    └──────────────────────────────┘
```

---

## Database Models (MongoDB / Mongoose)

### `Leaderboard`
Stores member profiles with real-time stats from LeetCode and Codeforces.
- `name`, `leetcodeUsername`, `codeforcesUsername`
- `leetcodeQuestions`, `leetcodeRating`, `codeforcesQuestions`, `codeforcesRating`
- `totalQuestions`, `rankScore` (computed)
- `lastUpdated`, `createdAt`

### `DailyQuestions`
Caches AI-generated daily practice questions per IST date.
- `date` (unique key — IST midnight), `questions[]` (questionName, questionLink, questionLevel)
- `generatedAt`, `createdAt`

### `PreviousYearQuestion`
Stores company-wise interview problems with full problem details.
- `questionId` (unique), `company`, `year`, `difficulty`, `topics[]`
- `problemStatement`, `examples[]`, `testCases[]`, `constraints[]`, `explanation`

---

## Ranking Algorithm

The custom leaderboard ranking score is calculated as:

```
rankScore = (totalQuestions × 10) + (totalRating × 0.25)
```

- **totalQuestions** = LeetCode questions solved + Codeforces problems solved
- **totalRating** = LeetCode contest rating + Codeforces contest rating

This formula balances raw problem-solving volume (weighted at 10x) with competitive contest performance (weighted at 0.25x), ensuring active problem solvers are not outranked purely by rating.

---

## Deployment & DevOps

- **Frontend** deployed on **Vercel** with:
  - SPA rewrite rule: all routes fallback to `/index.html`
  - `no-cache` headers on `index.html` to always serve the latest build
  - `immutable` 1-year cache headers on versioned `/assets/` files
- **Backend** deployed on **Render** (Node.js web service)
- **Service Worker** (Workbox) caches:
  - All static assets: `js, css, html, svg, png, json, woff2`  (`CacheFirst`, 1 year)
  - Google Fonts: `CacheFirst`, 1 year
  - Backend API responses: `NetworkFirst`, 5 min TTL, 50 entry max

---

## Key Engineering Highlights

1. **AI Integration with Server-Side Caching** — Gemini AI is called only once per day; results are stored in MongoDB by IST date so every subsequent request is served from DB, eliminating latency and API cost.

2. **Multi-Platform Stats Aggregation** — The backend acts as a unified proxy, fetching from LeetCode's GraphQL and Codeforces REST, normalizing the data, and persisting it, so the frontend gets consistent structured responses.

3. **Custom Ranking Engine** — Domain-specific algorithm designed to fairly rank competitive programmers across two different platforms with different scoring systems.

4. **Progressive Web App** — The application is fully installable (mobile + desktop), works offline for cached pages, and auto-updates without user intervention.

5. **Production-Ready CORS Configuration** — The backend explicitly restricts origins to known safe domains, with dynamic subdomain matching for Vercel preview deployments.

6. **Cold-Start UX Optimization** — A purpose-built `WakeUpScreen` component smoothly handles the Render free-tier cold-start delay so users get visual feedback instead of a blank screen.

7. **Live 3D Animated UI** — Vanta.js (backed by Three.js and WebGL) renders an interactive animated background, giving the platform a premium, modern aesthetic without impacting performance.

---

## Project Structure

```
GCG/
├── backend_gcg/
│   ├── server.js           # Express app, all routes, Mongoose models
│   ├── package.json
│   └── RANKING_ALGORITHM.md
└── GCG_frontend/
    ├── index.html
    ├── vite.config.js       # Vite + PWA + Tailwind config
    ├── vercel.json          # Deployment rewrite + cache rules
    ├── public/
    │   └── manifest.json    # PWA manifest
    └── src/
        ├── App.jsx          # Router setup
        ├── main.jsx         # React entry point
        ├── components/
        │   ├── WakeUpScreen.jsx   # Cold-start handler
        │   ├── InstallPWA.jsx     # PWA install prompt
        │   └── Loader.jsx
        ├── contexts/
        │   ├── ThemeContext.jsx   # Global theme state
        │   └── themes.js         # Theme definitions
        └── pages/
            ├── Home.jsx           # Landing + Vanta.js 3D bg
            ├── Leaderboard.jsx    # Live ranking table
            ├── Exam.jsx           # AI daily questions + calendar
            ├── Contest.jsx        # Upcoming contests aggregator
            ├── PreviousYear.jsx   # Company-wise interview Qs
            ├── Resources.jsx      # Curated resource cards
            └── About.jsx          # Community info
```

---

## Summary for Resume / Portfolio

> **GCG – GLA Coding Group Platform** is a production-deployed, full-stack web application that serves the competitive programming community of GLA University. Built with **React 19, Vite 7, Tailwind CSS 4, Node.js, Express 5, MongoDB Atlas, and Google Gemini AI**, the platform features a live leaderboard aggregating real-time data from LeetCode and Codeforces APIs, AI-generated daily practice questions with server-side caching, a previous year interview questions module, and an upcoming contest tracker. The frontend is deployed on **Vercel** with PWA support (Workbox service worker), and the backend is hosted on **Render**. The application uses a custom ranking algorithm, glassmorphism UI with Three.js/Vanta.js animated backgrounds, and is fully responsive and installable as a native-like PWA on mobile and desktop.
