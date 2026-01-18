const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const axios = require('axios');
require('dotenv').config(); // Loads environment variables from a .env file

const app = express();
const port = process.env.PORT || 5000;

// CORS Configuration - Allow your Vercel frontend
const corsOptions = {
  origin: [
    'http://localhost:5173', // Local development
    'http://localhost:5174',
    'https://gcg-frontend.vercel.app', // Your Vercel deployment (update with actual domain)
    /\.vercel\.app$/ // Allow all Vercel preview deployments
  ],
  credentials: true,
  optionsSuccessStatus: 200
};

// Middleware
app.use(cors(corsOptions));
app.use(express.json());

// MongoDB Connection using environment variable
const mongoURI = process.env.MONGO_URI;
mongoose.connect(mongoURI)
  .then(() => console.log('MongoDB connected successfully'))
  .catch(err => console.error('MongoDB connection error:', err));

// Mongoose Schema for the Leaderboard
const leaderboardSchema = new mongoose.Schema({
  name: { type: String, required: true },
  leetcodeUsername: { type: String, required: true },
  codeforcesUsername: { type: String, required: true },
  
  // Auto-generated URLs
  leetcodeURL: { type: String },
  codeforcesURL: { type: String },
  
  // LeetCode stats
  leetcodeQuestions: { type: Number, default: 0 },
  leetcodeRating: { type: Number, default: 0 },
  
  // Codeforces stats
  codeforcesQuestions: { type: Number, default: 0 },
  codeforcesRating: { type: Number, default: 0 },
  
  // Combined metrics
  totalQuestions: { type: Number, default: 0 },
  rankScore: { type: Number, default: 0 }, // Optimized ranking score
  
  lastUpdated: { type: Date, default: Date.now },
  createdAt: { type: Date, default: Date.now },
});

const Leaderboard = mongoose.model('Leaderboard', leaderboardSchema);

// --- HELPER FUNCTIONS FOR API CALLS ---

// Generate profile URLs from usernames
function generateProfileURL(username, platform) {
  if (platform === 'leetcode') {
    return `https://leetcode.com/${username}`;
  } else if (platform === 'codeforces') {
    return `https://codeforces.com/profile/${username}`;
  }
  return null;
}

// Fetch LeetCode user stats
async function fetchLeetCodeStats(username) {
  try {
    console.log(`🔄 Fetching LeetCode data for: ${username}`);
    
    let questions = 0;
    let rating = 0;

    // Step 1: Get total problems solved
    try {
      const solvedResponse = await axios.get(
        `https://alfa-leetcode-api.onrender.com/${username}/solved`,
        { 
          timeout: 15000,
          headers: { 'User-Agent': 'GCG-Leaderboard/1.0' }
        }
      );
      
      if (solvedResponse.status === 200 && solvedResponse.data) {
        questions = solvedResponse.data.solvedProblem || 0;
        console.log(`✅ Got ${questions} problems solved`);
      }
    } catch (err) {
      console.log(`❌ Failed to fetch solved problems:`, err.message);
    }

    // Step 2: Get contest rating (separate call)
    try {
      const contestResponse = await axios.get(
        `https://alfa-leetcode-api.onrender.com/${username}/contest`,
        { 
          timeout: 15000,
          headers: { 'User-Agent': 'GCG-Leaderboard/1.0' }
        }
      );
      
      if (contestResponse.status === 200 && contestResponse.data) {
        console.log('📦 Contest response:', contestResponse.data);
        rating = Math.round(contestResponse.data.contestRating || 0);
        console.log(`✅ Contest rating: ${rating}`);
      }
    } catch (err) {
      console.log(`⚠️ Failed to fetch contest rating:`, err.message);
    }

    // If both failed, try the main endpoint as final fallback
    if (questions === 0) {
      try {
        const mainResponse = await axios.get(
          `https://alfa-leetcode-api.onrender.com/${username}`,
          { 
            timeout: 15000,
            headers: { 'User-Agent': 'GCG-Leaderboard/1.0' }
          }
        );
        
        if (mainResponse.status === 200 && mainResponse.data) {
          questions = mainResponse.data.totalSolved || 0;
          if (rating === 0) {
            rating = Math.round(mainResponse.data.contestRating || 0);
          }
          console.log(`✅ From main endpoint: ${questions} problems, rating: ${rating}`);
        }
      } catch (err) {
        console.log(`❌ Main endpoint also failed:`, err.message);
      }
    }

    console.log(`✅ Final LeetCode stats for ${username}: ${questions} problems, rating: ${rating}`);
    return { questions, rating };

  } catch (error) {
    console.error(`❌ Error fetching LeetCode stats for ${username}:`, error.message);
    return { questions: 0, rating: 0 };
  }
}

