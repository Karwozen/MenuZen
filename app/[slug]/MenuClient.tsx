"use client";

import { use, useEffect, useState } from "react";
import { supabase, isSupabaseConfigured } from "@/lib/supabase";
import { ShoppingCart, Image as ImageIcon, Store, Loader2, UtensilsCrossed, Plus, Minus, X, MessageCircle, Info, Home, ListOrdered, Tag, ChevronDown, ChevronUp, Instagram } from "lucide-react";

interface PageProps {
  params: Promise<{ slug: string }>;
}

interface Restaurante {
  id: string;
  nome: string;
  cor_tema?: string;
  cor_primaria?: string;
  whatsapp?: string;
  logo_url?: string;
  endereco?: string;
  horario_atendimento?: string;
  formas_pagamento?: string;
  pedido_minimo?: number;
  banner_url?: string;
  tema_fundo?: string;
  estilo_fonte?: string;
  instagram?: string;
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
  const [isCheckout, setIsCheckout] = useState(false);
  const [clienteNome, setClienteNome] = useState("");
  const [tipoEntrega, setTipoEntrega] = useState<'delivery' | 'local'>('delivery');
  const [mesa, setMesa] = useState('');
  const [rua, setRua] = useState('');
  const [numero, setNumero] = useState('');
  const [bairro, setBairro] = useState('');
  const [complemento, setComplemento] = useState('');
  const [telefoneCli, setTelefoneCli] = useState('');
  const [isInfoModalOpen, setIsInfoModalOpen] = useState(false);
  const [expandedCategories, setExpandedCategories] = useState<Set<string>>(new Set());
  const [isMyOrdersModalOpen, setIsMyOrdersModalOpen] = useState(false);
  const [meusPedidos, setMeusPedidos] = useState<any[]>([]);

  useEffect(() => {
    let mounted = true;

    async function loadData() {
      try {
        if (!isSupabaseConfigured) {
           if (mounted) setLoading(false);
           return;
        }

        const { data: restData, error: restError } = await supabase
          .from('restaurantes')
          .select('*')
          .eq('slug', slug)
          .single();
          
        if (restError || !restData) {
          if (mounted) {
            setRestaurante(null);
            setLoading(false);
          }
          return;
        }

        if (mounted) setRestaurante(restData);
        
        const rId = restData.id;

        const { data: catData } = await supabase
          .from('categorias')
          .select('*')
          .eq('restaurante_id', rId)
          .order('created_at', { ascending: true });

        const catList = catData || [];
        if (mounted) setCategorias(catList);
        
        // Buscar produtos
        let prodList: Produto[] = [];
        if (catList.length > 0) {
           const catIds = catList.map(c => c.id);
           
           const { data: pData } = await supabase
             .from('produtos')
             .select('*')
             .in('categoria_id', catIds)
             .order('created_at', { ascending: true });
             
           if (pData) {
             prodList = pData.filter(p => {
               return p.disponivel === undefined || p.disponivel === true;
             });
           }
        }
        
        if (mounted) {
          setProdutos(prodList);
          if (catList.length > 0) {
            setActiveCategory(catList[0].id);
            setExpandedCategories(new Set([catList[0].id]));
          }
        }

      } catch (err) {
        console.error(err);
      } finally {
        if (mounted) setLoading(false);
      }
    }

    loadData();

    return () => { mounted = false; }
  }, [slug]);

  useEffect(() => {
    const savedData = localStorage.getItem('menuzen_cliente_data');
    if (savedData) {
      try {
        const data = JSON.parse(savedData);
        // eslint-disable-next-line react-hooks/set-state-in-effect
        if (data.clienteNome) setClienteNome(data.clienteNome);
        if (data.telefoneCli) setTelefoneCli(data.telefoneCli);
        if (data.rua) setRua(data.rua);
        if (data.numero) setNumero(data.numero);
        if (data.bairro) setBairro(data.bairro);
        if (data.complemento) setComplemento(data.complemento);
      } catch (e) {
        console.error("Erro ao carregar dados do localStorage", e);
      }
    }
  }, []);

