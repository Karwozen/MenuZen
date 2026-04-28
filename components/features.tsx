import { MessageCircle, QrCode, Store, Smartphone } from "lucide-react";

export function Features() {
  const features = [
    {
      title: "Cardápio via QR Code",
      description: "QR Code dinâmico com fotos em alta resolução. Carregamento instantâneo para não deixar seu cliente esperando.",
      icon: QrCode,
    },
    {
      title: "Pedidos direto no seu WhatsApp",
      description: "Nossa IA transcreve áudios, responde dúvidas do cardápio e fecha pedidos 24/7. Mais vendas, zero comissão.",
      icon: MessageCircle,
    },
    {
      title: "Gestão Simples e Rápida",
      description: "Interface desenhada para a correria do dia a dia. Controle de caixa, delivery e salão tudo em um único dashboard.",
      icon: Store,
    },
  ];

  return (
    <section id="funcionalidades" className="py-32 relative overflow-hidden">
      <div className="container mx-auto px-4 md:px-6">
        <div className="text-center max-w-3xl mx-auto mb-20">
          <h2 className="text-4xl font-black tracking-tight text-white sm:text-5xl mb-6">
            O fluxo perfeito para o seu restaurante
          </h2>
          <p className="text-lg text-slate-400 font-light">
            Automatizamos a burocracia para que você foque no que importa: <br className="hidden sm:block" />a experiência dos seus clientes.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8 max-w-5xl mx-auto">
          {features.map((feature, index) => (
            <div 
              key={index} 
              className="group relative glass-card p-8 sm:p-10"
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
