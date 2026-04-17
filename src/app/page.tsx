import Image from "next/image";

export default function Home() {
  return (
    <main className="bg-[#1A1A1A] min-h-screen text-white">
      <section className="flex flex-col items-center justify-center text-center px-6 py-20">
        <Image src="/LOGO.png" alt="Creative Shop 3D" width={220} height={220} priority />
        <h1 className="text-4xl font-bold mt-6">
          <span className="text-[#29ABE2]">Creative</span> <span className="text-[#F15A24]">Shop 3D</span>
        </h1>
        <p className="text-gray-300 mt-4">Soluciones visuales que hacen brillar tu marca</p>
        <div className="flex gap-4 mt-8">
          <a href="https://wa.me/527711951579" target="_blank" className="bg-[#39B54A] text-white font-bold px-8 py-4 rounded-full">WhatsApp</a>
          <a href="https://m.me/CreativeShopTulancingo" target="_blank" className="bg-[#29ABE2] text-white font-bold px-8 py-4 rounded-full">Messenger</a>
        </div>
      </section>
      <section className="px-6 py-16 bg-[#111111]">
        <h2 className="text-3xl font-bold text-center mb-12">Nuestros <span className="text-[#F15A24]">Servicios</span></h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 max-w-4xl mx-auto">
          {[
            {nombre:"Letras 3D",icono:"🔠"},
            {nombre:"Letreros Neón",icono:"💡"},
            {nombre:"Acrílico",icono:"🪟"},
            {nombre:"Glorificadores",icono:"✨"}
          
          ].map((s) => (
            <div key={s.nombre} className="bg-[#1A1A1A] border border-[#29ABE2] rounded-2xl p-6 text-center hover:border-[#F15A24] transition">
              <div className="text-5xl mb-3">{s.icono}</div>
              <p className="font-semibold text-lg">{s.nombre}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="px-6 py-16">
        <h2 className="text-3xl font-bold text-center mb-10">¿Listo para <span className="text-[#39B54A]">cotizar?</span></h2>
        <form className="max-w-lg mx-auto flex flex-col gap-4">
          <input type="text" placeholder="Tu nombre" className="bg-[#111111] border border-gray-600 rounded-xl px-4 py-3 text-white placeholder-gray-400 focus:outline-none focus:border-[#29ABE2]" />
          <input type="tel" placeholder="Tu teléfono" className="bg-[#111111] border border-gray-600 rounded-xl px-4 py-3 text-white placeholder-gray-400 focus:outline-none focus:border-[#29ABE2]" />
          <textarea placeholder="¿Qué necesitas?" rows={4} className="bg-[#111111] border border-gray-600 rounded-xl px-4 py-3 text-white placeholder-gray-400 focus:outline-none focus:border-[#29ABE2]" />
          <button type="submit" className="bg-[#F15A24] hover:bg-orange-600 text-white font-bold py-4 rounded-full text-lg transition">Enviar cotización</button>
        </form>

      </section>

      <footer className="bg-[#111111] text-center py-8 text-gray-400 text-sm">
        <p>© 2025 Creative Shop 3D · Tulancingo, Hidalgo</p>
        <a href="https://www.facebook.com/CreativeShopTulancingo" className="text-[#29ABE2] hover:underline mt-2 block" target="_blank">Facebook</a>
      </footer>

    </main>
  );
}