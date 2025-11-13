import React, { useState, useEffect } from 'react'
import { useParams, useNavigate, Link } from 'react-router-dom'

interface Rule {
  id: number
  name: string
  description: string
  category: string | null
  priority: number
  active: boolean
  times_fired: number
  created_at: string
  updated_at: string
  conditions_json: any[]
  actions_json: any[]
}

const AdminRuleDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const [rule, setRule] = useState<Rule | null>(null)
  const [loading, setLoading] = useState(true)
  const [showDeleteModal, setShowDeleteModal] = useState(false)

  useEffect(() => {
    fetchRule()
  }, [id])

  const fetchRule = async () => {
    try {
      const response = await fetch(`http://localhost:8000/admin/rules/${id}`)
      const data = await response.json()
      setRule(data)
    } catch (error) {
      console.error('Error fetching rule:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleToggleActive = async () => {
    try {
      const response = await fetch(`http://localhost:8000/admin/rules/${id}/toggle`, {
        method: 'POST',
      })

      if (response.ok) {
        fetchRule()
      }
    } catch (error) {
      console.error('Error toggling rule:', error)
    }
  }

  const handleDelete = async () => {
    try {
      const response = await fetch(`http://localhost:8000/admin/rules/${id}`, {
        method: 'DELETE',
      })

      if (response.ok) {
        navigate('/dashboard/admin/rules')
      }
    } catch (error) {
      console.error('Error deleting rule:', error)
      alert('Error al eliminar la regla')
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50 p-6 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin w-12 h-12 border-4 border-purple-600 border-t-transparent rounded-full mx-auto mb-4"></div>
          <p className="text-gray-600">Cargando regla...</p>
        </div>
      </div>
    )
  }

  if (!rule) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50 p-6">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Regla no encontrada</h1>
          <Link
            to="/dashboard/admin/rules"
            className="text-purple-600 hover:text-purple-700 font-medium"
          >
            ← Volver a Gestión de Reglas
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50 p-6">
      <div className="max-w-5xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h1 className="text-4xl font-bold text-gray-900 mb-2">Detalle de Regla</h1>
              <p className="text-lg text-gray-600">ID: {rule.id}</p>
            </div>
            <div className="flex space-x-3">
              <button
                onClick={handleToggleActive}
                className={`px-6 py-3 font-semibold rounded-xl transition-all ${
                  rule.active
                    ? 'bg-green-500 text-white hover:bg-green-600'
                    : 'bg-gray-300 text-gray-700 hover:bg-gray-400'
                }`}
              >
                {rule.active ? '✓ Activa' : '✗ Inactiva'}
              </button>
              <button
                onClick={() => setShowDeleteModal(true)}
                className="px-6 py-3 bg-red-600 text-white font-semibold rounded-xl hover:bg-red-700 transition-all"
              >
                Eliminar
              </button>
            </div>
          </div>

          <Link
            to="/dashboard/admin/rules"
            className="text-purple-600 hover:text-purple-700 font-medium"
          >
            ← Volver a Gestión de Reglas
          </Link>
        </div>

        {/* Rule Info */}
        <div className="bg-white rounded-2xl shadow-xl p-8 mb-6">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Información General</h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-500 mb-1">Nombre</label>
              <p className="text-lg font-semibold text-gray-900">{rule.name}</p>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-500 mb-1">Categoría</label>
              <p className="text-lg font-semibold text-gray-900">{rule.category || 'Sin categoría'}</p>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-500 mb-1">Prioridad</label>
              <p className="text-lg font-semibold text-gray-900">{rule.priority}</p>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-500 mb-1">Veces Ejecutada</label>
              <p className="text-lg font-semibold text-purple-600">{rule.times_fired}</p>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-500 mb-1">Creada</label>
              <p className="text-lg text-gray-900">
                {new Date(rule.created_at).toLocaleString('es-ES')}
              </p>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-500 mb-1">Actualizada</label>
              <p className="text-lg text-gray-900">
                {new Date(rule.updated_at).toLocaleString('es-ES')}
              </p>
            </div>
          </div>

          <div className="mt-6">
            <label className="block text-sm font-medium text-gray-500 mb-1">Descripción</label>
            <p className="text-lg text-gray-900">{rule.description}</p>
          </div>
        </div>

        {/* Conditions */}
        <div className="bg-white rounded-2xl shadow-xl p-8 mb-6">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">
            Condiciones (IF) - {rule.conditions_json.length}
          </h2>

          {rule.conditions_json.length === 0 ? (
            <p className="text-gray-500 italic">Sin condiciones</p>
          ) : (
            <div className="space-y-3">
              {rule.conditions_json.map((condition, idx) => (
                <div
                  key={idx}
                  className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl p-4 border-l-4 border-blue-500"
                >
                  <div className="font-mono text-sm">
                    <span className="font-bold text-blue-700">{condition.entity}</span>
                    <span className="text-gray-600">.</span>
                    <span className="text-purple-700">{condition.attribute}</span>
                    <span className="text-gray-600"> {condition.operator} </span>
                    <span className="text-green-700">
                      {typeof condition.value === 'string' ? `"${condition.value}"` : condition.value}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Actions */}
        <div className="bg-white rounded-2xl shadow-xl p-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">
            Acciones (THEN) - {rule.actions_json.length}
          </h2>

          {rule.actions_json.length === 0 ? (
            <p className="text-gray-500 italic">Sin acciones</p>
          ) : (
            <div className="space-y-3">
              {rule.actions_json.map((action, idx) => (
                <div
                  key={idx}
                  className="bg-gradient-to-r from-green-50 to-emerald-50 rounded-xl p-4 border-l-4 border-green-500"
                >
                  <div className="font-mono text-sm mb-2">
                    <span className="font-bold text-green-700">{action.action}</span>
                    <span className="text-gray-600"> → </span>
                    <span className="text-purple-700">{action.entity}</span>
                    {action.attribute && (
                      <>
                        <span className="text-gray-600">.</span>
                        <span className="text-blue-700">{action.attribute}</span>
                      </>
                    )}
                    {action.value !== undefined && (
                      <>
                        <span className="text-gray-600"> = </span>
                        <span className="text-orange-700">
                          {typeof action.value === 'string' ? `"${action.value}"` : action.value}
                        </span>
                      </>
                    )}
                  </div>
                  {action.reason && (
                    <div className="text-xs text-gray-600 mt-1">
                      <span className="font-semibold">Razón:</span> {action.reason}
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>

        {/* JSON Export */}
        <div className="bg-white rounded-2xl shadow-xl p-8 mt-6">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">JSON Completo</h2>
          <pre className="bg-gray-900 text-gray-100 p-6 rounded-xl overflow-auto max-h-96 text-sm">
            {JSON.stringify(rule, null, 2)}
          </pre>
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
                onClick={() => setShowDeleteModal(false)}
                className="flex-1 px-4 py-2 bg-gray-200 text-gray-700 rounded-xl hover:bg-gray-300 transition-colors"
              >
                Cancelar
              </button>
              <button
                onClick={handleDelete}
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

export default AdminRuleDetailPage
