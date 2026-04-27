import { QrCode, MessageSquareCode, Store, ClipboardList } from "lucide-react";

export function Features() {
  const features = [
    {
      title: "Cardápio Digital",
      description: "Esqueça PDFs e impressões. Tenha um cardápio atrativo acessível via QR Code na mesa ou link na bio do Instagram.",
      icon: QrCode,
    },
    {
      title: "Robô WhatsApp com IA",
      description: "Nosso robô entende áudios e textos, tira dúvidas sobre o cardápio e finaliza o pedido de forma humanizada 24/7.",
      icon: MessageSquareCode,
    },
    {
      title: "PDV Integrado",
      description: "Frente de caixa ágil e fácil de usar. Controle todos os pedidos (Delivery e Salão) em uma única tela unificada.",
      icon: Store,
    },
    {
      title: "Gestão de Comandas",
      description: "Controle de mesas perfeito. Os clientes podem pedir diretamente pelo celular e a cozinha recebe tudo instantaneamente.",
      icon: ClipboardList,
    },
  ];

  return (
    <section id="funcionalidades" className="py-24 relative">
      <div className="container mx-auto px-4 md:px-6">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h2 className="text-3xl font-bold tracking-tight text-white sm:text-4xl">
            Tudo o que seu restaurante precisa
          </h2>
          <p className="mt-4 text-lg text-slate-400">
            Uma plataforma completa para gerenciar vendas, automatizar o atendimento e fidelizar seus clientes.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {features.map((feature, index) => (
            <div 
              key={index} 
              className="group relative glass p-6 hover:-translate-y-1 transition-transform duration-300"
            >
              <div className="feature-icon group-hover:bg-emerald-500/20 transition-colors">
                <feature.icon className="h-5 w-5" />
              </div>
              <h3 className="mb-3 text-xl font-semibold text-white">
                {feature.title}
              </h3>
              <p className="text-slate-400 leading-relaxed text-sm">
                {feature.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
