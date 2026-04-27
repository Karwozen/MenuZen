"use client";

import { use, useEffect, useState } from "react";
import { supabase, isSupabaseConfigured } from "@/lib/supabase";
import { ShoppingCart, Image as ImageIcon, Store, Loader2, UtensilsCrossed, Plus, Minus, X, MessageCircle } from "lucide-react";

interface PageProps {
  params: Promise<{ slug: string }>;
}

interface Restaurante {
  id: string;
  nome: string;
  cor_primaria?: string;
  telefone?: string;
}

interface Categoria {
  id: string;
  nome: string;
}

interface Produto {
  id: string;
  nome: string;
  descricao: string;
  preco: number;
  categoria_id: string;
  imagem_url: string | null;
  disponivel?: boolean;
}

interface CartItem {
  produto: Produto;
  quantidade: number;
}

export default function PublicMenuPage(props: PageProps) {
  const params = use(props.params);
  const slug = params.slug;

  const [loading, setLoading] = useState(true);
  const [restaurante, setRestaurante] = useState<Restaurante | null>(null);
  const [categorias, setCategorias] = useState<Categoria[]>([]);
  const [produtos, setProdutos] = useState<Produto[]>([]);
  const [activeCategory, setActiveCategory] = useState<string | null>(null);
  
  // Cart State
  const [cart, setCart] = useState<CartItem[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    fetchData();
  }, [slug]);

  const fetchData = async () => {
    try {
      setLoading(true);

      if (!isSupabaseConfigured) {
         setLoading(false);
         return;
      }

      const { data: restData, error: restError } = await supabase
        .from('restaurantes')
        .select('*')
        .eq('slug', slug)
        .single();
        
      if (restError || !restData) {
        setRestaurante(null);
        setLoading(false);
        return;
      }

      setRestaurante(restData);
      
      const rId = restData.id;

      // Buscar categorias
      const { data: catData } = await supabase
        .from('categorias')
        .select('*')
        .eq('restaurante_id', rId)
        .order('created_at', { ascending: true });

      const catList = catData || [];
      setCategorias(catList);
      
      // Buscar produtos
      let prodList: Produto[] = [];
      if (catList.length > 0) {
         const catIds = catList.map(c => c.id);
         
         // Try fetching products, if 'disponivel' eq fails we fallback to getting all.
         // Let's just fetch all and filter in memory to avoid schema mismatch errors 
         // since the `disponivel` column might not exist if the prompt didn't add it in the DB setup.
         const { data: pData } = await supabase
           .from('produtos')
           .select('*')
           .in('categoria_id', catIds)
           .order('created_at', { ascending: true });
           
         if (pData) {
           prodList = pData.filter(p => {
             // Retorna os que não tem 'disponivel' definido (assume true) ou os que explicitamente são true
             return p.disponivel === undefined || p.disponivel === true;
           });
         }
      }
      
      setProdutos(prodList);
      
      if (catList.length > 0) {
        setActiveCategory(catList[0].id);
      }

    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const primaryColor = restaurante?.cor_primaria || '#10b981'; // default emerald-500

  // Cart Functions
  const addToCart = (produto: Produto) => {
    setCart(prev => {
      const existing = prev.find(item => item.produto.id === produto.id);
      if (existing) {
        return prev.map(item => 
          item.produto.id === produto.id 
            ? { ...item, quantidade: item.quantidade + 1 }
            : item
        );
      }
      return [...prev, { produto, quantidade: 1 }];
    });
  };

  const removeFromCart = (produtoId: string) => {
    setCart(prev => prev.map(item => 
      item.produto.id === produtoId 
        ? { ...item, quantidade: item.quantidade - 1 }
        : item
    ).filter(item => item.quantidade > 0));
  };

  const totalItems = cart.reduce((acc, item) => acc + item.quantidade, 0);
  const totalPrice = cart.reduce((acc, item) => acc + (item.produto.preco * item.quantidade), 0);

  const enviarPedidoWhatsApp = () => {
    if (cart.length === 0) return;

    let text = `*Novo Pedido - ${restaurante?.nome || 'Restaurante'}*\n\n`;
    text += `*Itens do Pedido:*\n`;
    cart.forEach(item => {
       text += `${item.quantidade}x ${item.produto.nome} - ${new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(item.produto.preco * item.quantidade)}\n`;
    });
    text += `\n*Total: ${new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(totalPrice)}*`;

    const telefone = restaurante?.telefone || '5511999999999';
    // remover todos caracteres não numericos
    const foneNumerico = telefone.replace(/\D/g, '');
    
    // open whatsapp
    const encodedText = encodeURIComponent(text);
    window.open(`https://wa.me/${foneNumerico}?text=${encodedText}`, '_blank');
  };

  if (loading) {
     return (
       <div className="min-h-screen bg-[#050505] flex items-center justify-center">
          <Loader2 className="w-8 h-8 text-white animate-spin" />
       </div>
     );
  }

  if (!restaurante) {
     return (
        <div className="min-h-screen bg-[#050505] flex items-center justify-center p-4">
           <div className="text-center bg-white/5 border border-white/10 p-8 rounded-2xl max-w-sm w-full">
              <Store className="w-16 h-16 text-slate-500 mx-auto mb-4" />
              <h1 className="text-2xl font-bold text-white mb-2">Restaurante não encontrado</h1>
              <p className="text-slate-400">Verifique o endereço digitado e tente novamente.</p>
           </div>
        </div>
     );
  }

  return (
    <div className="min-h-screen bg-[#050505] text-white pb-28">
       {/* Header */}
       <header className="pt-12 pb-6 px-4 bg-white/5 border-b border-white/10 sticky top-0 z-20 backdrop-blur-md">
          <h1 className="text-3xl font-bold text-center tracking-tight" style={{ color: primaryColor }}>
             {restaurante.nome}
          </h1>
       </header>

       {/* Category Navigation */}
       {categorias.length > 0 && (
          <div className="sticky top-[89px] z-10 bg-[#050505]/90 backdrop-blur-xl border-b border-white/5 py-4 px-4 shadow-xl">
             <div className="flex overflow-x-auto gap-3 snap-x pb-2 scrollbar-none" style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}>
                {categorias.map(cat => (
                   <button
                      key={cat.id}
                      onClick={() => {
                        setActiveCategory(cat.id);
                        document.getElementById(`categoria-${cat.id}`)?.scrollIntoView({ behavior: 'smooth', block: 'start' });
                      }}
                      className={`whitespace-nowrap px-5 py-2.5 rounded-full text-sm font-semibold snap-start transition-all ${
                         activeCategory === cat.id 
                           ? 'bg-white text-black shadow-lg' 
                           : 'bg-white/5 text-slate-300 hover:bg-white/10 border border-white/10'
                      }`}
                      style={activeCategory === cat.id ? { backgroundColor: primaryColor, color: '#fff', borderColor: primaryColor } : {}}
                   >
                     {cat.nome}
                   </button>
                ))}
             </div>
          </div>
       )}

       {/* Product List */}
       <main className="px-4 py-8 max-w-3xl mx-auto space-y-12">
          {categorias.length === 0 || produtos.length === 0 ? (
             <div className="text-center text-slate-500 mt-12 flex flex-col items-center">
                 <UtensilsCrossed className="w-12 h-12 mb-4 opacity-20" />
                 <p>Nenhum produto disponível no momento.</p>
             </div>
          ) : (
             categorias.map(categoria => {
                const catProducts = produtos.filter(p => p.categoria_id === categoria.id);
                if (catProducts.length === 0) return null;

                return (
                   <section key={categoria.id} id={`categoria-${categoria.id}`} className="scroll-mt-48">
                      <h2 className="text-xl font-bold mb-6 flex items-center gap-3">
                         <span className="w-1.5 h-6 rounded-full" style={{ backgroundColor: primaryColor }} />
                         {categoria.nome}
                      </h2>
                      
                      <div className="space-y-4">
                         {catProducts.map(produto => (
                            <div key={produto.id} className="bg-white/5 border border-white/10 rounded-2xl p-3 flex gap-4 hover:bg-white/10 transition-colors">
                               {/* Image */}
                               {produto.imagem_url ? (
                                  <div className="w-24 h-24 shrink-0 bg-[#0a0a0a] rounded-xl overflow-hidden shadow-lg border border-white/5">
                                     {/* eslint-disable-next-line @next/next/no-img-element */}
                                     <img src={produto.imagem_url} alt={produto.nome} className="w-full h-full object-cover" />
                                  </div>
                               ) : (
                                  <div className="w-24 h-24 shrink-0 bg-white/5 rounded-xl border border-white/5 flex items-center justify-center text-slate-600">
                                     <ImageIcon className="w-6 h-6" />
                                  </div>
                               )}

                               {/* Info */}
                               <div className="flex-1 flex flex-col justify-between py-1 pr-1">
                                  <div>
                                     <h3 className="font-semibold text-white leading-tight">{produto.nome}</h3>
                                     {produto.descricao && (
                                        <p className="text-slate-400 text-xs mt-1.5 line-clamp-2 leading-relaxed">{produto.descricao}</p>
                                     )}
                                  </div>
                                  <div className="mt-3 flex items-center justify-between">
                                      <div className="font-bold text-[15px]" style={{ color: primaryColor }}>
                                         {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(produto.preco)}
                                      </div>
                                      
                                      {/* Add to cart controls */}
                                      {cart.find(c => c.produto.id === produto.id) ? (
                                         <div className="flex items-center bg-white/10 rounded-full">
                                            <button 
                                                onClick={() => removeFromCart(produto.id)} 
                                                className="p-1.5 text-white hover:bg-white/10 rounded-full transition-colors"
                                            >
                                               <Minus className="w-4 h-4" />
                                            </button>
                                            <span className="w-6 text-center text-sm font-semibold text-white">
                                               {cart.find(c => c.produto.id === produto.id)?.quantidade}
                                            </span>
                                            <button 
                                                onClick={() => addToCart(produto)} 
                                                className="p-1.5 text-white hover:bg-white/10 rounded-full transition-colors"
                                            >
                                               <Plus className="w-4 h-4" />
                                            </button>
                                         </div>
                                      ) : (
                                         <button 
                                            onClick={() => addToCart(produto)}
                                            className="px-3 py-1 rounded-full text-sm font-bold text-white transition-opacity active:scale-95"
                                            style={{ backgroundColor: primaryColor }}
                                         >
                                            Adicionar
                                         </button>
                                      )}
                                  </div>
                               </div>
                            </div>
                         ))}
                      </div>
                   </section>
                )
             })
          )}
       </main>

       {/* FAB */}
       {totalItems > 0 && !isModalOpen && (
          <div className="fixed bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-[#050505] via-[#050505]/95 to-transparent pointer-events-none pb-8 pt-12 z-40 transition-all">
             <div className="max-w-3xl mx-auto pointer-events-auto">
                <button 
                   onClick={() => setIsModalOpen(true)}
                   className="w-full flex items-center justify-between p-4 rounded-2xl shadow-2xl transition-transform hover:scale-[1.02] active:scale-95 border border-black/10"
                   style={{ backgroundColor: primaryColor, color: '#fff' }}
                >
                   <div className="flex items-center gap-3">
                      <div className="bg-black/20 p-2.5 rounded-full">
                         <ShoppingCart className="w-5 h-5 text-white" />
                      </div>
                      <div className="text-left">
                         <span className="block font-semibold tracking-wide">Meu Pedido</span>
                         <span className="block text-xs opacity-90">{totalItems} {totalItems === 1 ? 'item' : 'itens'}</span>
                      </div>
                   </div>
                   <span className="font-bold tracking-wide text-lg">
                      {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(totalPrice)}
                   </span>
                </button>
             </div>
          </div>
       )}

       {/* Cart Modal */}
       {isModalOpen && (
          <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 bg-black/60 backdrop-blur-sm">
             <div className="w-full max-w-lg bg-[#111] sm:border border-white/10 sm:rounded-3xl rounded-t-3xl overflow-hidden flex flex-col max-h-[90vh] shadow-2xl animate-in slide-in-from-bottom-5">
                <div className="flex items-center justify-between p-5 border-b border-white/5">
                   <h2 className="text-xl font-bold flex items-center gap-2">
                       <ShoppingCart className="w-5 h-5" style={{ color: primaryColor }} />
                       Seu Pedido
                   </h2>
                   <button onClick={() => setIsModalOpen(false)} className="p-2 text-slate-400 hover:text-white transition-colors bg-white/5 rounded-full">
                      <X className="w-5 h-5" />
                   </button>
                </div>

                <div className="overflow-y-auto p-5 space-y-4">
                   {cart.length === 0 ? (
                      <div className="text-center text-slate-500 py-8">
                         <ShoppingCart className="w-12 h-12 mx-auto mb-3 opacity-20" />
                         <p>Sua sacola está vazia.</p>
                      </div>
                   ) : (
                      cart.map(item => (
                         <div key={item.produto.id} className="flex items-center justify-between border-b border-white/5 pb-4 last:border-0 last:pb-0">
                             <div>
                                <h4 className="font-semibold text-white">{item.produto.nome}</h4>
                                <p className="text-slate-400 text-sm mt-0.5">
                                   {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(item.produto.preco)}
                                </p>
                             </div>
                             <div className="flex items-center bg-white/5 rounded-full border border-white/10">
                                <button onClick={() => removeFromCart(item.produto.id)} className="p-2 text-white hover:bg-white/10 rounded-full transition-colors">
                                   <Minus className="w-4 h-4" />
                                </button>
                                <span className="w-6 text-center text-sm font-semibold">{item.quantidade}</span>
                                <button onClick={() => addToCart(item.produto)} className="p-2 text-white hover:bg-white/10 rounded-full transition-colors">
                                   <Plus className="w-4 h-4" />
                                </button>
                             </div>
                         </div>
                      ))
                   )}
                </div>

                {cart.length > 0 && (
                   <div className="p-5 border-t border-white/5 bg-[#161616]">
                      <div className="flex items-center justify-between mb-4">
                         <span className="text-slate-400">Total a pagar:</span>
                         <span className="text-2xl font-bold text-white">
                            {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(totalPrice)}
                         </span>
                      </div>
                      <button 
                         onClick={enviarPedidoWhatsApp}
                         className="w-full py-4 rounded-xl flex items-center justify-center gap-2 text-white font-bold text-lg transition-transform hover:scale-[1.02] active:scale-95 shadow-xl"
                         style={{ backgroundColor: primaryColor }}
                      >
                         <MessageCircle className="w-6 h-6" />
                         Fazer Pedido por WhatsApp
                      </button>
                   </div>
                )}
             </div>
          </div>
       )}

    </div>
  );
}
