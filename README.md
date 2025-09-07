<div align="center">

#  GCG – GLA Coding Group Website

A modern, open-access hub for the coding community at **GLA University** — featuring curated resources, a sleek UI, and an interactive leaderboard.

**Live Site:** [https://gla-coding-group.vercel.app/](https://gla-coding-group.vercel.app/)

</div>

---

##  Features

- **Resource Hub** — Browse tutorials, articles, videos, coding challenges, and projects, all presented in interactive glassy cards.
- **Community Leaderboard** — (Optional) Displays aggregated scores from student coding profiles (LeetCode, CodeChef, etc.).
- **Informational Pages** — Explore the “About GCG” and “About GLA University” sections for context and community values.
- **Modern Aesthetic** — Clean, responsive UI enhanced with a glassmorphism style, gradient text, hover effects, and elegant blur overlays.
- **Global Accessibility** — No account needed — perfect for all students and visitors.

---

##  Tech Stack

| Layer       | Technology                                            |
|-------------|--------------------------------------------------------|
| Frontend    | React, Vite, Tailwind CSS, React Router               |
| Backend     | Node.js, Express, MongoDB, Axios, Cheerio *(Optional)* |
| Deployment  | Vercel (Frontend), Render or similar *(Backend)*      |

---

##  Getting Started

Clone the project and launch it on your local machine with ease:

### Prerequisites

- Node.js v18 or newer  
- npm (comes bundled with Node.js)

```bash
git clone https://github.com/AyuSharma176/GCG.git
cd GCG
```
#2. Frontend Setup
```bash
cd frontend_gcg   # or the actual frontend folder
npm install
npm run dev
```
#3. Backend Setup
```bash
cd backend_gcg    # or the actual backend folder
npm install
```
#Create a .env file in backend_gcg and add your MongoDB URI:
```bash
MONGO_URI=your_mongodb_connection_string
```
#Start the backend server:
```bash
npm start


