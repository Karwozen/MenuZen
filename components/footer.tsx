import Link from "next/link";
import { UtensilsCrossed, Instagram, Facebook, Twitter } from "lucide-react";

export function Footer() {
  return (
    <footer className="border-t border-white/10 pt-16 pb-8">
      <div className="container mx-auto px-4 md:px-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-12">
          
          <div className="md:col-span-1">
            <Link href="/" className="flex items-center gap-2 mb-4">
              <div className="bg-emerald-600 p-1.5 rounded-lg">
                <UtensilsCrossed className="w-5 h-5 text-white" />
              </div>
              <span className="text-xl font-bold tracking-tight text-white">MenuZen</span>
            </Link>
            <p className="text-slate-400 text-sm mb-6">
              A plataforma definitiva para digitalizar o seu restaurante, fidelizar clientes e escalar suas vendas de forma inteligente.
            </p>
            <div className="flex gap-4 text-slate-400">
              <a href="#" className="hover:text-white transition-colors">
                <Instagram className="w-5 h-5" />
              </a>
              <a href="#" className="hover:text-white transition-colors">
                <Facebook className="w-5 h-5" />
              </a>
              <a href="#" className="hover:text-white transition-colors">
                <Twitter className="w-5 h-5" />
              </a>
            </div>
          </div>

          <div>
            <h4 className="font-semibold text-white mb-4">Produto</h4>
            <ul className="space-y-3 text-sm text-slate-400">
              <li><Link href="#funcionalidades" className="hover:text-white">Cardápio Digital</Link></li>
              <li><Link href="#funcionalidades" className="hover:text-white">Robô WhatsApp AI</Link></li>
              <li><Link href="#funcionalidades" className="hover:text-white">PDV e Gestão</Link></li>
              <li><Link href="#precos" className="hover:text-white">Preços</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="font-semibold text-white mb-4">Empresa</h4>
            <ul className="space-y-3 text-sm text-slate-400">
              <li><Link href="#" className="hover:text-white">Sobre Nós</Link></li>
              <li><Link href="#" className="hover:text-white">Blog</Link></li>
              <li><Link href="#" className="hover:text-white">Carreiras</Link></li>
              <li><Link href="#" className="hover:text-white">Contato</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="font-semibold text-white mb-4">Suporte</h4>
            <ul className="space-y-3 text-sm text-slate-400">
              <li><Link href="#" className="hover:text-white">Central de Ajuda</Link></li>
              <li><Link href="#" className="hover:text-white">Status do Sistema</Link></li>
              <li><Link href="#" className="hover:text-white">Termos de Serviço</Link></li>
              <li><Link href="#" className="hover:text-white">Política de Privacidade</Link></li>
            </ul>
          </div>
          
        </div>

        <div className="pt-8 border-t border-white/10 flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-slate-500 text-sm">
            © {new Date().getFullYear()} MenuZen. Todos os direitos reservados.
          </p>
          <div className="flex gap-4 text-sm text-slate-500">
            <span className="flex items-center gap-1">Feito com 💚 no Brasil</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
