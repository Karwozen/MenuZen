"use client";

import { useEffect, useState } from "react";
import { supabase, isSupabaseConfigured } from "@/lib/supabase";
import { Loader2, Settings, Smartphone, Link as LinkIcon, Save, Image as ImageIcon, Palette, Upload } from "lucide-react";

export default function ConfiguracoesPage() {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [uploadingLogo, setUploadingLogo] = useState(false);
  const [nome, setNome] = useState("");
  const [whatsapp, setWhatsapp] = useState("");
  const [slug, setSlug] = useState("");
  const [logoUrl, setLogoUrl] = useState("");
  const [corTema, setCorTema] = useState("#10b981");
  const [userId, setUserId] = useState<string | null>(null);
  const [feedback, setFeedback] = useState<{ type: 'success' | 'error', msg: string } | null>(null);

  const showFeedback = (type: 'success' | 'error', msg: string) => {
    setFeedback({ type, msg });
    setTimeout(() => setFeedback(null), 5000);
  };

  useEffect(() => {
    let mounted = true;

    async function fetchData() {
      if (!isSupabaseConfigured) {
        if (mounted) setLoading(false);
        return;
      }

      try {
        const { data: authData } = await supabase.auth.getUser();
        if (!authData.user) return;
        if (mounted) setUserId(authData.user.id);

        const { data, error } = await supabase
          .from('restaurantes')
          .select('*')
          .eq('owner_id', authData.user.id)
          .single();

        if (error) {
          console.error("Erro ao buscar configurações:", error.message);
          return;
        }

        if (data && mounted) {
          setNome(data.nome || "");
          setWhatsapp(data.whatsapp || "");
          setSlug(data.slug || "");
          setLogoUrl(data.logo_url || "");
          setCorTema(data.cor_tema || data.cor_primaria || "#10b981");
        }
      } catch (err) {
        console.error(err);
      } finally {
        if (mounted) setLoading(false);
      }
    }

    fetchData();

    return () => { mounted = false; };
  }, []);

  const handleLogoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    try {
      if (!e.target.files || e.target.files.length === 0) return;
      const file = e.target.files[0];
      setUploadingLogo(true);
      
      const fileExt = file.name.split('.').pop();
      const fileName = `${Math.random()}.${fileExt}`;
      const filePath = `logos/${fileName}`;
      
      const { error: uploadError } = await supabase.storage
        .from('midia')
        .upload(filePath, file);
        
      if (uploadError) throw uploadError;
      
      const { data: { publicUrl } } = supabase.storage
        .from('midia')
        .getPublicUrl(filePath);
        
      setLogoUrl(publicUrl);
      showFeedback('success', 'Logomarca enviada com sucesso!');
    } catch (error) {
      console.error(error);
      showFeedback('error', 'Erro ao enviar a imagem.');
    } finally {
      setUploadingLogo(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!userId || !isSupabaseConfigured) return;

    // Validate whatsapp length
    const numericWhatsapp = whatsapp.replace(/\D/g, '');
    if (numericWhatsapp.length > 0 && numericWhatsapp.length < 10) {
      showFeedback('error', 'Por favor, insira um número de WhatsApp válido com DDD.');
      return;
    }

    setSaving(true);
    try {
      const formattedSlug = slug.toLowerCase().replace(/[^a-z0-9-]/g, '-').replace(/-+/g, '-').replace(/^-|-$/g, '');
      setSlug(formattedSlug);

      const { error } = await supabase
        .from('restaurantes')
        .update({
          nome: nome,
          whatsapp: numericWhatsapp,
          slug: formattedSlug,
          logo_url: logoUrl,
          cor_tema: corTema
        })
        .eq('owner_id', userId);

      if (error) {
        if (error.message.includes('unique_slug') || error.message.includes('restaurantes_slug_key')) {
           showFeedback('error', 'Este link (slug) já está em uso por outro restaurante. Escolha outro.');
        } else {
           showFeedback('error', 'Erro ao salvar as configurações.');
        }
        console.error(error);
        return;
      }

      showFeedback('success', 'Configurações atualizadas com sucesso!');
    } catch (err) {
      console.error(err);
      showFeedback('error', 'Ocorreu um erro inesperado.');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
     return (
       <div className="flex h-[60vh] items-center justify-center">
         <Loader2 className="h-8 w-8 animate-spin text-indigo-500" />
       </div>
     );
  }

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      {feedback && (
        <div className={`p-4 rounded-xl text-sm flex items-center shadow-lg transition-all ${
          feedback.type === 'success' ? 'bg-emerald-500/10 border border-emerald-500/20 text-emerald-400' : 'bg-red-500/10 border border-red-500/20 text-red-400'
        }`}>
          {feedback.msg}
        </div>
      )}

      <div>
        <h1 className="text-2xl font-bold text-white tracking-tight flex items-center gap-3">
          <Settings className="w-7 h-7 text-indigo-500" />
          Configurações do Restaurante
        </h1>
        <p className="text-sm text-slate-400 mt-1">
          Ajuste as informações básicas e o link público do seu cardápio.
        </p>
      </div>

      <div className="bg-white/5 border border-white/10 rounded-2xl shadow-xl overflow-hidden backdrop-blur-sm">
         <div className="p-6 md:p-8">
            <form onSubmit={handleSubmit} className="space-y-8 max-w-xl">
               
               {/* Nome Field */}
               <div>
                  <label className="block text-sm font-semibold text-white mb-2 flex items-center gap-2">
                     <Settings className="w-4 h-4 text-slate-400" />
                     Nome do Restaurante
                  </label>
                  <p className="text-xs text-slate-400 mb-3">
                     O nome do seu negócio que aparecerá no cabeçalho do cardápio.
                  </p>
                  <div className="relative">
                     <input
                        type="text"
                        required
                        value={nome}
                        onChange={(e) => setNome(e.target.value)}
                        className="w-full bg-[#0a0a0a]/50 border border-white/10 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-indigo-500/50 focus:ring-1 focus:ring-indigo-500/50 transition-all"
                        placeholder="Ex: Pizzaria do Zé"
                     />
                  </div>
               </div>

               {/* URL Slug Field */}
               <div>
                  <label className="block text-sm font-semibold text-white mb-2 flex items-center gap-2">
                     <LinkIcon className="w-4 h-4 text-slate-400" />
                     Link do Cardápio (Slug)
                  </label>
                  <p className="text-xs text-slate-400 mb-3">
                     Este será o endereço acessado pelos seus clientes. Ex: meu-restaurante
                  </p>
                  <div className="flex bg-[#0a0a0a]/50 border border-white/10 rounded-xl overflow-hidden focus-within:border-indigo-500/50 focus-within:ring-1 focus-within:ring-indigo-500/50 transition-all">
                     <span className="px-4 py-3 bg-white/5 text-slate-400 border-r border-white/5 text-sm select-none flex items-center">
                        menuflow.app/
                     </span>
                     <input
                        type="text"
                        required
                        value={slug}
                        onChange={(e) => setSlug(e.target.value)}
                        className="flex-1 bg-transparent px-4 py-3 text-sm text-white focus:outline-none"
                        placeholder="meu-restaurante"
                     />
                  </div>
               </div>

               {/* WhatsApp Field */}
               <div>
                  <label className="block text-sm font-semibold text-white mb-2 flex items-center gap-2">
                     <Smartphone className="w-4 h-4 text-slate-400" />
                     WhatsApp para Pedidos
                  </label>
                  <p className="text-xs text-slate-400 mb-3">
                     O número que receberá a mensagem com o pedido do cliente. Apenas números com DDD.
                  </p>
                  <div className="relative">
                     <input
                        type="tel"
                        required
                        value={whatsapp}
                        onChange={(e) => {
                           // Allow only digits
                           const val = e.target.value.replace(/\D/g, '');
                           setWhatsapp(val);
                        }}
                        className="w-full bg-[#0a0a0a]/50 border border-white/10 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-indigo-500/50 focus:ring-1 focus:ring-indigo-500/50 transition-all"
                        placeholder="Ex: 11999999999"
                     />
                  </div>
               </div>

               {/* Logomarca Field */}
               <div>
                  <label className="block text-sm font-semibold text-white mb-2 flex items-center gap-2">
                     <ImageIcon className="w-4 h-4 text-slate-400" />
                     Logomarca do Restaurante
                  </label>
                  <p className="text-xs text-slate-400 mb-3">
                     Será exibida no cabeçalho do seu cardápio público.
                  </p>
                  <div className="flex items-center gap-6">
                     {logoUrl && (
                        <div className="w-16 h-16 rounded-full overflow-hidden border border-white/10 shrink-0 bg-white/5">
                           {/* eslint-disable-next-line @next/next/no-img-element */}
                           <img src={logoUrl} alt="Logo Atual" className="w-full h-full object-cover" />
                        </div>
                     )}
                     <div className="relative">
                        <input 
                           type="file" 
                           accept="image/*"
                           onChange={handleLogoUpload}
                           className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                           disabled={uploadingLogo}
                        />
                        <button 
                           type="button"
                           disabled={uploadingLogo}
                           className="flex items-center gap-2 px-4 py-2.5 bg-white/5 hover:bg-white/10 border border-white/10 rounded-xl text-sm font-medium text-white transition-colors disabled:opacity-50"
                        >
                           {uploadingLogo ? <Loader2 className="w-4 h-4 animate-spin" /> : <Upload className="w-4 h-4" />}
                           {uploadingLogo ? "Enviando..." : logoUrl ? "Trocar Logomarca" : "Enviar Logomarca"}
                        </button>
                     </div>
                  </div>
               </div>

               {/* Cor do Tema */}
               <div>
                  <label className="block text-sm font-semibold text-white mb-2 flex items-center gap-2">
                     <Palette className="w-4 h-4 text-slate-400" />
                     Cor do Tema
                  </label>
                  <p className="text-xs text-slate-400 mb-3">
                     Escolha a cor principal que será usada nos botões e destaques do cardápio.
                  </p>
                  <div className="flex items-center gap-4">
                     <input 
                        type="color" 
                        value={corTema}
                        onChange={(e) => setCorTema(e.target.value)}
                        className="w-12 h-12 rounded overflow-hidden cursor-pointer bg-transparent border-0 p-0"
                     />
                     <span className="text-sm font-mono text-slate-400 p-2 bg-white/5 rounded-lg border border-white/10 uppercase">
                        {corTema}
                     </span>
                  </div>
               </div>

               <div className="pt-4 border-t border-white/10 flex justify-end">
                  <button 
                     type="submit"
                     disabled={saving || !slug.trim()}
                     className="flex h-12 items-center justify-center bg-indigo-500 hover:bg-indigo-600 text-white rounded-xl px-8 text-sm font-bold shadow-lg shadow-indigo-500/20 transition-all disabled:opacity-70 disabled:cursor-not-allowed"
                  >
                     {saving ? (
                        <>
                           <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                           Salvando...
                        </>
                     ) : (
                        <>
                           <Save className="w-4 h-4 mr-2" />
                           Salvar Configurações
                        </>
                     )}
                  </button>
               </div>
               
            </form>
         </div>
      </div>
    </div>
  );
}
