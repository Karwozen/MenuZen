import { ShoppingBag, DollarSign, Users, ArrowUpRight } from "lucide-react";

export default function DashboardHome() {
  const stats = [
    {
      title: "Total de Pedidos",
      value: "42",
      change: "+12.5%",
      isPositive: true,
      icon: ShoppingBag,
    },
    {
      title: "Faturamento",
      value: "R$ 1.250,00",
      change: "+24.3%",
      isPositive: true,
      icon: DollarSign,
    },
    {
      title: "Novos Clientes",
      value: "8",
      change: "+2.1%",
      isPositive: true,
      icon: Users,
    },
  ];

  return (
    <div className="max-w-6xl mx-auto space-y-8">
      <div>
        <h1 className="text-2xl font-bold text-white tracking-tight">Resumo de Hoje</h1>
        <p className="text-sm text-slate-400 mt-1">Acompanhe o desempenho do seu restaurante em tempo real.</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {stats.map((stat) => (
          <div key={stat.title} className="glass-card p-6">
            <div className="flex items-center justify-between">
              <div className="bg-white/5 p-3 rounded-xl border border-white/5">
                <stat.icon className="h-5 w-5 text-indigo-400" />
              </div>
              <div className="flex items-center gap-1 text-emerald-400 text-xs font-semibold bg-emerald-400/10 px-2 py-1 rounded-md border border-emerald-400/20">
                <ArrowUpRight className="h-3 w-3" />
                {stat.change}
              </div>
            </div>
            
            <div className="mt-6">
              <p className="text-sm font-medium text-slate-400">{stat.title}</p>
              <h2 className="text-3xl font-bold tracking-tight text-white mt-1">{stat.value}</h2>
            </div>
          </div>
        ))}
      </div>

      {/* Placeholder for Chart or Recent Orders */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mt-8">
        <div className="lg:col-span-2 glass-card p-6 min-h-[400px] flex flex-col">
          <h3 className="text-lg font-semibold text-white">Desempenho Vendas vs Robô IA</h3>
          <div className="flex-1 flex items-center justify-center border-2 border-dashed border-white/10 rounded-xl mt-4 bg-white/[0.01]">
            <p className="text-slate-500 text-sm">Espaço para o Gráfico de Área</p>
          </div>
        </div>

        <div className="glass-card p-6 min-h-[400px] flex flex-col">
          <h3 className="text-lg font-semibold text-white">Últimos Pedidos</h3>
          <div className="flex-1 flex flex-col gap-3 mt-4">
            {[...Array(5)].map((_, i) => {
              // Deterministic fake value instead of Math.random
              const fakeValue = 20 + (i * 15) % 80;
              return (
                <div key={i} className="flex items-center justify-between border-b border-white/5 pb-3 last:border-0 last:pb-0">
                  <div>
                    <p className="text-sm font-medium text-slate-300">Pedido #{1024 + i}</p>
                    <p className="text-xs text-slate-500">12 min atrás</p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-bold text-emerald-400">R$ {fakeValue},00</p>
                    <span className="text-[10px] font-medium uppercase tracking-wider text-indigo-300 bg-indigo-500/10 px-2 py-0.5 rounded-full border border-indigo-500/20">Novo</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
