"use client";

import { useEffect, useState } from "react";
import { Plus, Loader2, Tag, UtensilsCrossed, AlignLeft, DollarSign, Trash2, Image as ImageIcon } from "lucide-react";
import { supabase, isSupabaseConfigured } from "@/lib/supabase";

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
}

export default function CardapioPage() {
  const [categorias, setCategorias] = useState<Categoria[]>([]);
  const [produtos, setProdutos] = useState<Produto[]>([]);
  const [loadingInitial, setLoadingInitial] = useState(true);

  const [novaCatNome, setNovaCatNome] = useState("");
  const [loadingCat, setLoadingCat] = useState(false);

  const [novoProdNome, setNovoProdNome] = useState("");
  const [novoProdDesc, setNovoProdDesc] = useState("");
  const [novoProdPreco, setNovoProdPreco] = useState("");
  const [novoProdCat, setNovoProdCat] = useState("");
  const [imagemFile, setImagemFile] = useState<File | null>(null);
  const [loadingProd, setLoadingProd] = useState(false);

  const [restauranteId, setRestauranteId] = useState<string | null>(null);
  const [feedback, setFeedback] = useState<{ type: 'success' | 'error', msg: string } | null>(null);

  useEffect(() => {
    fetchInitialData();
  }, []);

  const showFeedback = (type: 'success' | 'error', msg: string) => {
    setFeedback({ type, msg });
    setTimeout(() => setFeedback(null), 5000);
  };

  const fetchInitialData = async () => {
    if (!isSupabaseConfigured) {
      setLoadingInitial(false);
      return;
    }

    try {
      setLoadingInitial(true);
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      // Buscar ID do restaurante
      const { data: restData, error: restError } = await supabase
        .from("restaurantes")
        .select("id")
        .eq("owner_id", user.id)
        .single();

      if (restError) {
        console.error("Erro do Supabase:", restError.message, restError.details);
        showFeedback('error', 'Erro ao carregar seu restaurante. Contate o suporte.');
        return;
      }
      
      const rId = restData?.id;
      if (!rId) return;

      setRestauranteId(rId);

      const [catRes, prodRes] = await Promise.all([
        supabase.from("categorias").select("*").eq("restaurante_id", rId).order('created_at', { ascending: true }),
        supabase.from("produtos").select("*").in('categoria_id', (
           // Para pegar os produtos, buscamos os que pertecem às categorias deste restaurante, 
           // ou se produtos tiver restaurante_id, usaríamos ele. Como a modelagem costuma vincular
           // produtos à categoria, vamos trazer os produtos se tivermos as categorias depois.
           // Assumiremos que a tabela produtos também tem restaurante_id para simplificar, 
           // se não tiver a API vai reclamar. Vamos tentar sem restaurante_id e ao invés disso
           // buscar todos assim que tivermos as categorias.
           [] // Placeholder, vamos fazer via inner select se der mas Supabase não suporta in-array nativo assim facilmente no SDK
        )) // we will fetch products later
      ]);

      let catList = catRes.data || [];
      setCategorias(catList);

      if (catList.length > 0) {
        const catIds = catList.map(c => c.id);
        const { data: pData } = await supabase
          .from("produtos")
          .select("*")
          .in('categoria_id', catIds)
          .order('created_at', { ascending: true });
          
        if (pData) setProdutos(pData);
        setNovoProdCat(catList[0].id);
      }

    } catch (error: any) {
      console.error("Erro ao buscar dados:", error);
      showFeedback('error', 'Falha ao carregar os dados. Verifique a estrutura do banco.');
    } finally {
      setLoadingInitial(false);
    }
  };

  const handleAddCategory = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!novaCatNome.trim() || !isSupabaseConfigured) return;

    if (!restauranteId) {
      showFeedback('error', 'Erro interno: ID do restaurante não encontrado.');
      return;
    }

    try {
      setLoadingCat(true);
      const { data, error } = await supabase
        .from("categorias")
        .insert([{ nome: novaCatNome, restaurante_id: restauranteId }])
        .select();

      if (error) throw error;
      
      if (data) {
        setCategorias([...categorias, data[0]]);
        setNovaCatNome("");
        if (!novoProdCat) setNovoProdCat(data[0].id);
        showFeedback('success', 'Categoria adicionada com sucesso!');
      }
    } catch (error: any) {
      console.error("Erro ao adicionar categoria:", error);
      showFeedback('error', 'Erro ao adicionar categoria. Verifique o banco de dados.');
    } finally {
      setLoadingCat(false);
    }
  };

  const handleAddProduct = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!novoProdNome.trim() || !novoProdPreco || !novoProdCat || !isSupabaseConfigured) return;

    if (!restauranteId) {
      showFeedback('error', 'Erro interno: ID do restaurante não encontrado.');
      return;
    }

    try {
      setLoadingProd(true);
      const priceVal = parseFloat(novoProdPreco.replace(',', '.'));
      let imagem_url = null;

      // Lógica de Upload da Imagem
      if (imagemFile) {
        const fileExt = imagemFile.name.split('.').pop();
        const fileName = `${Date.now()}-${Math.random().toString(36).substring(7)}.${fileExt}`;
        const filePath = `${restauranteId}/${fileName}`;

        const { error: uploadError } = await supabase.storage
          .from('midia')
          .upload(filePath, imagemFile);

        if (uploadError) {
          throw new Error('Falha no upload da imagem: ' + uploadError.message);
        }

        const { data: publicUrlData } = supabase.storage
          .from('midia')
          .getPublicUrl(filePath);

        imagem_url = publicUrlData.publicUrl;
      }
      
      const { data, error } = await supabase
        .from("produtos")
        .insert([{ 
          nome: novoProdNome, 
          descricao: novoProdDesc, 
          preco: priceVal, 
          categoria_id: novoProdCat,
          imagem_url: imagem_url
        }])
        .select();

      if (error) throw error;

      if (data) {
        setProdutos([...produtos, data[0]]);
        setNovoProdNome("");
        setNovoProdDesc("");
        setNovoProdPreco("");
        setImagemFile(null);
        // Reset the file input visually
        const fileInput = document.getElementById('imagem_upload') as HTMLInputElement;
        if (fileInput) fileInput.value = '';
        showFeedback('success', 'Produto adicionado com sucesso!');
      }
    } catch (error: any) {
      console.error("Erro ao adicionar produto:", error);
      showFeedback('error', error.message || 'Erro ao adicionar produto.');
    } finally {
      setLoadingProd(false);
    }
  };

  const handleDeleteProduct = async (id: string) => {
    if (!confirm("Tem certeza que deseja remover este produto?")) return;
    
    try {
      const { error } = await supabase.from("produtos").delete().eq("id", id);
      if (error) throw error;
      setProdutos(produtos.filter(p => p.id !== id));
      showFeedback('success', 'Produto removido com sucesso!');
    } catch(err: any) {
      console.error(err);
      showFeedback('error', 'Erro ao remover produto.');
    }
  }

  const handleDeleteCategory = async (id: string) => {
    if (!confirm("Tem certeza? Isso pode remover produtos dentro da categoria.")) return;
    
    try {
      const { error } = await supabase.from("categorias").delete().eq("id", id);
      if (error) throw error;
      setCategorias(categorias.filter(c => c.id !== id));
      setProdutos(produtos.filter(p => p.categoria_id !== id));
      showFeedback('success', 'Categoria removida com sucesso!');
    } catch(err: any) {
      console.error(err);
      showFeedback('error', 'Erro ao remover categoria.');
    }
  }

  if (loadingInitial) {
    return (
      <div className="flex h-[60vh] items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-indigo-500" />
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto space-y-8 pb-12">
      {!isSupabaseConfigured && (
        <div className="bg-red-500/10 border border-red-500/20 text-red-400 p-4 rounded-xl text-sm flex items-center">
          <span className="font-semibold mr-2">Aviso:</span> Conecte suas chaves do Supabase em .env.local para testar o banco de dados.
        </div>
      )}

      {feedback && (
        <div className={`p-4 rounded-xl text-sm flex items-center shadow-lg transition-all ${
          feedback.type === 'success' ? 'bg-emerald-500/10 border border-emerald-500/20 text-emerald-400' : 'bg-red-500/10 border border-red-500/20 text-red-400'
        }`}>
          {feedback.msg}
        </div>
      )}

      <div>
        <h1 className="text-2xl font-bold text-white tracking-tight">Gerenciamento de Cardápio</h1>
        <p className="text-sm text-slate-400 mt-1">Organize suas categorias e produtos do MenuFlow com facilidade.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Painel Esquerdo: Formulários */}
        <div className="lg:col-span-4 space-y-6">
          {/* Adicionar Categoria */}
          <div className="bg-white/5 border border-white/10 p-6 rounded-xl shadow-xl relative overflow-hidden backdrop-blur-sm">
            <div className="absolute top-0 left-0 w-1 h-full bg-indigo-500"></div>
            <h2 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
              <Tag className="w-5 h-5 text-indigo-400" />
              Nova Categoria
            </h2>
            <form onSubmit={handleAddCategory} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-400 uppercase tracking-widest mb-2">
                  Nome da Categoria
                </label>
                <input
                  type="text"
                  required
                  value={novaCatNome}
                  onChange={(e) => setNovaCatNome(e.target.value)}
                  className="w-full bg-[#0a0a0a]/50 border border-white/10 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-indigo-500/50 focus:ring-1 focus:ring-indigo-500/50 transition-all"
                  placeholder="Ex: Lanches, Bebidas"
                />
              </div>
              <button
                type="submit"
                disabled={loadingCat || !novaCatNome.trim()}
                className="w-full flex h-11 items-center justify-center bg-indigo-500 hover:bg-indigo-600 text-white rounded-xl px-4 text-sm font-bold shadow-lg shadow-indigo-500/20 transition-all disabled:opacity-70 disabled:cursor-not-allowed"
              >
                {loadingCat ? (
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                ) : (
                  <Plus className="mr-2 h-4 w-4" />
                )}
                {loadingCat ? 'Salvando...' : 'Adicionar Categoria'}
              </button>
            </form>
          </div>

          {/* Adicionar Produto */}
          <div className="bg-white/5 border border-white/10 p-6 rounded-xl shadow-xl relative overflow-hidden backdrop-blur-sm">
             <div className="absolute top-0 left-0 w-1 h-full bg-emerald-500"></div>
            <h2 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
              <UtensilsCrossed className="w-5 h-5 text-emerald-400" />
              Novo Produto
            </h2>
            <form onSubmit={handleAddProduct} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-400 uppercase tracking-widest mb-2">
                  Categoria
                </label>
                <select
                  required
                  value={novoProdCat}
                  onChange={(e) => setNovoProdCat(e.target.value)}
                  className="w-full bg-[#0a0a0a]/50 border border-white/10 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-emerald-500/50 focus:ring-1 focus:ring-emerald-500/50 transition-all appearance-none"
                >
                  <option value="" disabled>Selecione uma categoria</option>
                  {categorias.map(c => (
                    <option key={c.id} value={c.id}>{c.nome}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-400 uppercase tracking-widest mb-2">
                  Nome do Produto
                </label>
                <input
                  type="text"
                  required
                  value={novoProdNome}
                  onChange={(e) => setNovoProdNome(e.target.value)}
                  className="w-full bg-[#0a0a0a]/50 border border-white/10 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-emerald-500/50 focus:ring-1 focus:ring-emerald-500/50 transition-all"
                  placeholder="Ex: X-Salada Especial"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-400 uppercase tracking-widest mb-2">
                  Descrição
                </label>
                <textarea
                  value={novoProdDesc}
                  onChange={(e) => setNovoProdDesc(e.target.value)}
                  rows={2}
                  className="w-full bg-[#0a0a0a]/50 border border-white/10 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-emerald-500/50 focus:ring-1 focus:ring-emerald-500/50 transition-all resize-none"
                  placeholder="Ingredientes..."
                ></textarea>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-400 uppercase tracking-widest mb-2">
                  Preço
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                    <DollarSign className="h-4 w-4 text-slate-500" />
                  </div>
                  <input
                    type="number"
                    step="0.01"
                    min="0"
                    required
                    value={novoProdPreco}
                    onChange={(e) => setNovoProdPreco(e.target.value)}
                    className="w-full bg-[#0a0a0a]/50 border border-white/10 rounded-xl pl-10 pr-4 py-3 text-sm text-white focus:outline-none focus:border-emerald-500/50 focus:ring-1 focus:ring-emerald-500/50 transition-all"
                    placeholder="0.00"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-400 uppercase tracking-widest mb-2">
                  Imagem do Produto
                </label>
                <div className="relative">
                  <input
                    type="file"
                    id="imagem_upload"
                    accept="image/png, image/jpeg, image/webp"
                    onChange={(e) => setImagemFile(e.target.files?.[0] || null)}
                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                  />
                  <div className="w-full flex items-center justify-center border border-dashed border-white/20 bg-[#0a0a0a]/50 rounded-xl px-4 py-4 text-sm text-slate-400 hover:border-emerald-500/50 hover:bg-white/5 transition-all">
                     <ImageIcon className="w-5 h-5 mr-2 text-slate-500" />
                     {imagemFile ? imagemFile.name : "Clique ou arraste uma foto"}
                  </div>
                </div>
              </div>

              <button
                type="submit"
                disabled={loadingProd || !novoProdNome.trim() || !novoProdCat || categorias.length === 0}
                className="w-full mt-2 flex h-11 items-center justify-center bg-emerald-500 hover:bg-emerald-600 text-white rounded-xl px-4 text-sm font-bold shadow-lg shadow-emerald-500/20 transition-all disabled:opacity-70 disabled:cursor-not-allowed"
              >
                {loadingProd ? (
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                ) : (
                  <Plus className="mr-2 h-4 w-4" />
                )}
                {loadingProd ? 'Salvando...' : 'Adicionar Produto'}
              </button>
            </form>
          </div>
        </div>

        {/* Painel Direito: Listagem do Cardápio */}
        <div className="lg:col-span-8">
          <div className="bg-white/5 border border-white/10 rounded-xl p-6 shadow-xl min-h-[600px] backdrop-blur-sm">
            <h2 className="text-lg font-semibold text-white mb-6 flex items-center gap-2">
              <AlignLeft className="w-5 h-5 text-slate-400" />
              Cardápio Cadastrado
            </h2>

            {categorias.length === 0 ? (
              <div className="border border-dashed border-white/10 bg-[#0a0a0a]/30 rounded-2xl p-12 text-center flex flex-col items-center justify-center h-[400px]">
                <AlignLeft className="w-12 h-12 text-slate-600 mb-4" />
                <h3 className="text-lg font-medium text-white">Nenhuma categoria cadastrada</h3>
                <p className="text-slate-400 mt-1 max-w-sm text-sm">
                  Comece adicionando uma categoria ao lado para montar o cardápio do seu restaurante.
                </p>
              </div>
            ) : (
              <div className="space-y-8">
                {categorias.map((categoria) => {
                  const catProducts = produtos.filter(p => p.categoria_id === categoria.id);
                  
                  return (
                    <div key={categoria.id} className="space-y-4">
                      {/* Cabeçalho da Categoria */}
                      <div className="flex items-center justify-between border-b border-white/10 pb-2">
                        <h3 className="text-xl font-bold tracking-tight text-white flex items-center gap-2">
                          <span className="w-2 h-2 rounded-full bg-indigo-500"></span>
                          {categoria.nome}
                        </h3>
                        <button 
                          onClick={() => handleDeleteCategory(categoria.id)}
                          className="text-slate-500 hover:text-red-400 transition-colors p-1"
                          title="Remover Categoria"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>

                      {/* Lista de Produtos */}
                      {catProducts.length === 0 ? (
                        <div className="bg-white/5 border border-indigo-500/10 rounded-xl p-4">
                          <p className="text-sm text-slate-500 italic">Nenhum produto nesta categoria.</p>
                        </div>
                      ) : (
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          {catProducts.map(produto => (
                            <div key={produto.id} className="bg-white/5 border border-white/10 rounded-xl flex overflow-hidden hover:bg-white/10 transition-colors group">
                              {/* Imagem do Produto */}
                              {produto.imagem_url ? (
                                <div className="w-24 shrink-0 bg-black overflow-hidden border-r border-white/5">
                                  {/* eslint-disable-next-line @next/next/no-img-element */}
                                  <img 
                                    src={produto.imagem_url} 
                                    alt={produto.nome}
                                    className="w-full h-full object-cover opacity-90 group-hover:opacity-100 transition-opacity group-hover:scale-105 duration-500"
                                  />
                                </div>
                              ) : (
                                <div className="w-24 shrink-0 bg-white/5 border-r border-white/5 flex items-center justify-center text-slate-600">
                                   <ImageIcon className="w-6 h-6" />
                                </div>
                              )}
                              
                              <div className="p-4 flex flex-col justify-between flex-1">
                                <div>
                                  <div className="flex items-start justify-between gap-2">
                                    <h4 className="font-semibold text-white text-base leading-tight">{produto.nome}</h4>
                                    <span className="font-bold text-emerald-400 text-sm whitespace-nowrap bg-emerald-500/10 px-2 py-0.5 rounded">
                                      {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(produto.preco)}
                                    </span>
                                  </div>
                                  {produto.descricao && (
                                    <p className="text-slate-400 text-xs mt-1.5 line-clamp-2 leading-relaxed">{produto.descricao}</p>
                                  )}
                                </div>
                                <div className="flex items-center justify-end mt-2 h-6 relative overflow-hidden">
                                  <button 
                                    onClick={() => handleDeleteProduct(produto.id)}
                                    className="text-slate-500 hover:text-red-400 transition-all text-xs flex items-center font-medium translate-y-8 group-hover:translate-y-0 opacity-0 group-hover:opacity-100"
                                    title="Remover Produto"
                                  >
                                    <Trash2 className="w-3 h-3 mr-1" /> Remover
                                  </button>
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>
        
      </div>
    </div>
  );
}
