import { useState, useEffect } from "react";
import Loader from "../components/Loader";

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
          <h1 className="text-5xl font-extrabold mb-4" style={{background:'linear-gradient(90deg,rgb(var(--gcg-accent)),rgb(var(--gcg-light)))',WebkitBackgroundClip:'text',WebkitTextFillColor:'transparent',backgroundClip:'text'}}>
            Upcoming Contests
          </h1>
          <p className="text-base" style={{color:'rgb(var(--gcg-light) /0.55)'}}>
            Stay updated with upcoming coding contests from LeetCode and Codeforces
          </p>
        </div>

        {loading && <Loader message="Loading contests..." />}

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
              <button onClick={fetchContests}
                className="px-4 py-2 rounded-lg transition flex items-center gap-2 text-sm font-medium"
                style={{background:'rgb(var(--gcg-accent) /0.12)',border:'1px solid rgb(var(--gcg-accent) /0.3)',color:'rgb(var(--gcg-light))'}}
                onMouseEnter={e=>e.currentTarget.style.background='rgb(var(--gcg-accent) /0.22)'}
                onMouseLeave={e=>e.currentTarget.style.background='rgb(var(--gcg-accent) /0.12)'}>
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M4 2a1 1 0 011 1v2.101a7.002 7.002 0 0111.601 2.566 1 1 0 11-1.885.666A5.002 5.002 0 005.999 7H9a1 1 0 010 2H4a1 1 0 01-1-1V3a1 1 0 011-1zm.008 9.057a1 1 0 011.276.61A5.002 5.002 0 0014.001 13H11a1 1 0 110-2h5a1 1 0 011 1v5a1 1 0 11-2 0v-2.101a7.002 7.002 0 01-11.601-2.566 1 1 0 01.61-1.276z" clipRule="evenodd" />
                </svg>
                Refresh
              </button>
            </div>

            {allContests.length === 0 ? (
              <div className="rounded-xl p-8 text-center" style={{background:'rgb(var(--gcg-mid) /0.3)',border:'1px solid rgb(var(--gcg-accent) /0.2)'}}>
                <p className="text-base" style={{color:'rgb(var(--gcg-light) /0.5)'}}>No upcoming contests found</p>
              </div>
            ) : (
              <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                {allContests.map((contest, index) => (
                  <div key={index}
                    className="rounded-xl p-6 transition-all duration-200"
                    style={{background:'linear-gradient(135deg,rgb(var(--gcg-mid) /0.5),rgb(var(--gcg-dark) /0.7))',border:'1px solid rgb(var(--gcg-accent) /0.3)',backdropFilter:'blur(12px)'}}
                    onMouseEnter={e=>{e.currentTarget.style.border='1px solid rgb(var(--gcg-light) /0.35)';e.currentTarget.style.boxShadow='0 0 30px rgb(var(--gcg-accent) /0.15)';}}
                    onMouseLeave={e=>{e.currentTarget.style.border='1px solid rgb(var(--gcg-accent) /0.3)';e.currentTarget.style.boxShadow='none';}}>
                    <div className="flex items-center justify-between mb-4">
                      <span className={`px-3 py-1 rounded-full text-xs font-bold ${
                          contest.platform === "LeetCode"
                            ? "" : ""
                        }`}
                        style={contest.platform==="LeetCode"
                          ? {background:'rgb(var(--gcg-light) /0.12)',color:'rgb(var(--gcg-light))',border:'1px solid rgb(var(--gcg-light) /0.3)'}
                          : {background:'rgb(var(--gcg-accent) /0.15)',color:'rgb(var(--gcg-accent))',border:'1px solid rgb(var(--gcg-accent) /0.4)'}}>
                        {contest.platform}
                      </span>
                      <span className="text-xs font-bold" style={{color:'rgb(var(--gcg-light))'}}>
                        {getTimeUntilContest(contest.startTime)}
                      </span>
                    </div>

                    <h3 className="text-xl font-bold text-white mb-3 line-clamp-2">
                      {contest.title}
                    </h3>

                    <div className="space-y-2 mb-4">
                      <div className="flex items-center text-sm" style={{color:'rgb(var(--gcg-light) /0.6)'}}>                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-2" style={{color:'rgb(var(--gcg-accent))'}} viewBox="0 0 20 20" fill="currentColor">
                          <path fillRule="evenodd" d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z" clipRule="evenodd" />
                        </svg>
                        {formatDate(contest.startTime)}
                      </div>

                      <div className="flex items-center text-sm" style={{color:'rgb(var(--gcg-light) /0.6)'}}>                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-2" style={{color:'rgb(var(--gcg-light))'}} viewBox="0 0 20 20" fill="currentColor">
                          <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clipRule="evenodd" />
                        </svg>
                        Duration: {formatDuration(contest.duration)}
                      </div>
                    </div>

                    <a href={contest.url} target="_blank" rel="noopener noreferrer"
                      className="block w-full py-2, px-4 text-white text-center font-bold rounded-xl transition-all duration-150 text-sm"
                      style={{background:'linear-gradient(135deg,rgb(var(--gcg-mid)),rgb(var(--gcg-accent)))',boxShadow:'0 0 14px rgb(var(--gcg-accent) /0.3)'}}
                      onMouseEnter={e=>e.currentTarget.style.boxShadow='0 0 24px rgb(var(--gcg-accent) /0.55)'}
                      onMouseLeave={e=>e.currentTarget.style.boxShadow='0 0 14px rgb(var(--gcg-accent) /0.3)'}>
                      View Contest
                    </a>
                  </div>
                ))}
              </div>
            )}

            <div className="mt-8 rounded-xl p-6" style={{background:'linear-gradient(135deg,rgb(var(--gcg-mid) /0.45),rgb(var(--gcg-dark) /0.65))',border:'1px solid rgb(var(--gcg-accent) /0.25)',backdropFilter:'blur(12px)'}}>
              <h3 className="text-lg font-bold text-white mb-5">Contest Statistics</h3>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="text-center p-4 rounded-xl" style={{background:'rgb(var(--gcg-accent) /0.1)',border:'1px solid rgb(var(--gcg-accent) /0.2)'}}>
                  <div className="text-3xl font-black" style={{background:'linear-gradient(90deg,rgb(var(--gcg-accent)),rgb(var(--gcg-light)))',WebkitBackgroundClip:'text',WebkitTextFillColor:'transparent',backgroundClip:'text'}}>{allContests.length}</div>
                  <div className="text-xs mt-1 font-medium" style={{color:'rgb(var(--gcg-light) /0.5)'}}>Total Upcoming</div>
                </div>
                <div className="text-center p-4 rounded-xl" style={{background:'rgb(var(--gcg-accent) /0.1)',border:'1px solid rgb(var(--gcg-accent) /0.2)'}}>
                  <div className="text-3xl font-black" style={{color:'rgb(var(--gcg-light))'}}>{contests.leetcode.length}</div>
                  <div className="text-xs mt-1 font-medium" style={{color:'rgb(var(--gcg-light) /0.5)'}}>LeetCode</div>
                </div>
                <div className="text-center p-4 rounded-xl" style={{background:'rgb(var(--gcg-accent) /0.1)',border:'1px solid rgb(var(--gcg-accent) /0.2)'}}>
                  <div className="text-3xl font-black" style={{color:'rgb(var(--gcg-accent))'}}>{contests.codeforces.length}</div>
                  <div className="text-xs mt-1 font-medium" style={{color:'rgb(var(--gcg-light) /0.5)'}}>Codeforces</div>
                </div>
                <div className="text-center p-4 rounded-xl" style={{background:'rgb(var(--gcg-accent) /0.1)',border:'1px solid rgb(var(--gcg-accent) /0.2)'}}>
                  <div className="text-3xl font-black" style={{color:'rgb(var(--gcg-light))'}}>
                    {allContests.filter(c => {
                      const diff = c.startTime - new Date();
                      return diff > 0 && diff < 24 * 60 * 60 * 1000;
                    }).length}
                  </div>
                  <div className="text-xs mt-1 font-medium" style={{color:'rgb(var(--gcg-light) /0.5)'}}>Next 24h</div>
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
