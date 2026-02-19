const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const axios = require('axios');
const { GoogleGenerativeAI } = require('@google/generative-ai');
require('dotenv').config(); // Loads environment variables from a .env file

const app = express();
const port = process.env.PORT || 5000;
module.exports = app;
// CORS Configuration - Allow your Vercel frontend and PWA
const corsOptions = {
  origin: function (origin, callback) {
    // Allow requests with no origin (like mobile apps, curl, Postman, or installed PWAs)
    if (!origin) return callback(null, true);
    
    const allowedOrigins = [
      'http://localhost:5173',
      'http://localhost:5174',
      'http://localhost:4173', // Vite preview
      'https://gcg-frontend.vercel.app',
      'https://gcg.ayusharma.in',
      'http://gcg.ayusharma.in',
    ];
    
    // Allow localhost ports, vercel domains, custom domain, and standalone PWA
    if (
      allowedOrigins.includes(origin) ||
      origin.includes('.vercel.app') ||
      origin.includes('localhost') ||
      origin.includes('ayusharma.in')
    ) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true,
  optionsSuccessStatus: 200
};

// Middleware
app.use(cors(corsOptions));
app.use(express.json());

// MongoDB Connection using environment variable with improved error handling
const mongoURI = process.env.MONGO_URI;

let isConnected = false;

// Root endpoint
app.get('/', (req, res) => {
  res.status(200).json({ 
    message: 'GCG Backend API', 
    version: '1.0',
    endpoints: {
      health: '/health',
      leaderboard: '/api/leaderboard',
      contest: '/api/contest',
      exam: '/api/exam'
    }
  });
});

// Health check endpoint for UptimeRobot (keeps backend awake)
app.get('/health', (req, res) => {
  res.status(200).json({ 
    status: 'ok', 
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    dbConnected: isConnected 
  });
});

mongoose.connect(mongoURI, {
  serverSelectionTimeoutMS: 30000,
  socketTimeoutMS: 45000,
})
  .then(() => {
    console.log('MongoDB connected successfully');
    isConnected = true;
  })
  .catch(err => {
    console.error('MongoDB connection error:', err);
    isConnected = false;
  });

// Handle connection events
mongoose.connection.on('disconnected', () => {
  console.log('MongoDB disconnected');
  isConnected = false;
});

mongoose.connection.on('error', (err) => {
  console.error('MongoDB error:', err);
  isConnected = false;
});

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

// Mongoose Schema for Daily Questions
const questionsSchema = new mongoose.Schema({
  date: { type: Date, required: true, unique: true },
  questions: [{
    questionNumber: { type: Number, required: true },
    questionName: { type: String, required: true },
    questionLink: { type: String, required: true },
    questionLevel: { type: String, required: true }
  }],
  generatedAt: { type: Date, default: Date.now },
  createdAt: { type: Date, default: Date.now }
});

const DailyQuestions = mongoose.model('DailyQuestions', questionsSchema);

// Mongoose Schema for Previous Year Questions
const previousYearQuestionSchema = new mongoose.Schema({
  questionId: { type: String, required: true, unique: true },
  company: { type: String, required: true }, // e.g., "HACKWITHINFY", "Microsoft", "Amazon", "JUSPAY"
  year: { type: String, required: true },
  problemStatement: { type: String, required: true },
  examples: [{
    input: { type: String, required: true },
    output: { type: String, required: true },
    explanation: { type: String }
  }],
  testCases: [{
    input: { type: String, required: true },
    output: { type: String, required: true }
  }],
  constraints: [{ type: String }],
  difficulty: { type: String, required: true }, // "Easy", "Medium", "Hard"
  topics: [{ type: String }],
  explanation: { type: String },
  generatedAt: { type: Date, default: Date.now },
  createdAt: { type: Date, default: Date.now }
});

const PreviousYearQuestion = mongoose.model('PreviousYearQuestion', previousYearQuestionSchema);

// Helper function to ensure MongoDB is connected
async function ensureMongoConnection() {
  if (mongoose.connection.readyState === 1) {
    return true;
  }
  console.log(' MongoDB not ready, waiting for connection...');
  return new Promise((resolve, reject) => {
    const timeout = setTimeout(() => {
      reject(new Error('MongoDB connection timeout'));
    }, 10000);
    
    mongoose.connection.once('connected', () => {
      clearTimeout(timeout);
      resolve(true);
    });
    
    if (mongoose.connection.readyState === 1) {
      clearTimeout(timeout);
      resolve(true);
    }
  });
}

// Helper function to save questions to database
// Helper to get IST date at midnight
function getISTDateAtMidnight() {
  const now = new Date();
  const istString = now.toLocaleString('en-US', { timeZone: 'Asia/Kolkata' });
  const istDate = new Date(istString);
  istDate.setHours(0, 0, 0, 0);
  
  // Convert back to UTC for consistent storage
  const dateStr = `${istDate.getFullYear()}-${String(istDate.getMonth() + 1).padStart(2, '0')}-${String(istDate.getDate()).padStart(2, '0')}`;
  return new Date(dateStr + 'T00:00:00.000Z');
}

async function saveQuestionsToDb(questions) {
  try {
    await ensureMongoConnection();
    
    // Get today's date in IST timezone (normalized to UTC midnight)
    const istDateKey = getISTDateAtMidnight();
    
    console.log(' Saving questions for date:', istDateKey.toISOString());
    
    const saved = await DailyQuestions.findOneAndUpdate(
      { date: istDateKey },
      {
        date: istDateKey,
        questions: questions,
        generatedAt: new Date()
      },
      { upsert: true, new: true }
    );
    
    console.log(' Questions saved to MongoDB for date:', istDateKey.toISOString());
    return saved;
  } catch (saveError) {
    console.error(' Error saving to MongoDB:', saveError.message);
    throw saveError;
  }
}

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
    console.log(` Fetching LeetCode data for: ${username}`);
    
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
        console.log(` Got ${questions} problems solved`);
      }
    } catch (err) {
      console.log(` Failed to fetch solved problems:`, err.message);
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
        console.log(' Contest response:', contestResponse.data);
        rating = Math.round(contestResponse.data.contestRating || 0);
        console.log(` Contest rating: ${rating}`);
      }
    } catch (err) {
      console.log(` Failed to fetch contest rating:`, err.message);
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
          console.log(` From main endpoint: ${questions} problems, rating: ${rating}`);
        }
      } catch (err) {
        console.log(` Main endpoint also failed:`, err.message);
      }
    }

    console.log(` Final LeetCode stats for ${username}: ${questions} problems, rating: ${rating}`);
    return { questions, rating };

  } catch (error) {
    console.error(` Error fetching LeetCode stats for ${username}:`, error.message);
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
      console.warn(` Codeforces user ${username} not found`);
      return { questions: 0, rating: 0 };
    }

    const userInfo = userInfoResponse.data.result[0];
    const rating = userInfo.rating || 0;
    console.log(` Got Codeforces rating: ${rating}`);

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
        console.log(` Codeforces stats for ${username}: ${acceptedProblems} problems, rating: ${rating}`);
      }

      return {
        questions: acceptedProblems,
        rating: rating
      };
    } catch (submissionError) {
      // If submission fetch fails, still return the rating
      console.log(` Could not fetch submissions, returning rating only`);
      return {
        questions: 0,
        rating: rating
      };
    }
  } catch (error) {
    console.error(` Error fetching Codeforces stats for ${username}:`, error.message);
    return { questions: 0, rating: 0 };
  }
}

