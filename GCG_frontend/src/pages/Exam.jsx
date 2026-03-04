import { useState, useEffect } from 'react';
import axios from 'axios';

function Exam() {
  const [questions, setQuestions] = useState([]);
  const [previousQuestions, setPreviousQuestions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [loadingPrevious, setLoadingPrevious] = useState(false);
  const [error, setError] = useState(null);
  const [generatedAt, setGeneratedAt] = useState(null);
  const [nextUpdateTime, setNextUpdateTime] = useState(null);
  const [selectedDate, setSelectedDate] = useState(null);
  const [isFromCache, setIsFromCache] = useState(false);

  const today = new Date().toLocaleDateString('en-US', { 
    weekday: 'long', 
    year: 'numeric', 
    month: 'long', 
    day: 'numeric' 
  });

  // Get the next 4 AM IST timestamp
  const getNextFourAMIST = () => {
    const now = new Date();
    const currentIST = new Date(now.toLocaleString('en-US', { timeZone: 'Asia/Kolkata' }));
    
    // Create next 4 AM IST
    const nextFourAM = new Date(currentIST);
    nextFourAM.setHours(0, 0, 0, 0);
    
    // If current IST time is after 4 AM, use tomorrow's 4 AM
    if (currentIST.getHours() >= 4) {
      nextFourAM.setDate(nextFourAM.getDate() + 1);
    }
    
    return nextFourAM;
  };

  // Load questions from cache or fetch new ones
  useEffect(() => {
    const loadQuestions = async () => {
      // Fetch questions (backend handles caching)
      await fetchQuestions();
      
      // Set next update time
      setNextUpdateTime(getNextFourAMIST());
    };

    loadQuestions();
    fetchPreviousQuestions();
  }, []);

  const fetchPreviousQuestions = async () => {
    try {
      setLoadingPrevious(true);
      
      const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:5000';
      const baseUrl = apiUrl.replace('/api/leaderboard', '');
      
      console.log('Fetching previous questions from:', `${baseUrl}/api/exam/previous-questions`);
      
      const response = await axios.get(`${baseUrl}/api/exam/previous-questions`);
      
      console.log('Previous questions response:', response.data);
      
      if (response.data.success && response.data.previousQuestions.length > 0) {
        setPreviousQuestions(response.data.previousQuestions);
        // Auto-select the first (most recent) date
        setSelectedDate(0);
      } else {
        console.log('No previous questions found');
      }
    } catch (err) {
      console.error('Error fetching previous questions:', err);
    } finally {
      setLoadingPrevious(false);
    }
  };

  const fetchQuestions = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:5000';
      const baseUrl = apiUrl.replace('/api/leaderboard', '');
      
      const response = await axios.get(`${baseUrl}/api/exam/generate-questions`);
      
      if (response.data.success) {
        const newQuestions = response.data.questions;
        const timestamp = response.data.generatedAt;
        const fromCache = response.data.fromCache || false;
        
        // Cache the questions
        localStorage.setItem('examQuestions', JSON.stringify({
          questions: newQuestions,
          timestamp: timestamp
        }));
        
        setQuestions(newQuestions);
        setGeneratedAt(new Date(timestamp));
        setIsFromCache(fromCache);
        
        console.log(fromCache ? '✅ Loaded from database cache' : '🆕 Freshly generated questions');
      } else {
        setError('Failed to fetch questions');
      }
    } catch (err) {
      console.error('Error fetching questions:', err);
      setError('Unable to load questions. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  const getDifficultyColor = (difficulty) => {
    switch(difficulty) {
      case "Easy": return "text-green-400 bg-green-500/20 border-green-500/30";
      case "Medium": return "text-yellow-400 bg-yellow-500/20 border-yellow-500/30";
      case "Hard": return "text-red-400 bg-red-500/20 border-red-500/30";
      default: return "text-gray-400 bg-gray-500/20 border-gray-500/30";
    }
  };

  return (
    <div className="max-w-7xl mx-auto">
      <div className="mb-6">
        <h1 className="text-4xl font-bold text-white mb-2" style={{background:'linear-gradient(90deg,rgb(var(--gcg-accent)),rgb(var(--gcg-light)))',WebkitBackgroundClip:'text',WebkitTextFillColor:'transparent'}}>
          Practice
        </h1>
        <p className="text-white/40 text-sm">{today}</p>
      </div>

      <div className="rounded-2xl p-6 mb-6" style={{background:'linear-gradient(135deg,rgb(var(--gcg-accent) /0.15),rgb(var(--gcg-mid) /0.2))',border:'1px solid rgb(var(--gcg-accent) /0.3)',backdropFilter:'blur(12px)'}}>
        <div className="flex items-center justify-between">
          <div className="flex-1">
            <h2 className="text-xl font-semibold text-white mb-2"> Daily Practice</h2>
            <p className="text-white/60 mb-2">
              Fresh LeetCode problems generated by AI every day at 12:00 AM IST
            </p>
            <div className="flex flex-col gap-1 text-sm">
              {generatedAt && (
                <p className="text-white/40 flex items-center gap-2">
                   Today's questions generated at: {new Date(generatedAt).toLocaleString('en-IN', {
                    timeZone: 'Asia/Kolkata',
                    hour: '2-digit',
                    minute: '2-digit',
                    hour12: true
                  })} IST
                  {isFromCache && (
                    <span className="px-2 py-0.5 rounded text-xs border" style={{background:'rgb(var(--gcg-accent) /0.15)',color:'rgb(var(--gcg-light))',borderColor:'rgb(var(--gcg-accent) /0.35)'}}>
                      ✓ Same questions until 12AM
                    </span>
                  )}
                </p>
              )}
              {nextUpdateTime && (
                <p style={{color:'rgb(var(--gcg-accent))'}}>
                   Next Auto update: {nextUpdateTime.toLocaleString('en-IN', {
                    timeZone: 'Asia/Kolkata',
                    month: 'short',
                    day: 'numeric',
                    hour: '2-digit',
                    minute: '2-digit',
                    hour12: true
                  })} IST (Tomorrow at 12:00 AM)
                </p>
              )}
            </div>
          </div>
        </div>
      </div>

      {error && (
        <div className="bg-red-500/20 backdrop-blur-md p-4 rounded-lg border border-red-500/30 mb-6">
          <p className="text-red-300 flex items-center gap-2">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            {error}
          </p>
        </div>
      )}

      {loading ? (
        <div className="flex items-center justify-center py-20">
          <div className="text-center">
            <svg className="animate-spin h-12 w-12 mx-auto mb-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" style={{color:'rgb(var(--gcg-accent))'}}>
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            <p className="text-white/50">AI is generating your practice questions...</p>
          </div>
        </div>
      ) : (
        <div className="space-y-4">
          {questions.map((question, index) => (
            <div 
              key={index}
              className="rounded-2xl p-6 transition-all duration-300 cursor-default"
              style={{background:'linear-gradient(135deg,rgb(var(--gcg-mid) /0.4),rgb(var(--gcg-dark) /0.6))',border:'1px solid rgb(var(--gcg-accent) /0.25)',backdropFilter:'blur(12px)'}}
              onMouseEnter={e=>{e.currentTarget.style.border='1px solid rgb(var(--gcg-light) /0.35)';e.currentTarget.style.boxShadow='0 0 30px rgb(var(--gcg-accent) /0.15)';e.currentTarget.style.transform='translateY(-2px)';}}
              onMouseLeave={e=>{e.currentTarget.style.border='1px solid rgb(var(--gcg-accent) /0.25)';e.currentTarget.style.boxShadow='none';e.currentTarget.style.transform='translateY(0)';}}
            >
              <div className="flex items-start justify-between mb-3">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <h3 className="text-xl font-semibold text-white">
                      {question.questionNumber}. {question.questionName}
                    </h3>
                    <span className={`px-3 py-1 rounded-full text-xs font-medium border ${getDifficultyColor(question.questionLevel)}`}>
                      {question.questionLevel}
                    </span>
                  </div>
                  <div className="flex items-center gap-2 mb-3">
                    <span className="px-2 py-1 rounded text-xs border" style={{background:'rgb(var(--gcg-accent) /0.12)',color:'rgb(var(--gcg-light))',borderColor:'rgb(var(--gcg-accent) /0.3)'}}>
                      LeetCode #{question.questionNumber}
                    </span>
                    <span className="px-2 py-1 rounded text-xs border" style={{background:'rgb(var(--gcg-light) /0.08)',color:'rgb(var(--gcg-light) /0.7)',borderColor:'rgb(var(--gcg-light) /0.15)'}}>
                      AI Generated
                    </span>
                  </div>
                </div>
              </div>
              <a 
                href={question.questionLink}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-4 py-2 text-white rounded-xl font-medium transition-all duration-300"
                style={{background:'linear-gradient(135deg,rgb(var(--gcg-mid)),rgb(var(--gcg-accent)))',boxShadow:'0 0 18px rgb(var(--gcg-accent) /0.3)'}}
              >
                Solve on LeetCode
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                </svg>
              </a>
            </div>
          ))}
        </div>
      )}

      <div className="mt-8 rounded-2xl p-6" style={{background:'linear-gradient(135deg,rgb(var(--gcg-mid) /0.4),rgb(var(--gcg-dark) /0.6))',border:'1px solid rgb(var(--gcg-accent) /0.25)',backdropFilter:'blur(12px)'}}>
        <h3 className="text-lg font-semibold text-white mb-3">💡 Tips for Success</h3>
        <ul className="space-y-2" style={{color:'rgb(var(--gcg-light) /0.65)'}}>
          <li className="flex items-start gap-2">
            <span className="text-blue-400 mt-1">•</span>
            <span>Start with Easy problems and gradually move to Medium and Hard</span>
          </li>
          <li className="flex items-start gap-2">
            <span className="text-blue-400 mt-1">•</span>
            <span>Focus on understanding the problem before coding</span>
          </li>
          <li className="flex items-start gap-2">
            <span className="text-blue-400 mt-1">•</span>
            <span>Practice time management - aim to solve each problem within 30-45 minutes</span>
          </li>
          <li className="flex items-start gap-2">
            <span className="text-blue-400 mt-1">•</span>
            <span>New questions are automatically generated daily at 12:00 AM IST</span>
          </li>
        </ul>
      </div>

      {/* Previous Days' Questions Section - Calendar Style */}
      <div className="mt-8">
        <h2 className="text-2xl font-bold text-white mb-4" style={{background:'linear-gradient(90deg,rgb(var(--gcg-accent)),rgb(var(--gcg-light)))',WebkitBackgroundClip:'text',WebkitTextFillColor:'transparent'}}>
           Previous Days' Questions
        </h2>
        
        {loadingPrevious ? (
          <div className="rounded-2xl p-6" style={{background:'rgb(var(--gcg-accent) /0.06)',border:'1px solid rgb(var(--gcg-accent) /0.2)',backdropFilter:'blur(12px)'}}>
            <p className="text-center" style={{color:'rgb(var(--gcg-light) /0.4)'}}>Loading previous questions...</p>
          </div>
        ) : previousQuestions.length === 0 ? (
          <div className="rounded-2xl p-6" style={{background:'rgb(var(--gcg-accent) /0.06)',border:'1px solid rgb(var(--gcg-accent) /0.2)',backdropFilter:'blur(12px)'}}>
            <p className="text-center" style={{color:'rgb(var(--gcg-light) /0.4)'}}>No previous questions available yet.</p>
          </div>
        ) : (
          <div className="rounded-2xl" style={{background:'linear-gradient(135deg,rgb(var(--gcg-mid) /0.4),rgb(var(--gcg-dark) /0.6))',border:'1px solid rgb(var(--gcg-accent) /0.25)',backdropFilter:'blur(12px)'}}>
            {/* Calendar Date Row */}
            <div className="p-4 border-b" style={{borderColor:'rgb(var(--gcg-accent) /0.15)',background:'rgb(var(--gcg-dark) /0.3)'}}>
              <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-thin" style={{'--scrollbar-color':'rgb(var(--gcg-accent) /0.4) transparent'}}>
                {previousQuestions.map((dayData, index) => {
                  const questionDate = new Date(dayData.date);
                  const dateNum = questionDate.getDate();
                  const monthShort = questionDate.toLocaleDateString('en-US', { month: 'short' });
                  const isSelected = selectedDate === index;
                  
                  return (
                    <button
                      key={index}
                      onClick={() => setSelectedDate(index)}
                      className={`flex-shrink-0 flex flex-col items-center justify-center w-16 h-20 rounded-xl border-2 transition-all duration-300 ${isSelected ? '' : ''}`}
                      style={isSelected ? {background:'linear-gradient(135deg,rgb(var(--gcg-mid)),rgb(var(--gcg-accent)))',border:'2px solid rgb(var(--gcg-accent))',boxShadow:'0 0 20px rgb(var(--gcg-accent) /0.4)'} : {background:'rgb(var(--gcg-accent) /0.06)',border:'2px solid rgb(var(--gcg-accent) /0.2)'}}>
                      <span className={`text-2xl font-bold ${isSelected ? 'text-white' : 'text-white/60'}`}>
                        {dateNum}
                      </span>
                      <span className={`text-xs ${isSelected ? 'text-white/80' : 'text-white/35'}`}>
                        {monthShort}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Selected Date Questions */}
            {selectedDate !== null && previousQuestions[selectedDate] && (
              <div className="p-6">
                <div className="mb-4">
                  <h3 className="text-xl font-semibold text-white mb-1">
                    {new Date(previousQuestions[selectedDate].date).toLocaleDateString('en-US', {
                      weekday: 'long',
                      month: 'long',
                      day: 'numeric',
                      year: 'numeric'
                    })}
                  </h3>
                  <p className="text-sm" style={{color:'rgb(var(--gcg-light) /0.4)'}}>
                    {previousQuestions[selectedDate].questions.length} questions
                  </p>
                </div>

                <div className="space-y-3">
                  {previousQuestions[selectedDate].questions.map((question, qIndex) => (
                    <div
                      key={qIndex}
                      className="rounded-xl p-4 transition-all duration-300"
                      style={{background:'rgb(var(--gcg-accent) /0.07)',border:'1px solid rgb(var(--gcg-accent) /0.18)'}}
                      onMouseEnter={e=>{e.currentTarget.style.borderColor='rgb(var(--gcg-light) /0.3)';}}
                      onMouseLeave={e=>{e.currentTarget.style.borderColor='rgb(var(--gcg-accent) /0.18)';}}>  
                      <div className="flex items-center gap-3 mb-2">
                        <h4 className="text-base font-semibold text-white flex-1">
                          {question.questionNumber}. {question.questionName}
                        </h4>
                        <span className={`px-2 py-1 rounded-full text-xs font-medium border ${getDifficultyColor(question.questionLevel)}`}>
                          {question.questionLevel}
                        </span>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="px-2 py-1 rounded text-xs border" style={{background:'rgb(var(--gcg-accent) /0.12)',color:'rgb(var(--gcg-light))',borderColor:'rgb(var(--gcg-accent) /0.3)'}}>
                          LeetCode #{question.questionNumber}
                        </span>
                        <a
                          href={question.questionLink}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="ml-auto inline-flex items-center gap-1 px-3 py-1 text-white rounded-lg text-sm font-medium transition-all duration-300"
                          style={{background:'linear-gradient(135deg,rgb(var(--gcg-mid)),rgb(var(--gcg-accent)))'}}>
                          Solve
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                          </svg>
                        </a>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* No Date Selected Message */}
            {selectedDate === null && (
              <div className="p-6 text-center">
                <p style={{color:'rgb(var(--gcg-light) /0.4)'}}>👆 Click on a date to view questions</p>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

export default Exam;

