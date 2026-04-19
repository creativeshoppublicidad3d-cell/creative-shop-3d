"use client";

import Image from "next/image";
import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";

function CardServicio({ nombre, icono, descripcion }: { nombre: string; icono: string; descripcion: string }) {
  const [fijo, setFijo] = useState(false);
  return (
    <div
      onClick={() => setFijo(!fijo)}
      className={`group bg-[#1A1A1A] border rounded-2xl p-6 text-center cursor-pointer transition-all duration-300 ${
        fijo ? "border-[#F15A24]" : "border-[#29ABE2] hover:border-[#F15A24]"
      }`}
    >
      <div className="text-5xl mb-3">{icono}</div>
      <p className="font-semibold text-lg">{nombre}</p>
      <div className={`overflow-hidden transition-all duration-300 ${
        fijo ? "max-h-40 mt-3" : "max-h-0 group-hover:max-h-40 group-hover:mt-3"
      }`}>
        <p className="text-gray-400 text-sm text-left leading-relaxed">{descripcion}</p>
        
         <a href="#cotizar"
          onClick={(e) => e.stopPropagation()}
          className="inline-block mt-3 bg-[#F15A24] text-white text-xs font-bold px-4 py-2 rounded-full hover:bg-orange-600 transition"
        >
          Cotizar
        </a>
      </div>
    </div>
  );
}