// Optimized Ranking Algorithm

function calculateRankScore(leetcodeQuestions, leetcodeRating, codeforcesQuestions, codeforcesRating) {
  const totalQuestions = leetcodeQuestions + codeforcesQuestions;
  
  // Combined rating from both platforms
  const totalRating = leetcodeRating + codeforcesRating;
  
  // Weighted scoring:

  const questionScore = totalQuestions * 10;
  const ratingScore = totalRating * 0.25;
  
  const rankScore = questionScore + ratingScore;
  
  console.log(`Score breakdown: ${totalQuestions} qs (${questionScore}) + ${totalRating} rating (${ratingScore}) = ${rankScore}`);
  
  return Math.round(rankScore * 100) / 100; // Round to 2 decimal places
}

// --- API ROUTES ---

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

// --- GEMINI AI ENDPOINTS ---

// Initialize Gemini AI
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

// GET: Generate LeetCode questions using Gemini
app.get('/api/exam/generate-questions', async (req, res) => {
  try {
    await ensureMongoConnection();
    
    // Check if questions already exist for today (IST)
    const istDateKey = getISTDateAtMidnight();
    console.log('🔍 Checking for existing questions for date:', istDateKey.toISOString());
    
    const existingQuestions = await DailyQuestions.findOne({ date: istDateKey });
    
    if (existingQuestions) {
      console.log(' Found existing questions in database - returning cached version');
      return res.json({
        success: true,
        questions: existingQuestions.questions,
        generatedAt: existingQuestions.generatedAt.toISOString(),
        fromCache: true
      });
    }
    
    console.log(' No existing questions found - generating new questions with Gemini...');
        const model = genAI.getGenerativeModel({ model: 'gemini-flash-latest' });
    
    const prompt = `Generate exactly 3 random not repeated LeetCode programming questions in JSON format based on the following syllabus.
    Also generate one ques of previous year HACKWITHINFY, Microsoft OA, Amazon OA, JUSPAY OA level and format.
    
    IMPORTANT: Avoid famous and very common questions like "Two Sum", "Reverse Linked List", "Valid Parentheses", etc. 
    Focus on rare, less commonly solved problems that are still relevant for competitive programming practice.
    
    SYLLABUS (pick questions from these topics, prioritize (imp) topics and also make sure the ques will be of HACKWITHINFY, Microsoft OA , Amazon OA, JUSPAY OA level and format):
    - Dynamic Programming (imp)
    - Greedy Algorithms(imp)
    - Backtracking
    - Stack
    - Queue
    - Mapping Concepts
    - Array manipulation (imp)
    - String manipulation
    - Tree(imp)
    - Segement Tree
    - Graph (imp)
    - Bit Mapping and Hashing
    - Recursion 
    - Heap
    - Divide and Conquer
    - Binary Search (imp)
    - Two Pointers (imp)
    - Sliding Window (imp)
    - Linked List
    - Math and Geometry
    - Design Problems
    
    Each question should include:
    - questionNumber: The actual LeetCode question number (integer)
    - questionName: The exact title of the LeetCode problem
    - questionLink: The full LeetCode URL (https://leetcode.com/problems/question-slug/)
    - questionLevel: first:"Easy", second:"Medium", and third:"Hard"
    
    Generate a diverse mix of mix difficulty levels covering different topics from the syllabus. 
    Use real but less commonly known LeetCode problems that exist on the platform.
    Return ONLY valid JSON array format without any markdown formatting or extra text.
    
    Example format:
    [
      {
        "questionNumber": 1,
        "questionName": "Two Sum",
        "questionLink": "https://leetcode.com/problems/two-sum/",
        "questionLevel": "Easy"
      }
    ]`;
    
    const result = await model.generateContent(prompt);
    const response = await result.response;
    let text = response.text();
    
    // Clean up the response - remove markdown code blocks if present
    text = text.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim();
    
    // Parse the JSON
    const questions = JSON.parse(text);
    
    // Validate the response
    if (!Array.isArray(questions) || questions.length !== 3) {
      throw new Error('Invalid response format from Gemini');
    }
    
    console.log(' Successfully generated questions:', questions);
    
    // Save to MongoDB
    try {
      await saveQuestionsToDb(questions);
    } catch (saveError) {
      console.error(' Failed to save questions, but continuing:', saveError.message);
    }
    
    res.json({
      success: true,
      questions: questions,
      generatedAt: new Date().toISOString()
    });
    
  } catch (error) {
    console.error('❌ Gemini API Error:', error.message);
    
    // Fallback questions if Gemini fails
    const fallbackQuestions = [
      {
        questionNumber: 1,
        questionName: "Two Sum",
        questionLink: "https://leetcode.com/problems/two-sum/",
        questionLevel: "Easy"
      },
      {
        questionNumber: 15,
        questionName: "3Sum",
        questionLink: "https://leetcode.com/problems/3sum/",
        questionLevel: "Medium"
      },
      {
        questionNumber: 41,
        questionName: "First Missing Positive",
        questionLink: "https://leetcode.com/problems/first-missing-positive/",
        questionLevel: "Hard"
      }
    ];
    
    // Try to save fallback questions too
    try {
      await saveQuestionsToDb(fallbackQuestions);
    } catch (saveError) {
      console.error(' Failed to save fallback questions:', saveError.message);
    }
    
    res.json({
      success: true,
      questions: fallbackQuestions,
      generatedAt: new Date().toISOString(),
      isFallback: true,
      error: error.message
    });
  }
});

