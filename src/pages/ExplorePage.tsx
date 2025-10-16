import { useEffect, useState } from 'react'
import { searchNdjson, toNdjson } from '../api/expertSystem'

export default function ExplorePage() {
  const [q, setQ] = useState('')
  const [genre, setGenre] = useState('')
  const [platform, setPlatform] = useState('')
  const [minRating, setMinRating] = useState<number | ''>('')
  const [ageMax, setAgeMax] = useState<number | ''>('')
  const [page, setPage] = useState(1)
  const [pageSize, setPageSize] = useState(12)
  const [items, setItems] = useState<any[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  async function runSearch(p = 1, ps = pageSize) {
    try {
      setLoading(true)
      setError(null)
      const data = await searchNdjson({
        q: q || undefined,
        genre: genre || undefined,
        platform: platform || undefined,
        min_rating: typeof minRating === 'number' ? minRating : undefined,
        age_max: typeof ageMax === 'number' ? ageMax : undefined,
        page: p,
        page_size: ps,
        only_released: true,
      })
      setItems(data.items)
      setPage(p)
    } catch (e: any) {
      setError(e.message || 'Error')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    runSearch(1, pageSize)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const hasPrev = page > 1
  const hasNext = items.length === pageSize

  return (
    <div className="p-6">
      <div className="mb-4">
        <h2 className="text-2xl font-bold text-gray-800">Explorar catálogo</h2>
        <p className="text-sm text-gray-500">Busca y filtra el catálogo local (NDJSON) sin cargar todo en memoria.</p>
      </div>

      <div className="bg-white border border-gray-200 rounded-xl shadow-sm p-4">
        <div className="grid grid-cols-1 md:grid-cols-6 gap-3">
          <input className="border border-gray-300 rounded-lg px-3 py-2 text-sm" placeholder="Buscar" value={q} onChange={(e) => setQ(e.target.value)} />
          <input className="border border-gray-300 rounded-lg px-3 py-2 text-sm" placeholder="Género (p.ej. RPG)" value={genre} onChange={(e) => setGenre(e.target.value)} />
          <input className="border border-gray-300 rounded-lg px-3 py-2 text-sm" placeholder="Plataforma (p.ej. PC)" value={platform} onChange={(e) => setPlatform(e.target.value)} />
          <input className="border border-gray-300 rounded-lg px-3 py-2 text-sm" placeholder="Rating mínimo (0-5)" value={minRating} onChange={(e) => setMinRating(e.target.value ? Number(e.target.value) : '')} />
          <input className="border border-gray-300 rounded-lg px-3 py-2 text-sm" placeholder="Edad máxima" value={ageMax} onChange={(e) => setAgeMax(e.target.value ? Number(e.target.value) : '')} />
          <div className="flex items-center gap-2">
            <select className="border border-gray-300 rounded-lg px-3 py-2 text-sm" value={pageSize} onChange={(e) => { const ps = Number(e.target.value); setPageSize(ps); runSearch(1, ps) }}>
              <option value={8}>8</option>
              <option value={12}>12</option>
              <option value={16}>16</option>
              <option value={20}>20</option>
            </select>
            <button onClick={() => runSearch(1, pageSize)} disabled={loading} className="bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded-lg px-4 py-2 text-sm font-medium hover:opacity-95 disabled:opacity-50">Buscar</button>
          </div>
        </div>
        <div className="mt-3">
          <button onClick={() => toNdjson()} disabled={loading} className="text-xs text-blue-600 hover:underline">Reconstruir NDJSON</button>
        </div>
      </div>

      {error && <div className="text-red-600 text-sm mt-3">{error}</div>}
      {loading && <div className="text-sm text-gray-500 mt-3">Cargando…</div>}

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 mt-4">
        {items.map((it) => (
          <div key={it.id} className="group relative bg-white border border-gray-200 rounded-xl shadow-sm overflow-hidden hover:shadow-md transition-shadow">
            <div className="relative">
              {it.background_image ? (
                <img src={it.background_image} loading="lazy" alt={it.title} className="w-full h-44 object-cover" />
              ) : (
                <div className="w-full h-44 bg-gray-100 flex items-center justify-center text-gray-400 text-sm">Sin imagen</div>
              )}
              <div className="absolute top-2 left-2 flex gap-2">
                {it.rating !== undefined && (
                  <span className="text-xs bg-black/70 text-white px-2 py-0.5 rounded-md">⭐ {it.rating}</span>
                )}
                {it.metacritic !== undefined && it.metacritic !== null && (
                  <span className="text-xs bg-green-600 text-white px-2 py-0.5 rounded-md">MC {it.metacritic}</span>
                )}
              </div>
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
            </div>
            <div className="p-3 space-y-1">
              <div className="font-semibold text-gray-800 line-clamp-2">{it.title}</div>
              <div className="text-xs text-gray-500">{it.released || 'TBA'} • Edad ≤ {it.age_rating}</div>
              <div className="flex flex-wrap gap-1 pt-1">
                {(it.platforms || []).slice(0, 3).map((p: string) => (
                  <span key={p} className="text-[10px] bg-gray-100 text-gray-700 px-2 py-0.5 rounded-md">{p}</span>
                ))}
              </div>
              <div className="flex flex-wrap gap-1 pt-1">
                {(it.genres || []).slice(0, 3).map((g: string) => (
                  <span key={g} className="text-[10px] bg-indigo-50 text-indigo-700 px-2 py-0.5 rounded-md">{g}</span>
                ))}
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="mt-4 flex items-center justify-between">
        <div className="text-sm text-gray-500">Página {page}</div>
        <div className="flex gap-2">
          <button onClick={() => runSearch(Math.max(1, page - 1), pageSize)} disabled={!hasPrev || loading} className="px-3 py-1.5 text-sm rounded-md border border-gray-300 text-gray-700 disabled:opacity-50">Anterior</button>
          <button onClick={() => runSearch(page + 1, pageSize)} disabled={!hasNext || loading} className="px-3 py-1.5 text-sm rounded-md border border-gray-300 text-gray-700 disabled:opacity-50">Siguiente</button>
        </div>
      </div>
    </div>
  )
}
