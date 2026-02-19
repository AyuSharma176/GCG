import { useState } from "react";
import { Routes, Route, NavLink } from "react-router-dom";
import Home from "./pages/Home";
import Resources from "./pages/Resources";
import Leaderboard from "./pages/Leaderboard";
import Contest from "./pages/Contest";
import About from "./pages/About";
import Exam from "./pages/Exam";
import PreviousYear from "./pages/PreviousYear";
import featureImg from "./assets/267.jpg";

function App() {
  const [mobileMenu, setMobileMenu] = useState(false);

  const links = [
    { path: "/", label: "Home" },
    { path: "/resources", label: "Resources" },
    { path: "/leaderboard", label: "Leaderboard" },
    { path: "/contest", label: "Contest" },
    { path: "/exam", label: "Exam" },
    { path: "/previous-year", label: "Previous Year" },
    { path: "/about", label: "About" },
  ];
  return (
    // The dark class is now applied directly to enforce dark mode
    <div className="dark">
      <div
        className="min-h-screen flex flex-col text-gray-100"
        style={{
          backgroundImage: `url(${featureImg})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
          backgroundAttachment: "fixed",
        }}
      >
        <div className="bg-black/60 min-h-screen flex flex-col">
          <nav
            className="sticky top-0 z-50 
                        bg-gray-900/30 
                          backdrop-blur-xl border-b border-gray-700/40 
                          shadow-lg"
          >
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="flex justify-between items-center h-16">
                <NavLink
                  to="/"
                  className="text-2xl font-extrabold bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent"
                >
                  GLA CODING GROUP (GCG)
                </NavLink>

                <div className="hidden md:flex space-x-8">
                  {links.map((link) => (
                    <NavLink
                      key={link.path}
                      to={link.path}
                      className={({ isActive }) =>
                        `relative text-lg font-medium text-white/90 hover:text-white transition group
               ${isActive ? "text-white font-semibold" : ""}`
                      }
                    >
                      {link.label}
                      <span className="absolute left-0 -bottom-1 w-0 h-[2px] bg-gradient-to-r from-blue-400 to-purple-500 transition-all duration-300 group-hover:w-full"></span>
                    </NavLink>
                  ))}
                </div>

                <div className="flex items-center space-x-3">
                  {/* Dark Mode Toggle has been removed */}

                  <div className="md:hidden">
                    <button
                      onClick={() => setMobileMenu(!mobileMenu)}
                      className="p-2 rounded-lg bg-gray-700/40 backdrop-blur-md border border-gray-600/30 shadow-md text-white"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16m-7 6h7" />
                      </svg>
                    </button>
                  </div>
                </div>
              </div>

              {mobileMenu && (
                <div
                  className="md:hidden pb-4 mt-2 space-y-2 
        bg-gray-900/30 
        backdrop-blur-xl border border-gray-700/40 
        rounded-xl shadow-lg p-4"
                >
                  {links.map((link) => (
                    <NavLink
                      key={link.path}
                      to={link.path}
                      className={({ isActive }) =>
                        `block py-2 px-3 rounded-lg text-white/90 hover:bg-gray-700/40 transition ${
                          isActive ? "font-semibold text-white" : ""
                        }`
                      }
                      onClick={() => setMobileMenu(false)}
                    >
                      {link.label}
                    </NavLink>
                  ))}
                </div>
              )}
            </div>
          </nav>

          <main className="flex-1 p-6">
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/resources" element={<Resources />} />
              <Route path="/leaderboard" element={<Leaderboard />} />
              <Route path="/exam" element={<Exam />} />
              <Route path="/previous-year" element={<PreviousYear />} />
              <Route path="/contest" element={<Contest />} />
              <Route path="/about" element={<About />} />
            </Routes>
          </main>

          <footer className="bg-gray-900/80 text-white py-6 text-center backdrop-blur-md">
            <p>
              © {new Date().getFullYear()} GLA CODING GROUP (GCG). All rights
              reserved.
            </p>
          </footer>
        </div>
      </div>
    </div>
  );
}
//final done
export default App;

