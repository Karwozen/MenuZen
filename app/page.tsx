import { Header } from "@/components/header";
import { Hero } from "@/components/hero";
import { SocialProof } from "@/components/social-proof";
import { Features } from "@/components/features";
import { Strategy } from "@/components/strategy";
import { Pricing } from "@/components/pricing";
import { PreRegisterForm } from "@/components/pre-register-form";
import { Footer } from "@/components/footer";

export default function LandingPage() {
  return (
    <div className="min-h-screen flex flex-col font-sans bg-[#0a0400] text-white relative overflow-hidden">
      {/* Global Background Effects */}
      <div className="fixed top-[-10%] left-[-10%] w-[500px] h-[500px] bg-red-600/10 rounded-full blur-[120px] animate-pulse pointer-events-none z-0" style={{ animationDuration: '4000ms' }}></div>
      <div className="fixed top-[40%] right-[-10%] w-[600px] h-[600px] bg-orange-600/10 rounded-full blur-[150px] animate-pulse pointer-events-none z-0" style={{ animationDuration: '5000ms' }}></div>
      <div className="fixed bottom-[-10%] left-[20%] w-[400px] h-[400px] bg-amber-500/10 rounded-full blur-[120px] animate-pulse pointer-events-none z-0" style={{ animationDuration: '6000ms' }}></div>
      
      {/* Forno de Tijolos com Lenha (Animado, Esmaecido e Fixo) */}
      <div 
        className="fixed inset-0 z-0 bg-cover bg-center pointer-events-none animate-oven-fire"
        style={{ backgroundImage: "url('https://images.unsplash.com/photo-1590947132387-155cc02f3212?q=80&w=2400&auto=format&fit=crop')" }}
      ></div>
      <div className="fixed inset-0 z-0 bg-gradient-to-b from-[#0a0400]/60 via-[#0a0400]/80 to-[#0a0400] pointer-events-none"></div>

      {/* Floating Embers (10 Fagulhas) */}
      <div className="fixed inset-0 z-0 overflow-hidden pointer-events-none">
        <div className="absolute w-2 h-2 bg-orange-400 rounded-full blur-[1px] shadow-[0_0_10px_#f97316] animate-[rise-embers_8s_linear_infinite] left-[10%]" style={{animationDelay: '0s', animationDuration: '7s'}}></div>
        <div className="absolute w-3 h-3 bg-red-500 rounded-full blur-[2px] shadow-[0_0_15px_#ef4444] animate-[rise-embers_12s_linear_infinite] left-[25%]" style={{animationDelay: '2s', animationDuration: '9s'}}></div>
        <div className="absolute w-1.5 h-1.5 bg-amber-300 rounded-full shadow-[0_0_8px_#fcd34d] animate-[rise-embers_6s_linear_infinite] left-[40%]" style={{animationDelay: '4s', animationDuration: '6s'}}></div>
        <div className="absolute w-2 h-2 bg-orange-500 rounded-full blur-[1px] shadow-[0_0_12px_#f97316] animate-[rise-embers_8s_linear_infinite] left-[55%]" style={{animationDelay: '1s', animationDuration: '10s'}}></div>
        <div className="absolute w-1 h-1 bg-yellow-400 rounded-full shadow-[0_0_5px_#eab308] animate-[rise-embers_6s_linear_infinite] left-[70%]" style={{animationDelay: '3s', animationDuration: '8s'}}></div>
        <div className="absolute w-2.5 h-2.5 bg-red-400 rounded-full blur-[1px] shadow-[0_0_15px_#ef4444] animate-[rise-embers_10s_linear_infinite] left-[85%]" style={{animationDelay: '5s', animationDuration: '11s'}}></div>
        <div className="absolute w-3 h-3 bg-orange-600 rounded-full blur-[2px] shadow-[0_0_20px_#ea580c] animate-[rise-embers_12s_linear_infinite] left-[15%]" style={{animationDelay: '6s', animationDuration: '12s'}}></div>
        <div className="absolute w-1.5 h-1.5 bg-amber-500 rounded-full shadow-[0_0_10px_#f59e0b] animate-[rise-embers_8s_linear_infinite] left-[80%]" style={{animationDelay: '2.5s', animationDuration: '7.5s'}}></div>
        <div className="absolute w-2 h-2 bg-red-500 rounded-full blur-[1px] shadow-[0_0_15px_#ef4444] animate-[rise-embers_10s_linear_infinite] left-[45%]" style={{animationDelay: '7s', animationDuration: '9.5s'}}></div>
        <div className="absolute w-2 h-2 bg-orange-300 rounded-full blur-[1px] shadow-[0_0_12px_#fdba74] animate-[rise-embers_10s_linear_infinite] left-[95%]" style={{animationDelay: '1.5s', animationDuration: '8.5s'}}></div>
      </div>

      <div className="relative z-10 flex flex-col min-h-screen">
        <Header />
        <main className="flex-1">
          <Hero />
          <SocialProof />
          <Features />
          <Strategy />
          <Pricing />
          <PreRegisterForm />
        </main>
        <Footer />
      </div>
    </div>
  );
}
