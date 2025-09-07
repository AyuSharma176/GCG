import { Code, BookOpen, Users, Award, Rocket, Globe } from "lucide-react";

export default function Home() {
  return (
    <section className="max-w-7xl mx-auto px-6 py-12">
      {/* Hero */}
      <div className="text-center mb-16">
        <h1 className="text-5xl md:text-6xl font-extrabold mb-6 drop-shadow-lg">
          Welcome to{" "}
          <span className="bg-gradient-to-r from-blue-500 to-purple-600 bg-clip-text text-transparent">
            GLA CODING GROUP
          </span>
        </h1>
        <p className="text-lg md:text-xl text-gray-100 max-w-3xl mx-auto leading-relaxed drop-shadow-md">
          The coding community of{" "}
          <span className="font-semibold">GLA University</span>.  
          Learn, build, and grow together with resources, mentorship, and
          competitions designed to shape you into a world-class programmer.
        </p>
      </div>

      {/* About Cards */}
      <div className="grid md:grid-cols-2 gap-8 mb-20">
        <div className="p-8 rounded-2xl shadow-xl 
            bg-white/20 dark:bg-gray-800/30 
            backdrop-blur-md border border-white/20 dark:border-gray-700/40 
            transform transition duration-300 hover:scale-105 hover:border-blue-400 hover:shadow-2xl">
          <BookOpen className="w-12 h-12 text-blue-400 mb-4" />
          <h3 className="text-2xl font-bold mb-3 text-white">About This Website</h3>
          <p className="text-gray-100 leading-relaxed">
            Your one-stop hub for coding enthusiasts at GLA. Access curated tutorials, 
            articles, video lessons, projects, and coding challenges — all designed to 
            boost your skills and help you shine in the tech world.
          </p>
        </div>

        <div className="p-8 rounded-2xl shadow-xl 
            bg-white/20 dark:bg-gray-800/30 
            backdrop-blur-md border border-white/20 dark:border-gray-700/40 
            transform transition duration-300 hover:scale-105 hover:border-purple-400 hover:shadow-2xl">
          <Globe className="w-12 h-12 text-purple-400 mb-4" />
          <h3 className="text-2xl font-bold mb-3 text-white">About GLA University</h3>
          <p className="text-gray-100 leading-relaxed">
            GLA University, Mathura, is a{" "}
            <span className="font-semibold">NAAC A+ accredited</span> institution known 
            for academic excellence. With world-class infrastructure and a thriving 
            tech culture, GLA nurtures innovation and career success.
          </p>
        </div>
      </div>

      {/* Why Join Section */}
      <div className="text-center">
        <h2 className="text-4xl font-extrabold mb-10 text-white drop-shadow-lg">
          Why Join{" "}
          <span className="text-blue-400">GCG?</span>
        </h2>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-10">
          {[
            { icon: <Code className="w-10 h-10 text-indigo-400 mb-4 mx-auto" />, title: "Learn to Code", desc: "Access structured tutorials, coding problems, and real-world projects.", hover: "hover:border-indigo-400" },
            { icon: <Users className="w-10 h-10 text-green-400 mb-4 mx-auto" />, title: "Community & Mentorship", desc: "Collaborate with peers, get guidance from seniors, and grow together.", hover: "hover:border-green-400" },
            { icon: <Award className="w-10 h-10 text-yellow-400 mb-4 mx-auto" />, title: "Compete & Win", desc: "Join coding challenges and earn a place on the community leaderboard.", hover: "hover:border-yellow-400" },
            { icon: <Rocket className="w-10 h-10 text-red-400 mb-4 mx-auto" />, title: "Career Growth", desc: "Prepare for placements, internships, and hackathons with the right skills.", hover: "hover:border-red-400" },
            { icon: <Globe className="w-10 h-10 text-blue-400 mb-4 mx-auto" />, title: "Global Exposure", desc: "Connect with developers worldwide and stay updated with latest trends.", hover: "hover:border-blue-400" }
          ].map((item, i) => (
            <div
              key={i}
              className={`p-6 rounded-xl shadow-xl 
                bg-white/20 dark:bg-gray-800/30 
                backdrop-blur-md border border-white/20 dark:border-gray-700/40 
                transform transition duration-300 hover:scale-105 hover:shadow-2xl ${item.hover}`}
            >
              {item.icon}
              <h4 className="text-xl font-semibold mb-2 text-white">{item.title}</h4>
              <p className="text-gray-100">{item.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
