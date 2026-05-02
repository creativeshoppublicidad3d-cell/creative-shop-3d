'use client'

import { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabase'

type Vista = 'login' | 'registro' | 'dashboard'
type Estatus = 'nuevo' | 'contactado' | 'cotizado' | 'negociando' | 'cerrado' | 'perdido'

interface Lead {
  id: string
  created_at: string
  nombre: string
  telefono: string
  negocio: string | null
  que_vende: string | null
  ciudad: string | null
  producto_interes: string | null
  mensaje: string | null
  como_llego: string | null
  estatus: Estatus
  vendedor_nombre: string | null
  vendedor_id: string | null
  asignado_a: string | null
}

interface Perfil {
  id: string
  nombre: string
  rol: string
}

interface LeadWeb {
  id: number
  created_at: string
  nombre: string
  telefono: string
  mensaje: string | null
  negocio: string | null
  que_vende: string | null
  ciudad: string | null
  producto_interes: string | null
  asignado_a: string | null
}

const PRODUCTOS = ['Letras 3D', 'Neón Flex', 'Acrílico personalizado', 'Artículo decorativo', 'Otro']
const VENDEDORES = ['Rosa Gayosso', 'Gustavo Maldonado', 'Alberto Huerta']
const COMO_LLEGO = ['Físico', 'Recomendado', 'Redes sociales']
const ESTATUS_LISTA: Estatus[] = ['nuevo', 'contactado', 'cotizado', 'negociando', 'cerrado', 'perdido']
const ESTATUS_COLOR: Record<Estatus, string> = {
  nuevo: 'bg-blue-500',
  contactado: 'bg-yellow-500',
  cotizado: 'bg-orange-500',
  negociando: 'bg-purple-500',
  cerrado: 'bg-green-500',
  perdido: 'bg-red-500',
}

export default function Registrar() {
  const [vista, setVista] = useState<Vista>('login')
  const [perfil, setPerfil] = useState<Perfil | null>(null)
  const [leads, setLeads] = useState<Lead[]>([])
  const [leadsWeb, setLeadsWeb] = useState<LeadWeb[]>([])
  const [cargando, setCargando] = useState(false)
  const [error, setError] = useState('')
  const [exito, setExito] = useState('')

  // Login
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')

  // Registro de cuenta
  const [regEmail, setRegEmail] = useState('')
  const [regPassword, setRegPassword] = useState('')
  const [regNombre, setRegNombre] = useState('')

  // Nuevo lead
  const [mostrarFormLead, setMostrarFormLead] = useState(false)
  const [leadEditando, setLeadEditando] = useState<Lead | null>(null)
const [mostrarFormEditar, setMostrarFormEditar] = useState(false)
  const [filtroVendedor, setFiltroVendedor] = useState('')
const [filtroEstatus, setFiltroEstatus] = useState('')
const [filtroProducto, setFiltroProducto] = useState('')
const [filtroOrigen, setFiltroOrigen] = useState('')
  const [form, setForm] = useState({
    nombre: '', telefono: '', negocio: '', que_vende: '',
    ciudad: '', producto_interes: '', mensaje: '', como_llego: 'Físico'
  })
  const [leadExistente, setLeadExistente] = useState<Lead | null>(null)

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session) cargarPerfil(session.user.id)
    })
  }, [])

  async function cargarPerfil(userId: string) {
    const { data } = await supabase.from('perfiles').select('*').eq('id', userId).single()
    if (data) {
      setPerfil(data)
      await cargarLeads(data)
      setVista('dashboard')
    }
  }

