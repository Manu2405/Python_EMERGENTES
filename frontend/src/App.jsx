import { useEffect, useState } from 'react'

const api = '/api'

export default function App() {
  const [groups, setGroups] = useState([])
  const [persons, setPersons] = useState([])
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

  const fetchData = async () => {
    const [gRes, pRes] = await Promise.all([fetch(`${api}/groups`), fetch(`${api}/persons`)])
    setGroups(await gRes.json())
    setPersons(await pRes.json())
  }

  useEffect(() => { fetchData() }, [])

  const handleGroupSubmit = async (e) => {
    e.preventDefault()
    const res = await fetch(`${api}/groups`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(formGroup),
    })
    if (res.ok) {
      setFormGroup({ grupo: '', esta_activo: true })
      fetchData()
    }
  }

  const handlePersonSubmit = async (e) => {
    e.preventDefault()
    const res = await fetch(`${api}/persons`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(formPerson),
    })
    if (res.ok) {
      setFormPerson({ nombres: '', apellidos: '', correo: '', celular: '', direccion: '', observaciones: '', fotografia_url: '', esta_activo: true, group_id: '' })
      fetchData()
    }
  }

  return (
    <div className="min-h-screen bg-slate-100 p-6">
      <div className="max-w-6xl mx-auto space-y-6">
        <header className="bg-white p-5 rounded-xl shadow">
          <h1 className="text-2xl font-bold">Gestión de Contactos</h1>
          <p className="text-sm text-slate-600">FastAPI + PostgreSQL / React + Tailwind</p>
        </header>

        <section className="grid md:grid-cols-2 gap-6">
          <article className="bg-white p-4 rounded-lg shadow">
            <h2 className="text-lg font-semibold mb-3">Crear Grupo</h2>
            <form onSubmit={handleGroupSubmit} className="space-y-3">
              <input value={formGroup.grupo} onChange={e => setFormGroup({...formGroup, grupo: e.target.value})} className="w-full border rounded px-3 py-2" placeholder="Nombre de grupo" required />
              <label className="flex items-center"><input type="checkbox" checked={formGroup.esta_activo} onChange={e => setFormGroup({...formGroup, esta_activo: e.target.checked})} className="mr-2" /> Activo</label>
              <button className="bg-blue-600 text-white px-4 py-2 rounded">Guardar Grupo</button>
            </form>
          </article>

          <article className="bg-white p-4 rounded-lg shadow">
            <h2 className="text-lg font-semibold mb-3">Crear Persona</h2>
            <form onSubmit={handlePersonSubmit} className="space-y-3">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                <input value={formPerson.nombres} onChange={e => setFormPerson({...formPerson, nombres: e.target.value})} className="border rounded px-2 py-1" placeholder="Nombres" required />
                <input value={formPerson.apellidos} onChange={e => setFormPerson({...formPerson, apellidos: e.target.value})} className="border rounded px-2 py-1" placeholder="Apellidos" required />
              </div>
              <input value={formPerson.correo} onChange={e => setFormPerson({...formPerson, correo: e.target.value})} className="border rounded px-2 py-1" type="email" placeholder="Correo" required />
              <input value={formPerson.celular} onChange={e => setFormPerson({...formPerson, celular: e.target.value})} className="border rounded px-2 py-1" placeholder="Celular" />
              <input value={formPerson.direccion} onChange={e => setFormPerson({...formPerson, direccion: e.target.value})} className="border rounded px-2 py-1" placeholder="Dirección" />
              <input value={formPerson.fotografia_url} onChange={e => setFormPerson({...formPerson, fotografia_url: e.target.value})} className="border rounded px-2 py-1" placeholder="URL fotografía" />
              <select value={formPerson.group_id} onChange={e => setFormPerson({...formPerson, group_id: e.target.value})} className="border rounded px-2 py-1" required>
                <option value="">Selecciona grupo</option>
                {groups.map(g => <option key={g.code} value={g.code}>{g.grupo}</option>)}
              </select>
              <label className="flex items-center"><input type="checkbox" checked={formPerson.esta_activo} onChange={e => setFormPerson({...formPerson, esta_activo: e.target.checked})} className="mr-2" /> Activo</label>
              <button className="bg-green-600 text-white px-4 py-2 rounded">Guardar Persona</button>
            </form>
          </article>
        </section>

        <section className="grid lg:grid-cols-2 gap-6">
          <article className="bg-white p-4 rounded-lg shadow">
            <h2 className="text-lg font-semibold mb-3">Lista de Grupos</h2>
            <ul className="space-y-2">
              {groups.map(g => (
                <li key={g.code} className="border rounded p-2 flex justify-between items-center">
                  <div>
                    <p className="font-medium">{g.grupo}</p>
                    <p className="text-sm text-slate-500">Activo: {g.esta_activo ? 'Sí' : 'No'}</p>
                  </div>
                  <span className="text-xs text-slate-400">{g.code}</span>
                </li>
              ))}
            </ul>
          </article>

          <article className="bg-white p-4 rounded-lg shadow">
            <h2 className="text-lg font-semibold mb-3">Lista de Personas</h2>
            <div className="space-y-3">
              {persons.map(p => (
                <div key={p.code} className="border rounded p-2 flex gap-3">
                  <img src={p.fotografia_url || 'https://via.placeholder.com/80'} alt="foto" className="w-20 h-20 object-cover rounded-full" />
                  <div>
                    <p className="font-semibold">{p.nombres} {p.apellidos}</p>
                    <p className="text-sm">{p.correo}</p>
                    <p className="text-sm">Cel: {p.celular || '-'}</p>
                    <p className="text-sm">Grupo: {p.group?.grupo || 'Sin grupo'}</p>
                    <p className="text-sm">Activo: {p.esta_activo ? 'Sí' : 'No'}</p>
                  </div>
                </div>
              ))}
            </div>
          </article>
        </section>
      </div>
    </div>
  )
}
