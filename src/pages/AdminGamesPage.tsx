import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'

interface Game {
  id: number
  name: string
  slug: string
  rating: number | null
  metacritic: number | null
  released: string | null
  genres_json: { name: string }[] | null
  parent_platforms_json: { platform: { name: string } }[] | null
  background_image: string | null
  playtime: number | null
}

interface GameListResponse {
  total: number
  page: number
  page_size: number
  games: Game[]
}

const AdminGamesPage: React.FC = () => {
  const [games, setGames] = useState<Game[]>([])
  const [total, setTotal] = useState(0)
  const [page, setPage] = useState(1)
  const [pageSize] = useState(20)
  const [search, setSearch] = useState('')
  const [loading, setLoading] = useState(false)
  const [stats, setStats] = useState<any>(null)
  const [showDeleteModal, setShowDeleteModal] = useState<number | null>(null)

  const fetchGames = async () => {
    setLoading(true)
    try {
      const params = new URLSearchParams({
        page: page.toString(),
        page_size: pageSize.toString(),
      })

      if (search) {
        params.append('search', search)
      }

      const response = await fetch(`http://localhost:8000/admin/games?${params}`)
      const data: GameListResponse = await response.json()

      setGames(data.games)
      setTotal(data.total)
    } catch (error) {
      console.error('Error fetching games:', error)
    } finally {
      setLoading(false)
    }
  }

  const fetchStats = async () => {
    try {
      const response = await fetch('http://localhost:8000/admin/games/stats')
      const data = await response.json()
      setStats(data)
    } catch (error) {
      console.error('Error fetching stats:', error)
    }
  }

  useEffect(() => {
    fetchGames()
    fetchStats()
  }, [page, search])

  const handleDelete = async (gameId: number) => {
    try {
      const response = await fetch(`http://localhost:8000/admin/games/${gameId}`, {
        method: 'DELETE',
      })

      if (response.ok) {
        fetchGames()
        fetchStats()
        setShowDeleteModal(null)
      } else {
        alert('Error al eliminar el juego')
      }
    } catch (error) {
      console.error('Error deleting game:', error)
      alert('Error al eliminar el juego')
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
              <h1 className="text-4xl font-bold text-gray-900 mb-2">Gestión de Juegos</h1>
              <p className="text-lg text-gray-600">Administra el catálogo de juegos del sistema experto</p>
            </div>
            <Link
              to="/dashboard/admin/games/new"
              className="px-6 py-3 bg-gradient-to-r from-purple-600 to-pink-600 text-white font-semibold rounded-xl hover:shadow-lg transform hover:scale-105 transition-all"
            >
              + Nuevo Juego
            </Link>
          </div>

          <Link
            to="/dashboard/admin"
            className="text-purple-600 hover:text-purple-700 font-medium"
          >
            ← Volver al Panel de Administración
          </Link>
        </div>

        {/* Stats Cards */}
        {stats && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <div className="bg-white rounded-2xl shadow-lg p-6">
              <h3 className="text-gray-500 text-sm font-medium mb-2">Total de Juegos</h3>
              <p className="text-4xl font-bold text-purple-600">{stats.total_games}</p>
            </div>

            <div className="bg-white rounded-2xl shadow-lg p-6">
              <h3 className="text-gray-500 text-sm font-medium mb-2">Géneros</h3>
              <p className="text-4xl font-bold text-pink-600">{stats.genres?.length || 0}</p>
            </div>

            <div className="bg-white rounded-2xl shadow-lg p-6">
              <h3 className="text-gray-500 text-sm font-medium mb-2">Plataformas</h3>
              <p className="text-4xl font-bold text-indigo-600">{stats.platforms?.length || 0}</p>
            </div>
          </div>
        )}

        {/* Search Bar */}
        <div className="bg-white rounded-2xl shadow-lg p-6 mb-6">
          <input
            type="text"
            placeholder="Buscar juegos por nombre..."
            value={search}
            onChange={(e) => {
              setSearch(e.target.value)
              setPage(1)
            }}
            className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-purple-500 transition-colors"
          />
        </div>

        {/* Games Table */}
        <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gradient-to-r from-purple-600 to-pink-600 text-white">
                <tr>
                  <th className="px-6 py-4 text-left text-sm font-semibold">ID</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold">Nombre</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold">Géneros</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold">Plataformas</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold">Rating</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold">Metacritic</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold">Acciones</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {loading ? (
                  <tr>
                    <td colSpan={7} className="px-6 py-8 text-center text-gray-500">
                      Cargando juegos...
                    </td>
                  </tr>
                ) : games.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="px-6 py-8 text-center text-gray-500">
                      No se encontraron juegos
                    </td>
                  </tr>
                ) : (
                  games.map((game) => (
                    <tr key={game.id} className="hover:bg-gray-50 transition-colors">
                      <td className="px-6 py-4 text-sm text-gray-900">{game.id}</td>
                      <td className="px-6 py-4">
                        <div className="flex items-center space-x-3">
                          {game.background_image && (
                            <img
                              src={game.background_image}
                              alt={game.name}
                              className="w-12 h-12 rounded-lg object-cover"
                            />
                          )}
                          <div>
                            <p className="text-sm font-medium text-gray-900">{game.name}</p>
                            <p className="text-xs text-gray-500">{game.slug}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex flex-wrap gap-1">
                          {game.genres_json?.slice(0, 2).map((genre, idx) => (
                            <span
                              key={idx}
                              className="px-2 py-1 bg-purple-100 text-purple-700 text-xs rounded-lg"
                            >
                              {genre.name}
                            </span>
                          ))}
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex flex-wrap gap-1">
                          {game.parent_platforms_json?.slice(0, 2).map((p, idx) => (
                            <span
                              key={idx}
                              className="px-2 py-1 bg-blue-100 text-blue-700 text-xs rounded-lg"
                            >
                              {p.platform.name}
                            </span>
                          ))}
                        </div>
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-900">
                        {game.rating ? `⭐ ${game.rating.toFixed(1)}` : '-'}
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-900">
                        {game.metacritic ? `🎮 ${game.metacritic}` : '-'}
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex space-x-2">
                          <Link
                            to={`/dashboard/admin/games/${game.id}`}
                            className="px-3 py-1 bg-blue-500 text-white text-sm rounded-lg hover:bg-blue-600 transition-colors"
                          >
                            Editar
                          </Link>
                          <button
                            onClick={() => setShowDeleteModal(game.id)}
                            className="px-3 py-1 bg-red-500 text-white text-sm rounded-lg hover:bg-red-600 transition-colors"
                          >
                            Eliminar
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="px-6 py-4 bg-gray-50 border-t border-gray-200 flex items-center justify-between">
              <p className="text-sm text-gray-700">
                Mostrando {(page - 1) * pageSize + 1} - {Math.min(page * pageSize, total)} de {total} juegos
              </p>
              <div className="flex space-x-2">
                <button
                  onClick={() => setPage(Math.max(1, page - 1))}
                  disabled={page === 1}
                  className="px-4 py-2 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  Anterior
                </button>
                <span className="px-4 py-2 bg-purple-600 text-white rounded-lg">
                  {page} / {totalPages}
                </span>
                <button
                  onClick={() => setPage(Math.min(totalPages, page + 1))}
                  disabled={page === totalPages}
                  className="px-4 py-2 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  Siguiente
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Delete Confirmation Modal */}
      {showDeleteModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-2xl p-8 max-w-md mx-4 shadow-2xl">
            <h3 className="text-2xl font-bold text-gray-900 mb-4">Confirmar Eliminación</h3>
            <p className="text-gray-600 mb-6">
              ¿Estás seguro de que quieres eliminar este juego? Esta acción no se puede deshacer.
            </p>
            <div className="flex space-x-4">
              <button
                onClick={() => setShowDeleteModal(null)}
                className="flex-1 px-4 py-2 bg-gray-200 text-gray-700 rounded-xl hover:bg-gray-300 transition-colors"
              >
                Cancelar
              </button>
              <button
                onClick={() => handleDelete(showDeleteModal)}
                className="flex-1 px-4 py-2 bg-red-600 text-white rounded-xl hover:bg-red-700 transition-colors"
              >
                Eliminar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default AdminGamesPage
