import Link from "next/link";
import { ArrowRight, BotMessageSquare, QrCode } from "lucide-react";

export function Hero() {
  return (
    <section className="relative overflow-hidden pt-24 pb-32">

      <div className="container mx-auto px-4 md:px-6 text-center">
        <div className="inline-flex items-center px-3 py-1 bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-semibold mb-8 rounded-full uppercase tracking-wider">
          <span className="flex h-2 w-2 rounded-full bg-emerald-500 mr-2 animate-pulse"></span>
          A Revolução do Atendimento Chegou
        </div>
        
        <h1 className="mx-auto max-w-4xl text-4xl font-extrabold tracking-tight sm:text-5xl md:text-6xl lg:text-7xl bg-clip-text text-transparent bg-gradient-to-r from-white to-slate-400 pb-2">
          Atendimento com <span className="text-emerald-400">Inteligência Artificial</span> para Restaurantes
        </h1>
        
        <p className="mx-auto mt-6 max-w-2xl text-lg leading-8 text-slate-400">
          Digitalize seu cardápio, automatize pedidos via WhatsApp com IA e gerencie seu salão de forma eficiente. O MenuZen trabalha por você 24h por dia.
        </p>
        
        <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4">
          <Link 
            href="#pre-cadastro"
            className="w-full sm:w-auto inline-flex h-12 items-center justify-center btn-primary rounded-lg px-8 text-base font-bold shadow-lg shadow-emerald-500/20"
          >
            Criar Conta Grátis
            <ArrowRight className="ml-2 h-4 w-4" />
          </Link>
          <Link 
            href="#funcionalidades"
            className="w-full sm:w-auto inline-flex h-12 items-center justify-center btn-glass rounded-lg px-8 text-base font-bold"
          >
            Ver Funcionalidades
          </Link>
        </div>

        <div className="mt-20 grid grid-cols-2 gap-8 md:grid-cols-4 max-w-4xl mx-auto pt-8 border-t border-white/10">
          <div className="flex flex-col items-center gap-2">
            <h3 className="text-3xl font-bold text-white">+40%</h3>
            <p className="text-sm text-slate-400 text-center">Agilidade no atendimento</p>
          </div>
          <div className="flex flex-col items-center gap-2">
            <h3 className="text-3xl font-bold text-white">24/7</h3>
            <p className="text-sm text-slate-400 text-center">IA vendendo por você</p>
          </div>
          <div className="flex flex-col items-center gap-2">
            <h3 className="text-3xl font-bold text-white">Zero</h3>
            <p className="text-sm text-slate-400 text-center">Taxas sobre pedidos</p>
          </div>
          <div className="flex flex-col items-center gap-2">
            <h3 className="text-3xl font-bold text-white">100%</h3>
            <p className="text-sm text-slate-400 text-center">Integrado ao PDV</p>
          </div>
        </div>
      </div>
    </section>
  );
}
