import { useEffect, useState } from 'react'

const api = '/api'

export default function App() {
  const [groups, setGroups] = useState([])
  const [persons, setPersons] = useState([])
  const [activeTab, setActiveTab] = useState('persons')
  
  // Estados para saber si estamos editando (guardan el ID de lo que se edita)
  const [editingPersonCode, setEditingPersonCode] = useState(null)
  const [editingGroupCode, setEditingGroupCode] = useState(null)

  const [formPerson, setFormPerson] = useState({
    nombres: '',
    apellidos: '',
    correo: '',
    celular: '',
    direccion: '',
    observaciones: '',
    fotografia_url: '',
    esta_activo: true,
    group_id: '',
  })
  const [formGroup, setFormGroup] = useState({ grupo: '', esta_activo: true })
  const [imageError, setImageError] = useState({})

  const fetchData = async () => {
    const [gRes, pRes] = await Promise.all([fetch(`${api}/groups`), fetch(`${api}/persons`)])
    setGroups(await gRes.json())
    setPersons(await pRes.json())
  }

  useEffect(() => { fetchData() }, [])

  // --- LÓGICA DE GRUPOS ---
  const handleGroupSubmit = async (e) => {
    e.preventDefault()
    // Si hay un ID en edición, usamos PUT, si no, POST
    const url = editingGroupCode ? `${api}/groups/${editingGroupCode}` : `${api}/groups`
    const method = editingGroupCode ? 'PUT' : 'POST'

    const res = await fetch(url, {
      method: method,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(formGroup),
    })
    if (res.ok) {
      setFormGroup({ grupo: '', esta_activo: true })
      setEditingGroupCode(null)
      fetchData()
      setActiveTab('groups')
    }
  }

  const handleEditGroup = (g) => {
    setFormGroup({ grupo: g.grupo, esta_activo: g.esta_activo })
    setEditingGroupCode(g.code)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  const handleDeleteGroup = async (code) => {
    if (window.confirm('¿Estás seguro de que deseas eliminar este grupo?')) {
      const res = await fetch(`${api}/groups/${code}`, { method: 'DELETE' })
      if (res.ok) fetchData()
    }
  }

  // --- LÓGICA DE PERSONAS ---
  const handlePersonSubmit = async (e) => {
    e.preventDefault()
    const url = editingPersonCode ? `${api}/persons/${editingPersonCode}` : `${api}/persons`
    const method = editingPersonCode ? 'PUT' : 'POST'

    const res = await fetch(url, {
      method: method,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(formPerson),
    })
    if (res.ok) {
      setFormPerson({ nombres: '', apellidos: '', correo: '', celular: '', direccion: '', observaciones: '', fotografia_url: '', esta_activo: true, group_id: '' })
      setEditingPersonCode(null)
      fetchData()
    }
  }

  const handleEditPerson = (p) => {
    setFormPerson({
      nombres: p.nombres,
      apellidos: p.apellidos,
      correo: p.correo,
      celular: p.celular || '',
      direccion: p.direccion || '',
      observaciones: p.observaciones || '',
      fotografia_url: p.fotografia_url || '',
      esta_activo: p.esta_activo,
      group_id: p.group_id
    })
    setEditingPersonCode(p.code)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  const handleDeletePerson = async (code) => {
    if (window.confirm('¿Estás seguro de que deseas eliminar a esta persona?')) {
      const res = await fetch(`${api}/persons/${code}`, { method: 'DELETE' })
      if (res.ok) fetchData()
    }
  }

  const handleCancelEdit = () => {
    if (activeTab === 'persons') {
      setFormPerson({ nombres: '', apellidos: '', correo: '', celular: '', direccion: '', observaciones: '', fotografia_url: '', esta_activo: true, group_id: '' })
      setEditingPersonCode(null)
    } else {
      setFormGroup({ grupo: '', esta_activo: true })
      setEditingGroupCode(null)
    }
  }

  const handleImageError = (personCode) => {
    setImageError(prev => ({ ...prev, [personCode]: true }))
  }

  // Iconos SVG ampliados con Editar y Eliminar
  const Icons = {
    Users: () => <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" /></svg>,
    Tag: () => <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l5 5a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-5-5A1.994 1.994 0 013 12V7a4 4 0 014-4z" /></svg>,
    User: () => <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" /></svg>,
    Mail: () => <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" /></svg>,
    Phone: () => <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" /></svg>,
    Location: () => <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" /></svg>,
    Image: () => <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>,
    Check: () => <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>,
    X: () => <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>,
    Plus: () => <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" /></svg>,
    Save: () => <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-3m-1 4l-3 3m0 0l-3-3m3 3V4" /></svg>,
    Folder: () => <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-6l-2-2H5a2 2 0 00-2 2z" /></svg>,
    List: () => <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 10h16M4 14h16M4 18h16" /></svg>,
    Edit: () => <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" /></svg>,
    Delete: () => <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8 text-center">
          <div className="inline-flex items-center justify-center p-2 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-2xl mb-4">
            <Icons.Users />
          </div>
          <h1 className="text-4xl font-bold bg-gradient-to-r from-slate-800 to-slate-600 bg-clip-text text-transparent">
            Gestión de Contactos
          </h1>
          <p className="text-slate-500 mt-2">FastAPI + PostgreSQL / React + Tailwind</p>
        </div>

        {/* Tabs */}
        <div className="flex gap-2 mb-6 border-b border-slate-200">
          <button
            onClick={() => setActiveTab('persons')}
            className={`flex items-center gap-2 px-6 py-3 font-medium transition-all duration-200 ${
              activeTab === 'persons' ? 'text-blue-600 border-b-2 border-blue-600' : 'text-slate-500 hover:text-slate-700'
            }`}
          >
            <Icons.User /> Personas
          </button>
          <button
            onClick={() => setActiveTab('groups')}
            className={`flex items-center gap-2 px-6 py-3 font-medium transition-all duration-200 ${
              activeTab === 'groups' ? 'text-blue-600 border-b-2 border-blue-600' : 'text-slate-500 hover:text-slate-700'
            }`}
          >
            <Icons.Tag /> Grupos
          </button>
        </div>

        {/* Forms Section */}
        <div className="mb-8">
          {activeTab === 'persons' ? (
            <div className="bg-white rounded-2xl shadow-lg overflow-hidden border border-slate-100">
              <div className="bg-gradient-to-r from-green-500 to-emerald-600 px-6 py-4">
                <h2 className="flex items-center gap-2 text-white font-semibold text-lg">
                  <Icons.Plus /> {editingPersonCode ? 'Editar Persona' : 'Crear Nueva Persona'}
                </h2>
              </div>
              <form onSubmit={handlePersonSubmit} className="p-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <input value={formPerson.nombres} onChange={e => setFormPerson({...formPerson, nombres: e.target.value})} className="border border-slate-200 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all" placeholder="Nombres" required />
                  <input value={formPerson.apellidos} onChange={e => setFormPerson({...formPerson, apellidos: e.target.value})} className="border border-slate-200 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all" placeholder="Apellidos" required />
                  <div className="relative">
                    <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400"><Icons.Mail /></div>
                    <input value={formPerson.correo} onChange={e => setFormPerson({...formPerson, correo: e.target.value})} className="border border-slate-200 rounded-lg pl-10 pr-4 py-2 w-full focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all" type="email" placeholder="Correo electrónico" required />
                  </div>
                  <div className="relative">
                    <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400"><Icons.Phone /></div>
                    <input value={formPerson.celular} onChange={e => setFormPerson({...formPerson, celular: e.target.value})} className="border border-slate-200 rounded-lg pl-10 pr-4 py-2 w-full focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all" placeholder="Celular" />
                  </div>
                  <div className="relative">
                    <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400"><Icons.Location /></div>
                    <input value={formPerson.direccion} onChange={e => setFormPerson({...formPerson, direccion: e.target.value})} className="border border-slate-200 rounded-lg pl-10 pr-4 py-2 w-full focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all" placeholder="Dirección" />
                  </div>
                  <div className="relative">
                    <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400"><Icons.Image /></div>
                    <input value={formPerson.fotografia_url} onChange={e => setFormPerson({...formPerson, fotografia_url: e.target.value})} className="border border-slate-200 rounded-lg pl-10 pr-4 py-2 w-full focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all" placeholder="URL de fotografía" />
                  </div>
                  <div className="relative">
                    <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400"><Icons.Folder /></div>
                    <select value={formPerson.group_id} onChange={e => setFormPerson({...formPerson, group_id: e.target.value})} className="border border-slate-200 rounded-lg pl-10 pr-4 py-2 w-full focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all" required>
                      <option value="">Selecciona un grupo</option>
                      {groups.map(g => <option key={g.code} value={g.code}>{g.grupo}</option>)}
                    </select>
                  </div>
                  <div className="flex items-center">
                    <label className="flex items-center cursor-pointer">
                      <input type="checkbox" checked={formPerson.esta_activo} onChange={e => setFormPerson({...formPerson, esta_activo: e.target.checked})} className="w-4 h-4 text-green-600 rounded focus:ring-green-500" />
                      <span className="ml-2 text-slate-700 flex items-center gap-1"><Icons.Check /> Activo</span>
                    </label>
                  </div>
                </div>
                <div className="flex gap-4 mt-6">
                  <button type="submit" className="bg-gradient-to-r from-green-500 to-emerald-600 text-white px-6 py-2 rounded-lg hover:shadow-lg transform hover:scale-105 transition-all duration-200 font-medium flex items-center gap-2">
                    <Icons.Save /> {editingPersonCode ? 'Actualizar Persona' : 'Guardar Persona'}
                  </button>
                  {editingPersonCode && (
                    <button type="button" onClick={handleCancelEdit} className="bg-slate-200 text-slate-700 px-6 py-2 rounded-lg hover:bg-slate-300 transition-all duration-200 font-medium">
                      Cancelar
                    </button>
                  )}
                </div>
              </form>
            </div>
          ) : (
            <div className="bg-white rounded-2xl shadow-lg overflow-hidden border border-slate-100">
              <div className="bg-gradient-to-r from-blue-500 to-indigo-600 px-6 py-4">
                <h2 className="flex items-center gap-2 text-white font-semibold text-lg">
                  <Icons.Plus /> {editingGroupCode ? 'Editar Grupo' : 'Crear Nuevo Grupo'}
                </h2>
              </div>
              <form onSubmit={handleGroupSubmit} className="p-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="relative">
                    <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400"><Icons.Tag /></div>
                    <input value={formGroup.grupo} onChange={e => setFormGroup({...formGroup, grupo: e.target.value})} className="border border-slate-200 rounded-lg pl-10 pr-4 py-2 w-full focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all" placeholder="Nombre del grupo" required />
                  </div>
                  <div className="flex items-center">
                    <label className="flex items-center cursor-pointer">
                      <input type="checkbox" checked={formGroup.esta_activo} onChange={e => setFormGroup({...formGroup, esta_activo: e.target.checked})} className="w-4 h-4 text-blue-600 rounded focus:ring-blue-500" />
                      <span className="ml-2 text-slate-700 flex items-center gap-1"><Icons.Check /> Activo</span>
                    </label>
                  </div>
                </div>
                <div className="flex gap-4 mt-6">
                  <button type="submit" className="bg-gradient-to-r from-blue-500 to-indigo-600 text-white px-6 py-2 rounded-lg hover:shadow-lg transform hover:scale-105 transition-all duration-200 font-medium flex items-center gap-2">
                    <Icons.Save /> {editingGroupCode ? 'Actualizar Grupo' : 'Guardar Grupo'}
                  </button>
                  {editingGroupCode && (
                    <button type="button" onClick={handleCancelEdit} className="bg-slate-200 text-slate-700 px-6 py-2 rounded-lg hover:bg-slate-300 transition-all duration-200 font-medium">
                      Cancelar
                    </button>
                  )}
                </div>
              </form>
            </div>
          )}
        </div>

        {/* Lists Section */}
        <div className="grid lg:grid-cols-2 gap-6">
          {/* Groups List */}
          <div className="bg-white rounded-2xl shadow-lg overflow-hidden border border-slate-100">
            <div className="bg-gradient-to-r from-blue-500 to-indigo-600 px-6 py-4">
              <h2 className="flex items-center gap-2 text-white font-semibold text-lg"><Icons.List /> Lista de Grupos</h2>
              <p className="text-blue-100 text-sm mt-1">{groups.length} grupos registrados</p>
            </div>
            <div className="divide-y divide-slate-100">
              {groups.map(g => (
                <div key={g.code} className="p-4 hover:bg-slate-50 transition-colors">
                  <div className="flex justify-between items-start">
                    <div className="flex-1">
                      <h3 className="font-semibold text-slate-800 flex items-center gap-2"><Icons.Tag /> {g.grupo}</h3>
                      <div className="flex items-center gap-2 mt-1">
                        <span className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${g.esta_activo ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                          {g.esta_activo ? <Icons.Check /> : <Icons.X />} {g.esta_activo ? 'Activo' : 'Inactivo'}
                        </span>
                        <span className="text-xs text-slate-400 font-mono">ID: {g.code.substring(0,8)}...</span>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <button onClick={() => handleEditGroup(g)} className="p-2 text-blue-500 hover:bg-blue-50 rounded-lg transition-colors" title="Editar">
                        <Icons.Edit />
                      </button>
                      <button onClick={() => handleDeleteGroup(g.code)} className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition-colors" title="Eliminar">
                        <Icons.Delete />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
              {groups.length === 0 && <div className="p-8 text-center text-slate-400">No hay grupos registrados</div>}
            </div>
          </div>

          {/* Persons List */}
          <div className="bg-white rounded-2xl shadow-lg overflow-hidden border border-slate-100">
            <div className="bg-gradient-to-r from-green-500 to-emerald-600 px-6 py-4">
              <h2 className="flex items-center gap-2 text-white font-semibold text-lg"><Icons.Users /> Lista de Personas</h2>
              <p className="text-green-100 text-sm mt-1">{persons.length} personas registradas</p>
            </div>
            <div className="divide-y divide-slate-100 max-h-[600px] overflow-y-auto">
              {persons.map(p => (
                <div key={p.code} className="p-4 hover:bg-slate-50 transition-colors">
                  <div className="flex gap-4">
                    <div className="relative">
                      <img src={imageError[p.code] ? 'https://via.placeholder.com/80?text=Sin+Imagen' : (p.fotografia_url || 'https://via.placeholder.com/80?text=Sin+Imagen')} alt={`${p.nombres}`} className="w-16 h-16 rounded-full object-cover border-2 border-slate-200" onError={() => handleImageError(p.code)} />
                    </div>
                    <div className="flex-1">
                      <div className="flex justify-between items-start">
                        <h3 className="font-semibold text-slate-800 flex items-center gap-2"><Icons.User /> {p.nombres} {p.apellidos}</h3>
                        <div className="flex gap-2">
                          <button onClick={() => handleEditPerson(p)} className="p-1.5 text-blue-500 hover:bg-blue-50 rounded-lg transition-colors" title="Editar">
                            <Icons.Edit />
                          </button>
                          <button onClick={() => handleDeletePerson(p.code)} className="p-1.5 text-red-500 hover:bg-red-50 rounded-lg transition-colors" title="Eliminar">
                            <Icons.Delete />
                          </button>
                        </div>
                      </div>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-4 gap-y-1 mt-2 text-sm">
                        <p className="text-slate-600 flex items-center gap-1"><Icons.Mail /> {p.correo}</p>
                        {p.celular && <p className="text-slate-600 flex items-center gap-1"><Icons.Phone /> {p.celular}</p>}
                        {p.direccion && <p className="text-slate-600 flex items-center gap-1"><Icons.Location /> {p.direccion}</p>}
                        <p className="text-slate-600 flex items-center gap-1"><Icons.Tag /> Grupo: {p.group?.grupo || 'Sin grupo'}</p>
                      </div>
                      <div className="flex items-center gap-2 mt-2">
                        <span className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${p.esta_activo ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                          {p.esta_activo ? <Icons.Check /> : <Icons.X />} {p.esta_activo ? 'Activo' : 'Inactivo'}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
              {persons.length === 0 && <div className="p-8 text-center text-slate-400">No hay personas registradas</div>}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}