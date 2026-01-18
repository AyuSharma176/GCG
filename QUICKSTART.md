# Quick Start Guide

## 🚀 Get Up and Running in 5 Minutes

### Step 1: Clone & Install
```bash
# Clone the repository
git clone https://github.com/AyuSharma176/GCG.git
cd GCG

# Install backend dependencies
cd backend_gcg
npm install

# Install frontend dependencies
cd ../GCG_frontend
npm install
```

### Step 2: Configure Environment

#### Backend (.env)
Create `backend_gcg/.env`:
```env
MONGO_URI=mongodb+srv://username:password@cluster.mongodb.net/gcg?retryWrites=true&w=majority
PORT=5000
```

**Get MongoDB URI:**
1. Go to [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
2. Create free cluster (if you don't have one)
3. Click "Connect" → "Connect your application"
4. Copy connection string and replace `<username>`, `<password>`, `<dbname>`

#### Frontend (.env)
Create `GCG_frontend/.env`:
```env
VITE_API_URL=http://localhost:5000/api/leaderboard
```

### Step 3: Start Servers

**Terminal 1 - Backend:**
```bash
cd backend_gcg
npm start
```
✅ Should see: "MongoDB connected successfully" and "Server is running on port: 5000"

**Terminal 2 - Frontend:**
```bash
cd GCG_frontend
npm run dev
```
✅ Should see: "Local: http://localhost:5173"

### Step 4: Test the App

1. Open browser to http://localhost:5173
2. Navigate to "Leaderboard" page
3. Click "Add Yourself"
4. Fill in the form:
   - **Name**: Your Name
   - **LeetCode Username**: `your_leetcode_username` (just the username, not URL)
   - **Codeforces Username**: `your_codeforces_username` (just the username, not URL)
5. Click Submit and wait 3-5 seconds for stats to be fetched
6. See your stats appear! 🎉

## 🧪 Testing with Sample Data

Don't have LeetCode/Codeforces profiles? Try these public usernames:

**Sample User 1:**
- Name: Test Coder 1
- LeetCode Username: `uwi`
- Codeforces Username: `tourist`

**Sample User 2:**
- Name: Test Coder 2
- LeetCode Username: `petr`
- Codeforces Username: `Petr`

## 🔧 Troubleshooting

### Problem: Backend won't start
**Error**: "MongoDB connection error"
- ✅ Check MONGO_URI is correct in `.env`
- ✅ Ensure MongoDB Atlas allows connections from your IP
- ✅ Verify username/password in connection string

### Problem: Frontend shows 0 stats
**Error**: "Could not load leaderboard data"
- ✅ Verify backend is running on port 5000
- ✅ Check VITE_API_URL in frontend `.env`
- ✅ Open browser console for error details

### Problem: "Invalid profile URLs"
- ✅ Use username only (no full URL)
- ✅ Format: just `username` not `https://...`
- ✅ Examples: `uwi`, `tourist`, `Petr`
- ✅ Only letters, numbers, underscores, hyphens allowed

### Problem: Stats showing as 0
- ✅ Verify username exists and profile is public
- ✅ Check backend console for detailed errors
- ✅ Try again (API might be temporarily down)
- ✅ Test with sample users above

## 📊 What You'll See

### Leaderboard Display:
| Rank | Name | LeetCode | Codeforces | Total Qs | Score | Actions |
|------|------|----------|------------|----------|-------|---------|
| #1 | John | john (500 Qs • Rank: 50000) | john123 (300 Qs • Rating: 1800) | 800 | 8630.00 | 🔄 |

### Understanding the Score:
- **Total Qs**: Combined questions from both platforms
- **Score**: Calculated using optimized algorithm
  - Questions solved × 10 (primary factor)
  - Ratings × 0.1 (secondary factor)
- **🔄 Button**: Refresh user's stats from APIs

## 🎯 Next Steps

1. **Add Your Profile**: Test with your actual accounts
2. **Invite Friends**: Have them add their profiles
3. **Explore Code**: Check `backend_gcg/server.js` for API logic
4. **Read Docs**: 
   - [RANKING_ALGORITHM.md](backend_gcg/RANKING_ALGORITHM.md) - How ranking works
   - [API_TESTING.md](backend_gcg/API_TESTING.md) - API testing guide
   - [IMPLEMENTATION_SUMMARY.md](IMPLEMENTATION_SUMMARY.md) - Full technical details

## 💡 Development Tips

### Auto-restart Backend on Changes
```bash
# Already configured with nodemon
cd backend_gcg
npm start  # Will auto-restart on file changes
```

### Frontend Hot Reload
- Vite provides instant hot module replacement
- Save files and see changes immediately in browser

### View Database
Use MongoDB Compass:
1. Install [MongoDB Compass](https://www.mongodb.com/products/compass)
2. Connect using your MONGO_URI
3. Navigate to your database → `leaderboards` collection
4. View all users and their stats

### API Testing with PowerShell
```powershell
# Get all users
Invoke-RestMethod -Uri "http://localhost:5000/api/leaderboard" -Method GET

# Add user
$body = @{ with usernames only
$body = @{
    name = "Test User"
    leetcodeUsername = "uwi"
    codeforcesUsername = "

Invoke-RestMethod -Uri "http://localhost:5000/api/leaderboard" -Method POST -Body $body -ContentType "application/json"
```

## 🚀 Ready for Production?

### Backend Deployment (Render)
1. Push code to GitHub
2. Create new Web Service on Render
3. Connect GitHub repo
4. Add environment variables
5. Deploy!

### Frontend Deployment (Vercel)
1. Push code to GitHub
2. Import project on Vercel
3. Add environment variable: `VITE_API_URL=https://your-backend.onrender.com/api/leaderboard`
4. Deploy!

## 📚 Resources

- [LeetCode](https://leetcode.com)
- [Codeforces](https://codeforces.com)
- [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
- [React Documentation](https://react.dev)
- [Express.js Guide](https://expressjs.com)

## ❓ Still Stuck?

Check the detailed guides:
- **Setup Issues**: See README.md
- **API Problems**: See API_TESTING.md
- **Algorithm Questions**: See RANKING_ALGORITHM.md
- **Technical Details**: See IMPLEMENTATION_SUMMARY.md

---

**Happy Coding! 🎉**