export default function Home() {

const [slide, setSlide] = useState(0);
const [touchStart, setTouchStart] = useState(0);
const [lightbox, setLightbox] = useState<number | null>(null);

useEffect(() => {
  if (lightbox !== null) return;
  const timer = setInterval(() => setSlide((s) => (s + 1) % 3), 4000);
  return () => clearInterval(timer);
}, [lightbox]);

  const [nombre, setNombre] = useState("");
  const [telefono, setTelefono] = useState("");
  const [negocio, setNegocio] = useState("");
  const [queVende, setQueVende] = useState("");
  const [ciudad, setCiudad] = useState("");
  const [productoInteres, setProductoInteres] = useState("");
  const [mensaje, setMensaje] = useState("");
  const [enviado, setEnviado] = useState(false);
  const [cargando, setCargando] = useState(false);

  const [menuAbierto, setMenuAbierto] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setCargando(true);
    const { error } = await supabase
      .from("leads")
      .insert([{ nombre, telefono, negocio, que_vende: queVende, ciudad, producto_interes: productoInteres, mensaje }]);
    if (!error) {
      setEnviado(true);
      setNombre(""); setTelefono(""); setNegocio("");
      setQueVende(""); setCiudad(""); setProductoInteres(""); setMensaje("");
    }
    setCargando(false);
  }

  const fotos = [
  { src: "/portafolio/p1.jpeg", alt: "Tortillería Claudia", index: 0 },
  { src: "/portafolio/p2.jpeg", alt: "MyCaze Pro", index: 1 },
  { src: "/portafolio/p3.jpeg", alt: "Agua Blanca de Iturbide", index: 2 },
  { src: "/portafolio/p4.jpeg", alt: "Todo Para Mi Cel", index: 3 },
  { src: "/portafolio/p5.jpeg", alt: "Carpintería Castelan", index: 4 },
  { src: "/portafolio/p6.jpeg", alt: "Beer Garden", index: 5 },
  { src: "/portafolio/p7.jpeg", alt: "Lucio Gastro Cantina", index: 6 },
  { src: "/portafolio/p8.jpeg", alt: "Tacos Miguelito", index: 7 },
  { src: "/portafolio/p9.jpeg", alt: "Torre Esmeralda", index: 8 },
  { src: "/portafolio/p10.jpeg", alt: "Kronos Fisioterapia", index: 9 },
  { src: "/portafolio/p11.jpeg", alt: "Barber Shop Phoenix", index: 10 },
  { src: "/portafolio/p12.jpeg", alt: "Letras Industriales GCP", index: 11 },
];

  return (
    <main className="bg-[#1A1A1A] min-h-screen text-white pt-20">

{/* NAVBAR */}
<nav className="fixed top-0 left-0 right-0 z-50 bg-[#111111] border-b border-gray-800 px-6 py-3">
  <div className="flex items-center justify-between">
    <Image src="/LOGO.png" alt="Creative Shop 3D" width={50} height={50} />

    {/* Links desktop */}
   <div className="hidden md:flex gap-6 text-sm font-semibold text-gray-300">
  <a href="#servicios" className="hover:text-[#29ABE2] transition">Servicios</a>
  <a href="#portafolio" className="hover:text-[#29ABE2] transition">Portafolio</a>
  <a href="#cotizar" className="hover:text-[#29ABE2] transition">Cotizar</a>
  <a href="#ubicacion" className="hover:text-[#29ABE2] transition">¿Dónde estamos?</a>
</div>

    <div className="flex items-center gap-3">
      <a href="https://wa.me/527711951579" target="_blank" className="bg-[#39B54A] text-white text-sm font-bold px-4 py-2 rounded-full">WhatsApp</a>
      {/* Botón hamburguesa — solo móvil */}
      <button
        className="md:hidden text-white text-2xl focus:outline-none"
        onClick={() => setMenuAbierto(!menuAbierto)}
        aria-label="Menú"
      >
        {menuAbierto ? "✕" : "☰"}
      </button>
    </div>
  </div>

  {/* Menú desplegable móvil */}
  {menuAbierto && (
    <div className="md:hidden flex flex-col gap-4 pt-4 pb-2 text-sm font-semibold text-gray-300 border-t border-gray-800 mt-3">
   <a href="#servicios" onClick={() => setMenuAbierto(false)} className="hover:text-[#29ABE2] transition">Servicios</a>
<a href="#portafolio" onClick={() => setMenuAbierto(false)} className="hover:text-[#29ABE2] transition">Portafolio</a>
<a href="#cotizar" onClick={() => setMenuAbierto(false)} className="hover:text-[#29ABE2] transition">Cotizar</a>
<a href="#ubicacion" onClick={() => setMenuAbierto(false)} className="hover:text-[#29ABE2] transition">¿Dónde estamos?</a></div>
  )}
</nav>

      <section className="flex flex-col items-center justify-center text-center px-6 py-20">
        <Image src="/LOGO.png" alt="Creative Shop 3D" width={220} height={220} priority />
       
        <p className="text-gray-300 mt-4">Soluciones visuales que hacen brillar tu marca</p>
        <div className="flex gap-4 mt-8">
          <a href="https://wa.me/527711951579" target="_blank" className="bg-[#39B54A] text-white font-bold px-8 py-4 rounded-full">WhatsApp</a>
          <a href="https://m.me/CreativeShopTulancingo" target="_blank" className="bg-[#29ABE2] text-white font-bold px-8 py-4 rounded-full">Messenger</a>
        </div>
      </section>

      <section id="servicios" className="px-6 py-16 bg-[#111111]">
  <h2 className="text-3xl font-bold text-center mb-12">Nuestros <span className="text-[#F15A24]">Servicios</span></h2>
  <div className="grid grid-cols-2 md:grid-cols-4 gap-6 max-w-4xl mx-auto">
    {[
      {
        nombre: "Letras 3D",
        icono: "🔠",
        descripcion: "Letras de alto impacto para fachadas y locales comerciales. Fabricadas en acrílico, acero o aluminio. Ideales para dar presencia y profesionalismo a tu negocio."
      },
      {
        nombre: "Letreros Neón",
        icono: "💡",
        descripcion: "Letreros con luz neón flex para interiores y exteriores. Perfectos para restaurantes, bares, salones y cualquier negocio que quiera destacar de noche."
      },
      {
        nombre: "Acrílico",
        icono: "🪟",
        descripcion: "Placas, señalética y decoración en acrílico cortado y grabado con láser. Acabados precisos para logos, menús, directorios y más."
      },
      {
        nombre: "Glorificadores",
        icono: "✨",
        descripcion: "Displays iluminados para destacar productos en punto de venta. Ideales para marcas, antros, tiendas y negocios que quieren resaltar sus productos frente al cliente."
      }
    ].map((s) => (
      <CardServicio key={s.nombre} {...s} />
    ))}
  </div>
</section>

<section id="portafolio" className="px-6 py-16 bg-[#111111]">
  <h2 className="text-3xl font-bold text-center mb-12">Nuestro <span className="text-[#29ABE2]">Portafolio</span></h2>
  <div className="relative max-w-5xl mx-auto">
    {/* Flechas */}
   <button onClick={() => { setSlide((slide + 2) % 3); }} className="hidden md:flex absolute -left-8 top-1/2 -translate-y-1/2 z-10 bg-[#29ABE2] hover:bg-[#1a8fc2] text-white w-12 h-12 rounded-full items-center justify-center text-2xl font-bold transition">&#10094;</button>
<button onClick={() => { setSlide((slide + 1) % 3); }} className="hidden md:flex absolute -right-8 top-1/2 -translate-y-1/2 z-10 bg-[#29ABE2] hover:bg-[#1a8fc2] text-white w-12 h-12 rounded-full items-center justify-center text-2xl font-bold transition">&#10095;</button>

    {/* Grid de fotos */}
    <div
      onTouchStart={(e) => setTouchStart(e.changedTouches[0].screenX)}
      onTouchEnd={(e) => {
        const diff = touchStart - e.changedTouches[0].screenX;
        if (Math.abs(diff) > 50) setSlide(diff > 0 ? (slide + 1) % 3 : (slide + 2) % 3);
      }}
      className="grid grid-cols-2 md:grid-cols-4 gap-4"
    >
      {fotos.slice(slide * 4, slide * 4 + 4).map((foto) => (
        <div key={foto.src} onClick={() => setLightbox(foto.index)} className="relative overflow-hidden rounded-2xl aspect-square cursor-pointer group">
          <Image src={foto.src} alt={foto.alt} fill className="object-cover group-hover:scale-105 transition duration-300" />
        </div>
      ))}
    </div>

    {/* Puntos */}
    <div className="flex justify-center gap-3 mt-6">
      {[0,1,2].map((i) => (
        <button key={i} onClick={() => setSlide(i)} className={`w-3 h-3 rounded-full transition ${slide === i ? 'bg-[#29ABE2]' : 'bg-gray-600'}`} />
      ))}
    </div>
  </div>

  {/* Lightbox */}
  {lightbox !== null && (
    <div className="fixed inset-0 bg-black/90 z-50 flex flex-col items-center justify-center p-4" onClick={() => setLightbox(null)}>
      <div className="relative w-full max-w-3xl" onClick={(e) => e.stopPropagation()}>
        <button onClick={() => setLightbox(null)} className="absolute -top-10 right-0 text-white text-2xl">✕</button>
        <Image src={fotos[lightbox].src} alt={fotos[lightbox].alt} width={900} height={600} className="rounded-2xl object-contain w-full max-h-[75vh]" />
        <div className="flex justify-between mt-4">
          <button onClick={() => setLightbox((lightbox + fotos.length - 1) % fotos.length)} className="bg-[#29ABE2] text-white px-4 py-2 rounded-full">← Anterior</button>
          <span className="text-gray-400 text-sm self-center">{lightbox + 1} / {fotos.length}</span>
          <button onClick={() => setLightbox((lightbox + 1) % fotos.length)} className="bg-[#29ABE2] text-white px-4 py-2 rounded-full">Siguiente →</button>
        </div>
      </div>
    </div>
  )}
</section>

     <section id="cotizar" className="px-6 py-16">
        <h2 className="text-3xl font-bold text-center mb-10">¿Listo para <span className="text-[#39B54A]">cotizar?</span></h2>
        {enviado ? (
          <div className="max-w-lg mx-auto text-center bg-[#111111] border border-[#39B54A] rounded-2xl p-10">
            <div className="text-5xl mb-4">✅</div>
            <h3 className="text-2xl font-bold text-[#39B54A]">¡Mensaje recibido!</h3>
            <p className="text-gray-300 mt-2">Te contactamos a la brevedad.</p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="max-w-lg mx-auto flex flex-col gap-4">
            <input type="text" placeholder="Tu nombre *" value={nombre} onChange={(e) => setNombre(e.target.value)} required className="bg-[#111111] border border-gray-600 rounded-xl px-4 py-3 text-white placeholder-gray-400 focus:outline-none focus:border-[#29ABE2]" />
            <input type="tel" placeholder="Tu teléfono *" value={telefono} onChange={(e) => setTelefono(e.target.value)} required className="bg-[#111111] border border-gray-600 rounded-xl px-4 py-3 text-white placeholder-gray-400 focus:outline-none focus:border-[#29ABE2]" />
            <input type="text" placeholder="Nombre de tu negocio" value={negocio} onChange={(e) => setNegocio(e.target.value)} className="bg-[#111111] border border-gray-600 rounded-xl px-4 py-3 text-white placeholder-gray-400 focus:outline-none focus:border-[#29ABE2]" />
            <input type="text" placeholder="¿Qué vendes?" value={queVende} onChange={(e) => setQueVende(e.target.value)} className="bg-[#111111] border border-gray-600 rounded-xl px-4 py-3 text-white placeholder-gray-400 focus:outline-none focus:border-[#29ABE2]" />
            <input type="text" placeholder="¿De dónde nos visitas? (Municipio / Estado)" value={ciudad} onChange={(e) => setCiudad(e.target.value)} className="bg-[#111111] border border-gray-600 rounded-xl px-4 py-3 text-white placeholder-gray-400 focus:outline-none focus:border-[#29ABE2]" />
            <select value={productoInteres} onChange={(e) => setProductoInteres(e.target.value)} className="bg-[#111111] border border-gray-600 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-[#29ABE2]">
              <option value="">Producto de interés</option>
              <option value="Letras 3D">Letras 3D</option>
              <option value="Letreros Neón">Letreros Neón</option>
              <option value="Acrílico">Acrílico</option>
              <option value="Glorificadores">Glorificadores</option>
            </select>
            <textarea placeholder="Cuéntanos más de tu proyecto (opcional)" rows={4} value={mensaje} onChange={(e) => setMensaje(e.target.value)} className="bg-[#111111] border border-gray-600 rounded-xl px-4 py-3 text-white placeholder-gray-400 focus:outline-none focus:border-[#29ABE2]" />
            <button type="submit" disabled={cargando} className="bg-[#F15A24] hover:bg-orange-600 disabled:opacity-50 text-white font-bold py-4 rounded-full text-lg transition">
              {cargando ? "Enviando..." : "Enviar cotización"}
            </button>
          </form>
        )}
      </section>

<section id="ubicacion" className="px-6 py-16 bg-[#1A1A1A]">
  <h2 className="text-3xl font-bold text-center mb-10">¿Dónde <span className="text-[#F15A24]">estamos?</span></h2>
  <div className="max-w-4xl mx-auto rounded-2xl overflow-hidden">
    <iframe
      src= "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3747.0466492789997!2d-98.36657692578798!3d20.090336719349516!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x85d057e6ac943ef9%3A0x644fd142fe2c19f8!2sCreative%20Shop%203D!5e0!3m2!1ses-419!2smx!4v1776561356445!5m2!1ses-419!2smx"
       width="100%"
      height="450"
      style={{ border: 0 }}
      allowFullScreen
      loading="lazy"
      referrerPolicy="no-referrer-when-downgrade"
    ></iframe>
  </div>
  <p className="text-center text-gray-400 mt-6">
    📍 Tulancingo, Hidalgo · <a href="https://maps.app.goo.gl/DaUJVVUrox8zEHEx5" target="_blank" className="text-[#29ABE2] hover:underline">Ver en Google Maps</a>
  </p>
</section>

      <footer className="bg-[#111111] text-center py-8 text-gray-400 text-sm">
        <p>© 2026 Creative Shop 3D · Tulancingo, Hidalgo</p>
<p className="mt-1">📍 <a href="https://maps.app.goo.gl/DaUJVVUrox8zEHEx5" target="_blank" className="hover:text-white transition">Ver ubicación en Google Maps</a></p>
        <a href="https://www.facebook.com/CreativeShopTulancingo" className="text-[#29ABE2] hover:underline mt-2 block" target="_blank">Facebook</a>
      </footer>
    </main>
  );
}