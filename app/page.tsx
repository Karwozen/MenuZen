import { Header } from "@/components/header";
import { Hero } from "@/components/hero";
import { SocialProof } from "@/components/social-proof";
import { Features } from "@/components/features";
import { Pricing } from "@/components/pricing";
import { PreRegisterForm } from "@/components/pre-register-form";
import { Footer } from "@/components/footer";

export default function LandingPage() {
  return (
    <div className="min-h-screen flex flex-col font-sans">
      <Header />
      <main className="flex-1">
        <Hero />
        <SocialProof />
        <Features />
        <Pricing />
        <PreRegisterForm />
      </main>
      <Footer />
    </div>
  );
}
