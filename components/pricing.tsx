"use client";

import { useState } from "react";
import { Check } from "lucide-react";
import { clsx } from "clsx";

export function Pricing() {
  const [annual, setAnnual] = useState(false);

  const plans = [
    {
      name: "Básico",
      description: "Perfeito para negócios locais começando a digitalizar.",
      monthlyPrice: 97,
      annualPrice: 87,
      popular: false,
      features: [
        "Cardápio Digital Ilimitado",
        "Pedidos via Link (Sem IA)",
        "Painel de Gerenciamento",
        "Suporte por Email",
        "Até 30 Mesas/Comandas"
      ]
    },
    {
      name: "Pro",
      description: "O mais escolhido. Automação completa para turbinar vendas.",
      monthlyPrice: 197,
      annualPrice: 167,
      popular: true,
      features: [
        "Tudo do plano Básico",
        "Robô de WhatsApp com Inteligência Artificial",
        "Agendamento de Mensagens",
        "PDV Frente de Caixa",
        "Suporte Prioritário WhatsApp",
        "Mesas/Comandas Ilimitadas"
      ]
    },
    {
      name: "Enterprise",
      description: "Para redes e restaurantes de alto volume.",
      monthlyPrice: "Custom",
      annualPrice: "Custom",
      popular: false,
      features: [
        "Tudo do plano Pro",
        "Múltiplas Lojas/Franquias",
        "Integração com ERP",
        "Relatórios Avançados",
        "Gerente de Conta Dedicado"
      ]
    }
  ];

  return (
    <section id="precos" className="py-24 relative">
      <div className="container mx-auto px-4 md:px-6">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h2 className="text-3xl font-bold tracking-tight text-white sm:text-4xl">
            Preços simples e transparentes
          </h2>
          <p className="mt-4 text-lg text-slate-400">
            Sem taxas escondidas. Sem comissão sobre seus pedidos. Comece com 7 dias grátis.
          </p>

          <div className="mt-8 flex items-center justify-center gap-3">
            <span className={clsx("text-sm font-medium", !annual ? "text-white" : "text-slate-500")}>Mensal</span>
            <button
              onClick={() => setAnnual(!annual)}
              className="relative inline-flex h-6 w-11 items-center rounded-full bg-emerald-500 transition-colors focus:outline-none"
            >
              <span 
                className={clsx(
                  "inline-block h-4 w-4 transform rounded-full bg-white transition-transform",
                  annual ? "translate-x-6" : "translate-x-1"
                )}
              />
            </button>
            <span className={clsx("text-sm font-medium", annual ? "text-white" : "text-slate-500")}>
              Anual <span className="text-emerald-400 font-bold ml-1 text-xs bg-emerald-500/10 border border-emerald-500/20 py-0.5 px-2 rounded-full">-15%</span>
            </span>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {plans.map((plan, index) => (
            <div 
              key={index}
              className={clsx(
                "relative flex flex-col p-8 glass",
                plan.popular && "border-emerald-500/50 shadow-2xl shadow-emerald-500/10"
              )}
            >
              {plan.popular && (
                <div className="absolute -top-4 left-0 right-0 mx-auto w-32 rounded-full bg-gradient-to-r from-emerald-500 to-emerald-600 px-3 py-1 text-center text-xs font-semibold text-white shadow-lg shadow-emerald-500/20">
                  Mais Popular
                </div>
              )}

              <div className="mb-6">
                <h3 className="text-xl font-semibold text-white">
                  {plan.name}
                </h3>
                <p className="mt-2 text-sm text-slate-400">
                  {plan.description}
                </p>
              </div>

              <div className="mb-6 flex items-baseline text-5xl font-extrabold tracking-tight text-white">
                {plan.monthlyPrice === "Custom" ? (
                  <span className="text-4xl">Sob Consulta</span>
                ) : (
                  <>
                    <span className="text-3xl font-semibold mr-1 text-slate-300">R$</span>
                    <span>
                      {annual ? plan.annualPrice : plan.monthlyPrice}
                    </span>
                    <span className="ml-1 text-xl font-medium text-slate-500">/mês</span>
                  </>
                )}
              </div>

              <ul className="flex-1 space-y-4 mb-8 text-sm">
                {plan.features.map((feature, idx) => (
                  <li key={idx} className="flex gap-3 items-start">
                    <Check className="h-5 w-5 shrink-0 text-emerald-400" />
                    <span className="text-slate-300">{feature}</span>
                  </li>
                ))}
              </ul>

              <a 
                href="#pre-cadastro"
                className={clsx(
                  "mt-auto block w-full text-center text-sm font-bold py-3 px-6 rounded-lg",
                  plan.popular ? "btn-primary shadow-lg shadow-emerald-500/20" : "btn-glass text-white"
                )}
              >
                {plan.monthlyPrice === "Custom" ? "Falar com Vendas" : "Começar o Teste"}
              </a>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
