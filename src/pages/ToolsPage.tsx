import { useNavigate } from "react-router-dom";
import { ArrowLeft, Stethoscope, Leaf, Crown, Presentation, Workflow, Palette, Languages, Music } from "lucide-react";

const tools = [
  { id: "health", name: "Sorix Health", desc: "AI health analysis assistant", icon: Stethoscope, route: "/health", gradient: "from-emerald-500 to-teal-500", free: true },
  { id: "agro", name: "Sorix Agro", desc: "AI agriculture advisor", icon: Leaf, route: "/agro", gradient: "from-green-500 to-lime-500", free: true },
  { id: "legends", name: "Sorix Legends", desc: "Chat with historical legends", icon: Crown, route: "/legends", gradient: "from-blue-500 to-cyan-500", free: false },
  { id: "deck", name: "Sorix Deck", desc: "AI presentation generator", icon: Presentation, route: "/deck", gradient: "from-cyan-500 to-blue-500", free: false },
  { id: "flowbuilder", name: "Sorix FlowBuilder", desc: "AI flowchart & diagram builder", icon: Workflow, route: "/flowbuilder", gradient: "from-violet-500 to-purple-500", free: false },
  { id: "imagine", name: "Sorix Imagine", desc: "AI image generation & editing", icon: Palette, route: "/imagine", gradient: "from-cyan-500 to-blue-500", free: false },
];

const comingSoon = [
  { name: "Sorix Translate", desc: "AI translation tool", icon: Languages, gradient: "from-pink-500 to-rose-500" },
  { name: "Sorix Music", desc: "AI music generator", icon: Music, gradient: "from-amber-500 to-yellow-500" },
];

const ToolsPage = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-background text-foreground">
      {/* Header */}
      <div className="sticky top-0 z-10 bg-background/80 backdrop-blur-lg border-b border-border">
        <div className="max-w-5xl mx-auto px-4 py-4 flex items-center gap-3">
          <button onClick={() => navigate("/chat")} className="w-9 h-9 rounded-lg flex items-center justify-center hover:bg-muted transition-colors">
            <ArrowLeft className="w-5 h-5" />
          </button>
          <h1 className="text-xl font-bold">Sorix Tools</h1>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-4 py-8 space-y-10">
        {/* Active Tools */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {tools.map((tool) => (
            <button
              key={tool.id}
              onClick={() => navigate(tool.route)}
              className="group relative flex items-start gap-4 p-5 rounded-2xl border border-border bg-card hover:border-primary/40 hover:shadow-lg hover:shadow-primary/5 transition-all text-left"
            >
              <div className={`shrink-0 w-11 h-11 rounded-xl bg-gradient-to-br ${tool.gradient} flex items-center justify-center shadow-md`}>
                <tool.icon className="w-5 h-5 text-white" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <span className="font-semibold text-sm">{tool.name}</span>
                  {tool.free && (
                    <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-emerald-500/15 text-emerald-500">FREE</span>
                  )}
                </div>
                <p className="text-xs text-muted-foreground mt-1">{tool.desc}</p>
              </div>
            </button>
          ))}
        </div>

        {/* Coming Soon */}
        <div>
          <h2 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider mb-4">More Tools Coming Soon</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {comingSoon.map((tool) => (
              <div
                key={tool.name}
                className="relative flex items-start gap-4 p-5 rounded-2xl border border-border/50 bg-card/50 opacity-60 cursor-default"
              >
                <div className={`shrink-0 w-11 h-11 rounded-xl bg-gradient-to-br ${tool.gradient} flex items-center justify-center shadow-md opacity-50`}>
                  <tool.icon className="w-5 h-5 text-white" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="font-semibold text-sm">{tool.name}</span>
                    <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-muted text-muted-foreground">COMING SOON</span>
                  </div>
                  <p className="text-xs text-muted-foreground mt-1">{tool.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ToolsPage;
