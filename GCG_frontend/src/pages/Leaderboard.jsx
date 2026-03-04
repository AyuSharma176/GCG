import { useState, useEffect, useMemo } from "react";
import Loader from "../components/Loader";

// The API endpoint for your backend server
const API_BASE = import.meta.env.VITE_API_URL || "https://gcg-rqxl.onrender.com";

export default function Leaderboard() {
  const [users, setUsers] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [newUser, setNewUser] = useState({ name: "", leetcodeUsername: "", codeforcesUsername: "" });
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false); // Track if leaderboard is being refreshed
  const [initialLoading, setInitialLoading] = useState(true); // Track initial page load

  // Function to fetch leaderboard data from the backend
  const fetchLeaderboard = async () => {
    try {
      const response = await fetch(`${API_BASE}/api/leaderboard`);
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      const data = await response.json();
      setUsers(data);
    } catch (error) {
      console.error("Failed to fetch leaderboard:", error);
      setError("Could not load leaderboard data. Please make sure the backend server is running.");
    } finally {
      setInitialLoading(false);
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
      const response = await fetch(`${API_BASE}/api/leaderboard`, {
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

  // Function to refresh all rankings
  const handleRefreshLeaderboard = async () => {
    setRefreshing(true);
    try {
      await fetchLeaderboard(); // Refresh the entire leaderboard
    } catch (error) {
      console.error("Error refreshing leaderboard:", error);
      alert("Failed to refresh leaderboard. Please try again.");
    } finally {
      setRefreshing(false);
    }
  };

  const sortedUsers = useMemo(() => {
    // The backend already provides rankScore sorted, but we can keep this for safety
    return [...users].sort((a, b) => b.rankScore - a.rankScore);
  }, [users]);

  // Show loader while initial data is loading
  if (initialLoading) {
    return <Loader message="Loading leaderboard..." />;
  }

  return (
    <section className="max-w-7xl mx-auto px-4 sm:px-6 py-8 sm:py-16">
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4 mb-6 sm:mb-10">
        <h2 className="text-2xl sm:text-4xl font-extrabold drop-shadow-sm" style={{background:'linear-gradient(90deg,rgb(var(--gcg-accent)),rgb(var(--gcg-light)))',WebkitBackgroundClip:'text',WebkitTextFillColor:'transparent',backgroundClip:'text'}}>
          Leaderboard
        </h2>
        <div className="flex gap-2 sm:gap-4">
          <button
            onClick={handleRefreshLeaderboard}
            disabled={refreshing}
            className="font-bold py-2 px-3 sm:px-5 rounded-lg transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-1 sm:gap-2 text-sm"
            style={{background:'rgb(var(--gcg-accent) /0.15)',border:'1px solid rgb(var(--gcg-accent) /0.4)',color:'rgb(var(--gcg-light))'}}
            title="Refresh Rankings"
          >
            <span className={refreshing ? 'inline-block animate-spin' : ''}>{refreshing ? '⟳' : '🔄'}</span>
            <span className="hidden sm:inline">Refresh</span>
          </button>
          <button
            onClick={() => setShowForm(true)}
            className="font-bold py-2 px-3 sm:px-5 rounded-lg transition-all duration-200 text-sm whitespace-nowrap"
            style={{background:'linear-gradient(135deg,rgb(var(--gcg-mid)),rgb(var(--gcg-accent)))',color:'#fff',boxShadow:'0 0 16px rgb(var(--gcg-accent) /0.35)'}}
          >
            + Add Yourself
          </button>
        </div>
      </div>

      {/* Leaderboard Table */}
      <div className="overflow-x-auto rounded-xl" style={{background:'linear-gradient(135deg,rgb(var(--gcg-mid) /0.45),rgb(var(--gcg-dark) /0.65))',border:'1px solid rgb(var(--gcg-accent) /0.3)',backdropFilter:'blur(12px)'}}>
        <table className="min-w-full text-left text-white">
          <thead>
            <tr style={{background:'linear-gradient(135deg,rgb(var(--gcg-accent) /0.2),rgb(var(--gcg-mid) /0.3))',borderBottom:'1px solid rgb(var(--gcg-accent) /0.25)'}}>
              <th className="p-3 sm:p-4 text-xs sm:text-sm font-bold uppercase tracking-wider" style={{color:'rgb(var(--gcg-light) /0.7)'}}>Rank</th>
              <th className="p-3 sm:p-4 text-xs sm:text-sm font-bold uppercase tracking-wider" style={{color:'rgb(var(--gcg-light) /0.7)'}}>Name</th>
              <th className="p-3 sm:p-4 text-xs sm:text-sm font-bold uppercase tracking-wider" style={{color:'rgb(var(--gcg-light) /0.7)'}}>LeetCode</th>
              <th className="p-3 sm:p-4 text-xs sm:text-sm font-bold uppercase tracking-wider" style={{color:'rgb(var(--gcg-light) /0.7)'}}>Codeforces</th>
              <th className="p-3 sm:p-4 text-xs sm:text-sm font-bold uppercase tracking-wider" style={{color:'rgb(var(--gcg-light) /0.7)'}}>Total Qs</th>
              <th className="p-3 sm:p-4 text-xs sm:text-sm font-bold uppercase tracking-wider" style={{color:'rgb(var(--gcg-light) /0.7)'}}>Score</th>
            </tr>
          </thead>
          <tbody>
            {error ? (
              <tr><td colSpan="6" className="p-3 sm:p-4 text-center text-red-400 text-sm sm:text-base">{error}</td></tr>
            ) : sortedUsers.length === 0 ? (
              <tr><td colSpan="6" className="p-3 sm:p-4 text-center text-gray-400 text-sm sm:text-base">No users yet. Be the first to add yourself!</td></tr>
            ) : sortedUsers.map((user, index) => (
              <tr key={user._id} className="transition-all duration-150"
                style={{borderTop:'1px solid rgb(var(--gcg-accent) /0.12)'}}
                onMouseEnter={e=>e.currentTarget.style.background='rgb(var(--gcg-accent) /0.08)'}
                onMouseLeave={e=>e.currentTarget.style.background='transparent'}>
                <td className="p-2 sm:p-4">
                  <span className="font-black text-base sm:text-lg" style={{color: index===0?'rgb(var(--gcg-light))': index===1?'rgb(var(--gcg-accent))': index===2?'#6aa8d8':'rgba(255,255,255,0.6)'}}>#{index + 1}</span>
                </td>
                <td className="p-2 sm:p-4 font-semibold text-sm sm:text-base text-white">{user.name}</td>
                <td className="p-2 sm:p-4">
                  <a href={user.leetcodeURL} target="_blank" rel="noopener noreferrer" className="hover:underline"
                    style={{color:'rgb(var(--gcg-accent))'}}>
                    <div className="font-medium text-sm sm:text-base">{user.leetcodeUsername}</div>
                    <div className="text-xs sm:text-sm" style={{color:'rgb(var(--gcg-light) /0.5)'}}>                      <span style={{color:'rgb(var(--gcg-light) /0.8)'}}>{user.leetcodeQuestions} Qs</span>
                      {user.leetcodeRating > 0 && <span className="hidden sm:inline"> · {user.leetcodeRating}</span>}
                    </div>
                  </a>
                </td>
                <td className="p-2 sm:p-4">
                  <a href={user.codeforcesURL} target="_blank" rel="noopener noreferrer" className="hover:underline"
                    style={{color:'rgb(var(--gcg-accent))'}}>
                    <div className="font-medium text-sm sm:text-base">{user.codeforcesUsername}</div>
                    <div className="text-xs sm:text-sm" style={{color:'rgb(var(--gcg-light) /0.5)'}}>                      <span style={{color:'rgb(var(--gcg-light) /0.8)'}}>{user.codeforcesQuestions} Qs</span>
                      {user.codeforcesRating > 0 && <span className="hidden sm:inline"> · {user.codeforcesRating}</span>}
                    </div>
                  </a>
                </td>
                <td className="p-2 sm:p-4 font-bold text-sm sm:text-lg" style={{color:'rgb(var(--gcg-light))'}}>{user.totalQuestions}</td>
                <td className="p-2 sm:p-4 font-bold text-sm sm:text-lg" style={{color:'rgb(var(--gcg-accent))'}}>{user.rankScore.toFixed(2)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Add User Modal */}
      {showForm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4" style={{background:'rgb(var(--gcg-dark) /0.7)',backdropFilter:'blur(16px)'}}>
          <div className="relative w-full max-w-lg rounded-2xl p-8" style={{background:'linear-gradient(145deg,rgb(var(--gcg-dark)),rgb(var(--gcg-mid)))',border:'1px solid rgb(var(--gcg-accent) /0.35)',boxShadow:'0 0 60px rgb(var(--gcg-accent) /0.2)'}}>
            <button onClick={() => setShowForm(false)} className="absolute top-4 right-4 w-8 h-8 rounded-lg flex items-center justify-center text-lg transition" style={{background:'rgb(var(--gcg-accent) /0.15)',color:'rgb(var(--gcg-light) /0.7)'}} aria-label="Close">&times;</button>
            <h3 className="text-xl font-bold text-white mb-6">Add Your Profile</h3>
            <form onSubmit={handleAddUser} className="space-y-4">
              <div>
                <label htmlFor="name" className="block text-sm font-medium mb-1.5" style={{color:'rgb(var(--gcg-light) /0.7)'}}>Your Name</label>
                <input type="text" id="name" name="name" value={newUser.name} onChange={handleInputChange}
                  className="w-full rounded-xl px-3 py-2.5 text-sm text-white focus:outline-none transition"
                  style={{background:'rgb(var(--gcg-accent) /0.12)',border:'1px solid rgb(var(--gcg-accent) /0.3)'}}
                  placeholder="e.g. Jane Doe" disabled={loading} required />
              </div>
              <div>
                <label htmlFor="leetcodeUsername" className="block text-sm font-medium mb-1.5" style={{color:'rgb(var(--gcg-light) /0.7)'}}>LeetCode Username</label>
                <input type="text" id="leetcodeUsername" name="leetcodeUsername" value={newUser.leetcodeUsername} onChange={handleInputChange}
                  className="w-full rounded-xl px-3 py-2.5 text-sm text-white focus:outline-none transition"
                  style={{background:'rgb(var(--gcg-accent) /0.12)',border:'1px solid rgb(var(--gcg-accent) /0.3)'}}
                  placeholder="e.g. uwi" disabled={loading} required pattern="[a-zA-Z0-9_-]+" />
                <p className="text-xs mt-1" style={{color:'rgb(var(--gcg-light) /0.4)'}}>Just your username, not the full URL</p>
              </div>
              <div>
                <label htmlFor="codeforcesUsername" className="block text-sm font-medium mb-1.5" style={{color:'rgb(var(--gcg-light) /0.7)'}}>Codeforces Username</label>
                <input type="text" id="codeforcesUsername" name="codeforcesUsername" value={newUser.codeforcesUsername} onChange={handleInputChange}
                  className="w-full rounded-xl px-3 py-2.5 text-sm text-white focus:outline-none transition"
                  style={{background:'rgb(var(--gcg-accent) /0.12)',border:'1px solid rgb(var(--gcg-accent) /0.3)'}}
                  placeholder="e.g. tourist" disabled={loading} required pattern="[a-zA-Z0-9_-]+" />
                <p className="text-xs mt-1" style={{color:'rgb(var(--gcg-light) /0.4)'}}>Just your username, not the full URL</p>
              </div>
              <button type="submit" disabled={loading}
                className="w-full font-bold py-3 rounded-xl transition-all duration-200 text-sm disabled:opacity-50 disabled:cursor-not-allowed"
                style={{background:'linear-gradient(135deg,rgb(var(--gcg-mid)),rgb(var(--gcg-accent)))',color:'#fff',boxShadow:'0 0 20px rgb(var(--gcg-accent) /0.3)'}}>
                {loading ? 'Fetching your stats… (3-5s)' : 'Submit Profile'}
              </button>
            </form>
          </div>
        </div>
      )}
    </section>
  );
}