// Fetch Codeforces user stats
async function fetchCodeforcesStats(username) {
  try {
    console.log(`🔄 Fetching Codeforces data for: ${username}`);
    
    // Fetch user info for rating
    const userInfoResponse = await axios.get(
      `https://codeforces.com/api/user.info?handles=${username}`,
      { timeout: 10000 }
    );

    if (userInfoResponse.data.status !== 'OK' || !userInfoResponse.data.result) {
      console.warn(`⚠️ Codeforces user ${username} not found`);
      return { questions: 0, rating: 0 };
    }

    const userInfo = userInfoResponse.data.result[0];
    const rating = userInfo.rating || 0;
    console.log(`✅ Got Codeforces rating: ${rating}`);

    // Fetch user submissions to count accepted problems
    try {
      const submissionsResponse = await axios.get(
        `https://codeforces.com/api/user.status?handle=${username}&from=1&count=10000`,
        { timeout: 15000 }
      );

      let acceptedProblems = 0;
      if (submissionsResponse.data.status === 'OK') {
        const submissions = submissionsResponse.data.result;
        const solvedProblems = new Set();
        
        submissions.forEach(submission => {
          if (submission.verdict === 'OK') {
            const problemId = `${submission.problem.contestId}-${submission.problem.index}`;
            solvedProblems.add(problemId);
          }
        });
        
        acceptedProblems = solvedProblems.size;
        console.log(`✅ Codeforces stats for ${username}: ${acceptedProblems} problems, rating: ${rating}`);
      }

      return {
        questions: acceptedProblems,
        rating: rating
      };
    } catch (submissionError) {
      // If submission fetch fails, still return the rating
      console.log(`⚠️ Could not fetch submissions, returning rating only`);
      return {
        questions: 0,
        rating: rating
      };
    }
  } catch (error) {
    console.error(`❌ Error fetching Codeforces stats for ${username}:`, error.message);
    return { questions: 0, rating: 0 };
  }
}

// Optimized Ranking Algorithm
// This algorithm considers both the number of questions solved and the ratings
// Formula: rankScore = (totalQuestions * questionWeight) + (totalRating * ratingWeight)
// Question weight: 10 (primary factor)
// Rating weight: 0.25 (secondary factor, more significant than before)
// This ensures questions are primary while ratings provide meaningful differentiation
function calculateRankScore(leetcodeQuestions, leetcodeRating, codeforcesQuestions, codeforcesRating) {
  const totalQuestions = leetcodeQuestions + codeforcesQuestions;
  
  // Combined rating from both platforms
  const totalRating = leetcodeRating + codeforcesRating;
  
  // Weighted scoring:
  // - Questions: 10x weight (solving problems is the main achievement)
  // - Ratings: 0.25x weight (contest performance adds bonus points)
  const questionScore = totalQuestions * 10;
  const ratingScore = totalRating * 0.25;
  
  const rankScore = questionScore + ratingScore;
  
  console.log(`Score breakdown: ${totalQuestions} qs (${questionScore}) + ${totalRating} rating (${ratingScore}) = ${rankScore}`);
  
  return Math.round(rankScore * 100) / 100; // Round to 2 decimal places
}

// --- API ROUTES ---

// GET: Fetch the entire leaderboard, sorted by rank score
app.get('/api/leaderboard', async (req, res) => {
  try {
    // Fetch all users and sort them in descending order of their rank score
    const users = await Leaderboard.find().sort({ rankScore: -1 });
    res.json(users);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching leaderboard data', error });
  }
});

