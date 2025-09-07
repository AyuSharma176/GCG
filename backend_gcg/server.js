const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config(); // Loads environment variables from a .env file

const app = express();
const port = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// MongoDB Connection using environment variable
const mongoURI = process.env.MONGO_URI;
mongoose.connect(mongoURI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log('MongoDB connected successfully'))
  .catch(err => console.error('MongoDB connection error:', err));

// Mongoose Schema for the Leaderboard
const leaderboardSchema = new mongoose.Schema({
  name: { type: String, required: true },
  leetcodeURL: { type: String, required: true },
  codechefURL: { type: String, required: true },
  leetcodeScore: { type: Number, default: 0 },
  codechefScore: { type: Number, default: 0 },
  totalScore: { type: Number, default: 0 },
  createdAt: { type: Date, default: Date.now },
});

const Leaderboard = mongoose.model('Leaderboard', leaderboardSchema);

// --- API ROUTES ---

// GET: Fetch the entire leaderboard, sorted by total score
app.get('/api/leaderboard', async (req, res) => {
  try {
    // Fetch all users and sort them in descending order of their total score
    const users = await Leaderboard.find().sort({ totalScore: -1 });
    res.json(users);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching leaderboard data', error });
  }
});

// POST: Add a new user to the leaderboard
app.post('/api/leaderboard', async (req, res) => {
  try {
    const { name, leetcodeURL, codechefURL } = req.body;
    
    // Basic validation
    if (!name || !leetcodeURL || !codechefURL) {
      return res.status(400).json({ message: 'All fields are required.' });
    }

    // In a real application, you would fetch scores from LeetCode/CodeChef APIs here.
    // For now, we'll use placeholder scores.
    const leetcodeScore = Math.floor(Math.random() * 500) + 1500; // Random score between 1500-2000
    const codechefScore = Math.floor(Math.random() * 500) + 1500; // Random score between 1500-2000

    const newUser = new Leaderboard({
      name,
      leetcodeURL,
      codechefURL,
      leetcodeScore,
      codechefScore,
      totalScore: leetcodeScore + codechefScore,
    });

    await newUser.save();
    res.status(201).json(newUser);
  } catch (error) {
    res.status(500).json({ message: 'Error adding user to leaderboard', error });
  }
});

app.listen(port, () => {
  console.log(`Server is running on port: ${port}`);
});

