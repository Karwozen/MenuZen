import type {Metadata} from 'next';
import { Inter } from 'next/font/google';
import './globals.css';

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-sans',
});

export const metadata: Metadata = {
  title: 'MenuZen | Automação e Cardápio Digital para Restaurantes',
  description: 'Automatize seu restaurante com nosso Cardápio Digital e Robô de WhatsApp com IA.',
};

export default function RootLayout({children}: {children: React.ReactNode}) {
  return (
    <html lang="pt-BR" className={`${inter.variable} scroll-smooth`}>
      <body className="font-sans antialiased text-slate-50 bg-[#0a0a0a] selection:bg-indigo-500/30" suppressHydrationWarning>
        <div className="mesh-bg" />
        {children}
      </body>
    </html>
  );
}
