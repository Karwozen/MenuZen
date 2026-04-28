"use client";

import { useState } from "react";
import { Check } from "lucide-react";
import { clsx } from "clsx";
import Link from "next/link";

export function Pricing() {
  const [annual, setAnnual] = useState(false);

  const plans = [
    {
      name: "Iniciante",
      description: "Para testar a conversão sem gastar nada.",
      monthlyPrice: 0,
      annualPrice: 0,
      popular: false,
      features: [
        "Até 30 produtos",
        "Link Personalizado",
        "Pedidos no WhatsApp",
        "Painel de Gerenciamento"
      ]
    },
    {
      name: "Profissional",
      description: "O mais escolhido. Automação completa para turbinar vendas.",
      monthlyPrice: 49.90,
      annualPrice: 39.90,
      popular: true,
      features: [
        "Produtos Ilimitados",
        "Temas e Cores Premium",
        "Gerador de QR Code",
        "Logo do Restaurante",
        "Mesas/Comandas Temporárias"
      ]
    },
    {
      name: "VIP",
      description: "Para redes e restaurantes de alto volume.",
      monthlyPrice: 99.90,
      annualPrice: 79.90,
      popular: false,
      features: [
        "Tudo do plano Profissional",
        "Fura-fila no Suporte VIP",
        "Mentoria de Vendas",
        "Relatórios Avançados Customizados"
      ]
    }
  ];

  return (
    <section id="precos" className="py-32 relative">
      <div className="container mx-auto px-4 md:px-6">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h2 className="text-4xl font-black tracking-tight text-white sm:text-5xl">
            Invista no crescimento, <br className="hidden sm:block" />não em taxas.
          </h2>
          <p className="mt-6 text-lg text-slate-400 font-light">
            Pare de perder margem com aplicativos de delivery. Assinaturas transparentes, sem pegadinhas e com 7 dias grátis.
          </p>

          <div className="mt-10 flex items-center justify-center gap-4">
            <span className={clsx("text-sm font-medium transition-colors", !annual ? "text-white" : "text-slate-500")}>Mensal</span>
            <button
              onClick={() => setAnnual(!annual)}
              className="relative inline-flex h-7 w-12 items-center rounded-full bg-white/10 border border-white/10 transition-colors focus:outline-none hover:bg-white/20"
            >
              <span 
                className={clsx(
                  "inline-block h-5 w-5 transform rounded-full bg-indigo-500 transition-transform shadow-md",
                  annual ? "translate-x-6 bg-indigo-400" : "translate-x-1"
                )}
              />
            </button>
            <span className={clsx("text-sm font-medium transition-colors flex items-center gap-2", annual ? "text-white" : "text-slate-500")}>
              Anual <span className="text-indigo-300 font-bold text-[10px] bg-indigo-500/20 border border-indigo-500/30 py-0.5 px-2 rounded-full tracking-wide">2 MESES OFF</span>
            </span>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8 max-w-6xl mx-auto">
          {plans.map((plan, index) => (
            <div 
              key={index}
              className={clsx(
                "relative flex flex-col p-8 lg:p-10 glass-card",
                plan.popular && "border-indigo-500/40 shadow-2xl shadow-indigo-500/10 md:-translate-y-4 md:hover:-translate-y-4"
              )}
            >
              {plan.popular && (
                <div className="absolute -top-4 left-0 right-0 mx-auto w-36 rounded-full bg-gradient-to-r from-indigo-500 to-purple-500 px-3 py-1.5 text-center text-xs font-bold tracking-wider text-white shadow-lg shadow-indigo-500/20">
                  MAIS ESCOLHIDO
                </div>
              )}

              <div className="mb-8">
                <h3 className="text-2xl font-bold text-white tracking-tight">
                  {plan.name}
                </h3>
                <p className="mt-3 text-sm text-slate-400 leading-relaxed">
                  {plan.description}
                </p>
              </div>

              <div className="mb-8 flex items-baseline text-white">
                <span className="text-2xl font-bold mr-1 text-slate-500">R$</span>
                <span className="text-5xl font-black tracking-tighter">
                  {new Intl.NumberFormat('pt-BR', { minimumFractionDigits: 2 }).format(annual ? plan.annualPrice : plan.monthlyPrice)}
                </span>
                <span className="ml-2 text-sm font-medium text-slate-500">/mês</span>
              </div>

              <ul className="flex-1 space-y-4 mb-10 text-sm">
                {plan.features.map((feature, idx) => (
                  <li key={idx} className="flex gap-4 items-start">
                    <Check className="h-5 w-5 shrink-0 text-indigo-400" />
                    <span className="text-slate-300">{feature}</span>
                  </li>
                ))}
              </ul>

              <Link 
                href="/register"
                className={clsx(
                  "mt-auto block w-full text-center text-sm font-bold py-3.5 px-6 rounded-xl transition-all",
                  plan.popular ? "btn-primary shadow-xl shadow-indigo-500/20" : "btn-glass text-white"
                )}
              >
                Começar 7 Dias Grátis
              </Link>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
