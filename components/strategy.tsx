import { TrendingUp, ShoppingBag, Smartphone, ArrowRight } from "lucide-react";

export function Strategy() {
  return (
    <section className="py-20 relative overflow-hidden">
      <div className="container mx-auto px-4 md:px-6">
        <div className="max-w-5xl mx-auto rounded-3xl bg-gradient-to-br from-orange-900/40 via-[#0a0a0a] to-amber-900/10 border border-white/10 p-8 md:p-12 lg:p-16 relative overflow-hidden">
          
          {/* Decorative Background */}
          <div className="absolute top-0 right-0 w-64 h-64 bg-orange-500/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 pointer-events-none"></div>
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center relative z-10">
            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1 bg-amber-500/10 border border-amber-500/20 text-amber-400 text-xs font-semibold mb-6 rounded-full uppercase tracking-widest">
                <TrendingUp className="w-3 h-3" />
                Dica Para Crescer
              </div>
              
              <h2 className="text-3xl md:text-4xl font-black text-white tracking-tight leading-tight mb-6">
                A Estratégia de Ouro para Escalar
              </h2>
              
              <p className="text-lg text-slate-300 leading-relaxed mb-6 font-light">
                Use os apps grandes para ser descoberto, mas use o <span className="font-semibold text-white">MenuZen</span> para fidelizar.
              </p>
              
              <div className="bg-white/5 border border-white/10 rounded-2xl p-6 mb-8 relative">
                <div className="absolute -left-3 -top-3 bg-orange-500 w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold text-white shadow-lg shadow-orange-500/30">1</div>
                <p className="text-slate-300">
                  Em cada pedido que sair no iFood, coloque um <strong className="text-white">panfleto na sacola</strong> com o seu QR Code MenuZen.
                </p>
              </div>
              
              <div className="bg-amber-500/10 border border-amber-500/20 rounded-2xl p-6 relative">
                <div className="absolute -left-3 -top-3 bg-amber-500 w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold text-white shadow-lg shadow-amber-500/30">2</div>
                <blockquote className="italic text-amber-100/80 mb-3 border-l-2 border-amber-500/30 pl-4 py-1">
                  &quot;Peça direto pelo nosso WhatsApp na próxima vez e ganhe 10% de desconto!&quot;
                </blockquote>
                <p className="text-amber-100 font-medium">
                  Você dá 10% para o cliente, economiza 27% de taxa de delivery e aumenta seu lucro final na mesma hora!
                </p>
              </div>
            </div>
            
            <div className="flex justify-center lg:justify-end">
              <div className="relative w-full max-w-sm animate-[bounce_6s_infinite] drop-shadow-[0_0_30px_rgba(245,158,11,0.2)]">
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent z-10 rounded-2xl"></div>
                <div className="bg-white/5 border border-white/10 rounded-3xl p-4 shadow-2xl backdrop-blur-sm relative z-0">
                  <div className="bg-[#111] rounded-2xl p-6 flex flex-col items-center gap-4 border border-white/5">
                    <ShoppingBag className="w-12 h-12 text-slate-500 drop-shadow-[0_0_10px_rgba(255,255,255,0.2)]" />
                    <div className="text-center">
                      <div className="text-xl font-bold text-white mb-2">Pedido #4892</div>
                      <div className="text-sm text-slate-400">Pronto para entrega</div>
                    </div>
                    
                    <div className="w-full h-px bg-white/10 my-2"></div>
                    
                    <div className="w-full bg-gradient-to-r from-amber-500 to-red-500 rounded-xl p-0.5 shadow-lg drop-shadow-[0_0_15px_rgba(245,158,11,0.3)]">
                      <div className="w-full bg-[#111] rounded-xl p-4 flex flex-col items-center text-center">
                        <div className="bg-amber-500/20 w-16 h-16 flex items-center justify-center rounded-xl mb-3 border border-amber-500/30">
                          <Smartphone className="w-8 h-8 text-amber-400 drop-shadow-[0_0_10px_rgba(245,158,11,0.6)]" />
                        </div>
                        <div className="text-xs font-bold text-white uppercase tracking-wider mb-1">
                          Próximo pedido
                        </div>
                        <div className="text-amber-400 font-medium text-sm">
                          Use o QR Code e ganhe 10% OFF
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                
                {/* Floating elements */}
                <div className="absolute -bottom-6 -right-6 bg-[#0a0a0a] border border-amber-500/30 shadow-[0_0_20px_rgba(245,158,11,0.2)] rounded-2xl p-4 flex items-center gap-3 z-20 animate-bounce" style={{ animationDuration: '3s' }}>
                  <div className="bg-amber-500/20 w-10 h-10 rounded-full flex items-center justify-center">
                    <span className="text-amber-500 font-bold">+17%</span>
                  </div>
                  <div>
                     <div className="text-xs text-slate-400">Lucro Extra</div>
                     <div className="text-sm font-bold text-white">Neste Pedido</div>
                  </div>
                </div>
              </div>
            </div>
            
          </div>
        </div>
      </div>
    </section>
  );
}