// GET: Fetch previous days' questions
app.get('/api/exam/previous-questions', async (req, res) => {
  try {
    console.log(' Fetching previous questions...');
    
    // Ensure MongoDB connection
    await ensureMongoConnection();
    
    // Get today in IST timezone (normalized)
    const istToday = getISTDateAtMidnight();
    
    // Get all questions (including today's)
    const allQuestions = await DailyQuestions.find({})
    .sort({ date: -1 })
    .limit(30)
    .maxTimeMS(20000); // Set query timeout to 20 seconds
    
    console.log(` Found ${allQuestions.length} total question sets`);
    
    // Separate today's and previous questions
    const previousQuestions = allQuestions.filter(q => {
      return new Date(q.date).getTime() < istToday.getTime();
    });
    
    console.log(` Found ${previousQuestions.length} previous question sets (excluding today)`);
    
    res.json({
      success: true,
      previousQuestions: previousQuestions
    });
    
  } catch (error) {
    console.error('❌ Error fetching previous questions:', error.message);
    res.status(500).json({
      success: false,
      error: error.message,
      previousQuestions: []
    });
  }
});

// GET: Fetch all previous year questions
app.get('/api/previous-year-questions', async (req, res) => {
  try {
    console.log('📚 Fetching previous year questions...');
    
    // Ensure MongoDB connection
    await ensureMongoConnection();
    
    const questions = await PreviousYearQuestion.find({})
      .sort({ createdAt: -1 })
      .maxTimeMS(20000);
    
    console.log(`✅ Found ${questions.length} previous year questions`);
    
    res.json({
      success: true,
      questions: questions
    });
    
  } catch (error) {
    console.error('❌ Error fetching previous year questions:', error.message);
    res.status(500).json({
      success: false,
      error: error.message,
      questions: []
    });
  }
});

