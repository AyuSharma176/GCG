import { useState, useEffect } from 'react';
import axios from 'axios';

  const difficultyConfig = {
    easy:   { label: 'Easy',   bg: 'bg-emerald-500/10', text: 'text-emerald-400', border: 'border-emerald-500/30', dot: 'bg-emerald-400' },
    medium: { label: 'Medium', bg: 'bg-[rgb(var(--gcg-accent))]/10',   text: 'text-[rgb(var(--gcg-accent))]',   border: 'border-[rgb(var(--gcg-accent))]/30',   dot: 'bg-[rgb(var(--gcg-accent))]'   },
    hard:   { label: 'Hard',   bg: 'bg-rose-500/10',    text: 'text-rose-400',    border: 'border-rose-500/30',    dot: 'bg-rose-400'    },
  };

function DifficultyBadge({ difficulty, size = 'sm' }) {
  const cfg = difficultyConfig[difficulty?.toLowerCase()] || difficultyConfig.medium;
  const padding = size === 'sm' ? 'px-2.5 py-0.5 text-xs' : 'px-3 py-1 text-sm';
  return (
    <span className={`inline-flex items-center gap-1.5 ${padding} rounded-full font-semibold border ${cfg.bg} ${cfg.text} ${cfg.border}`}>
      <span className={`w-1.5 h-1.5 rounded-full ${cfg.dot}`}></span>
      {cfg.label}
    </span>
  );
}

function SectionHeader({ icon, title }) {
  return (
    <div className="flex items-center gap-3 mb-4">
      <div className="w-1 h-6 rounded-full" style={{background:'linear-gradient(to bottom, rgb(var(--gcg-accent)), rgb(var(--gcg-mid)))'}}></div>
      <span className="text-lg font-bold text-white tracking-wide">{icon} {title}</span>
    </div>
  );
}

function CodeBlock({ code, label }) {
  return (
    <div className="rounded-xl overflow-hidden border border-white/10">
      <div className="flex items-center gap-2 px-4 py-2 bg-white/5 border-b border-white/10">
        <div className="flex gap-1.5">
          <div className="w-3 h-3 rounded-full bg-rose-500/60"></div>
          <div className="w-3 h-3 rounded-full bg-amber-500/60"></div>
          <div className="w-3 h-3 rounded-full bg-emerald-500/60"></div>
        </div>
        {label && <span className="text-xs text-white/40 ml-2 font-mono">{label}</span>}
      </div>
      <pre className="bg-[rgb(var(--gcg-dark))] text-emerald-300 p-4 overflow-x-auto font-mono text-sm leading-relaxed m-0">{code}</pre>
    </div>
  );
}

