import Link from "next/link";
import { UtensilsCrossed, Menu } from "lucide-react";

export function Header() {
  return (
    <header className="sticky top-0 z-50 w-full border-b border-white/10 glass rounded-none backdrop-blur-md">
      <div className="container mx-auto px-4 md:px-6 h-16 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Link href="/" className="flex items-center gap-2">
            <div className="bg-emerald-600 p-1.5 rounded-lg">
              <UtensilsCrossed className="w-5 h-5 text-white" />
            </div>
            <span className="font-bold text-xl tracking-tight text-white">MenuZen</span>
          </Link>
        </div>

        <nav className="hidden md:flex items-center gap-8 text-sm font-medium text-slate-400">
          <Link href="#funcionalidades" className="hover:text-white transition-colors">
            Funcionalidades
          </Link>
          <Link href="#precos" className="hover:text-white transition-colors">
            Preços
          </Link>
          <Link href="#contato" className="hover:text-white transition-colors">
            Contato
          </Link>
        </nav>

        <div className="flex items-center gap-4">
          <Link 
            href="/login" 
            className="hidden md:inline-flex px-4 py-2 text-sm font-semibold btn-glass rounded-lg"
          >
            Login
          </Link>
          <Link 
            href="#pre-cadastro"
            className="inline-flex h-9 items-center justify-center rounded-lg px-4 text-sm font-semibold btn-primary shadow-lg shadow-emerald-500/20"
          >
            Começar Agora
          </Link>
          
          <button className="md:hidden p-2 text-slate-400 hover:text-white">
            <Menu className="w-5 h-5" />
          </button>
        </div>
      </div>
    </header>
  );
}
