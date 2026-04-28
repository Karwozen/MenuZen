"use client";

import { useState } from "react";
import { CheckCircle2, Loader2, ArrowRight } from "lucide-react";

export function PreRegisterForm() {
  const [status, setStatus] = useState<"idle" | "submitting" | "success">("idle");
  const [formData, setFormData] = useState({
    restaurantName: "",
    name: "",
    email: "",
    whatsapp: "",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus("submitting");
    
    // Simulating API call before Supabase integration
    await new Promise((resolve) => setTimeout(resolve, 1500));
    
    setStatus("success");
    setFormData({
      restaurantName: "",
      name: "",
      email: "",
      whatsapp: "",
    });
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  return (
    <section id="pre-cadastro" className="py-32 relative overflow-hidden">
      <div className="absolute inset-0 bg-orange-900/10 backdrop-blur-3xl -z-10"></div>
      {/* Decorative patterns */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] rounded-full bg-gradient-to-tr from-orange-500/20 to-red-500/20 blur-[120px] -z-10"></div>

      <div className="container mx-auto px-4 md:px-6 relative z-10">
        <div className="grid lg:grid-cols-2 gap-16 items-center max-w-6xl mx-auto">
          
          <div>
            <h2 className="text-4xl font-black tracking-tight text-white md:text-5xl mb-6">
              Pronto para escalar as vendas do seu negócio?
            </h2>
            <p className="text-slate-400 text-lg mb-10 leading-relaxed font-light">
              Faça seu pré-cadastro agora. Crie sua conta gratuitamente e libere seu cardápio digital em menos de 5 minutos, sem cartão de crédito.
            </p>

            <ul className="space-y-6">
              {[
                "Setup simplificado em menos de 5 minutos.",
                "Taxa Zero de comissão por venda efetuada.",
                "7 dias gratuitos com todas as ferramentas Pro."
              ].map((item, i) => (
                <li key={i} className="flex items-start gap-4">
                  <div className="mt-1 bg-orange-500/20 rounded-full p-1 border border-orange-500/30">
                    <CheckCircle2 className="text-orange-400 w-5 h-5" />
                  </div>
                  <span className="text-slate-300 text-lg">{item}</span>
                </li>
              ))}
            </ul>
          </div>

          <div className="glass-card p-8 sm:p-10 shadow-2xl relative">
            {status === "success" ? (
              <div className="text-center py-16 flex flex-col items-center">
                <div className="w-20 h-20 bg-orange-500/10 text-orange-400 rounded-full flex items-center justify-center mb-6 border border-orange-500/20">
                  <CheckCircle2 className="w-10 h-10" />
                </div>
                <h3 className="text-3xl font-black mb-3 text-white tracking-tight">Vaga Garantida!</h3>
                <p className="text-slate-400 text-lg mb-8 leading-relaxed">
                  Recebemos seus dados. Em breve um de nossos consultores entrará em contato para liberar seu acesso.
                </p>
                <button 
                  onClick={() => setStatus("idle")}
                  className="text-orange-400 font-bold hover:text-orange-300 transition-colors inline-flex items-center gap-2"
                >
                  Fazer novo cadastro
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            ) : (
              <>
                <div className="mb-8">
                  <h3 className="text-2xl font-bold text-white mb-2 tracking-tight">Criar Conta</h3>
                  <p className="text-slate-400 text-sm">Preencha os dados abaixo e entraremos em contato.</p>
                </div>
                
                <form onSubmit={handleSubmit} className="space-y-5">
                  <div>
                    <input
                      required
                      type="text"
                      id="restaurantName"
                      name="restaurantName"
                      value={formData.restaurantName}
                      onChange={handleChange}
                      className="w-full bg-[#0a0a0a]/50 border border-white/10 rounded-xl px-4 py-3.5 text-base text-white focus:outline-none focus:border-orange-500/50 focus:ring-1 focus:ring-orange-500/50 placeholder:text-slate-500 transition-all"
                      placeholder="Nome do Restaurante/Delivery"
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                    <div>
                      <input
                        required
                        type="text"
                        id="name"
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        className="w-full bg-[#0a0a0a]/50 border border-white/10 rounded-xl px-4 py-3.5 text-base text-white focus:outline-none focus:border-orange-500/50 focus:ring-1 focus:ring-orange-500/50 placeholder:text-slate-500 transition-all"
                        placeholder="Seu Nome Completo"
                      />
                    </div>
                    <div>
                      <input
                        required
                        type="tel"
                        id="whatsapp"
                        name="whatsapp"
                        value={formData.whatsapp}
                        onChange={handleChange}
                        className="w-full bg-[#0a0a0a]/50 border border-white/10 rounded-xl px-4 py-3.5 text-base text-white focus:outline-none focus:border-orange-500/50 focus:ring-1 focus:ring-orange-500/50 placeholder:text-slate-500 transition-all"
                        placeholder="WhatsApp (DDD)"
                      />
                    </div>
                  </div>

                  <div>
                    <input
                      required
                      type="email"
                      id="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      className="w-full bg-[#0a0a0a]/50 border border-white/10 rounded-xl px-4 py-3.5 text-base text-white focus:outline-none focus:border-orange-500/50 focus:ring-1 focus:ring-orange-500/50 placeholder:text-slate-500 transition-all"
                      placeholder="E-mail Profissional"
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={status === "submitting"}
                    className="w-full mt-4 flex h-14 items-center justify-center bg-gradient-to-r from-orange-500 to-red-600 hover:from-orange-400 hover:to-red-500 rounded-xl px-6 text-base font-bold text-white shadow-[0_0_30px_rgba(249,115,22,0.4)] hover:shadow-[0_0_50px_rgba(249,115,22,0.7)] hover:scale-[1.02] transition-all duration-300 disabled:opacity-70 disabled:cursor-not-allowed border border-orange-400/50"
                  >
                    {status === "submitting" ? (
                      <>
                        <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                        Processando...
                      </>
                    ) : (
                      "Solicitar Acesso Antecipado"
                    )}
                  </button>
                  
                  <p className="text-xs text-center text-slate-500 mt-6 mt-4">
                    Ao continuar, você concorda com nossos <br className="sm:hidden"/> 
                    <a href="#" className="underline hover:text-white transition-colors">Termos de Serviço</a> e <a href="#" className="underline hover:text-white transition-colors">Política de Privacidade</a>.
                  </p>
                </form>
              </>
            )}
          </div>

        </div>
      </div>
    </section>
  );
}
