"use client";

import { use, useEffect, useState } from "react";
import { supabase, isSupabaseConfigured } from "@/lib/supabase";
import { ShoppingCart, Image as ImageIcon, Store, Loader2, UtensilsCrossed } from "lucide-react";

interface PageProps {
  params: Promise<{ slug: string }>;
}

interface Restaurante {
  id: string;
  nome: string;
  cor_primaria?: string;
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

export default function PublicMenuPage(props: PageProps) {
  const params = use(props.params);
  const slug = params.slug;

  const [loading, setLoading] = useState(true);
  const [restaurante, setRestaurante] = useState<Restaurante | null>(null);
  const [categorias, setCategorias] = useState<Categoria[]>([]);
  const [produtos, setProdutos] = useState<Produto[]>([]);
  const [activeCategory, setActiveCategory] = useState<string | null>(null);

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
                                  <div className="mt-3 font-bold text-[15px]" style={{ color: primaryColor }}>
                                     {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(produto.preco)}
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
       <div className="fixed bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-[#050505] via-[#050505]/95 to-transparent pointer-events-none pb-8 pt-12">
          <div className="max-w-3xl mx-auto pointer-events-auto">
             <button 
                className="w-full flex items-center justify-between p-4 rounded-2xl shadow-2xl transition-transform hover:scale-[1.02] active:scale-95 border border-black/10"
                style={{ backgroundColor: primaryColor, color: '#fff' }}
             >
                <div className="flex items-center gap-3">
                   <div className="bg-black/20 p-2.5 rounded-full">
                      <ShoppingCart className="w-5 h-5 text-white" />
                   </div>
                   <span className="font-semibold tracking-wide">Ver Sacola (0)</span>
                </div>
                <span className="font-bold tracking-wide">R$ 0,00</span>
             </button>
          </div>
       </div>

    </div>
  );
}
