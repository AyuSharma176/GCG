import { useState, useEffect } from "react";

function Contest() {
  const [contests, setContests] = useState({
    leetcode: [],
    codeforces: [],
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchContests();
  }, []);

  const fetchContests = async () => {
    setLoading(true);
    setError(null);

    try {
      // Fetch both contests in parallel
      const [leetcodeData, codeforcesData] = await Promise.all([
        fetchLeetCodeContests(),
        fetchCodeforcesContests(),
      ]);

      setContests({
        leetcode: leetcodeData,
        codeforces: codeforcesData,
      });
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const fetchLeetCodeContests = async () => {
    try {
      const response = await fetch("https://gcg-rqxl.onrender.com/api/contests/leetcode");
      
      if (!response.ok) {
        throw new Error("Failed to fetch LeetCode contests");
      }

      const data = await response.json();
      
      if (!data.success) {
        console.warn("LeetCode API returned error:", data.error);
        return [];
      }

      return data.contests || [];
    } catch (err) {
      console.error("LeetCode API Error:", err);
      return [];
    }
  };

  const fetchCodeforcesContests = async () => {
    try {
      const response = await fetch("https://gcg-rqxl.onrender.com/api/contests/codeforces");
      
      if (!response.ok) {
        throw new Error("Failed to fetch Codeforces contests");
      }

      const data = await response.json();
      
      if (!data.success) {
        console.warn("Codeforces API returned error:", data.error);
        return [];
      }

      return data.contests || [];
    } catch (err) {
      console.error("Codeforces API Error:", err);
      return [];
    }
  };

  const formatDuration = (seconds) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    return `${hours}h ${minutes}m`;
  };

  const formatDate = (date) => {
    return date.toLocaleString("en-US", {
      weekday: "short",
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const getTimeUntilContest = (startTime) => {
    const now = new Date();
    const diff = startTime - now;
    
    if (diff < 0) return "Started";
    
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
    
    if (days > 0) return `in ${days}d ${hours}h`;
    if (hours > 0) return `in ${hours}h ${minutes}m`;
    return `in ${minutes}m`;
  };

  const allContests = [...contests.leetcode, ...contests.codeforces]
    .map(contest => ({
      ...contest,
      startTime: new Date(contest.startTime)
    }))
    .sort((a, b) => a.startTime - b.startTime);

  return (
    <main className="flex-1 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-5xl font-extrabold bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent mb-4">
            Upcoming Contests
          </h1>
          <p className="text-xl text-gray-300">
            Stay updated with upcoming coding contests from LeetCode and Codeforces
          </p>
        </div>

        {loading && (
          <div className="text-center py-12">
            <div className="inline-block animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
            <p className="mt-4 text-gray-300">Loading contests...</p>
          </div>
        )}

        {error && (
          <div className="bg-red-500/10 border border-red-500/50 rounded-lg p-4 text-center">
            <p className="text-red-400">Error: {error}</p>
            <button
              onClick={fetchContests}
              className="mt-4 px-4 py-2 bg-red-500/20 hover:bg-red-500/30 rounded-lg transition"
            >
              Retry
            </button>
          </div>
        )}

        {!loading && !error && (
          <>
            <div className="flex justify-end mb-4">
              <button
                onClick={fetchContests}
                className="px-4 py-2 bg-blue-500/20 hover:bg-blue-500/30 border border-blue-500/50 rounded-lg transition flex items-center gap-2"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M4 2a1 1 0 011 1v2.101a7.002 7.002 0 0111.601 2.566 1 1 0 11-1.885.666A5.002 5.002 0 005.999 7H9a1 1 0 010 2H4a1 1 0 01-1-1V3a1 1 0 011-1zm.008 9.057a1 1 0 011.276.61A5.002 5.002 0 0014.001 13H11a1 1 0 110-2h5a1 1 0 011 1v5a1 1 0 11-2 0v-2.101a7.002 7.002 0 01-11.601-2.566 1 1 0 01.61-1.276z" clipRule="evenodd" />
                </svg>
                Refresh
              </button>
            </div>

            {allContests.length === 0 ? (
              <div className="bg-gray-800/40 backdrop-blur-md border border-gray-700/40 rounded-xl p-8 text-center">
                <p className="text-gray-400 text-lg">No upcoming contests found</p>
              </div>
            ) : (
              <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                {allContests.map((contest, index) => (
                  <div
                    key={index}
                    className="bg-gray-800/40 backdrop-blur-md border border-gray-700/40 rounded-xl p-6 hover:border-blue-500/50 transition-all hover:shadow-lg hover:shadow-blue-500/20"
                  >
                    <div className="flex items-center justify-between mb-4">
                      <span
                        className={`px-3 py-1 rounded-full text-sm font-semibold ${
                          contest.platform === "LeetCode"
                            ? "bg-yellow-500/20 text-yellow-300 border border-yellow-500/50"
                            : "bg-blue-500/20 text-blue-300 border border-blue-500/50"
                        }`}
                      >
                        {contest.platform}
                      </span>
                      <span className="text-sm text-green-400 font-semibold">
                        {getTimeUntilContest(contest.startTime)}
                      </span>
                    </div>

                    <h3 className="text-xl font-bold text-white mb-3 line-clamp-2">
                      {contest.title}
                    </h3>

                    <div className="space-y-2 mb-4">
                      <div className="flex items-center text-gray-300 text-sm">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 text-blue-400" viewBox="0 0 20 20" fill="currentColor">
                          <path fillRule="evenodd" d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z" clipRule="evenodd" />
                        </svg>
                        {formatDate(contest.startTime)}
                      </div>

                      <div className="flex items-center text-gray-300 text-sm">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 text-purple-400" viewBox="0 0 20 20" fill="currentColor">
                          <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clipRule="evenodd" />
                        </svg>
                        Duration: {formatDuration(contest.duration)}
                      </div>
                    </div>

                    <a
                      href={contest.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="block w-full py-2 px-4 bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 text-white text-center font-semibold rounded-lg transition"
                    >
                      View Contest
                    </a>
                  </div>
                ))}
              </div>
            )}

            <div className="mt-8 bg-gray-800/40 backdrop-blur-md border border-gray-700/40 rounded-xl p-6">
              <h3 className="text-xl font-bold text-white mb-4">Contest Statistics</h3>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="text-center">
                  <div className="text-3xl font-bold text-blue-400">{allContests.length}</div>
                  <div className="text-sm text-gray-400">Total Upcoming</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-yellow-400">{contests.leetcode.length}</div>
                  <div className="text-sm text-gray-400">LeetCode</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-blue-300">{contests.codeforces.length}</div>
                  <div className="text-sm text-gray-400">Codeforces</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-green-400">
                    {allContests.filter(c => {
                      const diff = c.startTime - new Date();
                      return diff > 0 && diff < 24 * 60 * 60 * 1000;
                    }).length}
                  </div>
                  <div className="text-sm text-gray-400">Next 24h</div>
                </div>
              </div>
            </div>
          </>
        )}
      </div>
    </main>
  );
}

export default Contest;
