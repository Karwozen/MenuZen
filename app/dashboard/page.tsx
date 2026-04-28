"use client";

import { useEffect, useState } from "react";
import { supabase, isSupabaseConfigured } from "@/lib/supabase";
import { Copy, Download, Share2, Tag, Utensils, Zap, Loader2, Check } from "lucide-react";

interface RestauranteInfo {
  nome: string;
  slug: string;
}

export default function DashboardHome() {
  const [loading, setLoading] = useState(true);
  const [restaurante, setRestaurante] = useState<RestauranteInfo | null>(null);
  const [totalProdutos, setTotalProdutos] = useState(0);
  const [totalCategorias, setTotalCategorias] = useState(0);
  const [copied, setCopied] = useState(false);

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

        const { data: restData, error: restError } = await supabase
          .from('restaurantes')
          .select('id, nome, slug')
          .eq('owner_id', authData.user.id)
          .single();

        if (restError || !restData) {
          console.error("Restaurante não encontrado:", restError);
          if (mounted) setLoading(false);
          return;
        }

        if (mounted) {
          setRestaurante({
            nome: restData.nome,
            slug: restData.slug
          });
        }

        const rId = restData.id;

        const [produtosRes, categoriasRes] = await Promise.all([
          supabase.from('produtos').select('*', { count: 'exact', head: true }).eq('restaurante_id', rId),
          supabase.from('categorias').select('*', { count: 'exact', head: true }).eq('restaurante_id', rId)
        ]);

        if (mounted) {
          setTotalProdutos(produtosRes.count || 0);
          setTotalCategorias(categoriasRes.count || 0);
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

  const handleCopyLink = () => {
    if (!restaurante) return;
    const url = `${window.location.origin}/${restaurante.slug}`;
    navigator.clipboard.writeText(url);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownloadQR = async () => {
    if (!restaurante) return;
    const url = `${window.location.origin}/${restaurante.slug}`;
    const qrUrl = `https://api.qrserver.com/v1/create-qr-code/?size=300x300&data=${encodeURIComponent(url)}`;
    
    try {
      const response = await fetch(qrUrl);
      const blob = await response.blob();
      const blobUrl = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = blobUrl;
      link.download = `qrcode-${restaurante.slug}.png`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(blobUrl);
    } catch (err) {
      console.error("Erro ao baixar QR code:", err);
    }
  };

  if (loading) {
    return (
      <div className="flex h-[60vh] items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-indigo-500" />
      </div>
    );
  }

  const publicUrl = restaurante ? `${window.location.origin}/${restaurante.slug}` : "";
  const qrUrl = restaurante ? `https://api.qrserver.com/v1/create-qr-code/?size=300x300&data=${encodeURIComponent(publicUrl)}` : "";

  return (
    <div className="max-w-6xl mx-auto space-y-8">
      <div>
        <h1 className="text-2xl font-bold text-white tracking-tight">
          Bem-vindo(a) ao seu painel, {restaurante?.nome || 'Lojista'}
        </h1>
        <p className="text-sm text-slate-400 mt-1">Acompanhe suas métricas e divulgue seu cardápio.</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        <div className="bg-white/5 border border-white/10 p-6 rounded-2xl shadow-xl backdrop-blur-sm">
          <div className="flex items-center justify-between">
            <div className="bg-indigo-500/10 p-3 rounded-xl border border-indigo-500/20">
              <Utensils className="h-5 w-5 text-indigo-400" />
            </div>
          </div>
          <div className="mt-6">
            <p className="text-sm font-medium text-slate-400">Total de Produtos Cadastrados</p>
            <h2 className="text-3xl font-bold tracking-tight text-white mt-1">{totalProdutos}</h2>
          </div>
        </div>

        <div className="bg-white/5 border border-white/10 p-6 rounded-2xl shadow-xl backdrop-blur-sm">
          <div className="flex items-center justify-between">
            <div className="bg-emerald-500/10 p-3 rounded-xl border border-emerald-500/20">
              <Tag className="h-5 w-5 text-emerald-400" />
            </div>
          </div>
          <div className="mt-6">
            <p className="text-sm font-medium text-slate-400">Total de Categorias</p>
            <h2 className="text-3xl font-bold tracking-tight text-white mt-1">{totalCategorias}</h2>
          </div>
        </div>

        <div className="bg-white/5 border border-white/10 p-6 rounded-2xl shadow-xl backdrop-blur-sm flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <div className="bg-orange-500/10 p-3 rounded-xl border border-orange-500/20">
              <Zap className="h-5 w-5 text-orange-400" />
            </div>
            <div className="flex items-center gap-2 text-emerald-400 text-xs font-semibold bg-emerald-400/10 px-3 py-1.5 rounded-full border border-emerald-400/20">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
              </span>
              Online
            </div>
          </div>
          <div className="mt-6">
            <p className="text-sm font-medium text-slate-400">Status do Cardápio</p>
            <h2 className="text-3xl font-bold tracking-tight text-white mt-1">Ativo</h2>
          </div>
        </div>
      </div>

      {/* Share Section */}
      <div className="bg-white/5 border border-white/10 rounded-2xl p-6 md:p-8 shadow-xl backdrop-blur-sm">
        <div className="flex items-center gap-3 mb-6">
          <Share2 className="w-6 h-6 text-indigo-400" />
          <h2 className="text-xl font-bold text-white">Compartilhe seu Cardápio</h2>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div className="space-y-6">
            <div>
              <label className="block text-sm font-semibold text-white mb-2">
                Link Público do Cardápio
              </label>
              <div className="flex flex-col sm:flex-row gap-3">
                <input
                  type="text"
                  readOnly
                  value={publicUrl}
                  className="flex-1 bg-[#0a0a0a]/50 border border-white/10 rounded-xl px-4 py-3 text-sm text-slate-300 focus:outline-none"
                />
                <button
                  onClick={handleCopyLink}
                  className="flex h-11 sm:h-auto items-center justify-center gap-2 bg-indigo-500 hover:bg-indigo-600 text-white rounded-xl px-6 text-sm font-bold shadow-lg shadow-indigo-500/20 transition-all active:scale-95 whitespace-nowrap"
                >
                  {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                  {copied ? 'Copiado!' : 'Copiar Link'}
                </button>
              </div>
              <p className="text-xs text-slate-400 mt-2">
                Envie este link no WhatsApp, Instagram ou Facebook para seus clientes.
              </p>
            </div>
          </div>

          <div className="flex flex-col items-center lg:items-start space-y-4">
            <label className="block text-sm font-semibold text-white mb-1">
              QR Code Dinâmico
            </label>
            {qrUrl && (
              <div className="bg-white p-3 rounded-2xl border-4 border-white/10 shadow-2xl">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img 
                  src={qrUrl} 
                  alt="QR Code" 
                  className="w-48 h-48 sm:w-56 sm:h-56 object-contain"
                />
              </div>
            )}
            <button
              onClick={handleDownloadQR}
              className="flex items-center gap-2 bg-white/10 hover:bg-white/20 text-white border border-white/10 rounded-xl px-6 py-2.5 text-sm font-bold transition-all active:scale-95"
            >
              <Download className="w-4 h-4" />
              Baixar QR Code
            </button>
          </div>
        </div>
      </div>

    </div>
  );
}