// POST: Add a new user to the leaderboard
app.post('/api/leaderboard', async (req, res) => {
  try {
    const { name, leetcodeUsername, codeforcesUsername } = req.body;
    
    // Basic validation
    if (!name || !leetcodeUsername || !codeforcesUsername) {
      return res.status(400).json({ message: 'All fields (name, leetcodeUsername, codeforcesUsername) are required.' });
    }

    // Validate username format (alphanumeric, underscore, hyphen)
    const usernameRegex = /^[a-zA-Z0-9_-]+$/;
    if (!usernameRegex.test(leetcodeUsername) || !usernameRegex.test(codeforcesUsername)) {
      return res.status(400).json({ 
        message: 'Invalid username format. Use only letters, numbers, underscores, and hyphens.' 
      });
    }

    // Generate profile URLs
    const leetcodeURL = generateProfileURL(leetcodeUsername, 'leetcode');
    const codeforcesURL = generateProfileURL(codeforcesUsername, 'codeforces');

    // Fetch stats from both platforms in parallel for better performance
    console.log(`Fetching stats for LeetCode: ${leetcodeUsername}, Codeforces: ${codeforcesUsername}`);
    const [leetcodeStats, codeforcesStats] = await Promise.all([
      fetchLeetCodeStats(leetcodeUsername),
      fetchCodeforcesStats(codeforcesUsername)
    ]);

    // Check if usernames exist on platforms
    if (leetcodeStats.questions === 0 && leetcodeStats.rating === 0) {
      console.warn(`LeetCode user ${leetcodeUsername} may not exist or has no data`);
    }
    if (codeforcesStats.questions === 0 && codeforcesStats.rating === 0) {
      console.warn(`Codeforces user ${codeforcesUsername} may not exist or has no data`);
    }

    // Calculate total questions and rank score
    const totalQuestions = leetcodeStats.questions + codeforcesStats.questions;
    const rankScore = calculateRankScore(
      leetcodeStats.questions,
      leetcodeStats.rating,
      codeforcesStats.questions,
      codeforcesStats.rating
    );

    const newUser = new Leaderboard({
      name,
      leetcodeUsername,
      codeforcesUsername,
      leetcodeURL,
      codeforcesURL,
      leetcodeQuestions: leetcodeStats.questions,
      leetcodeRating: leetcodeStats.rating,
      codeforcesQuestions: codeforcesStats.questions,
      codeforcesRating: codeforcesStats.rating,
      totalQuestions,
      rankScore,
      lastUpdated: new Date()
    });

    await newUser.save();
    res.status(201).json(newUser);
  } catch (error) {
    console.error('Error adding user:', error);
    res.status(500).json({ message: 'Error adding user to leaderboard', error: error.message });
  }
});

// PUT: Update/refresh user stats
app.put('/api/leaderboard/:id/refresh', async (req, res) => {
  try {
    const user = await Leaderboard.findById(req.params.id);
    
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Fetch updated stats from both platforms
    const [leetcodeStats, codeforcesStats] = await Promise.all([
      fetchLeetCodeStats(user.leetcodeUsername),
      fetchCodeforcesStats(user.codeforcesUsername)
    ]);

    // Update user data
    user.leetcodeQuestions = leetcodeStats.questions;
    user.leetcodeRating = leetcodeStats.rating;
    user.codeforcesQuestions = codeforcesStats.questions;
    user.codeforcesRating = codeforcesStats.rating;
    user.totalQuestions = leetcodeStats.questions + codeforcesStats.questions;
    user.rankScore = calculateRankScore(
      leetcodeStats.questions,
      leetcodeStats.rating,
      codeforcesStats.questions,
      codeforcesStats.rating
    );
    user.lastUpdated = new Date();

    await user.save();
    res.json(user);
  } catch (error) {
    console.error('Error refreshing user stats:', error);
    res.status(500).json({ message: 'Error refreshing user stats', error: error.message });
  }
});

// PUT: Refresh all users' stats (batch update)
app.put('/api/leaderboard/refresh-all', async (req, res) => {
  try {
    const users = await Leaderboard.find();
    const updatePromises = [];

    for (const user of users) {
      const updatePromise = (async () => {
        try {
          const [leetcodeStats, codeforcesStats] = await Promise.all([
            fetchLeetCodeStats(user.leetcodeUsername),
            fetchCodeforcesStats(user.codeforcesUsername)
          ]);

          user.leetcodeQuestions = leetcodeStats.questions;
          user.leetcodeRating = leetcodeStats.rating;
          user.codeforcesQuestions = codeforcesStats.questions;
          user.codeforcesRating = codeforcesStats.rating;
          user.totalQuestions = leetcodeStats.questions + codeforcesStats.questions;
          user.rankScore = calculateRankScore(
            leetcodeStats.questions,
            leetcodeStats.rating,
            codeforcesStats.questions,
            codeforcesStats.rating
          );
          user.lastUpdated = new Date();

          await user.save();
          return { success: true, username: user.name };
        } catch (error) {
          console.error(`Error updating ${user.name}:`, error);
          return { success: false, username: user.name, error: error.message };
        }
      })();
      
      updatePromises.push(updatePromise);
    }

    const results = await Promise.all(updatePromises);
    const successful = results.filter(r => r.success).length;
    const failed = results.filter(r => !r.success).length;

    res.json({ 
      message: `Refresh complete: ${successful} successful, ${failed} failed`,
      results 
    });
  } catch (error) {
    console.error('Error refreshing all users:', error);
    res.status(500).json({ message: 'Error refreshing leaderboard', error: error.message });
  }
});