// POST: Generate a new previous year question using Gemini AI
app.post('/api/previous-year-questions/generate', async (req, res) => {
  try {
    console.log(' Generating new previous year question with Gemini...');
    
    // Ensure MongoDB connection
    await ensureMongoConnection();
    
    const { company, year, difficulty } = req.body;
    
    // Initialize Gemini AI
    const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
    const model = genAI.getGenerativeModel({ model: 'gemini-flash-latest' });
    
    const prompt = `Generate a realistic previous year interview coding question for ${company || 'top tech companies'} ${year || '2024'} Online Assessment.

Create a single coding problem in JSON format with the following structure:

REQUIREMENTS:
- The question should be at ${difficulty || 'Medium'} difficulty level.
- Search for Orignal OA ques on web of selected companies and give those ques as the output.
- Make it realistic and similar to actual Online Assesment questions
- Include clear problem statement, examples with explanations, test cases, and constraints
- The problem should test algorithmic and problem-solving skills
- Focus on topics like:  
- Dynamic Programming (imp)
    - Greedy Algorithms(imp)
    - Backtracking
    - Stack
    - Queue
    - Mapping Concepts
    - Array manipulation (imp)
    - String manipulation
    - Tree(imp)
    - Segement Tree
    - Graph (imp)
    - Bit Mapping and Hashing
    - Recursion 
    - Heap
    - Divide and Conquer
    - Binary Search (imp)
    - Two Pointers (imp)
    - Sliding Window (imp)
    - Linked List
    - Math and Geometry
    - Design Problems.

Return ONLY valid JSON in this exact format (no markdown, no extra text):
{
  "company": "${company || 'HACKWITHINFY'}",
  "year": "${year || '2025'}",
  "problemStatement": "full fledge Clear description of the problem...",
  "examples": [
    {
      "input": "Example input",
      "output": "Example output",
      "explanation": "Why this output is correct"
    }
  ],
  "testCases": [
    {
      "input": "Test case input",
      "output": "Expected output"
    }
  ],
  "constraints": [
    "List of constraints like: 1 <= n <= 10^5",
    "Other constraints..."
  ],
  "difficulty": "${difficulty || 'Medium'}",
  "topics": ["Array", "Dynamic Programming"],
  "explanation": "Detailed explanation of the solution approach, time complexity, and space complexity"
}`;
    
    const result = await model.generateContent(prompt);
    const response = await result.response;
    let text = response.text();
    
    // Clean up the response - remove markdown code blocks if present
    text = text.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim();
    
    // Parse the JSON
    const questionData = JSON.parse(text);
    
    // Generate a unique question ID
    const questionId = `${questionData.company.toUpperCase()}_${questionData.year}_${Date.now()}`;
    
    // Save to database
    const newQuestion = new PreviousYearQuestion({
      questionId: questionId,
      company: questionData.company,
      year: questionData.year,
      problemStatement: questionData.problemStatement,
      examples: questionData.examples,
      testCases: questionData.testCases,
      constraints: questionData.constraints,
      difficulty: questionData.difficulty,
      topics: questionData.topics,
      explanation: questionData.explanation
    });
    
    await newQuestion.save();
    
    console.log(' Previous year question generated and saved:', questionId);
    
    res.json({
      success: true,
      question: newQuestion
    });
    
  } catch (error) {
    console.error(' Error generating previous year question:', error.message);
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

app.listen(port, () => {
  console.log(`Server is running on port: ${port}`);
});

