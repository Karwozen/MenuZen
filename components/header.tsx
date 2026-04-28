import Link from "next/link";
import { Zap, Menu } from "lucide-react";

export function Header() {
  return (
    <header className="fixed top-0 z-50 w-full border-b border-white/5 bg-[#0a0a0a]/50 backdrop-blur-xl">
      <div className="container mx-auto px-4 md:px-6 h-16 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2">
          <div className="bg-gradient-to-tr from-orange-500 to-red-500 p-1.5 rounded-lg shadow-lg shadow-orange-500/20">
            <Zap className="w-5 h-5 text-white" />
          </div>
          <span className="font-extrabold text-xl tracking-tight text-white">MenuFlow</span>
        </Link>

        <nav className="hidden md:flex items-center gap-8 text-sm font-medium text-slate-300">
          <Link href="#funcionalidades" className="hover:text-white transition-colors">
            Recursos
          </Link>
          <Link href="#precos" className="hover:text-white transition-colors">
            Preços
          </Link>
          <Link href="#depoimentos" className="hover:text-white transition-colors">
            Depoimentos
          </Link>
        </nav>

        <div className="flex items-center gap-4">
          <Link 
            href="/login" 
            className="hidden md:inline-flex h-9 items-center justify-center rounded-lg px-5 text-sm font-bold btn-primary"
          >
            Acessar Painel
          </Link>
          <button className="md:hidden p-2 text-slate-400 hover:text-white">
            <Menu className="w-6 h-6" />
          </button>
        </div>
      </div>
    </header>
  );
}
