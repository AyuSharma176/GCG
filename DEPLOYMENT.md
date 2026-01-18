# Deployment Guide

## Backend Deployment (Render)

Your backend is deployed at: **https://gcg-rqxl.onrender.com**

### Environment Variables on Render:
Make sure these are set in your Render dashboard:
- `MONGO_URI` - Your MongoDB Atlas connection string
- `PORT` - 5000 (or let Render auto-assign)

### Backend API Endpoints:
- `GET /api/leaderboard` - Get all leaderboard entries
- `POST /api/leaderboard` - Add new user
- `PUT /api/leaderboard/:id/refresh` - Refresh user stats
- `GET /api/contests/leetcode` - Get upcoming LeetCode contests
- `GET /api/contests/codeforces` - Get upcoming Codeforces contests
- `GET /api/contests/all` - Get all upcoming contests

## Frontend Deployment (Vercel)

### Setup Steps:
1. Push your code to GitHub
2. Import project in Vercel
3. Set environment variable in Vercel dashboard:
   - `VITE_API_URL` = `https://gcg-rqxl.onrender.com/api/leaderboard`

### Update CORS:
After deploying to Vercel, you'll get a domain like `your-app.vercel.app`. Update the CORS configuration in `backend_gcg/server.js`:

```javascript
const corsOptions = {
  origin: [
    'http://localhost:5173',
    'https://your-actual-vercel-domain.vercel.app', // Replace with your actual domain
    /\.vercel\.app$/ // Allows all Vercel preview URLs
  ],
  credentials: true
};
```

Then redeploy the backend on Render.

## Local Development

### Backend:
```bash
cd backend_gcg
npm install
# Create .env file with MONGO_URI
npm start
```

### Frontend:
```bash
cd GCG_frontend
npm install
# Update .env to use localhost:5000
npm run dev
```

## Pushing to GitHub

```bash
git add .
git commit -m "Configure production API URLs"
git push origin master
```

## Important Notes:

1. **Contest API**: The contest endpoints fetch from:
   - LeetCode: alfa-leetcode-api (https://alfa-leetcode-api.onrender.com)
   - Codeforces: Official API (https://codeforces.com/api)

2. **CORS**: The backend is configured to accept requests from:
   - localhost (for development)
   - Your Vercel domain (for production)

3. **Environment Variables**: 
   - Don't commit `.env` files
   - Set them in Render and Vercel dashboards

4. **API Rate Limits**: Be aware of rate limits on external APIs (LeetCode, Codeforces)
