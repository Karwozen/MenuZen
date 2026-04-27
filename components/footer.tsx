import Link from "next/link";
import { Zap, Instagram, Facebook, Twitter } from "lucide-react";

export function Footer() {
  return (
    <footer className="border-t border-white/5 pt-20 pb-10 bg-[#050505]">
      <div className="container mx-auto px-4 md:px-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 lg:gap-8 mb-16">
          
          <div className="md:col-span-1">
            <Link href="/" className="flex items-center gap-2 mb-6">
              <div className="bg-gradient-to-tr from-indigo-500 to-purple-500 p-1.5 rounded-lg shadow-lg shadow-indigo-500/20">
                <Zap className="w-5 h-5 text-white" />
              </div>
              <span className="text-xl font-extrabold tracking-tight text-white">MenuFlow</span>
            </Link>
            <p className="text-slate-400 text-sm mb-6 leading-relaxed">
              A plataforma definitiva para digitalizar o seu restaurante, encantar clientes com IA e escalar as suas vendas.
            </p>
            <div className="flex gap-4 text-slate-500">
              <a href="#" className="hover:text-indigo-400 transition-colors">
                <Instagram className="w-5 h-5" />
                <span className="sr-only">Instagram</span>
              </a>
              <a href="#" className="hover:text-indigo-400 transition-colors">
                <Facebook className="w-5 h-5" />
                <span className="sr-only">Facebook</span>
              </a>
              <a href="#" className="hover:text-indigo-400 transition-colors">
                <Twitter className="w-5 h-5" />
                <span className="sr-only">Twitter</span>
              </a>
            </div>
          </div>

          <div>
            <h4 className="font-bold text-white mb-6 uppercase tracking-wider text-xs">Produto</h4>
            <ul className="space-y-4 text-sm text-slate-400">
              <li><Link href="#funcionalidades" className="hover:text-indigo-400 transition-colors">Cardápio Digital</Link></li>
              <li><Link href="#funcionalidades" className="hover:text-indigo-400 transition-colors">Robô WhatsApp AI</Link></li>
              <li><Link href="#funcionalidades" className="hover:text-indigo-400 transition-colors">PDV e Gestão</Link></li>
              <li><Link href="#precos" className="hover:text-indigo-400 transition-colors">Preços</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="font-bold text-white mb-6 uppercase tracking-wider text-xs">Empresa</h4>
            <ul className="space-y-4 text-sm text-slate-400">
              <li><Link href="#" className="hover:text-indigo-400 transition-colors">Sobre Nós</Link></li>
              <li><Link href="#" className="hover:text-indigo-400 transition-colors">Blog</Link></li>
              <li><Link href="#" className="hover:text-indigo-400 transition-colors">Casos de Sucesso</Link></li>
              <li><Link href="#" className="hover:text-indigo-400 transition-colors">Contato</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="font-bold text-white mb-6 uppercase tracking-wider text-xs">Legal & Suporte</h4>
            <ul className="space-y-4 text-sm text-slate-400">
              <li><Link href="#" className="hover:text-indigo-400 transition-colors">Central de Ajuda</Link></li>
              <li><Link href="#" className="hover:text-indigo-400 transition-colors">Portal do Cliente</Link></li>
              <li><Link href="#" className="hover:text-indigo-400 transition-colors">Termos de Serviço</Link></li>
              <li><Link href="#" className="hover:text-indigo-400 transition-colors">Privacidade</Link></li>
            </ul>
          </div>
          
        </div>

        <div className="pt-8 border-t border-white/5 flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-slate-500 text-sm">
            © {new Date().getFullYear()} MenuFlow. Todos os direitos reservados.
          </p>
          <div className="flex gap-4 text-sm text-slate-500 font-medium">
            Desenvolvido com <span className="text-indigo-500">⚡</span> Next.js e AI
          </div>
        </div>
      </div>
    </footer>
  );
}