async function cargarLeads(p: Perfil) {
    let query = supabase.from('leads').select('*').order('created_at', { ascending: false })
    if (p.rol !== 'admin') query = query.eq('vendedor_id', (await supabase.auth.getUser()).data.user?.id)
    const { data } = await query
    if (data) setLeads(data)

    if (p.rol === 'admin') {
      const { data: webData } = await supabase
        .from('leads')
        .select('*')
        .is('asignado_a', null)
        .order('created_at', { ascending: false })
      if (webData) setLeadsWeb(webData)
    }
  }

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault()
    setCargando(true)
    setError('')
    const { data, error: err } = await supabase.auth.signInWithPassword({ email, password })
    if (err) { setError('Correo o contraseña incorrectos'); setCargando(false); return }
    if (data.user) await cargarPerfil(data.user.id)
    setCargando(false)
  }

  async function handleRegistro(e: React.FormEvent) {
    e.preventDefault()
    setCargando(true)
    setError('')
    const { data, error: err } = await supabase.auth.signUp({ email: regEmail, password: regPassword })
    if (err) { setError(err.message); setCargando(false); return }
    if (data.user) {
      await supabase.from('perfiles').update({ nombre: regNombre }).eq('id', data.user.id)
      setExito('Cuenta creada. Ahora inicia sesión.')
      setVista('login')
    }
    setCargando(false)
  }

async function handleNuevoLead(e: React.FormEvent) {
    e.preventDefault()
    setCargando(true)
    setError('')

    const normalizarTelefono = (tel: string): string => {
      tel = tel.replace(/\D/g, '')
      if (tel.startsWith('521') && tel.length === 13) return tel.slice(3)
      if (tel.startsWith('1') && tel.length === 11) return tel
      if (tel.length === 10) return tel
      return tel
    }

    const telefonoNormalizado = normalizarTelefono(form.telefono)

// Verificar si el teléfono ya existe
const { data: existentes } = await supabase
  .from('leads')
  .select('*')
  .eq('telefono', telefonoNormalizado)
  .limit(1)

if (existentes && existentes.length > 0) {
  setLeadExistente(existentes[0])
  setCargando(false)
  return
}

    const formNormalizado = { ...form, telefono: telefonoNormalizado }
    const { data: { user } } = await supabase.auth.getUser()
    const { error: err } = await supabase.from('leads').insert({
      ...formNormalizado,
      vendedor_id: user?.id,
      vendedor_nombre: perfil?.nombre,
      estatus: 'nuevo',
      asignado_a: perfil?.nombre
    })
    if (err) { setError('Error al guardar. Intenta de nuevo.'); setCargando(false); return }
    setExito('✅ Lead registrado correctamente')
    setForm({ nombre: '', telefono: '', negocio: '', que_vende: '', ciudad: '', producto_interes: '', mensaje: '', como_llego: 'Físico' })
    setMostrarFormLead(false)
    if (perfil) await cargarLeads(perfil)
    setCargando(false)
    setTimeout(() => setExito(''), 3000)
  }

 async function actualizarEstatus(id: string, estatus: Estatus) {
    await supabase.from('leads').update({ estatus }).eq('id', id)
    if (perfil) await cargarLeads(perfil)
  }

async function handleEditarLead(e: React.FormEvent) {
    e.preventDefault()
    if (!leadEditando) return
    setCargando(true)
    setError('')

    const normalizarTelefono = (tel: string): string => {
      tel = tel.replace(/\D/g, '')
      if (tel.startsWith('521') && tel.length === 13) return tel.slice(3)
      if (tel.startsWith('1') && tel.length === 11) return tel
      if (tel.length === 10) return tel
      return tel
    }

    const { error: err } = await supabase.from('leads').update({
      nombre: leadEditando.nombre,
      telefono: normalizarTelefono(leadEditando.telefono),
      negocio: leadEditando.negocio,
      que_vende: leadEditando.que_vende,
      ciudad: leadEditando.ciudad,
      producto_interes: leadEditando.producto_interes,
      mensaje: leadEditando.mensaje,
      como_llego: leadEditando.como_llego,
      ultima_edicion: new Date().toISOString(),
    }).eq('id', leadEditando.id)
    if (err) { 
      console.log('Error Supabase:', err)
      setError('Error al actualizar: ' + err.message)
      setCargando(false)
      return 
    }
    setExito('✅ Lead actualizado correctamente')
    setMostrarFormEditar(false)
    setLeadEditando(null)
    if (perfil) await cargarLeads(perfil)
    setCargando(false)
    setTimeout(() => setExito(''), 3000)
  }

