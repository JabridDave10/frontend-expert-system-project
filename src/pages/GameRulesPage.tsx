import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'

interface Game {
  id: number
  name: string
  slug: string
  released: string
  metacritic: number | null
  rating: number | null
  background_image: string | null
  genres_json: any[]
  tags_json: any[]
}

interface Rule {
  id: number
  name: string
  description: string
  category: string | null
  is_active: boolean
}

const GameRulesPage: React.FC = () => {
  const [games, setGames] = useState<Game[]>([])
  const [rules, setRules] = useState<Rule[]>([])
  const [selectedGame, setSelectedGame] = useState<Game | null>(null)
  const [gameRules, setGameRules] = useState<number[]>([])
  const [search, setSearch] = useState('')
  const [ruleSearch, setRuleSearch] = useState('')
  const [loading, setLoading] = useState(false)
  const [page, setPage] = useState(1)
  const [total, setTotal] = useState(0)
  const pageSize = 20

  useEffect(() => {
    fetchGames()
    fetchRules()
  }, [page, search])

  const fetchGames = async () => {
    setLoading(true)
    try {
      const params = new URLSearchParams({
        page: page.toString(),
        page_size: pageSize.toString(),
      })
      if (search) params.append('search', search)

      const response = await fetch(`http://localhost:8000/admin/games?${params}`)
      const data = await response.json()
      setGames(data.games || [])
      setTotal(data.total || 0)
    } catch (error) {
      console.error('Error fetching games:', error)
    } finally {
      setLoading(false)
    }
  }

  const fetchRules = async () => {
    try {
      const response = await fetch('http://localhost:8000/admin/rules?page_size=200&active_only=false')
      const data = await response.json()
      setRules(data.rules || [])
    } catch (error) {
      console.error('Error fetching rules:', error)
      setRules([])
    }
  }

  const fetchGameRules = async (gameId: number) => {
    try {
      // Este endpoint necesitarías crearlo en el backend
      const response = await fetch(`http://localhost:8000/admin/games/${gameId}/rules`)
      const data = await response.json()
      setGameRules(data.rule_ids || [])
    } catch (error) {
      console.error('Error fetching game rules:', error)
      setGameRules([])
    }
  }

  const handleSelectGame = (game: Game) => {
    setSelectedGame(game)
    fetchGameRules(game.id)
  }

  const toggleRule = async (ruleId: number) => {
    if (!selectedGame) return

    const isAssigned = gameRules.includes(ruleId)

    try {
      if (isAssigned) {
        // Desasignar regla
        await fetch(`http://localhost:8000/admin/games/${selectedGame.id}/rules/${ruleId}`, {
          method: 'DELETE',
        })
        setGameRules(gameRules.filter((id) => id !== ruleId))
      } else {
        // Asignar regla
        await fetch(`http://localhost:8000/admin/games/${selectedGame.id}/rules`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ rule_id: ruleId }),
        })
        setGameRules([...gameRules, ruleId])
      }
    } catch (error) {
      console.error('Error toggling rule:', error)
      alert('Error al asignar/desasignar la regla')
    }
  }

  const totalPages = Math.ceil(total / pageSize)

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h1 className="text-4xl font-bold text-gray-900 mb-2">Asignar Reglas a Juegos</h1>
              <p className="text-lg text-gray-600">Selecciona un juego para gestionar sus reglas</p>
            </div>
            <div className="flex gap-3">
              <Link
                to="/dashboard/admin/rules/new"
                className="px-6 py-3 bg-gradient-to-r from-green-600 to-emerald-600 text-white font-semibold rounded-xl hover:shadow-lg transform hover:scale-105 transition-all"
              >
                + Nueva Regla
              </Link>
              <Link
                to="/dashboard/admin/rules"
                className="px-6 py-3 bg-gradient-to-r from-purple-600 to-pink-600 text-white font-semibold rounded-xl hover:shadow-lg transform hover:scale-105 transition-all"
              >
                Gestionar Reglas
              </Link>
            </div>
          </div>

          <Link
            to="/dashboard/admin"
            className="text-purple-600 hover:text-purple-700 font-medium"
          >
            ← Volver al Panel de Administración
          </Link>
        </div>

        {/* Two Column Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Games List */}
          <div className="bg-white rounded-2xl shadow-lg p-6">
            <div className="mb-4">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">Juegos</h2>
              <input
                type="text"
                placeholder="Buscar juegos..."
                value={search}
                onChange={(e) => {
                  setSearch(e.target.value)
                  setPage(1)
                }}
                className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-purple-500"
              />
            </div>

            <div className="space-y-3 max-h-[600px] overflow-y-auto">
              {loading ? (
                <p className="text-center text-gray-500 py-8">Cargando juegos...</p>
              ) : games.length === 0 ? (
                <p className="text-center text-gray-500 py-8">No se encontraron juegos</p>
              ) : (
                games.map((game) => (
                  <div
                    key={game.id}
                    onClick={() => handleSelectGame(game)}
                    className={`p-4 rounded-xl cursor-pointer transition-all ${
                      selectedGame?.id === game.id
                        ? 'bg-purple-100 border-2 border-purple-500'
                        : 'bg-gray-50 hover:bg-gray-100 border-2 border-transparent'
                    }`}
                  >
                    <div className="flex items-center gap-4">
                      {game.background_image && (
                        <img
                          src={game.background_image}
                          alt={game.name}
                          className="w-16 h-16 object-cover rounded-lg"
                        />
                      )}
                      <div className="flex-1">
                        <h3 className="font-semibold text-gray-900">{game.name}</h3>
                        <p className="text-sm text-gray-500">{game.released}</p>
                        {game.genres_json && game.genres_json.length > 0 && (
                          <div className="flex gap-1 mt-1">
                            {game.genres_json.slice(0, 3).map((genre: any) => (
                              <span
                                key={genre.id}
                                className="px-2 py-0.5 bg-purple-200 text-purple-700 text-xs rounded"
                              >
                                {genre.name}
                              </span>
                            ))}
                          </div>
                        )}
                      </div>
                      {selectedGame?.id === game.id && (
                        <div className="text-purple-600 font-bold">✓</div>
                      )}
                    </div>
                  </div>
                ))
              )}
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="mt-4 flex items-center justify-between">
                <button
                  onClick={() => setPage(Math.max(1, page - 1))}
                  disabled={page === 1}
                  className="px-4 py-2 bg-gray-200 rounded-lg hover:bg-gray-300 disabled:opacity-50"
                >
                  Anterior
                </button>
                <span className="text-sm text-gray-600">
                  Página {page} de {totalPages}
                </span>
                <button
                  onClick={() => setPage(Math.min(totalPages, page + 1))}
                  disabled={page === totalPages}
                  className="px-4 py-2 bg-gray-200 rounded-lg hover:bg-gray-300 disabled:opacity-50"
                >
                  Siguiente
                </button>
              </div>
            )}
          </div>

          {/* Rules Assignment */}
          <div className="bg-white rounded-2xl shadow-lg p-6">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              {selectedGame ? `Reglas para: ${selectedGame.name}` : 'Selecciona un juego'}
            </h2>

            {!selectedGame ? (
              <div className="text-center py-16">
                <div className="text-6xl mb-4">👈</div>
                <p className="text-gray-500 text-lg">
                  Selecciona un juego de la lista para ver y gestionar sus reglas
                </p>
              </div>
            ) : (
              <>
                {/* Search bar for rules */}
                <div className="mb-4">
                  <input
                    type="text"
                    placeholder="Buscar reglas..."
                    value={ruleSearch}
                    onChange={(e) => setRuleSearch(e.target.value)}
                    className="w-full px-4 py-2 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-purple-500"
                  />
                </div>

                <div className="space-y-6 max-h-[600px] overflow-y-auto">
                  {rules.length === 0 ? (
                    <div className="text-center py-8">
                      <p className="text-gray-500 mb-4">No hay reglas disponibles</p>
                      <Link
                        to="/dashboard/admin/rules/new"
                        className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 inline-block"
                      >
                        Crear Primera Regla
                      </Link>
                    </div>
                  ) : (
                    <>
                      {/* Assigned Rules Section */}
                      {(() => {
                        const assignedRules = rules
                          .filter((rule) => gameRules.includes(rule.id))
                          .filter((rule) =>
                            ruleSearch === '' ||
                            rule.name.toLowerCase().includes(ruleSearch.toLowerCase()) ||
                            rule.description?.toLowerCase().includes(ruleSearch.toLowerCase())
                          )

                        const unassignedRules = rules
                          .filter((rule) => !gameRules.includes(rule.id))
                          .filter((rule) =>
                            ruleSearch === '' ||
                            rule.name.toLowerCase().includes(ruleSearch.toLowerCase()) ||
                            rule.description?.toLowerCase().includes(ruleSearch.toLowerCase())
                          )

                        return (
                          <>
                            {assignedRules.length > 0 && (
                              <div>
                                <h3 className="text-lg font-bold text-green-700 mb-3 flex items-center gap-2">
                                  <span className="inline-block w-3 h-3 bg-green-500 rounded-full"></span>
                                  Reglas Asignadas ({assignedRules.length})
                                </h3>
                                <div className="space-y-3">
                                  {assignedRules.map((rule) => (
                                    <div
                                      key={rule.id}
                                      className="p-4 rounded-xl border-2 bg-green-50 border-green-500 transition-all"
                                    >
                                      <div className="flex items-start justify-between gap-4">
                                        <div className="flex-1">
                                          <div className="flex items-center gap-2 mb-1">
                                            <h3 className="font-semibold text-gray-900">{rule.name}</h3>
                                            {rule.category && (
                                              <span className="px-2 py-0.5 bg-blue-100 text-blue-700 text-xs rounded">
                                                {rule.category}
                                              </span>
                                            )}
                                          </div>
                                          <p className="text-sm text-gray-600">{rule.description}</p>
                                          <div className="mt-2">
                                            <span
                                              className={`px-2 py-1 text-xs rounded ${
                                                rule.is_active
                                                  ? 'bg-green-100 text-green-700'
                                                  : 'bg-gray-100 text-gray-700'
                                              }`}
                                            >
                                              {rule.is_active ? 'Activa' : 'Inactiva'}
                                            </span>
                                          </div>
                                        </div>
                                        <button
                                          onClick={() => toggleRule(rule.id)}
                                          className="px-4 py-2 bg-red-500 text-white rounded-lg font-medium hover:bg-red-600 transition-all"
                                        >
                                          ✕ Quitar
                                        </button>
                                      </div>
                                    </div>
                                  ))}
                                </div>
                              </div>
                            )}

                            {unassignedRules.length > 0 && (
                              <div>
                                <h3 className="text-lg font-bold text-gray-700 mb-3 flex items-center gap-2">
                                  <span className="inline-block w-3 h-3 bg-gray-400 rounded-full"></span>
                                  Reglas Disponibles ({unassignedRules.length})
                                </h3>
                                <div className="space-y-3">
                                  {unassignedRules.map((rule) => (
                                    <div
                                      key={rule.id}
                                      className="p-4 rounded-xl border-2 bg-gray-50 border-gray-200 transition-all"
                                    >
                                      <div className="flex items-start justify-between gap-4">
                                        <div className="flex-1">
                                          <div className="flex items-center gap-2 mb-1">
                                            <h3 className="font-semibold text-gray-900">{rule.name}</h3>
                                            {rule.category && (
                                              <span className="px-2 py-0.5 bg-blue-100 text-blue-700 text-xs rounded">
                                                {rule.category}
                                              </span>
                                            )}
                                          </div>
                                          <p className="text-sm text-gray-600">{rule.description}</p>
                                          <div className="mt-2">
                                            <span
                                              className={`px-2 py-1 text-xs rounded ${
                                                rule.is_active
                                                  ? 'bg-green-100 text-green-700'
                                                  : 'bg-gray-100 text-gray-700'
                                              }`}
                                            >
                                              {rule.is_active ? 'Activa' : 'Inactiva'}
                                            </span>
                                          </div>
                                        </div>
                                        <button
                                          onClick={() => toggleRule(rule.id)}
                                          className="px-4 py-2 bg-green-500 text-white rounded-lg font-medium hover:bg-green-600 transition-all"
                                        >
                                          + Asignar
                                        </button>
                                      </div>
                                    </div>
                                  ))}
                                </div>
                              </div>
                            )}

                            {assignedRules.length === 0 && unassignedRules.length === 0 && ruleSearch !== '' && (
                              <div className="text-center py-8">
                                <p className="text-gray-500">No se encontraron reglas que coincidan con "{ruleSearch}"</p>
                              </div>
                            )}
                          </>
                        )
                      })()}
                    </>
                  )}
                </div>
              </>
            )}

            {selectedGame && gameRules.length > 0 && (
              <div className="mt-6 p-4 bg-purple-50 rounded-xl">
                <p className="text-sm text-purple-900">
                  <strong>{gameRules.length}</strong> {gameRules.length === 1 ? 'regla asignada' : 'reglas asignadas'} a este juego
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

export default GameRulesPage