// DELETE: Remove a user from the leaderboard
app.delete('/api/leaderboard/:id', async (req, res) => {
  try {
    const user = await Leaderboard.findByIdAndDelete(req.params.id);
    
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.json({ message: 'User deleted successfully', user });
  } catch (error) {
    console.error('Error deleting user:', error);
    res.status(500).json({ message: 'Error deleting user', error: error.message });
  }
});

// --- CONTEST API ENDPOINTS ---

// GET: Fetch LeetCode upcoming contests
app.get('/api/contests/leetcode', async (req, res) => {
  try {
    // Using alfa-leetcode-api for reliable upcoming contests data
    const response = await axios.get('https://alfa-leetcode-api.onrender.com/contests');

    if (!response.data) {
      throw new Error('Invalid response from LeetCode API');
    }

    // Handle different response structures
    let allContests = [];
    if (Array.isArray(response.data)) {
      allContests = response.data;
    } else if (response.data.data && Array.isArray(response.data.data)) {
      allContests = response.data.data;
    } else if (response.data.contests && Array.isArray(response.data.contests)) {
      allContests = response.data.contests;
    }

    // Filter only upcoming contests (where startTime is in the future)
    const now = Math.floor(Date.now() / 1000);
    
    const upcomingContests = allContests
      .filter(contest => contest.startTime && contest.startTime > now)
      .sort((a, b) => a.startTime - b.startTime)
      .slice(0, 10);

    const formattedContests = upcomingContests.map(contest => ({
      title: contest.title,
      startTime: contest.startTime * 1000, // Convert to milliseconds
      duration: contest.duration || 0,
      url: `https://leetcode.com/contest/${contest.titleSlug}`,
      platform: 'LeetCode'
    }));

    res.json({ success: true, contests: formattedContests });
  } catch (error) {
    console.error('LeetCode API Error:', error.message);
    res.json({ success: false, contests: [], error: error.message });
  }
});

// GET: Fetch Codeforces upcoming contests
app.get('/api/contests/codeforces', async (req, res) => {
  try {
    const response = await axios.get('https://codeforces.com/api/contest.list');

    if (response.data.status !== 'OK') {
      throw new Error('Codeforces API returned error');
    }

    const upcomingContests = response.data.result
      .filter(contest => contest.phase === 'BEFORE')
      .sort((a, b) => a.startTimeSeconds - b.startTimeSeconds)
      .slice(0, 10);

    const formattedContests = upcomingContests.map(contest => ({
      title: contest.name,
      startTime: contest.startTimeSeconds * 1000,
      duration: contest.durationSeconds,
      url: `https://codeforces.com/contest/${contest.id}`,
      platform: 'Codeforces'
    }));

    res.json({ success: true, contests: formattedContests });
  } catch (error) {
    console.error('Codeforces API Error:', error.message);
    res.json({ success: false, contests: [], error: error.message });
  }
});

// GET: Fetch all contests (combined)
app.get('/api/contests/all', async (req, res) => {
  try {
    const [leetcodeRes, codeforcesRes] = await Promise.all([
      axios.get(`http://localhost:${port}/api/contests/leetcode`),
      axios.get(`http://localhost:${port}/api/contests/codeforces`)
    ]);

    const leetcodeContests = leetcodeRes.data.contests || [];
    const codeforcesContests = codeforcesRes.data.contests || [];

    res.json({
      success: true,
      leetcode: leetcodeContests,
      codeforces: codeforcesContests,
      total: leetcodeContests.length + codeforcesContests.length
    });
  } catch (error) {
    console.error('Error fetching all contests:', error.message);
    res.status(500).json({ 
      success: false, 
      leetcode: [], 
      codeforces: [],
      error: error.message 
    });
  }
});

app.listen(port, () => {
  console.log(`Server is running on port: ${port}`);
});

