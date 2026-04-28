"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { 
  LayoutDashboard, 
  MenuSquare, 
  ShoppingBag, 
  Bot, 
  CreditCard,
  LogOut,
  Zap,
  Settings,
  ExternalLink
} from "lucide-react";
import { clsx } from "clsx";
import { supabase, isSupabaseConfigured } from "@/lib/supabase";
import { useRouter } from "next/navigation";

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const [slug, setSlug] = useState<string | null>(null);

  useEffect(() => {
    async function fetchSlug() {
      if (!isSupabaseConfigured) return;
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const { data } = await supabase
        .from('restaurantes')
        .select('slug')
        .eq('owner_id', user.id)
        .single();
      
      if (data?.slug) {
        setSlug(data.slug);
      }
    }
    fetchSlug();
  }, []);

  const navigation = [
    { name: "Início", href: "/dashboard", icon: LayoutDashboard },
    { name: "Cardápio", href: "/dashboard/cardapio", icon: MenuSquare },
    { name: "Pedidos", href: "/dashboard/orders", icon: ShoppingBag },
    { name: "Configuração do Robô IA", href: "/dashboard/ai-bot", icon: Bot },
    { name: "Configurações", href: "/dashboard/configuracoes", icon: Settings },
    { name: "Assinatura", href: "/dashboard/subscription", icon: CreditCard },
  ];

  const handleLogout = async () => {
    try {
      await supabase.auth.signOut();
    } catch (e) {
      console.warn("Logout fetch failed", e);
    }
    router.push("/login");
  };

  return (
    <div className="flex min-h-screen bg-[#050505]">
      {/* Sidebar Desktop */}
      <aside className="hidden md:flex flex-col w-72 border-r border-white/5 bg-[#0a0a0a]">
        <div className="h-16 flex items-center px-6 border-b border-white/5">
          <Link href="/dashboard" className="flex items-center gap-2">
            <div className="bg-gradient-to-tr from-indigo-500 to-purple-500 p-1.5 rounded-lg">
              <Zap className="w-4 h-4 text-white" />
            </div>
            <span className="font-extrabold text-lg tracking-tight text-white">MenuFlow</span>
          </Link>
        </div>

        <nav className="flex-1 overflow-y-auto py-6 px-4 space-y-1">
          {slug && (
            <div className="mb-6 px-1">
              <a 
                href={`/${slug}`} 
                target="_blank" 
                rel="noreferrer"
                className="flex items-center justify-center gap-2 w-full py-2.5 bg-emerald-500 hover:bg-emerald-600 text-white font-semibold rounded-xl text-sm transition-colors shadow-lg shadow-emerald-500/20"
              >
                <ExternalLink className="w-4 h-4" />
                Ver Cardápio
              </a>
            </div>
          )}
          <div className="text-xs font-semibold text-slate-500 uppercase tracking-widest mb-4 px-3">Geral</div>
          {navigation.map((item) => {
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.name}
                href={item.href}
                className={clsx(
                  "flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all group",
                  isActive 
                    ? "bg-indigo-500/10 text-indigo-400 border border-indigo-500/20" 
                    : "text-slate-400 hover:bg-white/5 hover:text-white border border-transparent"
                )}
              >
                <item.icon className={clsx("w-5 h-5", isActive ? "text-indigo-400" : "text-slate-500 group-hover:text-slate-300")} />
                {item.name}
              </Link>
            );
          })}
        </nav>

        <div className="p-4 border-t border-white/5">
          <button
            onClick={handleLogout}
            className="flex items-center w-full gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-slate-400 hover:bg-white/5 hover:text-white transition-all border border-transparent"
          >
            <LogOut className="w-5 h-5 text-slate-500" />
            Sair da Conta
          </button>
        </div>
      </aside>

      {/* Main content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Mobile Header */}
        <header className="md:hidden flex h-16 items-center border-b border-white/5 bg-[#0a0a0a] px-4 justify-between">
          <Link href="/dashboard" className="flex items-center gap-2">
            <div className="bg-gradient-to-tr from-indigo-500 to-purple-500 p-1.5 rounded-lg">
              <Zap className="w-4 h-4 text-white" />
            </div>
            <span className="font-extrabold tracking-tight text-white">MenuFlow</span>
          </Link>
          <div className="flex items-center gap-4">
            {slug && (
               <a 
                 href={`/${slug}`} 
                 target="_blank" 
                 rel="noreferrer"
                 className="flex items-center justify-center p-2 bg-emerald-500/10 text-emerald-400 rounded-lg hover:bg-emerald-500/20 transition-colors"
                 title="Ver Cardápio"
               >
                 <ExternalLink className="w-5 h-5" />
               </a>
            )}
            <button className="text-slate-400">
              <MenuSquare className="w-6 h-6" />
            </button>
          </div>
        </header>

        <main className="flex-1 overflow-y-auto bg-[url('/mesh.svg')] bg-cover bg-fixed">
          {/* subtle animated mesh background implemented globally but fine here */}
          <div className="p-4 md:p-8">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}
