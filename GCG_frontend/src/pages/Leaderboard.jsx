import { useState, useEffect, useMemo } from "react";

// The API endpoint for your backend server
const API_URL = "https://gcg-rqxl.onrender.com/api/leaderboard";

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
  const [newUser, setNewUser] = useState({ name: "", leetcodeURL: "", codechefURL: "" });
  const [error, setError] = useState(null);

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
    if (!newUser.name || !newUser.leetcodeURL || !newUser.codechefURL) {
      alert("Please fill all fields!");
      return;
    }
    
    try {
      const response = await fetch(API_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(newUser),
      });

      if (!response.ok) {
        throw new Error('Failed to add user');
      }
      
      // Clear form, hide modal, and refresh the leaderboard
      setNewUser({ name: "", leetcodeURL: "", codechefURL: "" });
      setShowForm(false);
      fetchLeaderboard(); // Refresh the data
      
    } catch (error) {
      console.error("Error adding user:", error);
      alert("Failed to add user. Please try again.");
    }
  };

  const sortedUsers = useMemo(() => {
    // The backend already provides totalScore, but we can keep this for safety
    return [...users].sort((a, b) => b.totalScore - a.totalScore);
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
              <th className="p-4 text-lg">CodeChef</th>
              <th className="p-4 text-lg">Total Score</th>
            </tr>
          </thead>
          <tbody>
            {error ? (
              <tr><td colSpan="5" className="p-4 text-center text-red-400">{error}</td></tr>
            ) : sortedUsers.map((user, index) => (
              <tr key={user._id} className="border-t border-gray-700 hover:bg-gray-700/50">
                <td className="p-4 font-bold text-xl">#{index + 1}</td>
                <td className="p-4 font-semibold">{user.name}</td>
                <td className="p-4">
                  <a href={user.leetcodeURL} target="_blank" rel="noopener noreferrer" className="text-cyan-400 hover:underline">
                    {getUsernameFromUrl(user.leetcodeURL)} ({user.leetcodeScore})
                  </a>
                </td>
                <td className="p-4">
                  <a href={user.codechefURL} target="_blank" rel="noopener noreferrer" className="text-cyan-400 hover:underline">
                    {getUsernameFromUrl(user.codechefURL)} ({user.codechefScore})
                  </a>
                </td>
                <td className="p-4 font-bold text-lg">{user.totalScore}</td>
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
                <input type="text" id="name" name="name" value={newUser.name} onChange={handleInputChange} className="w-full bg-gray-800/60 border border-gray-600 rounded-lg p-2 text-white focus:outline-none focus:ring-2 focus:ring-cyan-500" placeholder="e.g. Jane Doe" />
              </div>
              <div>
                <label htmlFor="leetcodeURL" className="block text-gray-300 mb-1">LeetCode Profile Link</label>
                <input type="url" id="leetcodeURL" name="leetcodeURL" value={newUser.leetcodeURL} onChange={handleInputChange} className="w-full bg-gray-800/60 border border-gray-600 rounded-lg p-2 text-white focus:outline-none focus:ring-2 focus:ring-cyan-500" placeholder="https://leetcode.com/username/" />
              </div>
              <div>
                <label htmlFor="codechefURL" className="block text-gray-300 mb-1">CodeChef Profile Link</label>
                <input type="url" id="codechefURL" name="codechefURL" value={newUser.codechefURL} onChange={handleInputChange} className="w-full bg-gray-800/60 border border-gray-600 rounded-lg p-2 text-white focus:outline-none focus:ring-2 focus:ring-cyan-500" placeholder="https://www.codechef.com/users/username" />
              </div>
              <button type="submit" className="w-full bg-cyan-500 text-white font-bold py-3 rounded-lg shadow-lg hover:bg-cyan-400 transition-all duration-300">
                Submit
              </button>
            </form>
          </div>
        </div>
      )}
    </section>
  );
}

