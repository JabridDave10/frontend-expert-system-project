import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'

const AdminMainPage: React.FC = () => {
  const [gameStats, setGameStats] = useState<any>(null)
  const [ruleStats, setRuleStats] = useState<any>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const [gamesRes, rulesRes] = await Promise.all([
          fetch('http://localhost:8000/admin/games/stats'),
          fetch('http://localhost:8000/admin/rules/stats'),
        ])

        const gamesData = await gamesRes.json()
        const rulesData = await rulesRes.json()

        setGameStats(gamesData)
        setRuleStats(rulesData)
      } catch (error) {
        console.error('Error fetching stats:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchStats()
  }, [])

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">Panel de Administración</h1>
          <p className="text-lg text-gray-600">Gestiona el sistema experto de recomendación de juegos</p>
          <Link to="/dashboard" className="text-purple-600 hover:text-purple-700 font-medium mt-4 inline-block">
            ← Volver al Dashboard
          </Link>
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          <Link
            to="/dashboard/admin/games"
            className="bg-white rounded-2xl shadow-xl p-8 hover:shadow-2xl transform hover:scale-105 transition-all group"
          >
            <div className="flex items-center justify-between mb-4">
              <div className="w-16 h-16 bg-gradient-to-br from-purple-500 to-pink-500 rounded-2xl flex items-center justify-center text-white text-3xl group-hover:scale-110 transition-transform">
                🎮
              </div>
              <svg
                className="w-8 h-8 text-gray-400 group-hover:text-purple-600 transition-colors"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Gestión de Juegos</h2>
            <p className="text-gray-600 mb-4">Administra el catálogo de juegos disponibles</p>
            {gameStats && (
              <div className="pt-4 border-t border-gray-200">
                <p className="text-3xl font-bold text-purple-600">{gameStats.total_games}</p>
                <p className="text-sm text-gray-500">juegos en el catálogo</p>
              </div>
            )}
          </Link>

          <Link
            to="/dashboard/admin/rules"
            className="bg-white rounded-2xl shadow-xl p-8 hover:shadow-2xl transform hover:scale-105 transition-all group"
          >
            <div className="flex items-center justify-between mb-4">
              <div className="w-16 h-16 bg-gradient-to-br from-indigo-500 to-purple-500 rounded-2xl flex items-center justify-center text-white text-3xl group-hover:scale-110 transition-transform">
                ⚙️
              </div>
              <svg
                className="w-8 h-8 text-gray-400 group-hover:text-indigo-600 transition-colors"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Gestión de Reglas</h2>
            <p className="text-gray-600 mb-4">Configura las reglas del sistema experto</p>
            {ruleStats && (
              <div className="pt-4 border-t border-gray-200">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-3xl font-bold text-indigo-600">{ruleStats.total_rules}</p>
                    <p className="text-sm text-gray-500">reglas totales</p>
                  </div>
                  <div className="text-right">
                    <p className="text-xl font-bold text-green-600">{ruleStats.active_rules}</p>
                    <p className="text-xs text-gray-500">activas</p>
                  </div>
                </div>
              </div>
            )}
          </Link>
        </div>

        {/* Statistics Overview */}
        {!loading && gameStats && ruleStats && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Game Stats */}
            <div className="bg-white rounded-2xl shadow-xl p-6">
              <h3 className="text-xl font-bold text-gray-900 mb-4">Estadísticas de Juegos</h3>

              {gameStats.genres && gameStats.genres.length > 0 && (
                <div className="mb-6">
                  <h4 className="text-sm font-medium text-gray-700 mb-3">Top Géneros</h4>
                  <div className="space-y-2">
                    {gameStats.genres.slice(0, 5).map((genre: any, idx: number) => (
                      <div key={idx} className="flex items-center justify-between">
                        <span className="text-sm text-gray-600">{genre.genre}</span>
                        <div className="flex items-center space-x-2">
                          <div className="w-32 h-2 bg-gray-200 rounded-full overflow-hidden">
                            <div
                              className="h-full bg-gradient-to-r from-purple-500 to-pink-500"
                              style={{
                                width: `${(genre.count / gameStats.total_games) * 100}%`,
                              }}
                            />
                          </div>
                          <span className="text-sm font-medium text-gray-900 w-12 text-right">
                            {genre.count}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {gameStats.platforms && gameStats.platforms.length > 0 && (
                <div>
                  <h4 className="text-sm font-medium text-gray-700 mb-3">Plataformas</h4>
                  <div className="grid grid-cols-2 gap-3">
                    {gameStats.platforms.slice(0, 4).map((platform: any, idx: number) => (
                      <div
                        key={idx}
                        className="bg-gradient-to-br from-purple-50 to-pink-50 rounded-xl p-3 text-center"
                      >
                        <p className="text-2xl font-bold text-purple-600">{platform.count}</p>
                        <p className="text-xs text-gray-600">{platform.platform}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Rule Stats */}
            <div className="bg-white rounded-2xl shadow-xl p-6">
              <h3 className="text-xl font-bold text-gray-900 mb-4">Estadísticas de Reglas</h3>

              <div className="grid grid-cols-2 gap-4 mb-6">
                <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-xl p-4 text-center">
                  <p className="text-3xl font-bold text-green-600">{ruleStats.active_rules}</p>
                  <p className="text-sm text-gray-600">Activas</p>
                </div>
                <div className="bg-gradient-to-br from-red-50 to-rose-50 rounded-xl p-4 text-center">
                  <p className="text-3xl font-bold text-red-600">{ruleStats.inactive_rules}</p>
                  <p className="text-sm text-gray-600">Inactivas</p>
                </div>
              </div>

              <div className="bg-gradient-to-br from-indigo-50 to-purple-50 rounded-xl p-4 mb-6 text-center">
                <p className="text-4xl font-bold text-indigo-600">{ruleStats.total_fires.toLocaleString()}</p>
                <p className="text-sm text-gray-600">Veces ejecutadas en total</p>
              </div>

              {ruleStats.categories && ruleStats.categories.length > 0 && (
                <div>
                  <h4 className="text-sm font-medium text-gray-700 mb-3">Categorías de Reglas</h4>
                  <div className="space-y-2">
                    {ruleStats.categories.slice(0, 5).map((cat: any, idx: number) => (
                      <div
                        key={idx}
                        className="flex items-center justify-between py-2 px-3 bg-gray-50 rounded-lg"
                      >
                        <span className="text-sm text-gray-700 font-medium">{cat.category}</span>
                        <span className="text-sm font-bold text-indigo-600">{cat.count}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {ruleStats.most_fired && ruleStats.most_fired.length > 0 && (
                <div className="mt-6">
                  <h4 className="text-sm font-medium text-gray-700 mb-3">Reglas Más Usadas</h4>
                  <div className="space-y-2">
                    {ruleStats.most_fired.slice(0, 3).map((rule: any, idx: number) => (
                      <div
                        key={idx}
                        className="flex items-center justify-between py-2 px-3 bg-gradient-to-r from-purple-50 to-pink-50 rounded-lg"
                      >
                        <div className="flex-1 min-w-0">
                          <p className="text-xs text-gray-600 truncate">{rule.name}</p>
                        </div>
                        <span className="text-sm font-bold text-purple-600 ml-2">
                          {rule.times_fired}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

        {loading && (
          <div className="bg-white rounded-2xl shadow-xl p-12 text-center">
            <div className="animate-spin w-12 h-12 border-4 border-purple-600 border-t-transparent rounded-full mx-auto mb-4"></div>
            <p className="text-gray-600">Cargando estadísticas...</p>
          </div>
        )}
      </div>
    </div>
  )
}

export default AdminMainPage