  const fetchMeusPedidos = async () => {
    const saved = JSON.parse(localStorage.getItem('menuzen_meus_pedidos') || '[]');
    if (saved.length === 0 || !restaurante?.id) return;
    try {
      const { data, error } = await supabase
        .from('pedidos')
        .select('*')
        .in('id', saved)
        .eq('restaurante_id', restaurante.id)
        .order('created_at', { ascending: false });

      if (data) {
        setMeusPedidos(data);
      }
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isMyOrdersModalOpen && restaurante?.id) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      fetchMeusPedidos();
      interval = setInterval(fetchMeusPedidos, 5000);
    }
    return () => clearInterval(interval);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isMyOrdersModalOpen, restaurante?.id]);

  const cancelarMeuPedido = async (orderId: string) => {
    try {
      const { error } = await supabase
        .from('pedidos')
        .update({ status: 'cancelado' })
        .eq('id', orderId);

      if (error) throw error;
      alert("Seu pedido foi cancelado com sucesso.");
      fetchMeusPedidos();
    } catch (err) {
      console.error(err);
      alert("Erro ao cancelar pedido.");
    }
  };

  const primaryColor = restaurante?.cor_tema || restaurante?.cor_primaria || '#10b981'; // default emerald-500
  const isLight = restaurante?.tema_fundo === 'claro';
  const fontClass = 
    restaurante?.estilo_fonte === 'serif' ? 'font-serif' :
    restaurante?.estilo_fonte === 'mono' ? 'font-mono' : 'font-sans';

  const toggleCategory = (id: string) => {
    setExpandedCategories(prev => {
      const next = new Set(prev);
      if (next.has(id)) {
        next.delete(id);
      } else {
        next.add(id);
      }
      return next;
    });
  };

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

  const enviarPedidoWhatsApp = async () => {
    if (cart.length === 0 || !clienteNome) return;
    if (tipoEntrega === 'delivery' && (!rua || !numero || !bairro || !telefoneCli)) {
       alert("Por favor, preencha todos os campos obrigatórios de endereço e telefone.");
       return;
    }

    try {
      // 0. Salvar no localStorage para facilitar compras futuras
      const clienteData = {
        clienteNome,
        telefoneCli,
        rua,
        numero,
        bairro,
        complemento
      };
      localStorage.setItem('menuzen_cliente_data', JSON.stringify(clienteData));

      // Formatar endereço
      const enderecoFormatado = tipoEntrega === 'delivery' 
        ? `${rua}, ${numero} - ${bairro}${complemento ? ` (${complemento})` : ''}`
        : '';

      // 1. Salvar no Supabase
      const { data: orderData, error: orderError } = await supabase
        .from('pedidos')
        .insert([{
          restaurante_id: restaurante?.id,
          cliente_nome: clienteNome,
          cliente_telefone: telefoneCli,
          itens: cart,
          total: totalPrice,
          status: 'pendente',
          pago: false,
          tipo_entrega: tipoEntrega,
          mesa: tipoEntrega === 'local' ? mesa : null,
          endereco_entrega: enderecoFormatado
        }])
        .select()
        .single();

      if (orderError) {
        console.error("Erro ao salvar pedido:", orderError);
      } else if (orderData) {
        const savedOrdersStr = localStorage.getItem('menuzen_meus_pedidos') || '[]';
        const savedOrders = JSON.parse(savedOrdersStr);
        if (!savedOrders.includes(orderData.id)) {
          savedOrders.push(orderData.id);
          localStorage.setItem('menuzen_meus_pedidos', JSON.stringify(savedOrders));
        }
      }

      // 2. Gerar texto do WhatsApp
      let text = `*Novo Pedido - #${orderData?.id?.substring(0, 5) || 'Novo'}*\n`;
      
      if (tipoEntrega === 'local') {
        text += `📍 *Pedido na Mesa:* ${mesa || 'Não informada'}\n`;
        text += `👤 *Cliente:* ${clienteNome}\n\n`;
      } else {
        text += `🛵 *Entrega para:* ${clienteNome}\n`;
        text += `📞 *WhatsApp:* ${telefoneCli}\n`;
        text += `📍 *Endereço:* ${enderecoFormatado}\n\n`;
      }

      text += `*Resumo do Pedido:*\n`;
      
      cart.forEach(item => {
        text += `${item.quantidade}x ${item.produto.nome} - R$ ${(item.produto.preco * item.quantidade).toFixed(2)}\n`;
      });
      text += `\n*Total:* R$ ${totalPrice.toFixed(2)}`;

      const telefone = restaurante?.whatsapp || '';
      if (!telefone) {
         alert("Este restaurante ainda não configurou um número de WhatsApp para receber pedidos.");
         return;
      }
      
      const foneNumerico = telefone.replace(/\D/g, '');
      const encodedText = encodeURIComponent(text);
      
      // 3. Limpar carrinho e fechar modal
      setCart([]);
      setIsCheckout(false);
      setIsModalOpen(false);

      // 4. Abrir WhatsApp
      window.open(`https://wa.me/${foneNumerico}?text=${encodedText}`, '_blank');
    } catch (err) {
      console.error("Erro no processamento do pedido:", err);
      alert("Ocorreu um erro ao processar seu pedido. Tente novamente.");
    }
  };

  if (loading) {
     return (
       <div className={`min-h-screen flex items-center justify-center font-sans bg-[#050505]`}>
          <Loader2 className="w-8 h-8 text-white animate-spin" />
       </div>
     );
  }

  if (!restaurante) {
     return (
        <div className={`min-h-screen flex items-center justify-center p-4 font-sans bg-[#050505]`}>
           <div className="text-center bg-white/5 border border-white/10 p-8 rounded-2xl max-w-sm w-full">
              <Store className="w-16 h-16 text-slate-500 mx-auto mb-4" />
              <h1 className="text-2xl font-bold text-white mb-2">Restaurante não encontrado</h1>
              <p className="text-slate-400">Verifique o endereço digitado e tente novamente.</p>
           </div>
        </div>
     );
  }

  return (
    <div className={`min-h-screen pb-28 ${fontClass} ${isLight ? 'bg-slate-50 text-slate-900' : 'bg-[#050505] text-white'}`}>
       {/* Header */}
       <header className="relative pb-6 bg-transparent">
          {/* Cover Banner */}
          <div 
             className="w-full h-40 object-cover"
             style={{ 
                backgroundColor: restaurante.banner_url ? 'transparent' : primaryColor,
                backgroundImage: restaurante.banner_url ? `url(${restaurante.banner_url})` : 'none',
                backgroundSize: 'cover',
                backgroundPosition: 'center'
             }}
          />
          
          <div className="px-4 relative flex flex-col items-center -mt-10">
             {/* Logo Container */}
             <div 
                className={`w-20 h-20 rounded-full overflow-hidden border-4 shadow-xl flex-shrink-0 flex items-center justify-center ${isLight ? 'border-slate-50 bg-white' : 'border-[#050505] bg-[#111]'}`}
             >
                {restaurante.logo_url ? (
                   /* eslint-disable-next-line @next/next/no-img-element */
                   <img src={restaurante.logo_url} alt={`Logo ${restaurante.nome}`} className="w-full h-full object-cover" />
                ) : (
                   <Store className={`w-10 h-10 ${isLight ? 'text-slate-300' : 'text-slate-600'}`} />
                )}
             </div>
             
             {/* Info */}
             <div className="flex flex-col items-center mt-3">
                <h1 className="text-2xl font-black text-center tracking-tight text-inherit">
                   {restaurante.nome}
                </h1>
                <button 
                  onClick={() => setIsInfoModalOpen(true)} 
                  className={`mt-1 flex items-center gap-1 text-sm font-medium transition-colors ${isLight ? 'text-slate-500 hover:text-slate-700' : 'text-slate-400 hover:text-slate-300'}`}
                >
                  <Info className="w-4 h-4" />
                  Ver informações da loja
                </button>
             </div>
          </div>
       </header>

       {/* Category Navigation */}
       {categorias.length > 0 && (
          <div className={`sticky top-0 z-10 backdrop-blur-xl border-b py-4 px-4 shadow-xl ${isLight ? 'bg-slate-50/90 border-slate-200 shadow-slate-200/50' : 'bg-[#050505]/90 border-white/5 shadow-black/50'}`}>
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
                           ? (isLight ? 'bg-slate-900 text-white shadow-md' : 'bg-white text-black shadow-lg') 
                           : (isLight ? 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200' : 'bg-white/5 text-slate-300 hover:bg-white/10 border border-white/10')
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
             <div className={`text-center mt-12 flex flex-col items-center ${isLight ? 'text-slate-500' : 'text-slate-500'}`}>
                 <UtensilsCrossed className="w-12 h-12 mb-4 opacity-20" />
                 <p>Nenhum produto disponível no momento.</p>
             </div>
          ) : (
             categorias.map(categoria => {
                const catProducts = produtos.filter(p => p.categoria_id === categoria.id);
                if (catProducts.length === 0) return null;

                return (
                   <section key={categoria.id} id={`categoria-${categoria.id}`} className="scroll-mt-48 transition-all">
                      <button 
                         onClick={() => toggleCategory(categoria.id)}
                         className={`w-full flex items-center justify-between mb-2 p-3 rounded-2xl transition-colors border ${isLight ? 'bg-white hover:bg-slate-50 border-slate-200' : 'bg-white/5 hover:bg-white/10 border-white/10'}`}
                      >
                         <h2 className="text-xl font-bold flex items-center gap-3">
                            <span className="w-1.5 h-6 rounded-full" style={{ backgroundColor: primaryColor }} />
                            {categoria.nome}
                         </h2>
                         {expandedCategories.has(categoria.id) ? (
                            <ChevronUp className={`w-5 h-5 ${isLight ? 'text-slate-500' : 'text-slate-400'}`} />
                         ) : (
                            <ChevronDown className={`w-5 h-5 ${isLight ? 'text-slate-500' : 'text-slate-400'}`} />
                         )}
                      </button>
                      
                      {expandedCategories.has(categoria.id) && (
                        <div className="space-y-4 mt-4 animate-in slide-in-from-top-2 fade-in">
                           {catProducts.map(produto => (
                              <div key={produto.id} className={`rounded-2xl p-3 flex gap-4 transition-colors border ${isLight ? 'bg-white hover:bg-slate-50 border-slate-200 shadow-sm' : 'bg-white/5 hover:bg-white/10 border-white/10'}`}>
                               {/* Image */}
                               {produto.imagem_url ? (
                                  <div className={`w-24 h-24 shrink-0 rounded-xl overflow-hidden shadow-sm border flex items-center justify-center ${isLight ? 'bg-slate-100 border-slate-200 text-slate-400' : 'bg-[#0a0a0a] border-white/5 text-slate-600'}`}>
                                     {/* eslint-disable-next-line @next/next/no-img-element */}
                                     <img src={produto.imagem_url} alt={produto.nome} className="w-full h-full object-cover" />
                                  </div>
                               ) : (
                                  <div className={`w-24 h-24 shrink-0 rounded-xl overflow-hidden shadow-sm border flex items-center justify-center ${isLight ? 'bg-slate-100 border-slate-200 text-slate-400' : 'bg-white/5 border-white/5 text-slate-600'}`}>
                                     <ImageIcon className="w-6 h-6" />
                                  </div>
                               )}

                               {/* Info */}
                               <div className="flex-1 flex flex-col justify-between py-1 pr-1">
                                  <div>
                                     <h3 className={`font-semibold leading-tight ${isLight ? 'text-slate-900' : 'text-white'}`}>{produto.nome}</h3>
                                     {produto.descricao && (
                                        <p className={`text-xs mt-1.5 line-clamp-2 leading-relaxed ${isLight ? 'text-slate-500' : 'text-slate-400'}`}>{produto.descricao}</p>
                                     )}
                                  </div>
                                  <div className="mt-3 flex items-center justify-between">
                                      <div className="font-bold text-[15px]" style={{ color: primaryColor }}>
                                         {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(produto.preco)}
                                      </div>
                                      
                                      {/* Add to cart controls */}
                                      {cart.find(c => c.produto.id === produto.id) ? (
                                         <div className={`flex items-center rounded-full border ${isLight ? 'bg-slate-100 border-slate-200' : 'bg-white/10 border-white/5'}`}>
                                            <button 
                                                onClick={() => removeFromCart(produto.id)} 
                                                className={`p-1.5 rounded-full transition-colors ${isLight ? 'text-slate-700 hover:bg-slate-200' : 'text-white hover:bg-white/10'}`}
                                            >
                                               <Minus className="w-4 h-4" />
                                            </button>
                                            <span className={`w-6 text-center text-sm font-semibold ${isLight ? 'text-slate-900' : 'text-white'}`}>
                                               {cart.find(c => c.produto.id === produto.id)?.quantidade}
                                            </span>
                                            <button 
                                                onClick={() => addToCart(produto)} 
                                                className={`p-1.5 rounded-full transition-colors ${isLight ? 'text-slate-700 hover:bg-slate-200' : 'text-white hover:bg-white/10'}`}
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
                      )}
                   </section>
                )
             })
          )}
       </main>

       {/* Bottom Nav Bar */}
       <div className={`fixed bottom-0 left-0 right-0 border-t px-6 py-3 z-30 flex justify-between items-center pb-safe ${isLight ? 'bg-white border-slate-200' : 'bg-[#111] border-white/10'}`}>
          <button onClick={() => window.scrollTo({ top: 0, behavior: 'smooth'})} className={`flex flex-col items-center gap-1 transition-colors ${isLight ? 'text-slate-500 hover:text-slate-900' : 'text-slate-400 hover:text-white'}`}>
              <Home className="w-6 h-6" />
              <span className="text-[10px] font-medium">Início</span>
          </button>
          
          <button onClick={() => setIsMyOrdersModalOpen(true)} className={`flex flex-col items-center gap-1 transition-colors ${isLight ? 'text-slate-500 hover:text-slate-900' : 'text-slate-400 hover:text-white'}`}>
              <ListOrdered className="w-6 h-6" />
              <span className="text-[10px] font-medium">Pedidos</span>
          </button>
          
          <button onClick={() => alert("Sem promoções hoje")} className={`flex flex-col items-center gap-1 transition-colors ${isLight ? 'text-slate-500 hover:text-slate-900' : 'text-slate-400 hover:text-white'}`}>
              <Tag className="w-6 h-6" />
              <span className="text-[10px] font-medium">Promos</span>
          </button>
          
          <button onClick={() => setIsModalOpen(true)} className={`flex flex-col items-center gap-1 transition-colors relative ${isLight ? 'text-slate-500 hover:text-slate-900' : 'text-slate-400 hover:text-white'}`}>
              <ShoppingCart className="w-6 h-6" style={{ color: totalItems > 0 ? primaryColor : undefined }} />
              {totalItems > 0 && (
                <span className="absolute -top-1 -right-2 w-5 h-5 bg-red-500 rounded-full flex items-center justify-center text-[10px] font-bold text-white border-2 border-[#111]">
                  {totalItems}
                </span>
              )}
              <span className="text-[10px] font-medium" style={{ color: totalItems > 0 ? primaryColor : undefined }}>Carrinho</span>
          </button>
       </div>

       {/* Cart Modal */}
       {isModalOpen && (
          <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 bg-black/60 backdrop-blur-sm">
             <div className={`w-full max-w-lg sm:border sm:rounded-3xl rounded-t-3xl overflow-hidden flex flex-col max-h-[90vh] shadow-2xl animate-in slide-in-from-bottom-5 ${isLight ? 'bg-white border-slate-200' : 'bg-[#111] border-white/10'}`}>
                <div className={`flex items-center justify-between p-5 border-b ${isLight ? 'border-slate-100' : 'border-white/5'}`}>
                   <h2 className="text-xl font-bold flex items-center gap-2 text-inherit">
                       <ShoppingCart className="w-5 h-5" style={{ color: primaryColor }} />
                       Seu Pedido
                   </h2>
                   <button onClick={() => { setIsModalOpen(false); setIsCheckout(false); }} className={`p-2 rounded-full transition-colors ${isLight ? 'text-slate-400 hover:text-slate-700 bg-slate-100 hover:bg-slate-200' : 'text-slate-400 hover:text-white bg-white/5 hover:bg-white/10'}`}>
                      <X className="w-5 h-5" />
                   </button>
                </div>

                <div className="overflow-y-auto p-5 space-y-4">
                   {cart.length === 0 ? (
                      <div className={`text-center py-8 ${isLight ? 'text-slate-500' : 'text-slate-500'}`}>
                         <ShoppingCart className="w-12 h-12 mx-auto mb-3 opacity-20" />
                         <p>Sua sacola está vazia.</p>
                      </div>
                   ) : isCheckout ? (
                      <div className="space-y-6 animate-in fade-in slide-in-from-right-4 p-1">
                         {/* Toggle Entrega */}
                         <div className={`flex p-1 rounded-2xl border ${isLight ? 'bg-slate-100 border-slate-200' : 'bg-white/5 border-white/10'}`}>
                            <button 
                               onClick={() => setTipoEntrega('delivery')}
                               className={`flex-1 py-3 rounded-xl text-sm font-bold flex items-center justify-center gap-2 transition-all ${tipoEntrega === 'delivery' ? (isLight ? 'bg-white text-slate-900 shadow-sm' : 'bg-white/10 text-white shadow-lg') : (isLight ? 'text-slate-500 hover:text-slate-700' : 'text-slate-500 hover:text-slate-300')}`}
                            >
                               🛵 Entrega em Casa
                            </button>
                            <button 
                               onClick={() => setTipoEntrega('local')}
                               className={`flex-1 py-3 rounded-xl text-sm font-bold flex items-center justify-center gap-2 transition-all ${tipoEntrega === 'local' ? (isLight ? 'bg-white text-slate-900 shadow-sm' : 'bg-white/10 text-white shadow-lg') : (isLight ? 'text-slate-500 hover:text-slate-700' : 'text-slate-500 hover:text-slate-300')}`}
                            >
                               🍽️ Comer no Local
                            </button>
                         </div>

                         {tipoEntrega === 'local' ? (
                            <div className="space-y-4">
                               <div>
                                  <label className={`block text-xs font-bold uppercase tracking-widest mb-2 ${isLight ? 'text-slate-500' : 'text-slate-400'}`}>
                                     Seu Nome Completo *
                                  </label>
                                  <input 
                                     type="text"
                                     value={clienteNome}
                                     onChange={(e) => setClienteNome(e.target.value)}
                                     placeholder="Ex: João da Silva"
                                     className={`w-full p-4 rounded-xl border focus:outline-none focus:ring-2 transition-all ${isLight ? 'bg-slate-50 border-slate-200 focus:ring-slate-200' : 'bg-white/5 border-white/10 focus:ring-white/10 text-white'}`}
                                  />
                               </div>
                               <div>
                                  <label className={`block text-xs font-bold uppercase tracking-widest mb-2 ${isLight ? 'text-slate-500' : 'text-slate-400'}`}>
                                     Número da Mesa (Opcional)
                                  </label>
                                  <input 
                                     type="text"
                                     value={mesa}
                                     onChange={(e) => setMesa(e.target.value)}
                                     placeholder="Ex: Mesa 05"
                                     className={`w-full p-4 rounded-xl border focus:outline-none focus:ring-2 transition-all ${isLight ? 'bg-slate-50 border-slate-200 focus:ring-slate-200' : 'bg-white/5 border-white/10 focus:ring-white/10 text-white'}`}
                                  />
                               </div>
                            </div>
                         ) : (
                            <div className="space-y-4">
                               <div>
                                  <label className={`block text-xs font-bold uppercase tracking-widest mb-2 ${isLight ? 'text-slate-500' : 'text-slate-400'}`}>
                                     Seu Nome Completo *
                                  </label>
                                  <input 
                                     type="text"
                                     value={clienteNome}
                                     onChange={(e) => setClienteNome(e.target.value)}
                                     placeholder="Ex: João da Silva"
                                     className={`w-full p-4 rounded-xl border focus:outline-none focus:ring-2 transition-all ${isLight ? 'bg-slate-50 border-slate-200 focus:ring-slate-200' : 'bg-white/5 border-white/10 focus:ring-white/10 text-white'}`}
                                  />
                               </div>
                               <div>
                                  <label className={`block text-xs font-bold uppercase tracking-widest mb-2 ${isLight ? 'text-slate-500' : 'text-slate-400'}`}>
                                     WhatsApp (Celular) *
                                  </label>
                                  <input 
                                     type="tel"
                                     value={telefoneCli}
                                     onChange={(e) => setTelefoneCli(e.target.value)}
                                     placeholder="(00) 00000-0000"
                                     className={`w-full p-4 rounded-xl border focus:outline-none focus:ring-2 transition-all ${isLight ? 'bg-slate-50 border-slate-200 focus:ring-slate-200' : 'bg-white/5 border-white/10 focus:ring-white/10 text-white'}`}
                                  />
                               </div>
                               
                               <div className="pt-2">
                                  <h4 className={`text-sm font-bold flex items-center gap-2 mb-4 ${isLight ? 'text-slate-900' : 'text-white'}`}>
                                     <Home className="w-4 h-4" /> Endereço de Entrega
                                  </h4>
                                  <div className="space-y-4">
                                     <div>
                                        <input 
                                           type="text"
                                           value={rua}
                                           onChange={(e) => setRua(e.target.value)}
                                           placeholder="Rua / Avenida *"
                                           className={`w-full p-4 rounded-xl border focus:outline-none focus:ring-2 transition-all ${isLight ? 'bg-slate-50 border-slate-200 focus:ring-slate-200' : 'bg-white/5 border-white/10 focus:ring-white/10 text-white'}`}
                                        />
                                     </div>
                                     <div className="grid grid-cols-2 gap-4">
                                        <input 
                                           type="text"
                                           value={numero}
                                           onChange={(e) => setNumero(e.target.value)}
                                           placeholder="Nº *"
                                           className={`w-full p-4 rounded-xl border focus:outline-none focus:ring-2 transition-all ${isLight ? 'bg-slate-50 border-slate-200 focus:ring-slate-200' : 'bg-white/5 border-white/10 focus:ring-white/10 text-white'}`}
                                        />
                                        <input 
                                           type="text"
                                           value={bairro}
                                           onChange={(e) => setBairro(e.target.value)}
                                           placeholder="Bairro *"
                                           className={`w-full p-4 rounded-xl border focus:outline-none focus:ring-2 transition-all ${isLight ? 'bg-slate-50 border-slate-200 focus:ring-slate-200' : 'bg-white/5 border-white/10 focus:ring-white/10 text-white'}`}
                                        />
                                     </div>
                                     <input 
                                        type="text"
                                        value={complemento}
                                        onChange={(e) => setComplemento(e.target.value)}
                                        placeholder="Complemento (Apt, Bloco...)"
                                        className={`w-full p-4 rounded-xl border focus:outline-none focus:ring-2 transition-all ${isLight ? 'bg-slate-50 border-slate-200 focus:ring-slate-200' : 'bg-white/5 border-white/10 focus:ring-white/10 text-white'}`}
                                     />
                                  </div>
                               </div>
                            </div>
                         )}
                      </div>
                   ) : (
                      cart.map(item => (
                         <div key={item.produto.id} className={`flex items-center justify-between border-b pb-4 last:border-0 last:pb-0 ${isLight ? 'border-slate-100' : 'border-white/5'}`}>
                             <div>
                                <h4 className={`font-semibold ${isLight ? 'text-slate-900' : 'text-white'}`}>{item.produto.nome}</h4>
                                <p className={`text-sm mt-0.5 ${isLight ? 'text-slate-500' : 'text-slate-400'}`}>
                                   {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(item.produto.preco)}
                                </p>
                             </div>
                             <div className={`flex items-center rounded-full border ${isLight ? 'bg-slate-100 border-slate-200' : 'bg-white/5 border-white/10'}`}>
                                <button onClick={() => removeFromCart(item.produto.id)} className={`p-2 rounded-full transition-colors ${isLight ? 'text-slate-700 hover:bg-slate-200' : 'text-white hover:bg-white/10'}`}>
                                   <Minus className="w-4 h-4" />
                                </button>
                                <span className={`w-6 text-center text-sm font-semibold ${isLight ? 'text-slate-900' : 'text-white'}`}>{item.quantidade}</span>
                                <button onClick={() => addToCart(item.produto)} className={`p-2 rounded-full transition-colors ${isLight ? 'text-slate-700 hover:bg-slate-200' : 'text-white hover:bg-white/10'}`}>
                                   <Plus className="w-4 h-4" />
                                </button>
                             </div>
                         </div>
                      ))
                   )}
                </div>

                {cart.length > 0 && (
                   <div className={`p-5 border-t ${isLight ? 'border-slate-100 bg-slate-50' : 'border-white/5 bg-[#161616]'}`}>
                      <div className="flex items-center justify-between mb-4">
                         <span className={isLight ? 'text-slate-500' : 'text-slate-400'}>Total a pagar:</span>
                         <span className={`text-2xl font-bold ${isLight ? 'text-slate-900' : 'text-white'}`}>
                            {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(totalPrice)}
                         </span>
                      </div>
                      
                      {(restaurante.pedido_minimo || 0) > totalPrice ? (
                        <div className={`w-full py-4 rounded-xl flex items-center justify-center text-center font-semibold cursor-not-allowed border ${isLight ? 'bg-slate-100 text-slate-500 border-slate-200' : 'bg-white/5 text-slate-400 border-white/10'}`}>
                           Falta {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format((restaurante.pedido_minimo || 0) - totalPrice)} para o pedido mínimo
                        </div>
                      ) : isCheckout ? (
                        <div className="flex gap-3">
                           <button 
                              onClick={() => setIsCheckout(false)}
                              className={`flex-1 py-4 rounded-xl font-bold text-lg transition-all ${isLight ? 'bg-slate-100 text-slate-600 hover:bg-slate-200' : 'bg-white/5 text-slate-300 hover:bg-white/10'}`}
                           >
                              Voltar para Sacola
                           </button>
                           <button 
                              disabled={!clienteNome || (tipoEntrega === 'delivery' && (!rua || !numero || !bairro || !telefoneCli))}
                              onClick={enviarPedidoWhatsApp}
                              className="flex-[2] py-4 rounded-xl flex items-center justify-center gap-2 text-white font-bold text-lg transition-transform hover:scale-[1.02] active:scale-95 shadow-xl disabled:opacity-50 disabled:cursor-not-allowed"
                              style={{ backgroundColor: primaryColor }}
                           >
                              Confirmar Pedido
                           </button>
                        </div>
                      ) : (
                        <button 
                           onClick={() => setIsCheckout(true)}
                           className="w-full py-4 rounded-xl flex items-center justify-center gap-2 text-white font-bold text-lg transition-transform hover:scale-[1.02] active:scale-95 shadow-xl"
                           style={{ backgroundColor: primaryColor }}
                        >
                           <MessageCircle className="w-6 h-6" />
                           Fazer Pedido por WhatsApp
                        </button>
                      )}
                   </div>
                )}
             </div>
          </div>
       )}

       {/* Info Modal */}
       {isInfoModalOpen && (
          <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 bg-black/60 backdrop-blur-sm">
             <div className={`w-full max-w-lg sm:border sm:rounded-3xl rounded-t-3xl overflow-hidden flex flex-col max-h-[90vh] shadow-2xl animate-in slide-in-from-bottom-5 ${isLight ? 'bg-white border-slate-200' : 'bg-[#111] border-white/10'}`}>
                <div className={`flex items-center justify-between p-5 border-b ${isLight ? 'border-slate-100' : 'border-white/5'}`}>
                   <h2 className="text-xl font-bold flex items-center gap-2 text-inherit">
                       <Info className="w-5 h-5" style={{ color: primaryColor }} />
                       Informações da Loja
                   </h2>
                   <button onClick={() => setIsInfoModalOpen(false)} className={`p-2 rounded-full transition-colors ${isLight ? 'text-slate-400 hover:text-slate-700 bg-slate-100 hover:bg-slate-200' : 'text-slate-400 hover:text-white bg-white/5 hover:bg-white/10'}`}>
                      <X className="w-5 h-5" />
                   </button>
                </div>
                
                <div className="p-5 space-y-6">
                   <div>
                      <h3 className={`text-sm font-semibold uppercase tracking-wider mb-2 ${isLight ? 'text-slate-500' : 'text-slate-400'}`}>Endereço</h3>
                      <p className={`text-base leading-relaxed break-words whitespace-pre-wrap ${isLight ? 'text-slate-900' : 'text-white'}`}>
                        {restaurante.endereco || "Não informado"}
                      </p>
                   </div>
                   
                   <div>
                      <h3 className={`text-sm font-semibold uppercase tracking-wider mb-2 ${isLight ? 'text-slate-500' : 'text-slate-400'}`}>Horário de Atendimento</h3>
                      <p className={`text-base leading-relaxed break-words whitespace-pre-wrap ${isLight ? 'text-slate-900' : 'text-white'}`}>
                        {restaurante.horario_atendimento || "Não informado"}
                      </p>
                   </div>
                   
                   <div>
                      <h3 className={`text-sm font-semibold uppercase tracking-wider mb-2 ${isLight ? 'text-slate-500' : 'text-slate-400'}`}>Formas de Pagamento</h3>
                      <p className={`text-base leading-relaxed break-words whitespace-pre-wrap ${isLight ? 'text-slate-900' : 'text-white'}`}>
                        {restaurante.formas_pagamento || "Não informado"}
                      </p>
                   </div>
                   
                   <div>
                      <h3 className={`text-sm font-semibold uppercase tracking-wider mb-2 ${isLight ? 'text-slate-500' : 'text-slate-400'}`}>Pedido Mínimo</h3>
                      <p className="text-base font-medium" style={{ color: primaryColor }}>
                        {restaurante.pedido_minimo 
                          ? new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(restaurante.pedido_minimo) 
                          : "Sem valor mínimo"}
                      </p>
                   </div>

                   <div>
                      <h3 className={`text-sm font-semibold tracking-wider mb-3 ${isLight ? 'text-slate-500' : 'text-slate-400'}`}>Redes Sociais</h3>
                      {restaurante.instagram ? (
                         <a 
                            href={restaurante.instagram.startsWith('http') ? restaurante.instagram : `https://instagram.com/${restaurante.instagram.replace('@', '')}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className={`inline-flex items-center gap-2 px-4 py-2.5 rounded-xl font-medium transition-colors ${isLight ? 'bg-slate-100 text-slate-700 hover:bg-slate-200' : 'bg-white/5 text-white hover:bg-white/10'}`}
                         >
                            <Instagram className="w-5 h-5" style={{ color: primaryColor }} />
                            {restaurante.instagram.startsWith('http') ? 'Instagram' : restaurante.instagram}
                         </a>
                      ) : (
                         <p className={`text-base leading-relaxed ${isLight ? 'text-slate-900' : 'text-white'}`}>Não informado</p>
                      )}
                   </div>
                </div>
             </div>
          </div>
       )}

       {/* My Orders Modal */}
       {isMyOrdersModalOpen && (
          <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 bg-black/60 backdrop-blur-sm">
             <div className={`w-full max-w-lg sm:border sm:rounded-3xl rounded-t-3xl overflow-hidden flex flex-col h-[85vh] sm:h-auto sm:max-h-[90vh] shadow-2xl animate-in slide-in-from-bottom-5 ${isLight ? 'bg-white border-slate-200' : 'bg-[#111] border-white/10'}`}>
                <div className={`flex items-center justify-between p-5 border-b shrink-0 ${isLight ? 'border-slate-100' : 'border-white/5'}`}>
                   <h2 className="text-xl font-bold flex items-center gap-2 text-inherit">
                       <ListOrdered className="w-5 h-5" style={{ color: primaryColor }} />
                       Meus Pedidos
                   </h2>
                   <button onClick={() => setIsMyOrdersModalOpen(false)} className={`p-2 rounded-full transition-colors ${isLight ? 'text-slate-400 hover:text-slate-700 bg-slate-100 hover:bg-slate-200' : 'text-slate-400 hover:text-white bg-white/5 hover:bg-white/10'}`}>
                      <X className="w-5 h-5" />
                   </button>
                </div>

                <div className="overflow-y-auto p-5 space-y-4">
                   {meusPedidos.length === 0 ? (
                      <div className={`text-center py-8 ${isLight ? 'text-slate-500' : 'text-slate-500'}`}>
                         <ListOrdered className="w-12 h-12 mx-auto mb-3 opacity-20" />
                         <p>Nenhum pedido recente neste restaurante.</p>
                      </div>
                   ) : (
                      meusPedidos.map(pedido => (
                         <div key={pedido.id} className={`p-4 rounded-xl border flex flex-col ${isLight ? 'bg-slate-50 border-slate-200' : 'bg-[#0f0f0f] border-white/10'}`}>
                            <div className="flex justify-between items-start mb-2">
                               <div className="font-bold text-lg text-inherit">
                                  #{pedido.id.substring(0, 8).toUpperCase()}
                               </div>
                               <span className={`px-2 flex-shrink-0 py-1 rounded-md text-[10px] font-black uppercase tracking-widest ${
                                   pedido.status === 'pendente' ? 'bg-indigo-500/10 text-indigo-400' :
                                   pedido.status === 'preparando' ? 'bg-orange-500/10 text-orange-400' :
                                   pedido.status === 'concluido' ? 'bg-emerald-500/10 text-emerald-400' :
                                   pedido.status === 'cancelado' ? 'bg-red-500/10 text-red-500' :
                                   'bg-slate-500/10 text-slate-400'
                               }`}>
                                  {pedido.status}
                               </span>
                            </div>
                            <div className={`text-xs mb-3 font-medium ${isLight ? 'text-slate-500' : 'text-slate-400'}`}>
                               {new Date(pedido.created_at).toLocaleString('pt-BR')}
                            </div>
                            <div className="space-y-1 mb-4 flex-1">
                               {pedido.itens?.map((item: any, i: number) => (
                                  <div key={i} className={`text-sm ${isLight ? 'text-slate-700' : 'text-slate-300'}`}>
                                     {item.quantidade}x {item.produto?.nome}
                                  </div>
                                ))}
                            </div>
                            <div className={`text-sm font-bold mb-4 ${isLight ? 'text-slate-900' : 'text-white'}`}>
                               Total: {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(pedido.total)}
                            </div>

                            {pedido.status === 'pendente' ? (
                               <button 
                                  onClick={() => {
                                     if(confirm('Deseja realmente cancelar este pedido?')) {
                                        cancelarMeuPedido(pedido.id);
                                     }
                                  }}
                                  className="w-full py-3 rounded-lg border border-red-500 text-red-500 font-bold hover:bg-red-500/10 transition-colors"
                               >
                                  Cancelar Pedido
                               </button>
                            ) : pedido.status === 'cancelado' ? (
                               <div className="w-full py-3 rounded-lg border border-red-500/20 bg-red-500/10 text-red-400 font-bold text-center text-sm">
                                  Pedido Cancelado
                               </div>
                            ) : (
                               <div className={`w-full p-3 rounded-lg text-xs font-bold text-center leading-relaxed ${isLight ? 'bg-slate-100 text-slate-500' : 'bg-white/5 text-slate-400'}`}>
                                  Pedido em produção.<br/>Entre em contato com a loja para alterações.
                               </div>
                            )}
                         </div>
                      ))
                   )}
                </div>
             </div>
          </div>
       )}

    </div>
  );
}