function PreviousYear() {
  const [questions, setQuestions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [generating, setGenerating] = useState(false);
  const [error, setError] = useState(null);
  const [selectedQuestion, setSelectedQuestion] = useState(null);
  const [generateForm, setGenerateForm] = useState({
    company: 'HACKWITHINFY',
    year: '2025',
    difficulty: 'Medium'
  });

  const companies = ['HACKWITHINFY', 'Microsoft', 'Amazon', 'JUSPAY', 'Google', 'Meta'];
  const years = ['2025', '2024', '2023', '2022', '2021', '2020'];
  const difficulties = ['Easy', 'Medium', 'Hard'];

  useEffect(() => {
    fetchQuestions();
  }, []);

  const fetchQuestions = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:5000';
      const baseUrl = apiUrl.replace('/api/leaderboard', '');
      
      const response = await axios.get(`${baseUrl}/api/previous-year-questions`);
      
      if (response.data.success) {
        setQuestions(response.data.questions);
        if (response.data.questions.length > 0) {
          setSelectedQuestion(0);
        }
      } else {
        setError('Failed to fetch questions');
      }
    } catch (err) {
      console.error('Error fetching previous year questions:', err);
      setError('Failed to load questions. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const generateQuestion = async () => {
    try {
      setGenerating(true);
      setError(null);
      
      const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:5000';
      const baseUrl = apiUrl.replace('/api/leaderboard', '');
      
      const response = await axios.post(`${baseUrl}/api/previous-year-questions/generate`, generateForm);
      
      if (response.data.success) {
        // Refresh the questions list
        await fetchQuestions();
        setSelectedQuestion(0); // Select the newly generated question
      } else {
        setError('Failed to generate question');
      }
    } catch (err) {
      console.error('Error generating question:', err);
      setError('Failed to generate question. Please try again.');
    } finally {
      setGenerating(false);
    }
  };

  const currentQuestion = selectedQuestion !== null ? questions[selectedQuestion] : null;

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="relative w-16 h-16 mx-auto mb-6">
            <div className="absolute inset-0 rounded-full" style={{border:'3px solid rgb(var(--gcg-accent) /0.15)'}}></div>
            <div className="absolute inset-0 rounded-full animate-spin" style={{border:'3px solid transparent',borderTopColor:'rgb(var(--gcg-accent))'}}></div>
          </div>
          <p className="text-white/50 text-sm tracking-widest uppercase">Loading questions</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen px-4 py-8 max-w-[1600px] mx-auto">

      {/* Page Header */}
      <div className="text-center mb-10">
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full mb-4 text-xs font-semibold uppercase tracking-widest"
          style={{background:'rgb(var(--gcg-accent) /0.1)',border:'1px solid rgb(var(--gcg-accent) /0.25)',color:'rgb(var(--gcg-accent))'}}>
          <span className="w-1.5 h-1.5 rounded-full animate-pulse" style={{background:'rgb(var(--gcg-accent))'}}></span>
          Interview Prep
        </div>
        <h1 className="text-4xl md:text-5xl font-extrabold text-white mb-3 leading-tight">
          Interview{' '}
          <span className="bg-gradient-to-r from-[rgb(var(--gcg-accent))] to-[rgb(var(--gcg-light))] bg-clip-text text-transparent">
            Questions
          </span>
        </h1>
        <p className="text-white/40 text-base max-w-xl mx-auto mb-6">
          Practice authentic interview questions sourced from top tech companies
        </p>
        <a
          href="https://prepai.ayusharma.in/"
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-2.5 px-6 py-3 rounded-2xl font-bold text-white text-sm shadow-lg shadow-violet-500/25 hover:shadow-violet-500/40 hover:scale-105 active:scale-95 transition-all duration-300"
          style={{ background: 'linear-gradient(135deg, rgb(var(--gcg-mid)), rgb(var(--gcg-accent)))', boxShadow:'0 0 24px rgb(var(--gcg-accent) /0.3)' }}
        >
          <span className="text-base"></span>
          AI Mock Interview
          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 opacity-70" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
          </svg>
        </a>
      </div>

      {/* Generate Question Panel */}
        <div className="relative rounded-2xl overflow-hidden mb-8" style={{border:'1px solid rgb(var(--gcg-accent) /0.25)'}}>        <div className="absolute inset-0 pointer-events-none" style={{background:'linear-gradient(135deg,rgb(var(--gcg-accent) /0.12) 0%,rgb(var(--gcg-mid) /0.08) 50%,transparent 100%)'}}></div>
        <div className="relative p-6">
          <div className="flex items-center gap-3 mb-5">
            <div className="w-9 h-9 rounded-xl flex items-center justify-center text-lg" style={{background:'rgb(var(--gcg-accent) /0.15)',border:'1px solid rgb(var(--gcg-accent) /0.3)'}}>🤔</div>
            <div>
              <h2 className="text-white font-bold text-lg">Question Generator</h2>
              <p className="text-white/40 text-xs">Generate a question tailored to your target company</p>
            </div>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
            {[
              { label: 'Company', key: 'company', options: companies },
              { label: 'Year',    key: 'year',    options: years },
              { label: 'Difficulty', key: 'difficulty', options: difficulties },
            ].map(({ label, key, options }) => (
              <div key={key} className="flex flex-col gap-1.5">
                <label className="text-white/50 text-xs font-semibold uppercase tracking-wider">{label}</label>
                <select
                  value={generateForm[key]}
                  onChange={(e) => setGenerateForm({ ...generateForm, [key]: e.target.value })}
                  disabled={generating}
                  className="rounded-xl px-3 py-2.5 text-white text-sm focus:outline-none transition-all disabled:opacity-50 cursor-pointer"
                  style={{background:'rgb(var(--gcg-accent) /0.08)',border:'1px solid rgb(var(--gcg-accent) /0.2)'}}
                >
                  {options.map(o => <option key={o} value={o} className="bg-gray-900">{o}</option>)}
                </select>
              </div>
            ))}
            <div className="flex flex-col gap-1.5">
              <label className="text-white/0 text-xs">.</label>
              <button
                onClick={generateQuestion}
                disabled={generating}
                className="relative overflow-hidden rounded-xl px-5 py-2.5 text-sm font-bold text-white transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed group"
                style={{ background: 'linear-gradient(135deg, rgb(var(--gcg-mid)), rgb(var(--gcg-accent)))' }}
              >
                <span className="absolute inset-0 bg-white/10 opacity-0 group-hover:opacity-100 transition-opacity"></span>
                <span className="relative flex items-center justify-center gap-2">
                  {generating ? (
                    <>
                      <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></span>
                      Generating…
                    </>
                  ) : (
                    <> ✨ Generate Question </>
                  )}
                </span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Error */}
      {error && (
        <div className="flex items-center gap-3 rounded-xl border border-rose-500/30 bg-rose-500/10 px-4 py-3 mb-6 text-rose-400 text-sm">
          <span className="text-lg">⚠️</span> {error}
        </div>
      )}

      {/* Empty State */}
      {questions.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-24 text-center">
          <div className="w-20 h-20 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center text-4xl mb-5">📭</div>
          <h3 className="text-white/70 text-xl font-semibold mb-2">No questions yet</h3>
          <p className="text-white/30 text-sm max-w-xs">Hit the Generate button above to create your first AI-powered interview question.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-[280px_1fr] gap-5">

          {/* ── Sidebar ── */}
          <div className="flex flex-col gap-2">
            <p className="text-white/30 text-xs font-semibold uppercase tracking-widest px-1 mb-1">
              {questions.length} Question{questions.length !== 1 ? 's' : ''}
            </p>
            <div className="flex flex-col gap-2 max-h-[75vh] overflow-y-auto pr-1 scrollbar-thin scrollbar-thumb-white/10">
              {questions.map((q, index) => {
                const active = selectedQuestion === index;
                return (
                  <button
                    key={q.questionId}
                    onClick={() => setSelectedQuestion(index)}
                    className={`group relative text-left rounded-2xl px-4 py-3.5 border transition-all duration-200 ${
                      active
                        ? ''
                        : 'bg-white/3 border-white/8 hover:bg-white/6 hover:border-white/15'
                    }`}
                    style={active ? {background:'linear-gradient(135deg,rgb(var(--gcg-accent) /0.25),rgb(var(--gcg-mid) /0.35))',border:'1px solid rgb(var(--gcg-accent) /0.5)',boxShadow:'0 4px 16px rgb(var(--gcg-dark) /0.4)'} : {}}>
                    {active && <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-8 rounded-r-full" style={{background:'linear-gradient(to bottom,rgb(var(--gcg-accent)),rgb(var(--gcg-light)))'}}></div>}
                    <div className="flex items-center justify-between mb-1.5">
                      <span className={`text-sm font-bold ${active ? 'text-white' : 'text-white/70'}`}>{q.company}</span>
                      <DifficultyBadge difficulty={q.difficulty} />
                    </div>
                    <div className="text-xs text-white/40 mb-1">{q.year}</div>
                    <div className="text-xs text-white/30 truncate" style={{color:'rgb(var(--gcg-light) /0.35)'}}>{q.topics.slice(0, 2).join(' · ')}</div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* ── Question Panel ── */}
          {currentQuestion && (
            <div className="rounded-2xl border border-white/10 bg-white/3 overflow-hidden">

              {/* Question header bar */}
              <div className="px-8 pt-8 pb-6 border-b border-white/8">
                <div className="flex flex-wrap items-start justify-between gap-4 mb-4">
                  <div>
                    <h2 className="text-2xl md:text-3xl font-extrabold text-white mb-1">
                      {currentQuestion.company}
                      <span className="text-white/30 font-normal ml-2">{currentQuestion.year}</span>
                    </h2>
                  </div>
                  <DifficultyBadge difficulty={currentQuestion.difficulty} size="md" />
                </div>
                <div className="flex flex-wrap gap-2">
                  {currentQuestion.topics.map((topic, i) => (
                    <span key={i} className="px-3 py-1 rounded-full text-xs font-medium" style={{background:'rgb(var(--gcg-accent) /0.12)',color:'rgb(var(--gcg-light))',border:'1px solid rgb(var(--gcg-accent) /0.25)'}}>
                      {topic}
                    </span>
                  ))}
                </div>
              </div>

              <div className="px-8 py-8 space-y-10">

                {/* Problem Statement */}
                <div>
                  <SectionHeader icon="📝" title="Problem Statement" />
                  <div className="rounded-xl border border-white/8 bg-white/3 px-6 py-5 text-white/75 leading-relaxed text-sm">
                    {currentQuestion.problemStatement}
                  </div>
                </div>

                {/* Examples */}
                <div>
                  <SectionHeader icon="💡" title="Examples" />
                  <div className="space-y-4">
                    {currentQuestion.examples.map((example, i) => (
                      <div key={i} className="rounded-xl border border-white/8 bg-white/3 overflow-hidden">
                        <div className="px-4 py-2.5 border-b border-white/8 bg-white/3">
                          <span className="text-xs font-bold uppercase tracking-wider" style={{color:'rgb(var(--gcg-light))'}}>Example {i + 1}</span>
                        </div>
                        <div className="p-4 space-y-3">
                          <div>
                            <span className="text-xs font-semibold text-white/40 uppercase tracking-wider block mb-1.5">Input</span>
                            <CodeBlock code={example.input} />
                          </div>
                          <div>
                            <span className="text-xs font-semibold text-white/40 uppercase tracking-wider block mb-1.5">Output</span>
                            <CodeBlock code={example.output} />
                          </div>
                          {example.explanation && (
                            <div className="rounded-lg bg-amber-500/5 border border-amber-500/20 px-4 py-3 text-amber-200/70 text-sm leading-relaxed">
                              <span className="font-semibold text-amber-300">Explanation: </span>{example.explanation}
                            </div>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Constraints */}
                {currentQuestion.constraints?.length > 0 && (
                  <div>
                    <SectionHeader icon="⚙️" title="Constraints" />
                    <div className="rounded-xl border border-white/8 bg-white/3 divide-y divide-white/5">
                      {currentQuestion.constraints.map((c, i) => (
                        <div key={i} className="flex items-center gap-3 px-5 py-3">
                          <span className="w-1.5 h-1.5 rounded-full flex-shrink-0" style={{background:'rgb(var(--gcg-accent))'}}></span>
                          <span className="text-white/60 text-sm font-mono">{c}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Test Cases */}
                {currentQuestion.testCases?.length > 0 && (
                  <div>
                    <SectionHeader icon="🧪" title="Test Cases" />
                    <div className="space-y-4">
                      {currentQuestion.testCases.map((tc, i) => (
                        <div key={i} className="rounded-xl border border-white/8 bg-white/3 overflow-hidden">
                          <div className="px-4 py-2.5 border-b border-white/8 bg-white/3">
                            <span className="text-xs font-bold text-emerald-400 uppercase tracking-wider">Test Case {i + 1}</span>
                          </div>
                          <div className="p-4 grid grid-cols-1 md:grid-cols-2 gap-3">
                            <div>
                              <span className="text-xs font-semibold text-white/40 uppercase tracking-wider block mb-1.5">Input</span>
                              <CodeBlock code={tc.input} />
                            </div>
                            <div>
                              <span className="text-xs font-semibold text-white/40 uppercase tracking-wider block mb-1.5">Expected Output</span>
                              <CodeBlock code={tc.output} />
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Solution Approach */}
                {currentQuestion.explanation && (
                  <div>
                    <SectionHeader icon="💭" title="Solution Approach" />
                    <div className="relative rounded-xl px-6 py-5 text-white/65 leading-relaxed text-sm" style={{background:'linear-gradient(135deg,rgb(var(--gcg-accent) /0.1),rgb(var(--gcg-mid) /0.15))',border:'1px solid rgb(var(--gcg-accent) /0.25)'}}>
                      <div className="absolute top-0 left-0 w-full h-0.5 rounded-t-xl" style={{background:'linear-gradient(90deg,rgb(var(--gcg-accent)),rgb(var(--gcg-light)))'}}></div>
                      {currentQuestion.explanation}
                    </div>
                  </div>
                )}

              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export default PreviousYear;
