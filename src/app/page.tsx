"use client";

import Image from "next/image";
import { useState } from "react";
import { supabase } from "@/lib/supabase";

export default function Home() {
  const [nombre, setNombre] = useState("");
  const [telefono, setTelefono] = useState("");
  const [negocio, setNegocio] = useState("");
  const [queVende, setQueVende] = useState("");
  const [ciudad, setCiudad] = useState("");
  const [productoInteres, setProductoInteres] = useState("");
  const [mensaje, setMensaje] = useState("");
  const [enviado, setEnviado] = useState(false);
  const [cargando, setCargando] = useState(false);

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

  return (
    <main className="bg-[#1A1A1A] min-h-screen text-white pt-20">

{/* NAVBAR */}
<nav className="fixed top-0 left-0 right-0 z-50 bg-[#111111] border-b border-gray-800 px-6 py-3 flex items-center justify-between">
  <Image src="/LOGO.png" alt="Creative Shop 3D" width={50} height={50} />
  <div className="hidden md:flex gap-6 text-sm font-semibold text-gray-300">
    <a href="#servicios" className="hover:text-[#29ABE2] transition">Servicios</a>
    <a href="#portafolio" className="hover:text-[#29ABE2] transition">Portafolio</a>
    <a href="#cotizar" className="hover:text-[#29ABE2] transition">Cotizar</a>
  </div>
  <a href="https://wa.me/527711951579" target="_blank" className="bg-[#39B54A] text-white text-sm font-bold px-4 py-2 rounded-full">WhatsApp</a>
</nav>

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

      <section id="servicios" className="px-6 py-16 bg-[#111111]">
        <h2 className="text-3xl font-bold text-center mb-12">Nuestros <span className="text-[#F15A24]">Servicios</span></h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 max-w-4xl mx-auto">
          {[
            { nombre: "Letras 3D", icono: "🔠" },
            { nombre: "Letreros Neón", icono: "💡" },
            { nombre: "Acrílico", icono: "🪟" },
            { nombre: "Glorificadores", icono: "✨" }
          ].map((s) => (
            <div key={s.nombre} className="bg-[#1A1A1A] border border-[#29ABE2] rounded-2xl p-6 text-center hover:border-[#F15A24] transition">
              <div className="text-5xl mb-3">{s.icono}</div>
              <p className="font-semibold text-lg">{s.nombre}</p>
            </div>
          ))}
        </div>
      </section>

<section id="portafolio" className="px-6 py-16 bg-[#111111]">
  <h2 className="text-3xl font-bold text-center mb-12">Nuestro <span className="text-[#29ABE2]">Portafolio</span></h2>
  <div className="grid grid-cols-2 md:grid-cols-3 gap-4 max-w-5xl mx-auto">
    {[
      { src: "/portafolio/p1.jpeg", alt: "Letras 3D Bienvenidos" },
      { src: "/portafolio/p2.jpeg", alt: "Tortillería Claudia" },
      { src: "/portafolio/p3.jpeg", alt: "MyCaze Pro" },
      { src: "/portafolio/p4.jpeg", alt: "Todo Para Mi Cel" },
      { src: "/portafolio/p5.jpeg", alt: "Carpintería Castelan" },
      { src: "/portafolio/p6.jpeg", alt: "Beer Garden" },
      { src: "/portafolio/p7.jpeg", alt: "Lucio Gastro Cantina" },
      { src: "/portafolio/p8.jpeg", alt: "Tacos Miguelito" },
      { src: "/portafolio/p9.jpeg", alt: "Torre Esmeralda" },
      { src: "/portafolio/p10.jpeg", alt: "Kronos Fisioterapia" },
      { src: "/portafolio/p11.jpeg", alt: "Barber Shop Phoenix" },
      { src: "/portafolio/p12.jpeg", alt: "Letras industriales GCP" },
    ].map((foto) => (
      <div key={foto.src} className="relative overflow-hidden rounded-2xl aspect-square group">
        <Image
          src={foto.src}
          alt={foto.alt}
          fill
          className="object-cover group-hover:scale-105 transition duration-300"
        />
      </div>
    ))}
  </div>
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

      <footer className="bg-[#111111] text-center py-8 text-gray-400 text-sm">
        <p>© 2025 Creative Shop 3D · Tulancingo, Hidalgo</p>
        <a href="https://www.facebook.com/CreativeShopTulancingo" className="text-[#29ABE2] hover:underline mt-2 block" target="_blank">Facebook</a>
      </footer>
    </main>
  );
}