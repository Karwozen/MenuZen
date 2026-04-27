"use client";

import { useState } from "react";
import { CheckCircle2, Loader2 } from "lucide-react";

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
    <section id="pre-cadastro" className="py-24 relative overflow-hidden">
      <div className="container mx-auto px-4 md:px-6 relative z-10">
        <div className="grid md:grid-cols-2 gap-12 items-center max-w-6xl mx-auto">
          
          <div>
            <h2 className="text-3xl font-extrabold sm:text-4xl mb-4 text-white">
              Pronto para escalar as vendas do seu negócio?
            </h2>
            <p className="text-slate-400 text-lg mb-8">
              Faça seu pré-cadastro agora. Crie sua conta gratuitamente e libere seu cardápio digital em menos de 5 minutos.
            </p>

            <ul className="space-y-4">
              {[
                "Setup em menos de 5 minutos.",
                "Não cobramos comissão por venda.",
                "Testes gratuitos por 7 dias."
              ].map((item, i) => (
                <li key={i} className="flex items-center gap-3">
                  <CheckCircle2 className="text-emerald-500 w-6 h-6" />
                  <span className="text-slate-300 max-w-xs">{item}</span>
                </li>
              ))}
            </ul>
          </div>

          <div className="glass p-8 shadow-2xl">
            {status === "success" ? (
              <div className="text-center py-12 flex flex-col items-center">
                <div className="w-16 h-16 bg-emerald-500/10 text-emerald-500 rounded-full flex items-center justify-center mb-6">
                  <CheckCircle2 className="w-8 h-8" />
                </div>
                <h3 className="text-2xl font-bold mb-2 text-white">Tudo certo!</h3>
                <p className="text-slate-400">
                  Recebemos seus dados. Em breve entraremos em contato para finalizar sua configuração!
                </p>
                <button 
                  onClick={() => setStatus("idle")}
                  className="mt-8 text-emerald-400 font-medium hover:underline"
                >
                  Fazer novo cadastro
                </button>
              </div>
            ) : (
              <>
                <h3 className="text-lg font-bold mb-6 flex items-center gap-2 text-white">
                  <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
                  Pré-cadastro para Acesso Antecipado
                </h3>
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div>
                    <input
                      required
                      type="text"
                      id="restaurantName"
                      name="restaurantName"
                      value={formData.restaurantName}
                      onChange={handleChange}
                      className="w-full bg-slate-900/50 border border-white/10 rounded-md px-3 py-2 text-sm text-white focus:outline-none focus:border-emerald-500/50 placeholder:text-slate-500"
                      placeholder="Nome do Restaurante/Delivery"
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <input
                        required
                        type="text"
                        id="name"
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        className="w-full bg-slate-900/50 border border-white/10 rounded-md px-3 py-2 text-sm text-white focus:outline-none focus:border-emerald-500/50 placeholder:text-slate-500"
                        placeholder="Seu Nome"
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
                        className="w-full bg-slate-900/50 border border-white/10 rounded-md px-3 py-2 text-sm text-white focus:outline-none focus:border-emerald-500/50 placeholder:text-slate-500"
                        placeholder="WhatsApp (com DDD)"
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
                      className="w-full bg-slate-900/50 border border-white/10 rounded-md px-3 py-2 text-sm text-white focus:outline-none focus:border-emerald-500/50 placeholder:text-slate-500"
                      placeholder="E-mail Profissional"
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={status === "submitting"}
                    className="w-full mt-4 flex h-10 items-center justify-center btn-primary rounded-md px-4 text-sm font-bold shadow-lg shadow-emerald-500/20 disabled:opacity-70 disabled:cursor-not-allowed"
                  >
                    {status === "submitting" ? (
                      <>
                        <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                        Enviando...
                      </>
                    ) : (
                      "Reservar Vaga"
                    )}
                  </button>
                  
                  <p className="text-xs text-center text-slate-400 mt-4">
                    Ao continuar, você concorda com nossos Termos de Serviço e Política de Privacidade.
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
