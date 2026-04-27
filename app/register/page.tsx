"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Zap, Loader2, ArrowRight } from "lucide-react";
import { supabase, isSupabaseConfigured } from "@/lib/supabase";

export default function RegisterPage() {
  const router = useRouter();
  const [restaurantName, setRestaurantName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const generateSlug = (name: string) => {
    return name
      .toLowerCase()
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "") // Remove accents
      .replace(/[^\w\s-]/g, "") // Remove special characters
      .replace(/[\s_-]+/g, "-") // Replace spaces with hyphens
      .replace(/^-+|-+$/g, ""); // Trim hyphens
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    if (!isSupabaseConfigured) {
      setError("As chaves de API do Supabase não foram encontradas no ambiente. Configure o arquivo .env.local ou as variáveis do servidor.");
      setLoading(false);
      return;
    }

    const slug = generateSlug(restaurantName);

    try {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            restaurant_name: restaurantName,
            restaurant_slug: slug,
          },
        },
      });

      if (error) {
        throw error;
      }

      if (data?.session) {
        router.push("/dashboard");
      } else if (data?.user) {
        setError("Conta criada! Verifique seu e-mail para confirmar o cadastro.");
      } else {
        setError("Conta criada, mas não foi possível fazer login automático.");
      }
    } catch (err: any) {
      setError(err.message || "Erro ao criar conta. Verifique suas informações.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 relative overflow-hidden bg-[#050505]">
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[700px] rounded-full bg-gradient-to-tr from-purple-500/10 to-indigo-500/10 blur-[120px] -z-10 pointer-events-none"></div>

      <div className="w-full max-w-md">
        <div className="flex flex-col items-center mb-8">
          <Link href="/" className="flex items-center gap-2 mb-8">
            <div className="bg-gradient-to-tr from-indigo-500 to-purple-500 p-2 rounded-xl shadow-lg shadow-indigo-500/20">
              <Zap className="w-6 h-6 text-white" />
            </div>
            <span className="text-2xl font-black tracking-tight text-white">MenuFlow</span>
          </Link>
          <h1 className="text-2xl font-bold tracking-tight text-white">Crie sua conta</h1>
          <p className="text-slate-400 mt-2 text-sm text-center">Comece a transformar seu delivery em poucos passos.</p>
        </div>

        <div className="glass-card p-6 sm:p-8 shadow-2xl relative">
          <form onSubmit={handleRegister} className="space-y-4">
            {error && (
              <div className="p-3 bg-red-500/10 border border-red-500/20 rounded-lg text-red-400 text-sm">
                {error}
              </div>
            )}
            
            <div>
              <label className="block text-xs font-semibold text-slate-300 uppercase tracking-widest mb-2" htmlFor="restaurantName">
                Nome do Restaurante
              </label>
              <input
                id="restaurantName"
                type="text"
                required
                value={restaurantName}
                onChange={(e) => setRestaurantName(e.target.value)}
                className="w-full bg-[#0a0a0a]/50 border border-white/10 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-indigo-500/50 focus:ring-1 focus:ring-indigo-500/50 transition-all"
                placeholder="Ex: Pizzaria Bella"
              />
              {restaurantName && (
                <p className="text-xs text-slate-500 mt-2 font-mono">
                  Seu link será: menuflow.app/{generateSlug(restaurantName)}
                </p>
              )}
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 uppercase tracking-widest mb-2" htmlFor="email">
                E-mail
              </label>
              <input
                id="email"
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full bg-[#0a0a0a]/50 border border-white/10 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-indigo-500/50 focus:ring-1 focus:ring-indigo-500/50 transition-all"
                placeholder="seu@restaurante.com"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 uppercase tracking-widest mb-2" htmlFor="password">
                Senha de Acesso
              </label>
              <input
                id="password"
                type="password"
                required
                minLength={6}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full bg-[#0a0a0a]/50 border border-white/10 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-indigo-500/50 focus:ring-1 focus:ring-indigo-500/50 transition-all"
                placeholder="Mínimo de 6 caracteres"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full mt-6 flex h-12 items-center justify-center btn-primary rounded-xl px-6 text-sm font-bold shadow-lg shadow-indigo-500/20 disabled:opacity-70 disabled:cursor-not-allowed"
            >
              {loading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Criando conta...
                </>
              ) : (
                <>
                  Começar Teste Grátis
                  <ArrowRight className="ml-2 h-4 w-4" />
                </>
              )}
            </button>
          </form>
        </div>

        <p className="text-center text-sm text-slate-400 mt-8">
          Já possui conta?{" "}
          <Link href="/login" className="text-indigo-400 font-bold hover:text-indigo-300 hover:underline">
            Acesse seu painel
          </Link>
        </p>
      </div>
    </div>
  );
}
