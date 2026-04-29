import Link from "next/link";
import { ArrowRight, Play, BarChart3, Users, MessageCircle, Settings, LayoutDashboard } from "lucide-react";

export function Hero() {
  return (
    <section className="relative overflow-hidden">
      <div className="relative z-10 flex flex-col items-center pt-20 pb-16 gap-16">
        <div className="container mx-auto px-4 text-center">
          <div className="inline-flex items-center px-4 py-1.5 bg-orange-500/10 border border-orange-500/20 text-orange-400 text-xs font-semibold mb-8 rounded-full uppercase tracking-widest backdrop-blur-sm">
            <span className="flex h-2 w-2 rounded-full bg-orange-500 mr-2 animate-pulse"></span>
            A Revolução do Delivery Independente
          </div>
          
          <h1 className="mx-auto max-w-5xl text-5xl font-black tracking-tight sm:text-6xl md:text-7xl text-white drop-shadow-lg pb-4">
            Liberte seu restaurante das <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-400 to-red-500 pb-2">taxas abusivas</span>.<br className="hidden md:block" /> Tenha seu aplicativo próprio.
          </h1>
          
          <p className="mx-auto mt-6 max-w-2xl text-lg md:text-xl text-slate-400 leading-relaxed font-light">
            Pare de deixar 27% do seu lucro nos aplicativos de delivery. Crie seu cardápio digital, receba pedidos direto no seu WhatsApp e construa a sua própria base de clientes fiéis.
          </p>
          
          <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link 
              href="/register"
              className="w-full sm:w-auto inline-flex h-12 items-center justify-center rounded-xl px-8 text-base font-bold transition-all duration-300 hover:scale-105 bg-gradient-to-r from-orange-500 to-red-600 hover:from-orange-400 hover:to-red-500 text-white shadow-[0_0_30px_rgba(249,115,22,0.4)] hover:shadow-[0_0_50px_rgba(249,115,22,0.7)] border border-orange-400/50"
            >
              Criar Meu Cardápio Grátis
              <ArrowRight className="ml-2 h-5 w-5" />
            </Link>
            <Link 
              href="#demo"
              className="w-full sm:w-auto inline-flex h-12 items-center justify-center btn-glass rounded-xl px-8 text-base font-bold gap-2"
            >
              <Play className="w-4 h-4 fill-current" />
              Ver Demonstração
            </Link>
          </div>
        </div>

        {/* Dashboard Preview Component simulating UI */}
        <div className="container mx-auto px-4 pointer-events-none select-none relative pb-10 w-full">
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[80%] h-[80%] bg-orange-600/20 blur-[120px] z-0 rounded-full" />
          <div className="relative z-10 mx-auto max-w-5xl">
            <div className="relative rounded-t-2xl bg-[#0a0400]/80 backdrop-blur-2xl overflow-hidden animate-float-3d shadow-[-30px_40px_100px_rgba(234,88,12,0.25)] border-l-[3px] border-b-[4px] border-white/20 border-r border-r-white/5 border-t border-t-white/10">
          
          <div className="flex h-12 items-center gap-2 border-b border-white/5 bg-white/[0.02] px-4">
            <div className="flex gap-1.5">
              <div className="h-3 w-3 rounded-full bg-rose-500/40"></div>
              <div className="h-3 w-3 rounded-full bg-amber-500/40"></div>
              <div className="h-3 w-3 rounded-full bg-emerald-500/40"></div>
            </div>
            <div className="flex-1 flex justify-center">
              <div className="h-6 w-48 bg-white/5 rounded-md flex items-center justify-center border border-white/5">
                <span className="text-[10px] text-slate-500 font-medium">menuzen.app/dashboard</span>
              </div>
            </div>
          </div>
          
          {/* Internal Mock App */}
          <div className="flex h-[400px] md:h-[500px] w-full">
            {/* Mock Sidebar */}
            <div className="hidden md:flex flex-col w-64 border-r border-white/5 p-4 gap-4">
              <div className="flex items-center gap-3 px-2 mb-4">
                <div className="h-8 w-8 rounded-lg bg-orange-500/20 border border-orange-500/30 flex items-center justify-center">
                  <LayoutDashboard className="w-4 h-4 text-orange-400" />
                </div>
                <div className="h-4 w-24 bg-white/10 rounded"></div>
              </div>
              {[...Array(5)].map((_, i) => (
                <div key={i} className={`h-10 rounded-lg flex items-center px-4 gap-3 ${i === 0 ? 'bg-orange-500/10 text-orange-400 border border-orange-500/20' : 'text-slate-500 border border-transparent'}`}>
                  {i === 0 && <BarChart3 className="w-4 h-4" />}
                  {i === 1 && <MessageCircle className="w-4 h-4" />}
                  {i === 2 && <Users className="w-4 h-4" />}
                  {i === 3 && <Settings className="w-4 h-4" />}
                  {i === 4 && <LayoutDashboard className="w-4 h-4" />}
                  <div className={`h-2.5 rounded-sm ${i === 0 ? 'w-16 bg-orange-400/50' : 'w-20 bg-white/10'}`}></div>
                </div>
              ))}
            </div>
            {/* Mock Content area */}
            <div className="flex-1 p-6 md:p-8 overflow-hidden flex flex-col gap-6 bg-white/[0.01]">
              <div className="flex justify-between items-center">
                <div className="space-y-3">
                  <div className="h-6 w-32 bg-white/10 rounded-md"></div>
                  <div className="h-4 w-48 bg-white/5 rounded-md"></div>
                </div>
                <div className="h-10 w-32 bg-orange-500/20 border border-orange-500/30 rounded-lg flex items-center justify-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-orange-400"></div>
                  <div className="h-3 w-16 bg-orange-400/50 rounded flex-shrink-0"></div>
                </div>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                {[...Array(3)].map((_, i) => (
                  <div key={i} className="h-32 rounded-xl bg-white/5 border border-white/5 p-5 flex flex-col justify-between">
                     <div className="flex justify-between items-start">
                        <div className="h-4 w-20 bg-white/10 rounded"></div>
                        <div className="h-8 w-8 bg-white/5 rounded-full"></div>
                     </div>
                     <div className="h-8 w-1/2 bg-white/20 rounded"></div>
                  </div>
                ))}
              </div>
              <div className="flex-1 rounded-xl bg-white/5 border border-white/5 mt-2 flex flex-col p-5">
                <div className="h-4 w-32 bg-white/10 rounded mb-6"></div>
                <div className="flex-1 border-b border-white/5 flex gap-4 items-end pb-4 h-full">
                  {[...Array(12)].map((_, idx) => {
                    const fakeHeight = Math.max(20, (idx * 37) % 100);
                    return (
                      <div key={idx} className="flex-1 bg-gradient-to-t from-orange-500/40 to-orange-500/10 rounded-t-sm" style={{ height: `${fakeHeight}%` }}></div>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>
          </div>
          </div>

          {/* Fade out bottom to blend with background */}
          <div className="absolute bottom-0 left-0 right-0 h-40 bg-gradient-to-t from-[#0a0400] to-transparent pointer-events-none"></div>
        </div>
      </div>
    </section>
  );
}
