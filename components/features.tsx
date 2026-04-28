import { CircleDollarSign, Users, ShieldCheck, Zap } from "lucide-react";

export function Features() {
  const features = [
    {
      title: "Lucro 100% Seu",
      description: "Vendeu R$ 10.000? Fique com R$ 10.000. Zero comissões por pedido.",
      icon: CircleDollarSign,
    },
    {
      title: "Dono do Seu Cliente",
      description: "Chega de clientes anônimos. Receba o pedido no WhatsApp e crie uma lista de contatos para enviar promoções toda semana.",
      icon: Users,
    },
    {
      title: "Fim da Concorrência Desleal",
      description: "No seu link, só existe a sua marca. Sem banners de outras lanchonetes dando frete grátis na cara do seu cliente.",
      icon: ShieldCheck,
    },
    {
      title: "Dinheiro na Mão",
      description: "Receba na hora via Pix direto na sua conta, sem esperar semanas pelo repasse dos aplicativos.",
      icon: Zap,
    },
  ];

  return (
    <section id="funcionalidades" className="py-32 relative overflow-hidden">
      <div className="container mx-auto px-4 md:px-6">
        <div className="text-center max-w-3xl mx-auto mb-20">
          <h2 className="text-4xl font-black tracking-tight text-white sm:text-5xl mb-6">
            Por que escolher o MenuZen?
          </h2>
          <p className="text-lg text-slate-400 font-light">
            Automatizamos a burocracia para que você foque no que importa: <br className="hidden sm:block" />aumentar o seu lucro de verdade.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 lg:gap-8 max-w-5xl mx-auto">
          {features.map((feature, index) => (
            <div 
              key={index} 
              className="group relative bg-[#1a0b02]/60 backdrop-blur-xl border border-orange-500/20 shadow-[0_8px_30px_rgba(234,88,12,0.05)] p-8 sm:p-10 rounded-3xl hover:-translate-y-2 hover:border-orange-500/60 hover:shadow-[0_0_40px_rgba(234,88,12,0.2)] hover:bg-[#2a1204]/80 duration-500 transition-all overflow-hidden"
            >
              <div className="absolute inset-0 bg-gradient-to-b from-orange-500/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"></div>
              <div className="mb-6 inline-flex bg-gradient-to-br from-amber-500/20 to-purple-500/20 border border-white/20 p-3 rounded-2xl shadow-lg backdrop-blur-md text-orange-500 drop-shadow-[0_0_15px_rgba(245,158,11,0.5)] group-hover:text-amber-300 transition-all duration-500 relative z-10">
                <feature.icon className="h-8 w-8" />
              </div>
              <h3 className="mb-4 text-2xl font-bold text-white tracking-tight">
                {feature.title}
              </h3>
              <p className="text-slate-400 leading-relaxed">
                {feature.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
