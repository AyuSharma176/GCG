import { useState } from "react";
import articles from "../assets/CP.png";
import videos from "../assets/videos.png";
import projects from "../assets/projects.png";

// Data for CP Levels
const cpLevels = [
  {
    title: "Introduction to CP",
    desc: "Learn the basics of competitive programming.",
    isExternal: true,
    url: "https://medium.com/codess-cafe/the-ultimate-guide-to-competitive-programming-7bde37b70f45",
  },
  {
    title: "Beginner Level",
    desc: "Solve simple problems and practice fundamentals.",
    blog: {
      title: "How to Start Your CP Journey",
      url: "https://www.geeksforgeeks.org/how-to-prepare-for-competitive-programming/",
    },
    problems: [
      { name: "1000-1400 Difficulty Problems", url: "https://www.codechef.com/practice/1-star-difficulty-problems", difficulty: "CodeChef 1★" },
      { name: "Morning Sandwich", url: "https://codeforces.com/problemset/problem/1832/A", difficulty: "Codeforces 800" },
      { name: "Remove Two Letters", url: "https://codeforces.com/problemset/problem/1800/A", difficulty: "Codeforces 800" },
      { name: "We Need the Zero", url: "https://codeforces.com/problemset/problem/1805/A", difficulty: "Codeforces 800" },
      { name: "The Miracle and the Sleeper", url: "https://codeforces.com/problemset/problem/1562/A", difficulty: "Codeforces 800" },
      { name: "Problem 2104/A", url: "https://codeforces.com/problemset/problem/2104/A", difficulty: "Codeforces 800" },
      { name: "Problem 2094/B", url: "https://codeforces.com/problemset/problem/2094/B", difficulty: "Codeforces 800" },
      { name: "Problem 2090/A", url: "https://codeforces.com/problemset/problem/2090/A", difficulty: "Codeforces 800" },
    ],
  },
  {
    title: "Intermediate Level",
    desc: "Work on more challenging problems and algorithms.",
    blog: { 
        title: "Mastering Common Algorithms", 
        url: "https://cp-algorithms.com/index.html-structures-and-algorithms-the-ultimate-guide" 
    },
    problems: [
        { name: "Codechef 1400 to 1600 difficulty problems", url: "https://www.codechef.com/practice/2-star-difficulty-problems", difficulty: "Medium" },
        { name: "Codeforces- Add 0 or K", url: "https://codeforces.com/problemset/problem/2134/B", difficulty: "Medium" },
        { name: "Codeforces- The Nether", url: "https://codeforces.com/problemset/problem/2133/C", difficulty: "Medium" },
        { name: "Codeforces- Arboris Contractio", url: "https://codeforces.com/problemset/problem/2131/E", difficulty: "Medium" },
        { name: "Codeforces- Make it Equal", url: "https://codeforces.com/problemset/problem/2131/C", difficulty: "Medium" },
        { name: "Codeforces- Pathless", url: "https://codeforces.com/problemset/problem/2130/B", difficulty: "Medium" },
        { name: "Codeforces- Deque Process", url: "https://codeforces.com/problemset/problem/2128/B", difficulty: "Medium" },
        { name: "Codeforces- MEX Count", url: "https://codeforces.com/problemset/problem/2123/E", difficulty: "Medium" },
    ],
  },
];

// Main resources data
const resources = [
  {
    img: articles,
    title: "CP",
    desc: "In-depth coding articles.",
    isMultiLevel: true,
    content: cpLevels,
  },
  {
    img: videos,
    title: "DSA",
    desc: "Video lessons & challenges.",
    isMultiLevel: false,
    content: {
      blog: { title: "Top Channels for Developers", url: "https://leetcode.com/problemset/" },
      items: [
        { name: "Phase-1", url: "https://drive.google.com/drive/folders/1jp5HkedM781IQzc5i34aM4zncZ_SYQgr?usp=drive_link", difficulty: "Playlist" },
        { name: "Phase-2", url: "https://drive.google.com/drive/folders/1e8TRCK1Ilx-IEIVoPKaDJKIx8xhzLErH?usp=sharing", difficulty: "Playlist" },
      ],
    },
  },
  {
    img: projects,
    title: "Projects",
    desc: "Inspiration & templates.",
    isMultiLevel: false,
    content: {
        blog: { title: "Building a Standout Portfolio", url: "https://docs.google.com/document/d/19DdAKaa2-HKvVBzW2Akg3JOJ4gcWVg_dpSItYcxuX_w/edit?usp=sharing" },
        items: [
            { name: "BeFIT - A Fitness Application", url: "https://github.com/AyuSharma176/BeFIT-A_Fitness_Application", difficulty: "Full-Stack" },
            { name: "Electricity Demand Forecasting Dashboard", url: "https://github.com/AyuSharma176/Electricity-Demand-Forecasting-Dashboard", difficulty: "Data Science" },
        ],
    },
  },
];

