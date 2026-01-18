import { useState, useEffect, useMemo } from "react";

// The API endpoint for your backend server
const API_URL = import.meta.env.VITE_API_URL || "https://gcg-rqxl.onrender.com/api/leaderboard";

// Helper function to extract username from a URL
const getUsernameFromUrl = (url) => {
  try {
    const path = new URL(url).pathname;
    const parts = path.split('/').filter(part => part && part !== 'users');
    return parts.pop() || '';
  } catch (error) {
    console.error("Invalid URL:", url);
    return url;
  }
};

export default function Leaderboard() {
  const [users, setUsers] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [newUser, setNewUser] = useState({ name: "", leetcodeUsername: "", codeforcesUsername: "" });
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(null); // Track which user is being refreshed

  // Function to fetch leaderboard data from the backend
  const fetchLeaderboard = async () => {
    try {
      const response = await fetch(API_URL);
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      const data = await response.json();
      setUsers(data);
    } catch (error) {
      console.error("Failed to fetch leaderboard:", error);
      setError("Could not load leaderboard data. Please make sure the backend server is running.");
    }
  };

  // useEffect to fetch data when the component mounts
  useEffect(() => {
    fetchLeaderboard();
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewUser(prev => ({ ...prev, [name]: value }));
  };

  // Function to add a new user by sending data to the backend
  const handleAddUser = async (e) => {
    e.preventDefault();
    if (!newUser.name || !newUser.leetcodeUsername || !newUser.codeforcesUsername) {
      alert("Please fill all fields!");
      return;
    }

    // Validate username format
    const usernameRegex = /^[a-zA-Z0-9_-]+$/;
    if (!usernameRegex.test(newUser.leetcodeUsername)) {
      alert("Invalid LeetCode username. Use only letters, numbers, underscores, and hyphens.");
      return;
    }
    if (!usernameRegex.test(newUser.codeforcesUsername)) {
      alert("Invalid Codeforces username. Use only letters, numbers, underscores, and hyphens.");
      return;
    }
    
    setLoading(true);
    try {
      const response = await fetch(API_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(newUser),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to add user');
      }
      
      // Clear form, hide modal, and refresh the leaderboard
      setNewUser({ name: "", leetcodeUsername: "", codeforcesUsername: "" });
      setShowForm(false);
      fetchLeaderboard(); // Refresh the data
      
    } catch (error) {
      console.error("Error adding user:", error);
      alert(error.message || "Failed to add user. Please check the usernames are correct and try again.");
    } finally {
      setLoading(false);
    }
  };

  // Function to refresh a user's stats
  const handleRefreshUser = async (userId) => {
    setRefreshing(userId);
    try {
      const response = await fetch(`${API_URL}/${userId}/refresh`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error('Failed to refresh user stats');
      }

      fetchLeaderboard(); // Refresh the entire leaderboard
    } catch (error) {
      console.error("Error refreshing user:", error);
      alert("Failed to refresh user stats. Please try again.");
    } finally {
      setRefreshing(null);
    }
  };

  const sortedUsers = useMemo(() => {
    // The backend already provides rankScore sorted, but we can keep this for safety
    return [...users].sort((a, b) => b.rankScore - a.rankScore);
  }, [users]);

  return (
    <section className="max-w-7xl mx-auto px-6 py-16">
      <div className="flex justify-between items-center mb-10">
        <h2 className="text-4xl font-extrabold bg-gradient-to-r from-cyan-400 to-purple-500 bg-clip-text text-transparent drop-shadow-sm">
          Leaderboard
        </h2>
        <button
          onClick={() => setShowForm(true)}
          className="bg-cyan-500 text-white font-bold py-2 px-6 rounded-lg shadow-lg hover:bg-cyan-400 transition-all duration-300"
        >
          Add Yourself
        </button>
      </div>

      {/* Leaderboard Table */}
      <div className="overflow-x-auto rounded-lg border border-gray-700 bg-gray-800/40 backdrop-blur-sm">
        <table className="min-w-full text-left text-white">
          <thead className="bg-gray-800/60">
            <tr>
              <th className="p-4 text-lg">Rank</th>
              <th className="p-4 text-lg">Name</th>
              <th className="p-4 text-lg">LeetCode</th>
              <th className="p-4 text-lg">Codeforces</th>
              <th className="p-4 text-lg">Total Qs</th>
              <th className="p-4 text-lg">Score</th>
              <th className="p-4 text-lg">Actions</th>
            </tr>
          </thead>
          <tbody>
            {error ? (
              <tr><td colSpan="7" className="p-4 text-center text-red-400">{error}</td></tr>
            ) : sortedUsers.length === 0 ? (
              <tr><td colSpan="7" className="p-4 text-center text-gray-400">No users yet. Be the first to add yourself!</td></tr>
            ) : sortedUsers.map((user, index) => (
              <tr key={user._id} className="border-t border-gray-700 hover:bg-gray-700/50">
                <td className="p-4 font-bold text-xl">#{index + 1}</td>
                <td className="p-4 font-semibold">{user.name}</td>
                <td className="p-4">
                  <a href={user.leetcodeURL} target="_blank" rel="noopener noreferrer" className="text-cyan-400 hover:underline">
                    <div className="font-medium">{user.leetcodeUsername}</div>
                    <div className="text-sm text-gray-400">
                      <span className="text-green-400">{user.leetcodeQuestions} Qs</span>
                      {user.leetcodeRating > 0 && <span> • Rating: {user.leetcodeRating}</span>}
                    </div>
                  </a>
                </td>
                <td className="p-4">
                  <a href={user.codeforcesURL} target="_blank" rel="noopener noreferrer" className="text-cyan-400 hover:underline">
                    <div className="font-medium">{user.codeforcesUsername}</div>
                    <div className="text-sm text-gray-400">
                      <span className="text-green-400">{user.codeforcesQuestions} Qs</span>
                      {user.codeforcesRating > 0 && <span> • Rating: {user.codeforcesRating}</span>}
                    </div>
                  </a>
                </td>
                <td className="p-4 font-bold text-lg text-green-400">{user.totalQuestions}</td>
                <td className="p-4 font-bold text-lg text-purple-400">{user.rankScore.toFixed(2)}</td>
                <td className="p-4">
                  <button
                    onClick={() => handleRefreshUser(user._id)}
                    disabled={refreshing === user._id}
                    className="text-cyan-400 hover:text-cyan-300 disabled:text-gray-500 text-sm font-medium"
                    title="Refresh stats"
                  >
                    {refreshing === user._id ? '⟳' : '🔄'}
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Add User Modal */}
      {showForm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-md">
          <div className="relative w-full max-w-lg rounded-2xl border border-gray-700 bg-[#1e293b]/90 p-8">
            <button onClick={() => setShowForm(false)} className="absolute top-4 right-4 text-3xl text-gray-400 transition hover:text-white" aria-label="Close">&times;</button>
            <h3 className="text-2xl font-bold text-white mb-6">Add Your Profile</h3>
            <form onSubmit={handleAddUser} className="space-y-4">
              <div>
                <label htmlFor="name" className="block text-gray-300 mb-1">Your Name</label>
                <input 
                  type="text" 
                  id="name" 
                  name="name" 
                  value={newUser.name} 
                  onChange={handleInputChange} 
                  className="w-full bg-gray-800/60 border border-gray-600 rounded-lg p-2 text-white focus:outline-none focus:ring-2 focus:ring-cyan-500" 
                  placeholder="e.g. Jane Doe"
                  disabled={loading}
                  required
                />
              </div>
              <div>
                <label htmlFor="leetcodeUsername" className="block text-gray-300 mb-1">LeetCode Username</label>
                <input 
                  type="text" 
                  id="leetcodeUsername" 
                  name="leetcodeUsername" 
                  value={newUser.leetcodeUsername} 
                  onChange={handleInputChange} 
                  className="w-full bg-gray-800/60 border border-gray-600 rounded-lg p-2 text-white focus:outline-none focus:ring-2 focus:ring-cyan-500" 
                  placeholder="e.g. uwi"
                  disabled={loading}
                  required
                  pattern="[a-zA-Z0-9_-]+"
                  title="Only letters, numbers, underscores, and hyphens allowed"
                />
                <p className="text-xs text-gray-400 mt-1">Just your username, not the full URL</p>
              </div>
              <div>
                <label htmlFor="codeforcesUsername" className="block text-gray-300 mb-1">Codeforces Username</label>
                <input 
                  type="text" 
                  id="codeforcesUsername" 
                  name="codeforcesUsername" 
                  value={newUser.codeforcesUsername} 
                  onChange={handleInputChange} 
                  className="w-full bg-gray-800/60 border border-gray-600 rounded-lg p-2 text-white focus:outline-none focus:ring-2 focus:ring-cyan-500" 
                  placeholder="e.g. tourist"
                  disabled={loading}
                  required
                  pattern="[a-zA-Z0-9_-]+"
                  title="Only letters, numbers, underscores, and hyphens allowed"
                />
                <p className="text-xs text-gray-400 mt-1">Just your username, not the full URL</p>
              </div>
              <button 
                type="submit" 
                disabled={loading}
                className="w-full bg-cyan-500 text-white font-bold py-3 rounded-lg shadow-lg hover:bg-cyan-400 transition-all duration-300 disabled:bg-gray-500 disabled:cursor-not-allowed"
              >
                {loading ? 'Fetching your stats... (3-5s)' : 'Submit'}
              </button>
            </form>
          </div>
        </div>
      )}
    </section>
  );
}

