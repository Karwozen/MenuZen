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
      <div className="fixed inset-0 opacity-[0.02] bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] mix-blend-overlay pointer-events-none z-0"></div>

      {/* Premium FoodTech Background */}
      <div className="fixed inset-0 z-0 bg-[url('https://images.unsplash.com/photo-1574071318508-1cdbab80d002?q=80&w=2000&auto=format&fit=crop')] bg-cover bg-center opacity-15 blur-[8px] grayscale-[30%] pointer-events-none"></div>
      <div className="fixed inset-0 z-0 bg-gradient-to-b from-[#0a0400]/60 via-[#0a0400]/80 to-[#0a0400] pointer-events-none"></div>

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
