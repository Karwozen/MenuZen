export function SocialProof() {
  return (
    <section id="depoimentos" className="py-12 border-y border-white/5 bg-white/[0.01]">
      <div className="container mx-auto px-4">
        <p className="text-center text-sm font-medium text-slate-500 mb-8 uppercase tracking-widest">
          Restaurantes de ponta que já usam MenuFlow
        </p>
        <div className="flex flex-wrap justify-center items-center gap-10 md:gap-20 opacity-40 grayscale hover:grayscale-0 transition-all duration-700 select-none pointer-events-none">
          <h3 className="text-2xl font-bold font-serif italic text-white">Osteria Bella</h3>
          <h3 className="text-2xl font-black text-white uppercase tracking-tighter">BURGER<span className="text-indigo-400">X</span></h3>
          <h3 className="text-2xl font-semibold text-white">Sushi<span className="font-light">Zen</span></h3>
          <h3 className="text-2xl text-white font-black tracking-widest">T A C O S</h3>
          <h3 className="text-xl font-medium text-white border-2 border-white px-3 py-1">PIZZA CO.</h3>
        </div>
      </div>
    </section>
  )
}