// Reusable component for the detailed, scrollable view
const DetailView = ({ title, data, header }) => {
  const items = data.items || data.problems;
  return (
    <>
      <div className="flex-shrink-0">
        <h2 className="mb-8 text-center text-4xl font-bold text-white">{title}</h2>
      </div>
      <div className="overflow-y-auto pr-4">
        <div className="mb-8">
          <h3 className="mb-3 text-2xl font-semibold text-cyan-400">{data.blog.title ? "Getting Started Guide" : "Featured Guide"}</h3>
          <a href={data.blog.url} target="_blank" rel="noopener noreferrer" className="group flex items-center gap-4 rounded-lg border border-gray-700 bg-gray-800/50 p-4 transition hover:bg-gray-700/60">
            <svg className="h-8 w-8 text-cyan-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"/></svg>
            <div>
              <p className="text-lg text-white">{data.blog.title}</p>
              <span className="text-sm text-blue-400 transition-colors group-hover:text-blue-300">Read more →</span>
            </div>
          </a>
        </div>
        <div>
          <h3 className="mb-4 text-2xl font-semibold text-cyan-400">{header || "Practice Problems"}</h3>
          <div className="space-y-3">
            {items.map((item, i) => (
              <a key={i} href={item.url} target="_blank" rel="noopener noreferrer" className="group flex items-center justify-between rounded-lg border border-gray-700 bg-gray-800/50 p-4 transition hover:bg-gray-700/60">
                <span className="text-white">{item.name}</span>
                <div className="flex items-center gap-4">
                  <span className="rounded-full bg-yellow-900/60 px-3 py-1 text-sm text-yellow-300">{item.difficulty}</span>
                  <span className="text-gray-400 transition-transform group-hover:translate-x-1">→</span>
                </div>
              </a>
            ))}
          </div>
        </div>

        {/* Section to add a new project */}
        {title === "Projects" && (
          <>
            <hr className="border-gray-700 my-8" />
            <div className="text-center">
              <h3 className="text-2xl font-semibold text-cyan-400 mb-4">Showcase Your Work</h3>
              <p className="text-gray-400 mb-6">Want to add your project to this list? Submit your details by filling out the form.</p>
              <a
                href="https://forms.gle/PuMbw8DfNfcEVugv9"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 text-gray-300 bg-gray-700/50 hover:bg-cyan-500/20 hover:text-cyan-300 transition-all duration-300 px-4 py-2 rounded-lg"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v3m0 0v3m0-3h3m-3 0H9m12 0a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <span>Submit Your Project</span>
              </a>
            </div>
          </>
        )}
      </div>
    </>
  );
};


export default function Resources() {
  const [selectedResource, setSelectedResource] = useState(null);
  const [selectedLevel, setSelectedLevel] = useState(null);

  const handleCloseModal = () => {
    setSelectedResource(null);
    setSelectedLevel(null);
  };

  const handleLevelClick = (level) => {
    if (level.isExternal) {
      window.open(level.url, "_blank");
    } else {
      setSelectedLevel(level);
    }
  };

  return (
    <section className="max-w-7xl mx-auto px-6 py-16">
      {!selectedResource && (
        <>
          <h2 className="text-4xl font-extrabold text-center mb-14 bg-gradient-to-r from-cyan-400 to-purple-500 bg-clip-text text-transparent drop-shadow-sm">
            Coding Resources
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
            {resources.map((item, i) => (
              <div key={i} onClick={() => setSelectedResource(item)} className="group relative cursor-pointer overflow-hidden rounded-2xl bg-gray-800/40 p-6 shadow-lg transition-all duration-300 hover:-translate-y-2 hover:shadow-2xl hover:shadow-cyan-500/20 border border-gray-700">
                <div className="mb-4 overflow-hidden rounded-xl">
                  <img src={item.img} alt={item.title} className="h-48 w-full object-cover transition-transform duration-500 group-hover:scale-105"/>
                </div>
                <h3 className="text-2xl font-bold text-white drop-shadow">{item.title}</h3>
                <p className="text-gray-300 leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>
        </>
      )}

      {selectedResource && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-md">
          <div className="relative flex flex-col w-full max-w-4xl max-h-[90vh] rounded-2xl border border-gray-700 bg-[#1e293b]/80 p-8">
            <button onClick={handleCloseModal} className="absolute top-4 right-4 text-3xl text-gray-400 transition hover:text-white" aria-label="Close">&times;</button>
            
            {selectedResource.isMultiLevel ? (
              // Logic for multi-level resources like CP
              !selectedLevel ? (
                <div>
                  <h2 className="mb-10 text-4xl font-bold text-white">{selectedResource.title}</h2>
                  <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
                    {selectedResource.content.map((level, i) => (
                      <div key={i} onClick={() => handleLevelClick(level)} className="cursor-pointer rounded-xl border border-gray-700 bg-gray-800/50 p-6 transition duration-300 hover:-translate-y-1 hover:bg-gray-700/60">
                        <h3 className="mb-2 text-2xl font-bold text-cyan-400">{level.title}</h3>
                        <p className="leading-relaxed text-gray-300">{level.desc}</p>
                      </div>
                    ))}
                  </div>
                </div>
              ) : (
                <>
                  <button onClick={() => setSelectedLevel(null)} className="absolute top-4 left-4 text-4xl text-gray-400 transition hover:text-white" aria-label="Back">←</button>
                  <DetailView title={selectedLevel.title} data={selectedLevel} />
                </>
              )
            ) : (
              // Logic for single-level resources like Tutorials, Videos, etc.
              <DetailView title={selectedResource.title} data={selectedResource.content} header="Featured Resources" />
            )}
          </div>
        </div>
      )}
    </section>
  );
}

