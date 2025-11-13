import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'

interface Rule {
  id: number
  name: string
  description: string
  category: string | null
  priority: number
  is_active: boolean
  specificity: number
  created_at: string
  updated_at: string
  conditions_json: any[]
  actions_json: any[]
}

interface RuleListResponse {
  total: number
  page: number
  page_size: number
  rules: Rule[]
}

const AdminRulesPage: React.FC = () => {
  const [rules, setRules] = useState<Rule[]>([])
  const [total, setTotal] = useState(0)
  const [page, setPage] = useState(1)
  const [pageSize] = useState(50)
  const [search, setSearch] = useState('')
  const [category, setCategory] = useState('')
  const [activeOnly, setActiveOnly] = useState(false)
  const [sortBy, setSortBy] = useState('priority')
  const [sortOrder, setSortOrder] = useState('desc')
  const [loading, setLoading] = useState(false)
  const [stats, setStats] = useState<any>(null)
  const [categories, setCategories] = useState<string[]>([])
  const [showDeleteModal, setShowDeleteModal] = useState<number | null>(null)
  const [selectedRules, setSelectedRules] = useState<Set<number>>(new Set())

  const fetchRules = async () => {
    setLoading(true)
    try {
      const params = new URLSearchParams({
        page: page.toString(),
        page_size: pageSize.toString(),
        sort_by: sortBy,
        sort_order: sortOrder,
      })

      if (search) params.append('search', search)
      if (category) params.append('category', category)
      if (activeOnly) params.append('active_only', 'true')

      const response = await fetch(`http://localhost:8000/admin/rules?${params}`)
      const data: RuleListResponse = await response.json()

      setRules(data.rules)
      setTotal(data.total)
    } catch (error) {
      console.error('Error fetching rules:', error)
    } finally {
      setLoading(false)
    }
  }

  const fetchStats = async () => {
    try {
      const response = await fetch('http://localhost:8000/admin/rules/stats')
      const data = await response.json()
      setStats(data)
    } catch (error) {
      console.error('Error fetching stats:', error)
    }
  }

  const fetchCategories = async () => {
    try {
      const response = await fetch('http://localhost:8000/admin/rules/categories')
      const data = await response.json()
      setCategories(data.categories)
    } catch (error) {
      console.error('Error fetching categories:', error)
    }
  }

  useEffect(() => {
    fetchRules()
    fetchStats()
    fetchCategories()
  }, [page, search, category, activeOnly, sortBy, sortOrder])

  const handleDelete = async (ruleId: number) => {
    try {
      const response = await fetch(`http://localhost:8000/admin/rules/${ruleId}`, {
        method: 'DELETE',
      })

      if (response.ok) {
        fetchRules()
        fetchStats()
        setShowDeleteModal(null)
      } else {
        alert('Error al eliminar la regla')
      }
    } catch (error) {
      console.error('Error deleting rule:', error)
      alert('Error al eliminar la regla')
    }
  }

  const handleBulkDelete = async () => {
    if (selectedRules.size === 0) return

    if (!confirm(`¿Eliminar ${selectedRules.size} reglas seleccionadas?`)) return

    try {
      const response = await fetch('http://localhost:8000/admin/rules/bulk-delete', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ rule_ids: Array.from(selectedRules) }),
      })

      if (response.ok) {
        fetchRules()
        fetchStats()
        setSelectedRules(new Set())
      } else {
        alert('Error al eliminar las reglas')
      }
    } catch (error) {
      console.error('Error bulk deleting rules:', error)
      alert('Error al eliminar las reglas')
    }
  }

  const handleToggleActive = async (ruleId: number) => {
    try {
      const response = await fetch(`http://localhost:8000/admin/rules/${ruleId}/toggle`, {
        method: 'POST',
      })

      if (response.ok) {
        fetchRules()
        fetchStats()
      } else {
        alert('Error al cambiar estado de la regla')
      }
    } catch (error) {
      console.error('Error toggling rule:', error)
      alert('Error al cambiar estado de la regla')
    }
  }

  const toggleRuleSelection = (ruleId: number) => {
    const newSelection = new Set(selectedRules)
    if (newSelection.has(ruleId)) {
      newSelection.delete(ruleId)
    } else {
      newSelection.add(ruleId)
    }
    setSelectedRules(newSelection)
  }

  const totalPages = Math.ceil(total / pageSize)

  const getCategoryColor = (cat: string | null) => {
    if (!cat) return 'bg-gray-100 text-gray-700'
    if (cat === 'recommendation') return 'bg-green-100 text-green-700'
    if (cat.startsWith('filter_')) return 'bg-red-100 text-red-700'
    return 'bg-blue-100 text-blue-700'
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h1 className="text-4xl font-bold text-gray-900 mb-2">Gestión de Reglas</h1>
              <p className="text-lg text-gray-600">Administra las reglas del sistema experto</p>
            </div>
            <Link
              to="/dashboard/admin/rules/new"
              className="px-6 py-3 bg-gradient-to-r from-purple-600 to-pink-600 text-white font-semibold rounded-xl hover:shadow-lg transform hover:scale-105 transition-all"
            >
              + Nueva Regla
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
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
            <div className="bg-white rounded-2xl shadow-lg p-6">
              <h3 className="text-gray-500 text-sm font-medium mb-2">Total de Reglas</h3>
              <p className="text-4xl font-bold text-purple-600">{stats.total_rules}</p>
            </div>

            <div className="bg-white rounded-2xl shadow-lg p-6">
              <h3 className="text-gray-500 text-sm font-medium mb-2">Reglas Activas</h3>
              <p className="text-4xl font-bold text-green-600">{stats.active_rules}</p>
            </div>

            <div className="bg-white rounded-2xl shadow-lg p-6">
              <h3 className="text-gray-500 text-sm font-medium mb-2">Reglas Inactivas</h3>
              <p className="text-4xl font-bold text-red-600">{stats.inactive_rules}</p>
            </div>

            <div className="bg-white rounded-2xl shadow-lg p-6">
              <h3 className="text-gray-500 text-sm font-medium mb-2">Veces Ejecutadas</h3>
              <p className="text-4xl font-bold text-indigo-600">{stats.total_fires}</p>
            </div>
          </div>
        )}

        {/* Filters */}
        <div className="bg-white rounded-2xl shadow-lg p-6 mb-6 space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <input
              type="text"
              placeholder="Buscar reglas..."
              value={search}
              onChange={(e) => {
                setSearch(e.target.value)
                setPage(1)
              }}
              className="px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-purple-500 transition-colors"
            />

            <select
              value={category}
              onChange={(e) => {
                setCategory(e.target.value)
                setPage(1)
              }}
              className="px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-purple-500 transition-colors"
            >
              <option value="">Todas las categorías</option>
              {categories.map((cat) => (
                <option key={cat} value={cat}>
                  {cat}
                </option>
              ))}
            </select>

            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-purple-500 transition-colors"
            >
              <option value="priority">Ordenar por Prioridad</option>
              <option value="name">Ordenar por Nombre</option>
              <option value="specificity">Ordenar por Especificidad</option>
              <option value="created_at">Ordenar por Fecha</option>
            </select>
          </div>

          <div className="flex items-center space-x-4">
            <label className="flex items-center space-x-2 cursor-pointer">
              <input
                type="checkbox"
                checked={activeOnly}
                onChange={(e) => {
                  setActiveOnly(e.target.checked)
                  setPage(1)
                }}
                className="w-5 h-5 text-purple-600 rounded focus:ring-purple-500"
              />
              <span className="text-gray-700">Solo reglas activas</span>
            </label>

            <label className="flex items-center space-x-2 cursor-pointer">
              <input
                type="checkbox"
                checked={sortOrder === 'asc'}
                onChange={(e) => setSortOrder(e.target.checked ? 'asc' : 'desc')}
                className="w-5 h-5 text-purple-600 rounded focus:ring-purple-500"
              />
              <span className="text-gray-700">Orden ascendente</span>
            </label>

            {selectedRules.size > 0 && (
              <button
                onClick={handleBulkDelete}
                className="ml-auto px-4 py-2 bg-red-600 text-white rounded-xl hover:bg-red-700 transition-colors"
              >
                Eliminar {selectedRules.size} seleccionadas
              </button>
            )}
          </div>
        </div>

        {/* Rules Table */}
        <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gradient-to-r from-purple-600 to-pink-600 text-white">
                <tr>
                  <th className="px-4 py-4 text-left">
                    <input
                      type="checkbox"
                      onChange={(e) => {
                        if (e.target.checked) {
                          setSelectedRules(new Set(rules.map((r) => r.id)))
                        } else {
                          setSelectedRules(new Set())
                        }
                      }}
                      className="w-5 h-5"
                    />
                  </th>
                  <th className="px-6 py-4 text-left text-sm font-semibold">ID</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold">Nombre</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold">Categoría</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold">Prioridad</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold">Estado</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold">Condiciones</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold">Acciones</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {loading ? (
                  <tr>
                    <td colSpan={8} className="px-6 py-8 text-center text-gray-500">
                      Cargando reglas...
                    </td>
                  </tr>
                ) : rules.length === 0 ? (
                  <tr>
                    <td colSpan={8} className="px-6 py-8 text-center text-gray-500">
                      No se encontraron reglas
                    </td>
                  </tr>
                ) : (
                  rules.map((rule) => (
                    <tr key={rule.id} className="hover:bg-gray-50 transition-colors">
                      <td className="px-4 py-4">
                        <input
                          type="checkbox"
                          checked={selectedRules.has(rule.id)}
                          onChange={() => toggleRuleSelection(rule.id)}
                          className="w-5 h-5"
                        />
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-900">{rule.id}</td>
                      <td className="px-6 py-4">
                        <div>
                          <p className="text-sm font-medium text-gray-900">{rule.name}</p>
                          <p className="text-xs text-gray-500 truncate max-w-xs">
                            {rule.description}
                          </p>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <span className={`px-2 py-1 text-xs rounded-lg ${getCategoryColor(rule.category)}`}>
                          {rule.category || 'sin categoría'}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-900">{rule.priority}</td>
                      <td className="px-6 py-4">
                        <button
                          onClick={() => handleToggleActive(rule.id)}
                          className={`px-3 py-1 text-xs rounded-lg font-medium transition-colors ${
                            rule.is_active
                              ? 'bg-green-100 text-green-700 hover:bg-green-200'
                              : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                          }`}
                        >
                          {rule.is_active ? 'Activa' : 'Inactiva'}
                        </button>
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-900">{rule.specificity}</td>
                      <td className="px-6 py-4">
                        <div className="flex space-x-2">
                          <Link
                            to={`/dashboard/admin/rules/${rule.id}`}
                            className="px-3 py-1 bg-blue-500 text-white text-sm rounded-lg hover:bg-blue-600 transition-colors"
                          >
                            Ver
                          </Link>
                          <button
                            onClick={() => setShowDeleteModal(rule.id)}
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
                Mostrando {(page - 1) * pageSize + 1} - {Math.min(page * pageSize, total)} de {total} reglas
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
              ¿Estás seguro de que quieres eliminar esta regla? Esta acción no se puede deshacer.
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

export default AdminRulesPage
