import { useState } from 'react'
import { diagnose } from '../api/expertSystem'

const GENRES = [
  'Action', 'Adventure', 'RPG', 'Indie', 'Strategy', 'Shooter', 'Puzzle', 'Platformer', 'Simulation', 'Sports', 'Racing', 'Casual', 'Horror'
]

export default function DiagnosePage() {
  const [platform, setPlatform] = useState('PC')
  const [ageMax, setAgeMax] = useState<number | ''>(12)
  const [allowViolence, setAllowViolence] = useState(false)
  const [multiplayerRequired, setMultiplayerRequired] = useState<boolean | ''>('')
  const [offlineRequired, setOfflineRequired] = useState(false)
  const [includeGenres, setIncludeGenres] = useState<string[]>(['Adventure'])
  const [excludeGenres, setExcludeGenres] = useState<string[]>(['Horror'])
  const [maxPlaytime, setMaxPlaytime] = useState<number | ''>('')
  const [page, setPage] = useState(1)
  const [pageSize, setPageSize] = useState(12)
  const [items, setItems] = useState<any[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  function toggleIn(list: string[], setList: (v: string[]) => void, value: string) {
    if (list.includes(value)) setList(list.filter(v => v !== value))
    else setList([...list, value])
  }

  async function runDiagnose(p = page, ps = pageSize) {
    try {
      setLoading(true)
      setError(null)
      const payload = {
        hardware: { platform: platform || undefined },
        budget: { },
        time: { max_playtime_hours: typeof maxPlaytime === 'number' ? maxPlaytime : undefined },
        content: {
          allow_violence: allowViolence,
          age_max: typeof ageMax === 'number' ? ageMax : undefined,
          multiplayer_required: typeof multiplayerRequired === 'boolean' ? multiplayerRequired : undefined,
          offline_required: offlineRequired,
        },
        preferences: {
          include_genres: includeGenres,
          exclude_genres: excludeGenres,
        },
        page: p,
        page_size: ps,
      }
      const data = await diagnose(payload)
      setItems(data.items)
      setPage(p)
    } catch (e: any) {
      setError(e.message || 'Error')
    } finally {
      setLoading(false)
    }
  }

  const hasPrev = page > 1
  const hasNext = items.length === pageSize

  return (
    <div className="p-6">
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-gray-800">Recomendaciones (Diagnóstico)</h2>
        <p className="text-sm text-gray-500">Configura restricciones y preferencias. El sistema experto filtrará juegos que cumplan 100%.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Filtros */}
        <div className="lg:col-span-1">
          <div className="bg-white border border-gray-200 rounded-xl shadow-sm p-4 space-y-4">
            <h3 className="text-sm font-semibold text-gray-700">Restricciones</h3>
            <div className="space-y-3">
              <div>
                <label className="block text-xs text-gray-500 mb-1">Plataforma</label>
                <input className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-blue-500" placeholder="PC / PS5 / Xbox / Switch" value={platform} onChange={e => setPlatform(e.target.value)} />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs text-gray-500 mb-1">Edad máxima</label>
                  <input className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm" placeholder="12" value={ageMax} onChange={e => setAgeMax(e.target.value ? Number(e.target.value) : '')} />
                </div>
                <div>
                  <label className="block text-xs text-gray-500 mb-1">Horas máx.</label>
                  <input className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm" placeholder="10" value={maxPlaytime} onChange={e => setMaxPlaytime(e.target.value ? Number(e.target.value) : '')} />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs text-gray-500 mb-1">¿Multijugador requerido?</label>
                  <select className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm" value={String(multiplayerRequired)} onChange={e => setMultiplayerRequired(e.target.value === '' ? '' : e.target.value === 'true')}>
                    <option value="">Cualquiera</option>
                    <option value="true">Sí</option>
                    <option value="false">No</option>
                  </select>
                </div>
                <div className="flex items-end gap-2">
                  <label className="flex items-center gap-2 text-sm text-gray-700">
                    <input type="checkbox" checked={offlineRequired} onChange={e => setOfflineRequired(e.target.checked)} /> Offline
                  </label>
                </div>
              </div>

              {/* Multiselección de géneros */}
              <div>
                <label className="block text-xs text-gray-500 mb-2">Géneros a incluir</label>
                <div className="grid grid-cols-3 gap-2">
                  {GENRES.map(g => (
                    <label key={`inc-${g}`} className="flex items-center gap-2 text-sm text-gray-700">
                      <input type="checkbox" checked={includeGenres.includes(g)} onChange={() => toggleIn(includeGenres, setIncludeGenres, g)} /> {g}
                    </label>
                  ))}
                </div>
              </div>
              <div>
                <label className="block text-xs text-gray-500 mb-2">Géneros a excluir</label>
                <div className="grid grid-cols-3 gap-2">
                  {GENRES.map(g => (
                    <label key={`exc-${g}`} className="flex items-center gap-2 text-sm text-gray-700">
                      <input type="checkbox" checked={excludeGenres.includes(g)} onChange={() => toggleIn(excludeGenres, setExcludeGenres, g)} /> {g}
                    </label>
                  ))}
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs text-gray-500 mb-1">Permitir violencia</label>
                  <select className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm" value={allowViolence ? 'true' : 'false'} onChange={e => setAllowViolence(e.target.value === 'true')}>
                    <option value="false">No</option>
                    <option value="true">Sí</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs text-gray-500 mb-1">Resultados por página</label>
                  <select className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm" value={pageSize} onChange={e => { const ps = Number(e.target.value); setPageSize(ps); runDiagnose(1, ps) }}>
                    <option value={6}>6</option>
                    <option value={9}>9</option>
                    <option value={12}>12</option>
                    <option value={18}>18</option>
                  </select>
                </div>
              </div>
            </div>
            <div className="pt-2 flex gap-2">
              <button onClick={() => runDiagnose(1, pageSize)} disabled={loading} className="flex-1 bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded-lg px-4 py-2 text-sm font-medium hover:opacity-95 disabled:opacity-50">
                {loading ? 'Procesando…' : 'Ejecutar diagnóstico'}
              </button>
            </div>
            {error && <div className="text-red-600 text-sm">{error}</div>}
          </div>
        </div>

        {/* Resultados */}
        <div className="lg:col-span-2">
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
            {items.map((it) => (
              <div key={it.id} className="bg-white border border-gray-200 rounded-xl shadow-sm overflow-hidden">
                {it.background_image && (
                  <img src={it.background_image} className="w-full h-40 object-cover" />
                )}
                <div className="p-4 space-y-1">
                  <div className="font-semibold text-gray-800 line-clamp-2">{it.title}</div>
                  <div className="text-xs text-gray-500">{it.released || 'TBA'}</div>
                  <div className="text-xs text-gray-600">Edad: ≤ {it.age_rating}</div>
                  <div className="text-xs text-gray-600">Plataformas: {(it.platforms || []).join(', ')}</div>
                  <div className="flex flex-wrap gap-2 pt-2">
                    {(it.genres || []).slice(0, 4).map((g: string) => (
                      <span key={g} className="text-xs bg-gray-100 text-gray-700 px-2 py-1 rounded-md">{g}</span>
                    ))}
                  </div>
                </div>
              </div>
            ))}
            {!loading && items.length === 0 && (
              <div className="col-span-full text-sm text-gray-500">No hay resultados. Ajusta las restricciones y vuelve a intentar.</div>
            )}
          </div>

          {/* Paginación */}
          <div className="mt-4 flex items-center justify-between">
            <div className="text-sm text-gray-500">Página {page}</div>
            <div className="flex gap-2">
              <button onClick={() => runDiagnose(Math.max(1, page - 1), pageSize)} disabled={!hasPrev || loading} className="px-3 py-1.5 text-sm rounded-md border border-gray-300 text-gray-700 disabled:opacity-50">Anterior</button>
              <button onClick={() => runDiagnose(page + 1, pageSize)} disabled={!hasNext || loading} className="px-3 py-1.5 text-sm rounded-md border border-gray-300 text-gray-700 disabled:opacity-50">Siguiente</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
