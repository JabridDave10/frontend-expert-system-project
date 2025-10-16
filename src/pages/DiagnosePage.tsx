import { useState } from 'react'
import { diagnose } from '../api/expertSystem'

const ALL_GENRES = [
  'Action', 'Adventure', 'Arcade', 'Card', 'Casual', 'Educational', 'Family',
  'Fighting', 'Indie', 'Massively Multiplayer', 'Platformer', 'Puzzle',
  'RPG', 'Racing', 'Shooter', 'Simulation', 'Sports', 'Strategy'
]

const PLATFORMS = ['PC', 'PlayStation 5', 'PlayStation 4', 'Xbox Series X', 'Xbox One', 'Nintendo Switch', 'iOS', 'Android', 'macOS', 'Linux']

type Step = 'welcome' | 'age' | 'platform' | 'time' | 'multiplayer' | 'genres' | 'preferences' | 'results'

export default function DiagnosePage() {
  const [currentStep, setCurrentStep] = useState<Step>('welcome')

  // Respuestas del usuario
  const [ageMax, setAgeMax] = useState<number | ''>(18)
  const [allowViolence, setAllowViolence] = useState(true)
  const [platform, setPlatform] = useState('PC')
  const [minPlaytime, setMinPlaytime] = useState<number | ''>('')
  const [maxPlaytime, setMaxPlaytime] = useState<number | ''>('')
  const [multiplayerRequired, setMultiplayerRequired] = useState<boolean | ''>('')
  const [singleplayerRequired, setSingleplayerRequired] = useState<boolean | ''>('')
  const [coopRequired, setCoopRequired] = useState<boolean | ''>('')
  const [pvpRequired, setPvpRequired] = useState<boolean | ''>('')
  const [offlineRequired, setOfflineRequired] = useState(false)
  const [includeGenres, setIncludeGenres] = useState<string[]>([])
  const [excludeGenres, setExcludeGenres] = useState<string[]>([])
  const [minRating, setMinRating] = useState<number | ''>('')
  const [minMetacritic, setMinMetacritic] = useState<number | ''>('')

  const [page, setPage] = useState(1)
  const [pageSize] = useState(12)
  const [items, setItems] = useState<any[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  function toggleIn(list: string[], setList: (v: string[]) => void, value: string) {
    if (list.includes(value)) setList(list.filter(v => v !== value))
    else setList([...list, value])
  }

  function goNext(nextStep: Step) {
    setCurrentStep(nextStep)
  }

  function goBack(prevStep: Step) {
    setCurrentStep(prevStep)
  }

  function resetWizard() {
    setCurrentStep('welcome')
    setItems([])
    setPage(1)
    setError(null)
  }

  async function runDiagnose(p = page, ps = pageSize) {
    try {
      setLoading(true)
      setError(null)
      const payload = {
        hardware: { platform: platform || undefined },
        budget: {},
        time: {
          min_playtime_hours: typeof minPlaytime === 'number' ? minPlaytime : undefined,
          max_playtime_hours: typeof maxPlaytime === 'number' ? maxPlaytime : undefined
        },
        content: {
          allow_violence: allowViolence,
          age_max: typeof ageMax === 'number' ? ageMax : undefined,
          multiplayer_required: typeof multiplayerRequired === 'boolean' ? multiplayerRequired : undefined,
          singleplayer_required: typeof singleplayerRequired === 'boolean' ? singleplayerRequired : undefined,
          coop_required: typeof coopRequired === 'boolean' ? coopRequired : undefined,
          pvp_required: typeof pvpRequired === 'boolean' ? pvpRequired : undefined,
          offline_required: offlineRequired,
        },
        preferences: {
          include_genres: includeGenres,
          exclude_genres: excludeGenres,
          min_rating: typeof minRating === 'number' ? minRating : undefined,
          min_metacritic: typeof minMetacritic === 'number' ? minMetacritic : undefined,
        },
        page: p,
        page_size: ps,
      }
      const data = await diagnose(payload)
      setItems(data.items)
      setPage(p)
      setCurrentStep('results')
    } catch (e: any) {
      setError(e.message || 'Error al ejecutar diagnóstico')
    } finally {
      setLoading(false)
    }
  }

  const hasPrev = page > 1
  const hasNext = items.length === pageSize

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50 p-6">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-800 mb-2">Sistema Experto de Juegos</h1>
          <p className="text-gray-600">Responde unas preguntas y te recomendaremos los mejores juegos para ti</p>
        </div>

        {/* Progress Bar */}
        {currentStep !== 'welcome' && currentStep !== 'results' && (
          <div className="mb-8 bg-white rounded-xl shadow-sm p-4">
            <div className="flex items-center justify-between text-sm text-gray-600 mb-2">
              <span>Progreso</span>
              <span>{['age', 'platform', 'time', 'multiplayer', 'genres', 'preferences'].indexOf(currentStep) + 1} de 6</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div
                className="bg-gradient-to-r from-purple-600 to-blue-600 h-2 rounded-full transition-all duration-300"
                style={{ width: `${(['age', 'platform', 'time', 'multiplayer', 'genres', 'preferences'].indexOf(currentStep) + 1) / 6 * 100}%` }}
              />
            </div>
          </div>
        )}

        {/* Welcome Step */}
        {currentStep === 'welcome' && (
          <div className="bg-white rounded-2xl shadow-lg p-8 text-center space-y-6">
            <div className="text-6xl">🎮</div>
            <h2 className="text-3xl font-bold text-gray-800">Bienvenido</h2>
            <p className="text-gray-600 text-lg">Te haré algunas preguntas para encontrar los juegos perfectos para ti. El proceso toma menos de 2 minutos.</p>
            <button
              onClick={() => goNext('age')}
              className="bg-gradient-to-r from-purple-600 to-blue-600 text-white px-8 py-3 rounded-lg text-lg font-medium hover:opacity-95 transition-opacity"
            >
              Comenzar
            </button>
          </div>
        )}

        {/* Step 1: Age */}
        {currentStep === 'age' && (
          <div className="bg-white rounded-2xl shadow-lg p-8 space-y-6">
            <h2 className="text-2xl font-bold text-gray-800">Edad y Contenido</h2>
            <p className="text-gray-600">Configuremos las restricciones de edad y contenido apropiadas</p>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">¿Cuál es tu edad? (o la del jugador)</label>
                <input
                  type="number"
                  className="w-full border-2 border-gray-300 rounded-lg px-4 py-3 text-lg focus:outline-none focus:border-purple-500"
                  placeholder="Ej: 18"
                  value={ageMax}
                  onChange={e => setAgeMax(e.target.value ? Number(e.target.value) : '')}
                />
                <p className="text-xs text-gray-500 mt-1">Filtraremos juegos apropiados según la clasificación ESRB</p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">¿Permites juegos con violencia?</label>
                <div className="flex gap-3">
                  <button
                    onClick={() => setAllowViolence(true)}
                    className={`flex-1 py-3 rounded-lg font-medium transition-all ${allowViolence ? 'bg-purple-600 text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}`}
                  >
                    Sí
                  </button>
                  <button
                    onClick={() => setAllowViolence(false)}
                    className={`flex-1 py-3 rounded-lg font-medium transition-all ${!allowViolence ? 'bg-purple-600 text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}`}
                  >
                    No
                  </button>
                </div>
              </div>
            </div>

            <div className="flex gap-3 pt-4">
              <button
                onClick={() => goBack('welcome')}
                className="flex-1 border-2 border-gray-300 text-gray-700 px-6 py-3 rounded-lg font-medium hover:bg-gray-50"
              >
                Atrás
              </button>
              <button
                onClick={() => goNext('platform')}
                className="flex-1 bg-gradient-to-r from-purple-600 to-blue-600 text-white px-6 py-3 rounded-lg font-medium hover:opacity-95"
              >
                Siguiente
              </button>
            </div>
          </div>
        )}

        {/* Step 2: Platform */}
        {currentStep === 'platform' && (
          <div className="bg-white rounded-2xl shadow-lg p-8 space-y-6">
            <h2 className="text-2xl font-bold text-gray-800">Plataforma</h2>
            <p className="text-gray-600">¿En qué plataforma juegas?</p>

            <div className="grid grid-cols-2 gap-3">
              {PLATFORMS.map(p => (
                <button
                  key={p}
                  onClick={() => setPlatform(p)}
                  className={`py-3 px-4 rounded-lg font-medium transition-all ${platform === p ? 'bg-purple-600 text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}`}
                >
                  {p}
                </button>
              ))}
            </div>

            <div className="flex gap-3 pt-4">
              <button
                onClick={() => goBack('age')}
                className="flex-1 border-2 border-gray-300 text-gray-700 px-6 py-3 rounded-lg font-medium hover:bg-gray-50"
              >
                Atrás
              </button>
              <button
                onClick={() => goNext('time')}
                className="flex-1 bg-gradient-to-r from-purple-600 to-blue-600 text-white px-6 py-3 rounded-lg font-medium hover:opacity-95"
              >
                Siguiente
              </button>
            </div>
          </div>
        )}

        {/* Step 3: Time */}
        {currentStep === 'time' && (
          <div className="bg-white rounded-2xl shadow-lg p-8 space-y-6">
            <h2 className="text-2xl font-bold text-gray-800">Tiempo Disponible</h2>
            <p className="text-gray-600">¿Cuánto tiempo tienes para jugar?</p>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Horas mínimas de juego (opcional)</label>
                <input
                  type="number"
                  className="w-full border-2 border-gray-300 rounded-lg px-4 py-3 text-lg focus:outline-none focus:border-purple-500"
                  placeholder="Ej: 5"
                  value={minPlaytime}
                  onChange={e => setMinPlaytime(e.target.value ? Number(e.target.value) : '')}
                />
                <p className="text-xs text-gray-500 mt-1">Para juegos con contenido sustancial</p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Horas máximas de juego (opcional)</label>
                <input
                  type="number"
                  className="w-full border-2 border-gray-300 rounded-lg px-4 py-3 text-lg focus:outline-none focus:border-purple-500"
                  placeholder="Ej: 20"
                  value={maxPlaytime}
                  onChange={e => setMaxPlaytime(e.target.value ? Number(e.target.value) : '')}
                />
                <p className="text-xs text-gray-500 mt-1">Para experiencias más cortas</p>
              </div>
            </div>

            <div className="flex gap-3 pt-4">
              <button
                onClick={() => goBack('platform')}
                className="flex-1 border-2 border-gray-300 text-gray-700 px-6 py-3 rounded-lg font-medium hover:bg-gray-50"
              >
                Atrás
              </button>
              <button
                onClick={() => goNext('multiplayer')}
                className="flex-1 bg-gradient-to-r from-purple-600 to-blue-600 text-white px-6 py-3 rounded-lg font-medium hover:opacity-95"
              >
                Siguiente
              </button>
            </div>
          </div>
        )}

        {/* Step 4: Multiplayer */}
        {currentStep === 'multiplayer' && (
          <div className="bg-white rounded-2xl shadow-lg p-8 space-y-6">
            <h2 className="text-2xl font-bold text-gray-800">Modo de Juego</h2>
            <p className="text-gray-600">¿Qué tipo de experiencia buscas?</p>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">¿Necesitas modo multijugador?</label>
                <div className="flex gap-3">
                  <button onClick={() => setMultiplayerRequired(true)} className={`flex-1 py-3 rounded-lg font-medium ${multiplayerRequired === true ? 'bg-purple-600 text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}`}>Sí</button>
                  <button onClick={() => setMultiplayerRequired('')} className={`flex-1 py-3 rounded-lg font-medium ${multiplayerRequired === '' ? 'bg-purple-600 text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}`}>No importa</button>
                  <button onClick={() => setMultiplayerRequired(false)} className={`flex-1 py-3 rounded-lg font-medium ${multiplayerRequired === false ? 'bg-purple-600 text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}`}>No</button>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">¿Necesitas modo un solo jugador?</label>
                <div className="flex gap-3">
                  <button onClick={() => setSingleplayerRequired(true)} className={`flex-1 py-3 rounded-lg font-medium ${singleplayerRequired === true ? 'bg-purple-600 text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}`}>Sí</button>
                  <button onClick={() => setSingleplayerRequired('')} className={`flex-1 py-3 rounded-lg font-medium ${singleplayerRequired === '' ? 'bg-purple-600 text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}`}>No importa</button>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">¿Necesitas modo cooperativo (Co-op)?</label>
                <div className="flex gap-3">
                  <button onClick={() => setCoopRequired(true)} className={`flex-1 py-3 rounded-lg font-medium ${coopRequired === true ? 'bg-purple-600 text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}`}>Sí</button>
                  <button onClick={() => setCoopRequired('')} className={`flex-1 py-3 rounded-lg font-medium ${coopRequired === '' ? 'bg-purple-600 text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}`}>No importa</button>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">¿Necesitas modo competitivo (PvP)?</label>
                <div className="flex gap-3">
                  <button onClick={() => setPvpRequired(true)} className={`flex-1 py-3 rounded-lg font-medium ${pvpRequired === true ? 'bg-purple-600 text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}`}>Sí</button>
                  <button onClick={() => setPvpRequired('')} className={`flex-1 py-3 rounded-lg font-medium ${pvpRequired === '' ? 'bg-purple-600 text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}`}>No importa</button>
                </div>
              </div>

              <div>
                <label className="flex items-center gap-2 text-sm font-medium text-gray-700">
                  <input
                    type="checkbox"
                    checked={offlineRequired}
                    onChange={e => setOfflineRequired(e.target.checked)}
                    className="w-5 h-5 text-purple-600 rounded"
                  />
                  Prefiero juegos offline (sin conexión a internet)
                </label>
              </div>
            </div>

            <div className="flex gap-3 pt-4">
              <button
                onClick={() => goBack('time')}
                className="flex-1 border-2 border-gray-300 text-gray-700 px-6 py-3 rounded-lg font-medium hover:bg-gray-50"
              >
                Atrás
              </button>
              <button
                onClick={() => goNext('genres')}
                className="flex-1 bg-gradient-to-r from-purple-600 to-blue-600 text-white px-6 py-3 rounded-lg font-medium hover:opacity-95"
              >
                Siguiente
              </button>
            </div>
          </div>
        )}

        {/* Step 5: Genres */}
        {currentStep === 'genres' && (
          <div className="bg-white rounded-2xl shadow-lg p-8 space-y-6">
            <h2 className="text-2xl font-bold text-gray-800">Géneros</h2>
            <p className="text-gray-600">Selecciona los géneros que te interesan o que quieres evitar</p>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-3">Géneros que me interesan</label>
                <div className="grid grid-cols-3 gap-2">
                  {ALL_GENRES.map(g => (
                    <label key={`inc-${g}`} className="flex items-center gap-2 text-sm text-gray-700 bg-gray-50 px-3 py-2 rounded-lg hover:bg-gray-100 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={includeGenres.includes(g)}
                        onChange={() => toggleIn(includeGenres, setIncludeGenres, g)}
                        className="w-4 h-4 text-purple-600 rounded"
                      />
                      {g}
                    </label>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-3">Géneros que NO me interesan</label>
                <div className="grid grid-cols-3 gap-2">
                  {ALL_GENRES.map(g => (
                    <label key={`exc-${g}`} className="flex items-center gap-2 text-sm text-gray-700 bg-gray-50 px-3 py-2 rounded-lg hover:bg-gray-100 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={excludeGenres.includes(g)}
                        onChange={() => toggleIn(excludeGenres, setExcludeGenres, g)}
                        className="w-4 h-4 text-red-600 rounded"
                      />
                      {g}
                    </label>
                  ))}
                </div>
              </div>
            </div>

            <div className="flex gap-3 pt-4">
              <button
                onClick={() => goBack('multiplayer')}
                className="flex-1 border-2 border-gray-300 text-gray-700 px-6 py-3 rounded-lg font-medium hover:bg-gray-50"
              >
                Atrás
              </button>
              <button
                onClick={() => goNext('preferences')}
                className="flex-1 bg-gradient-to-r from-purple-600 to-blue-600 text-white px-6 py-3 rounded-lg font-medium hover:opacity-95"
              >
                Siguiente
              </button>
            </div>
          </div>
        )}

        {/* Step 6: Preferences */}
        {currentStep === 'preferences' && (
          <div className="bg-white rounded-2xl shadow-lg p-8 space-y-6">
            <h2 className="text-2xl font-bold text-gray-800">Preferencias de Calidad</h2>
            <p className="text-gray-600">Filtros adicionales para asegurar la calidad de las recomendaciones</p>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Rating mínimo (1-5) (opcional)</label>
                <input
                  type="number"
                  step="0.1"
                  min="0"
                  max="5"
                  className="w-full border-2 border-gray-300 rounded-lg px-4 py-3 text-lg focus:outline-none focus:border-purple-500"
                  placeholder="Ej: 3.5"
                  value={minRating}
                  onChange={e => setMinRating(e.target.value ? Number(e.target.value) : '')}
                />
                <p className="text-xs text-gray-500 mt-1">Solo juegos con este rating o superior</p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Metacritic mínimo (0-100) (opcional)</label>
                <input
                  type="number"
                  min="0"
                  max="100"
                  className="w-full border-2 border-gray-300 rounded-lg px-4 py-3 text-lg focus:outline-none focus:border-purple-500"
                  placeholder="Ej: 80"
                  value={minMetacritic}
                  onChange={e => setMinMetacritic(e.target.value ? Number(e.target.value) : '')}
                />
                <p className="text-xs text-gray-500 mt-1">Solo juegos bien valorados por la crítica</p>
              </div>
            </div>

            <div className="flex gap-3 pt-4">
              <button
                onClick={() => goBack('genres')}
                className="flex-1 border-2 border-gray-300 text-gray-700 px-6 py-3 rounded-lg font-medium hover:bg-gray-50"
              >
                Atrás
              </button>
              <button
                onClick={() => runDiagnose(1, pageSize)}
                disabled={loading}
                className="flex-1 bg-gradient-to-r from-purple-600 to-blue-600 text-white px-6 py-3 rounded-lg font-medium hover:opacity-95 disabled:opacity-50"
              >
                {loading ? 'Procesando...' : 'Ver Recomendaciones'}
              </button>
            </div>
          </div>
        )}

        {/* Results */}
        {currentStep === 'results' && (
          <div className="space-y-6">
            <div className="bg-white rounded-2xl shadow-lg p-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-2xl font-bold text-gray-800">Tus Recomendaciones</h2>
                <button
                  onClick={resetWizard}
                  className="text-sm text-purple-600 hover:text-purple-700 font-medium"
                >
                  Nueva búsqueda
                </button>
              </div>

              {error && (
                <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-4">
                  {error}
                </div>
              )}

              {!loading && items.length === 0 && (
                <div className="text-center py-12">
                  <div className="text-6xl mb-4">😢</div>
                  <p className="text-gray-600 mb-4">No encontramos juegos que cumplan con todos tus criterios.</p>
                  <button
                    onClick={() => goBack('preferences')}
                    className="text-purple-600 hover:text-purple-700 font-medium"
                  >
                    Ajustar criterios
                  </button>
                </div>
              )}

              {items.length > 0 && (
                <>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {items.map((game) => (
                      <div key={game.id} className="bg-white border-2 border-gray-100 rounded-xl shadow-sm overflow-hidden hover:shadow-md transition-shadow">
                        {game.background_image && (
                          <img src={game.background_image} alt={game.title} className="w-full h-40 object-cover" />
                        )}
                        <div className="p-4 space-y-2">
                          <h3 className="font-bold text-gray-800 line-clamp-2">{game.title}</h3>
                          <div className="flex items-center gap-2 text-xs text-gray-600">
                            {game.rating > 0 && (
                              <span className="bg-yellow-100 text-yellow-800 px-2 py-1 rounded">⭐ {game.rating.toFixed(1)}</span>
                            )}
                            {game.metacritic > 0 && (
                              <span className="bg-green-100 text-green-800 px-2 py-1 rounded">MC: {game.metacritic}</span>
                            )}
                          </div>
                          <div className="text-xs text-gray-500">{game.released || 'TBA'}</div>
                          <div className="text-xs text-gray-600">
                            <span className="font-medium">ESRB:</span> {game.esrb_rating || 'N/A'} (≤{game.age_rating} años)
                          </div>
                          <div className="text-xs text-gray-600">
                            <span className="font-medium">Tiempo:</span> {game.playtime_hours}h promedio
                          </div>
                          <div className="flex flex-wrap gap-1 pt-2">
                            {game.multiplayer && <span className="text-xs bg-blue-100 text-blue-700 px-2 py-1 rounded">Multiplayer</span>}
                            {game.singleplayer && <span className="text-xs bg-purple-100 text-purple-700 px-2 py-1 rounded">Single</span>}
                            {game.coop && <span className="text-xs bg-green-100 text-green-700 px-2 py-1 rounded">Co-op</span>}
                            {game.pvp && <span className="text-xs bg-red-100 text-red-700 px-2 py-1 rounded">PvP</span>}
                          </div>
                          <div className="flex flex-wrap gap-1 pt-1">
                            {(game.genres || []).slice(0, 3).map((g: string) => (
                              <span key={g} className="text-xs bg-gray-100 text-gray-700 px-2 py-1 rounded">{g}</span>
                            ))}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Pagination */}
                  <div className="mt-6 flex items-center justify-between">
                    <div className="text-sm text-gray-500">Página {page}</div>
                    <div className="flex gap-2">
                      <button
                        onClick={() => runDiagnose(Math.max(1, page - 1), pageSize)}
                        disabled={!hasPrev || loading}
                        className="px-4 py-2 text-sm rounded-lg border-2 border-gray-300 text-gray-700 disabled:opacity-50 hover:bg-gray-50"
                      >
                        Anterior
                      </button>
                      <button
                        onClick={() => runDiagnose(page + 1, pageSize)}
                        disabled={!hasNext || loading}
                        className="px-4 py-2 text-sm rounded-lg border-2 border-gray-300 text-gray-700 disabled:opacity-50 hover:bg-gray-50"
                      >
                        Siguiente
                      </button>
                    </div>
                  </div>
                </>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
