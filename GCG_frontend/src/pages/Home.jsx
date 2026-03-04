import { Code, BookOpen, Users, Award, Rocket, Globe } from "lucide-react";

const GlassCard = ({ children, className = "" }) => (
  <div
    className={`rounded-2xl backdrop-blur-md transition-all duration-300 ${className}`}
    style={{
      background: "linear-gradient(135deg, rgb(var(--gcg-mid) /0.5) 0%, rgb(var(--gcg-dark) /0.7) 100%)",
      border: "1px solid rgb(var(--gcg-accent) /0.3)",
      boxShadow: "0 4px 24px rgb(var(--gcg-dark) /0.5), inset 0 1px 0 rgb(var(--gcg-light) /0.08)",
    }}
    onMouseEnter={e => {
      e.currentTarget.style.border = "1px solid rgb(var(--gcg-light) /0.4)";
      e.currentTarget.style.boxShadow = "0 0 40px rgb(var(--gcg-accent) /0.18), 0 8px 32px rgb(var(--gcg-dark) /0.6), inset 0 1px 0 rgb(var(--gcg-light) /0.12)";
      e.currentTarget.style.transform = "translateY(-4px)";
    }}
    onMouseLeave={e => {
      e.currentTarget.style.border = "1px solid rgb(var(--gcg-accent) /0.3)";
      e.currentTarget.style.boxShadow = "0 4px 24px rgb(var(--gcg-dark) /0.5), inset 0 1px 0 rgb(var(--gcg-light) /0.08)";
      e.currentTarget.style.transform = "translateY(0)";
    }}
  >
    {children}
  </div>
);

const features = [
  { icon: <Code className="w-5 h-5" />, title: "Learn to Code", desc: "Structured tutorials, coding problems, and real-world projects tailored for every level." },
  { icon: <Users className="w-5 h-5" />, title: "Community & Mentorship", desc: "Collaborate with peers, get guidance from seniors, and grow together." },
  { icon: <Award className="w-5 h-5" />, title: "Compete & Win", desc: "Join coding challenges and earn your spot on the community leaderboard." },
  { icon: <Rocket className="w-5 h-5" />, title: "Career Growth", desc: "Prepare for placements, internships, and hackathons with the right skills." },
  { icon: <Globe className="w-5 h-5" />, title: "Global Exposure", desc: "Connect with developers worldwide and stay updated with the latest trends." },
];

export default function Home() {
  return (
    <section className="max-w-7xl mx-auto px-6 py-12">

      {/* ── Hero ── */}
      <div className="text-center mb-20 relative">
        <div className="absolute inset-0 -top-20 flex items-start justify-center pointer-events-none">
          <div className="w-[700px] h-[400px] rounded-full blur-[120px] opacity-20"
            style={{ background: "radial-gradient(circle, rgb(var(--gcg-accent)) 0%, transparent 70%)" }} />
        </div>

        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-widest mb-6"
          style={{ background: "rgb(var(--gcg-accent) /0.1)", border: "1px solid rgb(var(--gcg-accent) /0.35)", color: "rgb(var(--gcg-light))" }}>
          <span className="w-1.5 h-1.5 rounded-full animate-pulse" style={{ background: "rgb(var(--gcg-light))" }}></span>
          Keep Coding · Stay Curious
        </div>

        <h1 className="text-5xl md:text-7xl font-black mb-6 leading-tight">
          Welcome to<br className="hidden md:block" />
          <span style={{ background: "linear-gradient(90deg, rgb(var(--gcg-accent)) 0%, rgb(var(--gcg-light)) 50%, rgb(var(--gcg-accent)) 100%)", backgroundSize: "200% auto", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", backgroundClip: "text" }}>
            GLA CODING GROUP
          </span>
        </h1>

        <p className="text-lg md:text-xl max-w-2xl mx-auto leading-relaxed mb-10" style={{ color: "rgb(var(--gcg-light) /0.65)" }}>
          The coding community of{" "}
          <span className="font-semibold" style={{ color: "rgb(var(--gcg-light))" }}>GLA University</span>.{" "}
          Learn, build, and grow with resources, mentorship, and competitions designed to shape world-class programmers.
        </p>
      </div>

      {/* ── About Cards ── */}
      <div className="grid md:grid-cols-2 gap-6 mb-20">
        <GlassCard className="p-8">
          <div className="w-12 h-12 rounded-xl flex items-center justify-center mb-5"
            style={{ background: "linear-gradient(135deg, rgb(var(--gcg-accent) /0.3), rgb(var(--gcg-mid) /0.5))", border: "1px solid rgb(var(--gcg-accent) /0.4)" }}>
            <BookOpen className="w-6 h-6" style={{ color: "rgb(var(--gcg-light))" }} />
          </div>
          <h3 className="text-xl font-bold mb-3 text-white">About This Website</h3>
          <p style={{ color: "rgb(var(--gcg-light) /0.65)", lineHeight: "1.8" }}>
            Your one-stop hub for coding enthusiasts at GLA. Access curated tutorials,
            articles, video lessons, projects, and coding challenges — all designed to
            boost your skills and help you shine in the tech world.
          </p>
        </GlassCard>

        <GlassCard className="p-8">
          <div className="w-12 h-12 rounded-xl flex items-center justify-center mb-5"
            style={{ background: "linear-gradient(135deg, rgb(var(--gcg-light) /0.15), rgb(var(--gcg-accent) /0.3))", border: "1px solid rgb(var(--gcg-light) /0.25)" }}>
            <Globe className="w-6 h-6" style={{ color: "rgb(var(--gcg-light))" }} />
          </div>
          <h3 className="text-xl font-bold mb-3 text-white">About GLA University</h3>
          <p style={{ color: "rgb(var(--gcg-light) /0.65)", lineHeight: "1.8" }}>
            GLA University, Mathura, is a{" "}
            <span className="font-semibold text-white">NAAC A+ accredited</span> institution
            known for academic excellence. With world-class infrastructure and a thriving
            tech culture, GLA nurtures innovation and career success.
          </p>
        </GlassCard>
      </div>

      {/* ── Why Join ── */}
      <div className="mb-4">
        <div className="flex items-center gap-5 mb-10">
          <div className="flex-1 h-px" style={{ background: "linear-gradient(90deg, transparent, rgb(var(--gcg-accent) /0.4))" }} />
          <h2 className="text-3xl md:text-4xl font-extrabold whitespace-nowrap">
            Why Join{" "}
            <span style={{ background: "linear-gradient(90deg, rgb(var(--gcg-accent)), rgb(var(--gcg-light)))", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", backgroundClip: "text" }}>
              GCG?
            </span>
          </h2>
          <div className="flex-1 h-px" style={{ background: "linear-gradient(90deg, rgb(var(--gcg-accent) /0.4), transparent)" }} />
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5">
          {features.map((item, i) => (
            <GlassCard key={i} className="p-6">
              <div className="w-10 h-10 rounded-xl flex items-center justify-center mb-4"
                style={{ background: "linear-gradient(135deg, rgb(var(--gcg-accent) /0.25), rgb(var(--gcg-mid) /0.45))", border: "1px solid rgb(var(--gcg-accent) /0.35)" }}>
                <span style={{ color: "rgb(var(--gcg-light))" }}>{item.icon}</span>
              </div>
              <h4 className="text-base font-bold mb-2 text-white">{item.title}</h4>
              <p className="text-sm leading-relaxed" style={{ color: "rgb(var(--gcg-light) /0.6)" }}>{item.desc}</p>
            </GlassCard>
          ))}
        </div>
      </div>

    </section>
  );
}