async function handleConfirmarActualizar() {
    if (!leadExistente) return
    setCargando(true)

    const normalizarTelefono = (tel: string): string => {
      tel = tel.replace(/\D/g, '')
      if (tel.startsWith('521') && tel.length === 13) return tel.slice(3)
      if (tel.startsWith('1') && tel.length === 11) return tel
      if (tel.length === 10) return tel
      return tel
    }

    const { error: err } = await supabase.from('leads').update({
      nombre: form.nombre,
      negocio: form.negocio,
      que_vende: form.que_vende,
      ciudad: form.ciudad,
      producto_interes: form.producto_interes,
      mensaje: form.mensaje,
      como_llego: form.como_llego,
      ultima_edicion: new Date().toISOString(),
    }).eq('telefono', normalizarTelefono(form.telefono))

    if (err) { setError('Error al actualizar.'); setCargando(false); return }
    setExito('✅ Lead actualizado correctamente')
    setLeadExistente(null)
    setForm({ nombre: '', telefono: '', negocio: '', que_vende: '', ciudad: '', producto_interes: '', mensaje: '', como_llego: 'Físico' })
    setMostrarFormLead(false)
    if (perfil) await cargarLeads(perfil)
    setCargando(false)
    setTimeout(() => setExito(''), 3000)
  }

  async function handleEliminarLead(id: string) {
    if (!confirm('¿Seguro que quieres eliminar este lead?')) return
    
    // Obtener el teléfono del lead antes de borrarlo
    const { data: lead } = await supabase
      .from('leads')
      .select('telefono')
      .eq('id', id)
      .single()
    
    // Borrar el lead
    await supabase.from('leads').delete().eq('id', id)
    
    // Borrar historial de conversaciones del mismo teléfono
    if (lead?.telefono) {
      await supabase.from('conversaciones').delete().eq('telefono', lead.telefono)
    }
    
    if (perfil) await cargarLeads(perfil)
  }

  async function asignarLead(lead: LeadWeb, vendedor: string) {
    const { data: perfilVendedor } = await supabase
      .from('perfiles')
      .select('id, nombre')
      .eq('nombre', vendedor)
      .single()

    await supabase.from('leads').update({ 
      asignado_a: vendedor,
      vendedor_id: perfilVendedor?.id,
      vendedor_nombre: vendedor
    }).eq('id', lead.id)

    if (perfil) await cargarLeads(perfil)
  }

  async function cerrarSesion() {
    await supabase.auth.signOut()
    setPerfil(null)
    setLeads([])
    setVista('login')
  }

  // Métricas
  const total = leads.length
  const cerrados = leads.filter(l => l.estatus === 'cerrado').length
  const tasa = total > 0 ? Math.round((cerrados / total) * 100) : 0

  // Leads filtrados
  const leadsFiltrados = leads.filter(l => {
    if (filtroVendedor && l.vendedor_nombre !== filtroVendedor) return false
    if (filtroEstatus && l.estatus !== filtroEstatus) return false
    if (filtroProducto && l.producto_interes !== filtroProducto) return false
    if (filtroOrigen && l.como_llego !== filtroOrigen) return false
    return true
  })

  // Métricas por vendedor (solo admin)
  const vendedores = perfil?.rol === 'admin'
    ? [...new Set(leads.map(l => l.vendedor_nombre))].map(nombre => ({
        nombre,
        total: leads.filter(l => l.vendedor_nombre === nombre).length,
        cerrados: leads.filter(l => l.vendedor_nombre === nombre && l.estatus === 'cerrado').length,
      }))
    : []

  if (vista === 'login') return (
    <div className="min-h-screen bg-zinc-950 flex items-center justify-center p-4">
      <div className="w-full max-w-sm">
        <div className="text-center mb-8">
          <h1 className="text-2xl font-bold text-white">Creative Shop 3D</h1>
          <p className="text-zinc-400 text-sm mt-1">Panel de vendedores</p>
        </div>
        <form onSubmit={handleLogin} className="bg-zinc-900 rounded-2xl p-6 space-y-4 border border-zinc-800">
          <div>
            <label className="text-zinc-400 text-xs mb-1 block">Correo</label>
            <input type="email" value={email} onChange={e => setEmail(e.target.value)} required
              className="w-full bg-zinc-800 text-white rounded-lg px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-orange-500 border border-zinc-700" />
          </div>
          <div>
            <label className="text-zinc-400 text-xs mb-1 block">Contraseña</label>
            <input type="password" value={password} onChange={e => setPassword(e.target.value)} required
              className="w-full bg-zinc-800 text-white rounded-lg px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-orange-500 border border-zinc-700" />
          </div>
          {error && <p className="text-red-400 text-xs">{error}</p>}
          {exito && <p className="text-green-400 text-xs">{exito}</p>}
          <button type="submit" disabled={cargando}
            className="w-full bg-orange-500 hover:bg-orange-600 text-white font-semibold py-3 rounded-lg text-sm transition disabled:opacity-50">
            {cargando ? 'Entrando...' : 'Entrar'}
          </button>
        </form>
        <p className="text-center text-zinc-500 text-xs mt-4">
          ¿Primera vez?{' '}
          <button onClick={() => setVista('registro')} className="text-orange-400 hover:text-orange-300">Crear cuenta</button>
        </p>
      </div>
    </div>
  )

  if (vista === 'registro') return (
    <div className="min-h-screen bg-zinc-950 flex items-center justify-center p-4">
      <div className="w-full max-w-sm">
        <div className="text-center mb-8">
          <h1 className="text-2xl font-bold text-white">Crear cuenta</h1>
          <p className="text-zinc-400 text-sm mt-1">Creative Shop 3D</p>
        </div>
        <form onSubmit={handleRegistro} className="bg-zinc-900 rounded-2xl p-6 space-y-4 border border-zinc-800">
          <div>
            <label className="text-zinc-400 text-xs mb-1 block">Tu nombre</label>
            <input type="text" value={regNombre} onChange={e => setRegNombre(e.target.value)} required
              className="w-full bg-zinc-800 text-white rounded-lg px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-orange-500 border border-zinc-700" />
          </div>
          <div>
            <label className="text-zinc-400 text-xs mb-1 block">Correo</label>
            <input type="email" value={regEmail} onChange={e => setRegEmail(e.target.value)} required
              className="w-full bg-zinc-800 text-white rounded-lg px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-orange-500 border border-zinc-700" />
          </div>
          <div>
            <label className="text-zinc-400 text-xs mb-1 block">Contraseña</label>
            <input type="password" value={regPassword} onChange={e => setRegPassword(e.target.value)} required minLength={6}
              className="w-full bg-zinc-800 text-white rounded-lg px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-orange-500 border border-zinc-700" />
          </div>
          {error && <p className="text-red-400 text-xs">{error}</p>}
          <button type="submit" disabled={cargando}
            className="w-full bg-orange-500 hover:bg-orange-600 text-white font-semibold py-3 rounded-lg text-sm transition disabled:opacity-50">
            {cargando ? 'Creando...' : 'Crear cuenta'}
          </button>
        </form>
        <p className="text-center text-zinc-500 text-xs mt-4">
          ¿Ya tienes cuenta?{' '}
          <button onClick={() => setVista('login')} className="text-orange-400 hover:text-orange-300">Iniciar sesión</button>
        </p>
      </div>
    </div>
  )

  return (
    <div className="min-h-screen bg-zinc-950 text-white">
      {/* Header */}
      <header className="bg-zinc-900 border-b border-zinc-800 px-4 py-4">
        <div className="max-w-4xl mx-auto flex items-center justify-between">
          <div>
            <h1 className="font-bold text-white">Creative Shop 3D</h1>
            <p className="text-zinc-400 text-xs">{perfil?.nombre} · {perfil?.rol === 'admin' ? '⭐ Admin' : 'Vendedor'}</p>
          </div>
          <button onClick={cerrarSesion} className="text-zinc-500 hover:text-white text-xs transition">Salir</button>
        </div>
      </header>

      <div className="max-w-4xl mx-auto p-4 space-y-6">

        {/* Métricas propias */}
        <div className="grid grid-cols-3 gap-3">
          {[
            { label: 'Total leads', valor: total, color: 'text-white' },
            { label: 'Cerrados', valor: cerrados, color: 'text-green-400' },
            { label: 'Tasa cierre', valor: `${tasa}%`, color: tasa >= 50 ? 'text-green-400' : 'text-orange-400' },
          ].map(m => (
            <div key={m.label} className="bg-zinc-900 rounded-xl p-4 border border-zinc-800 text-center">
              <p className={`text-2xl font-bold ${m.color}`}>{m.valor}</p>
              <p className="text-zinc-500 text-xs mt-1">{m.label}</p>
            </div>
          ))}
        </div>

{/* Leads web sin asignar — solo admin */}
        {perfil?.rol === 'admin' && leadsWeb.length > 0 && (
          <div className="bg-zinc-900 rounded-xl border border-orange-500/30 overflow-hidden">
            <div className="px-4 py-3 border-b border-zinc-800 flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-orange-500 animate-pulse"></span>
              <h2 className="font-semibold text-sm">Leads web sin asignar ({leadsWeb.length})</h2>
            </div>
            <div className="divide-y divide-zinc-800">
              {leadsWeb.map(lead => (
                <div key={lead.id} className="px-4 py-4 space-y-3">
                  <div>
                    <p className="font-semibold text-white">{lead.nombre}</p>
                    <a href={`https://wa.me/52${lead.telefono.replace(/\D/g, '')}`} target="_blank" rel="noreferrer"
                      className="text-green-400 text-xs hover:underline">
                      📱 {lead.telefono}
                    </a>
                  </div>
                  <div className="flex flex-wrap gap-2 text-xs text-zinc-500">
                    {lead.producto_interes && <span>🏷️ {lead.producto_interes}</span>}
                    {lead.ciudad && <span>📍 {lead.ciudad}</span>}
                    {lead.negocio && <span>🏢 {lead.negocio}</span>}
                  </div>
                  {lead.mensaje && <p className="text-zinc-400 text-xs">{lead.mensaje}</p>}
                  <div>
                    <label className="text-zinc-500 text-xs mb-1 block">Asignar a vendedor</label>
                    <select
                      defaultValue=""
                      onChange={e => { if (e.target.value) asignarLead(lead, e.target.value) }}
                      className="bg-zinc-800 text-white rounded-lg px-3 py-2 text-xs border border-zinc-700 outline-none">
                      <option value="">Seleccionar...</option>
                      {VENDEDORES.map(v => <option key={v}>{v}</option>)}
                    </select>

                    <button
  onClick={() => handleEliminarLead(lead.id.toString())}
  className="mt-2 w-full bg-red-900/40 hover:bg-red-900/70 text-red-400 text-xs py-2 rounded-lg transition">
  🗑️ Eliminar lead
</button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Tabla comparativa admin */}
        {perfil?.rol === 'admin' && vendedores.length > 0 && (
          <div className="bg-zinc-900 rounded-xl border border-zinc-800 overflow-hidden">
            <div className="px-4 py-3 border-b border-zinc-800">
              <h2 className="font-semibold text-sm">Rendimiento del equipo</h2>
            </div>
            <div className="divide-y divide-zinc-800">
              {vendedores.map(v => (
                <div key={v.nombre} className="px-4 py-3 flex items-center justify-between">
                  <span className="text-sm">{v.nombre || 'Sin nombre'}</span>
                  <div className="flex gap-4 text-xs text-zinc-400">
                    <span>{v.total} leads</span>
                    <span className="text-green-400">{v.cerrados} cerrados</span>
                    <span className="text-orange-400">
                      {v.total > 0 ? Math.round((v.cerrados / v.total) * 100) : 0}%
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}


{mostrarFormEditar && leadEditando && (
  <form onSubmit={handleEditarLead} className="bg-zinc-900 rounded-2xl p-5 border border-orange-500/30 space-y-4">
    <h2 className="font-semibold text-sm text-orange-400">Editando: {leadEditando.nombre}</h2>
    {error && <p className="text-red-400 text-xs">{error}</p>}
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
      {[
        { label: 'Nombre *', key: 'nombre', required: true },
        { label: 'Teléfono *', key: 'telefono', required: true },
        { label: 'Negocio', key: 'negocio', required: false },
        { label: '¿Qué vende?', key: 'que_vende', required: false },
        { label: 'Ciudad', key: 'ciudad', required: false },
      ].map(f => (
        <div key={f.key}>
          <label className="text-zinc-400 text-xs mb-1 block">{f.label}</label>
          <input type="text"
            value={leadEditando[f.key as keyof Lead] as string || ''}
            onChange={e => setLeadEditando({ ...leadEditando, [f.key]: e.target.value })}
            required={f.required}
            className="w-full bg-zinc-800 text-white rounded-lg px-3 py-2.5 text-sm outline-none focus:ring-2 focus:ring-orange-500 border border-zinc-700" />
        </div>
      ))}
      <div>
        <label className="text-zinc-400 text-xs mb-1 block">Producto de interés</label>
        <select value={leadEditando.producto_interes || ''}
          onChange={e => setLeadEditando({ ...leadEditando, producto_interes: e.target.value })}
          className="w-full bg-zinc-800 text-white rounded-lg px-3 py-2.5 text-sm outline-none focus:ring-2 focus:ring-orange-500 border border-zinc-700">
          <option value="">Seleccionar...</option>
          {PRODUCTOS.map(p => <option key={p}>{p}</option>)}
        </select>
      </div>
      <div>
        <label className="text-zinc-400 text-xs mb-1 block">¿Cómo llegó?</label>
        <select value={leadEditando.como_llego || ''}
          onChange={e => setLeadEditando({ ...leadEditando, como_llego: e.target.value })}
          className="w-full bg-zinc-800 text-white rounded-lg px-3 py-2.5 text-sm outline-none focus:ring-2 focus:ring-orange-500 border border-zinc-700">
          {COMO_LLEGO.map(c => <option key={c}>{c}</option>)}
        </select>
      </div>
    </div>
    <div>
      <label className="text-zinc-400 text-xs mb-1 block">Notas</label>
      <textarea value={leadEditando.mensaje || ''}
        onChange={e => setLeadEditando({ ...leadEditando, mensaje: e.target.value })} rows={3}
        className="w-full bg-zinc-800 text-white rounded-lg px-3 py-2.5 text-sm outline-none focus:ring-2 focus:ring-orange-500 border border-zinc-700 resize-none" />
    </div>
    <div className="flex gap-3">
      <button type="submit" disabled={cargando}
        className="flex-1 bg-orange-500 hover:bg-orange-600 text-white font-semibold py-3 rounded-lg text-sm transition disabled:opacity-50">
        {cargando ? 'Guardando...' : 'Guardar cambios'}
      </button>
      <button type="button" onClick={() => { setMostrarFormEditar(false); setLeadEditando(null) }}
        className="flex-1 bg-zinc-800 hover:bg-zinc-700 text-white font-semibold py-3 rounded-lg text-sm transition">
        Cancelar
      </button>
    </div>
  </form>
)}

{leadExistente && (
  <div className="bg-yellow-900/30 border border-yellow-500/40 rounded-xl p-4 space-y-3">
    <p className="text-yellow-400 text-sm font-semibold">⚠️ Este número ya está registrado</p>
    <div className="text-xs text-zinc-400 space-y-1">
      <p><span className="text-zinc-300">Nombre:</span> {leadExistente.nombre}</p>
      <p><span className="text-zinc-300">Estatus:</span> {leadExistente.estatus}</p>
      <p><span className="text-zinc-300">Asignado a:</span> {leadExistente.vendedor_nombre || 'Sin asignar'}</p>
      {leadExistente.producto_interes && <p><span className="text-zinc-300">Producto:</span> {leadExistente.producto_interes}</p>}
    </div>
    <p className="text-zinc-400 text-xs">¿Quieres actualizar sus datos con la información que acabas de ingresar?</p>
    <div className="flex gap-3">
      <button onClick={handleConfirmarActualizar} disabled={cargando}
        className="flex-1 bg-yellow-600 hover:bg-yellow-500 text-white text-xs font-semibold py-2.5 rounded-lg transition disabled:opacity-50">
        {cargando ? 'Actualizando...' : '✅ Sí, actualizar'}
      </button>
      <button onClick={() => setLeadExistente(null)}
        className="flex-1 bg-zinc-800 hover:bg-zinc-700 text-white text-xs font-semibold py-2.5 rounded-lg transition">
        ❌ Cancelar
      </button>
    </div>
  </div>
)}


{/* Botón nuevo lead */}
        {/* Botón nuevo lead */}
        {exito && <p className="text-green-400 text-sm text-center">{exito}</p>}
        <button onClick={() => setMostrarFormLead(!mostrarFormLead)}
          className="w-full bg-orange-500 hover:bg-orange-600 text-white font-semibold py-3 rounded-xl transition">
          {mostrarFormLead ? 'Cancelar' : '+ Registrar nuevo cliente'}
        </button>

        {/* Formulario nuevo lead */}
        {mostrarFormLead && (
          <form onSubmit={handleNuevoLead} className="bg-zinc-900 rounded-2xl p-5 border border-zinc-800 space-y-4">
            <h2 className="font-semibold text-sm text-zinc-300">Datos del cliente</h2>
            {error && <p className="text-red-400 text-xs">{error}</p>}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {[
                { label: 'Nombre *', key: 'nombre', required: true },
                { label: 'Teléfono *', key: 'telefono', required: true },
                { label: 'Negocio', key: 'negocio', required: false },
                { label: '¿Qué vende?', key: 'que_vende', required: false },
                { label: 'Ciudad', key: 'ciudad', required: false },
              ].map(f => (
                <div key={f.key}>
                  <label className="text-zinc-400 text-xs mb-1 block">{f.label}</label>
                  <input type="text" value={form[f.key as keyof typeof form]}
                    onChange={e => setForm({ ...form, [f.key]: e.target.value })}
                    required={f.required}
                    className="w-full bg-zinc-800 text-white rounded-lg px-3 py-2.5 text-sm outline-none focus:ring-2 focus:ring-orange-500 border border-zinc-700" />
                </div>
              ))}
              <div>
                <label className="text-zinc-400 text-xs mb-1 block">Producto de interés</label>
                <select value={form.producto_interes} onChange={e => setForm({ ...form, producto_interes: e.target.value })}
                  className="w-full bg-zinc-800 text-white rounded-lg px-3 py-2.5 text-sm outline-none focus:ring-2 focus:ring-orange-500 border border-zinc-700">
                  <option value="">Seleccionar...</option>
                  {PRODUCTOS.map(p => <option key={p}>{p}</option>)}
                </select>
              </div>
              <div>
                <label className="text-zinc-400 text-xs mb-1 block">¿Cómo llegó?</label>
                <select value={form.como_llego} onChange={e => setForm({ ...form, como_llego: e.target.value })}
                  className="w-full bg-zinc-800 text-white rounded-lg px-3 py-2.5 text-sm outline-none focus:ring-2 focus:ring-orange-500 border border-zinc-700">
                  {COMO_LLEGO.map(c => <option key={c}>{c}</option>)}
                </select>
              </div>
            </div>
            <div>
              <label className="text-zinc-400 text-xs mb-1 block">Notas</label>
              <textarea value={form.mensaje} onChange={e => setForm({ ...form, mensaje: e.target.value })} rows={3}
                className="w-full bg-zinc-800 text-white rounded-lg px-3 py-2.5 text-sm outline-none focus:ring-2 focus:ring-orange-500 border border-zinc-700 resize-none" />
            </div>
            <button type="submit" disabled={cargando}
              className="w-full bg-orange-500 hover:bg-orange-600 text-white font-semibold py-3 rounded-lg text-sm transition disabled:opacity-50">
              {cargando ? 'Guardando...' : 'Guardar cliente'}
            </button>
          </form>
        )}

        {/* Lista de leads */}
        <div className="space-y-3">
          {/* Filtros */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
            <select value={filtroVendedor} onChange={e => setFiltroVendedor(e.target.value)}
              className="bg-zinc-800 text-white rounded-lg px-3 py-2 text-xs border border-zinc-700 outline-none">
              <option value="">Todos los vendedores</option>
              {VENDEDORES.map(v => <option key={v}>{v}</option>)}
            </select>
            <select value={filtroEstatus} onChange={e => setFiltroEstatus(e.target.value)}
              className="bg-zinc-800 text-white rounded-lg px-3 py-2 text-xs border border-zinc-700 outline-none">
              <option value="">Todos los estatus</option>
              {ESTATUS_LISTA.map(s => <option key={s}>{s}</option>)}
            </select>
            <select value={filtroProducto} onChange={e => setFiltroProducto(e.target.value)}
              className="bg-zinc-800 text-white rounded-lg px-3 py-2 text-xs border border-zinc-700 outline-none">
              <option value="">Todos los productos</option>
              {PRODUCTOS.map(p => <option key={p}>{p}</option>)}
            </select>
            <select value={filtroOrigen} onChange={e => setFiltroOrigen(e.target.value)}
              className="bg-zinc-800 text-white rounded-lg px-3 py-2 text-xs border border-zinc-700 outline-none">
              <option value="">Todos los orígenes</option>
              {COMO_LLEGO.map(c => <option key={c}>{c}</option>)}
              <option>Web</option>
            </select>
          </div>
          <h2 className="font-semibold text-sm text-zinc-400">
            {perfil?.rol === 'admin' ? 'Todos los leads' : 'Mis leads'} ({leadsFiltrados.length})
          </h2>

          {leadsFiltrados.length === 0 && (
            <div className="text-center py-12 text-zinc-600 text-sm">
              Sin leads registrados aún
            </div>
          )}
          {leadsFiltrados.map(lead => (
            <div key={lead.id} className="bg-zinc-900 rounded-xl border border-zinc-800 p-4 space-y-3">
              <div className="flex items-start justify-between gap-2">
                <div>
                  <p className="font-semibold text-white">{lead.nombre}</p>
                  <a href={`https://wa.me/52${lead.telefono.replace(/\D/g, '')}`} target="_blank" rel="noreferrer"
                    className="text-green-400 text-xs hover:underline">
                    📱 {lead.telefono}
                  </a>
                </div>
                <span className={`text-xs text-white px-2 py-1 rounded-full ${ESTATUS_COLOR[lead.estatus]}`}>
                  {lead.estatus}
                </span>
              </div>
              <div className="flex flex-wrap gap-2 text-xs text-zinc-500">
                {lead.producto_interes && <span>🏷️ {lead.producto_interes}</span>}
                {lead.ciudad && <span>📍 {lead.ciudad}</span>}
                {lead.como_llego && <span>🚶 {lead.como_llego}</span>}
                {perfil?.rol === 'admin' && lead.vendedor_nombre && <span>👤 {lead.vendedor_nombre}</span>}
              </div>
              {lead.mensaje && <p className="text-zinc-400 text-xs">{lead.mensaje}</p>}
              <div>
                <label className="text-zinc-500 text-xs mb-1 block">Actualizar estatus</label>

                <div className="flex gap-2 pt-1">
  <button
    onClick={() => { setLeadEditando(lead); setMostrarFormEditar(true); window.scrollTo({ top: 0, behavior: 'smooth' }) }}
    className="flex-1 bg-zinc-800 hover:bg-zinc-700 text-white text-xs py-2 rounded-lg transition">
    ✏️ Editar
  </button>
  <button
    onClick={() => handleEliminarLead(lead.id)}
    className="flex-1 bg-red-900/40 hover:bg-red-900/70 text-red-400 text-xs py-2 rounded-lg transition">
    🗑️ Eliminar
  </button>
</div>

                <select value={lead.estatus}
                  onChange={e => actualizarEstatus(lead.id, e.target.value as Estatus)}
                  className="bg-zinc-800 text-white rounded-lg px-3 py-2 text-xs border border-zinc-700 outline-none">
                  {ESTATUS_LISTA.map(s => <option key={s}>{s}</option>)}
                </select>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}