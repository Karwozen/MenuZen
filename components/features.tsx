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
              className="group relative glass-card p-8 sm:p-10 border border-white/5"
            >
              <div className="feature-icon group-hover:bg-indigo-500/20 group-hover:text-indigo-400 group-hover:border-indigo-500/30">
                <feature.icon className="h-6 w-6" />
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
