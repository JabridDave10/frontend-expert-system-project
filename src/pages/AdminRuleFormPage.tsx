import React, { useState, useEffect } from 'react'
import { useNavigate, useLocation, Link } from 'react-router-dom'

const AdminRuleFormPage: React.FC = () => {
  const navigate = useNavigate()
  const location = useLocation()

  // Extraer el ID del pathname
  const pathParts = location.pathname.split('/')
  const id = pathParts[pathParts.length - 1]
  const isEditMode = id !== 'new' && !isNaN(Number(id))

  const [formData, setFormData] = useState({
    name: '',
    description: '',
    category: '',
    priority: '10',
  })

  // Arrays para condiciones y acciones
  const [conditions, setConditions] = useState<Array<{ fact: string; operator: string; value: string }>>([])
  const [actions, setActions] = useState<Array<{ type: string; params: any }>>([])

  // Estados para nuevas condiciones y acciones
  const [newCondition, setNewCondition] = useState({ fact: '', operator: '==', value: '' })
  const [newAction, setNewAction] = useState({ type: 'recommend', params: {} })

  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    if (isEditMode && id) {
      fetchRule()
    }
  }, [location.pathname])

  const fetchRule = async () => {
    try {
      const response = await fetch(`http://localhost:8000/admin/rules/${id}`)
      const rule = await response.json()

      setFormData({
        name: rule.name || '',
        description: rule.description || '',
        category: rule.category || '',
        priority: rule.priority?.toString() || '10',
      })

      if (rule.conditions_json) {
        setConditions(rule.conditions_json)
      }
      if (rule.actions_json) {
        setActions(rule.actions_json)
      }
    } catch (error) {
      console.error('Error fetching rule:', error)
      setError('Error al cargar la regla')
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    try {
      const payload = {
        ...formData,
        priority: parseInt(formData.priority),
        conditions_json: conditions,
        actions_json: actions,
      }

      const url = isEditMode
        ? `http://localhost:8000/admin/rules/${id}`
        : 'http://localhost:8000/admin/rules'

      const method = isEditMode ? 'PUT' : 'POST'

      const response = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      })

      if (response.ok) {
        navigate('/dashboard/admin/rules')
      } else {
        const data = await response.json()
        setError(data.detail || 'Error al guardar la regla')
      }
    } catch (error) {
      console.error('Error saving rule:', error)
      setError('Error al guardar la regla')
    } finally {
      setLoading(false)
    }
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    })
  }

  // Funciones para manejar condiciones
  const addCondition = () => {
    if (newCondition.fact && newCondition.value) {
      setConditions([...conditions, newCondition])
      setNewCondition({ fact: '', operator: '==', value: '' })
    }
  }

  const removeCondition = (index: number) => {
    setConditions(conditions.filter((_, i) => i !== index))
  }

  // Funciones para manejar acciones
  const addAction = () => {
    setActions([...actions, newAction])
    setNewAction({ type: 'recommend', params: {} })
  }

  const removeAction = (index: number) => {
    setActions(actions.filter((_, i) => i !== index))
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50 p-6">
      <div className="max-w-4xl mx-auto">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">
            {isEditMode ? 'Editar Regla' : 'Nueva Regla'}
          </h1>
          <Link
            to="/dashboard/admin/rules"
            className="text-purple-600 hover:text-purple-700 font-medium"
          >
            ← Volver a Gestión de Reglas
          </Link>
        </div>

        <form onSubmit={handleSubmit} className="bg-white rounded-2xl shadow-xl p-8 space-y-6">
          {error && (
            <div className="bg-red-50 border-2 border-red-200 text-red-700 px-4 py-3 rounded-xl">
              {error}
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Nombre * <span className="text-xs text-gray-500">(obligatorio)</span>
              </label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                required
                placeholder="Ej: Recomendar juegos de acción"
                className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-purple-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Categoría
              </label>
              <input
                type="text"
                name="category"
                value={formData.category}
                onChange={handleChange}
                placeholder="Ej: recommendation, filter_genre"
                className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-purple-500"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Descripción</label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              rows={3}
              placeholder="Describe qué hace esta regla..."
              className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-purple-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Prioridad (1-100)
            </label>
            <input
              type="number"
              name="priority"
              value={formData.priority}
              onChange={handleChange}
              min="1"
              max="100"
              className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-purple-500"
            />
          </div>

          {/* Condiciones */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-3">Condiciones</label>
            <div className="space-y-3">
              {/* Lista de condiciones agregadas */}
              {conditions.map((condition, index) => (
                <div key={index} className="flex items-center gap-2 p-3 bg-blue-50 rounded-lg">
                  <span className="flex-1 font-medium">{condition.fact}</span>
                  <span className="text-sm text-gray-500">{condition.operator}</span>
                  <span className="text-sm text-gray-700">{condition.value}</span>
                  <button
                    type="button"
                    onClick={() => removeCondition(index)}
                    className="px-3 py-1 bg-red-500 text-white text-sm rounded-lg hover:bg-red-600"
                  >
                    ✕
                  </button>
                </div>
              ))}

              {/* Formulario para agregar nueva condición */}
              <div className="grid grid-cols-3 gap-3">
                <input
                  type="text"
                  placeholder="Hecho (ej: user_age)"
                  value={newCondition.fact}
                  onChange={(e) => setNewCondition({ ...newCondition, fact: e.target.value })}
                  className="px-4 py-2 border-2 border-gray-200 rounded-lg focus:outline-none focus:border-blue-500"
                />
                <select
                  value={newCondition.operator}
                  onChange={(e) => setNewCondition({ ...newCondition, operator: e.target.value })}
                  className="px-4 py-2 border-2 border-gray-200 rounded-lg focus:outline-none focus:border-blue-500"
                >
                  <option value="==">=</option>
                  <option value="!=">≠</option>
                  <option value=">">{'>'}</option>
                  <option value="<">{'<'}</option>
                  <option value=">=">{'>='}</option>
                  <option value="<=">{'<='}</option>
                  <option value="in">en</option>
                  <option value="contains">contiene</option>
                </select>
                <input
                  type="text"
                  placeholder="Valor"
                  value={newCondition.value}
                  onChange={(e) => setNewCondition({ ...newCondition, value: e.target.value })}
                  className="px-4 py-2 border-2 border-gray-200 rounded-lg focus:outline-none focus:border-blue-500"
                />
              </div>
              <button
                type="button"
                onClick={addCondition}
                className="w-full px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
              >
                + Agregar Condición
              </button>
            </div>
          </div>

          {/* Acciones */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-3">Acciones</label>
            <div className="space-y-3">
              {/* Lista de acciones agregadas */}
              {actions.map((action, index) => (
                <div key={index} className="flex items-center gap-2 p-3 bg-green-50 rounded-lg">
                  <span className="flex-1 font-medium">{action.type}</span>
                  <span className="text-sm text-gray-500">{JSON.stringify(action.params)}</span>
                  <button
                    type="button"
                    onClick={() => removeAction(index)}
                    className="px-3 py-1 bg-red-500 text-white text-sm rounded-lg hover:bg-red-600"
                  >
                    ✕
                  </button>
                </div>
              ))}

              {/* Formulario para agregar nueva acción */}
              <div className="grid grid-cols-2 gap-3">
                <select
                  value={newAction.type}
                  onChange={(e) => setNewAction({ ...newAction, type: e.target.value })}
                  className="px-4 py-2 border-2 border-gray-200 rounded-lg focus:outline-none focus:border-green-500"
                >
                  <option value="recommend">Recomendar</option>
                  <option value="filter">Filtrar</option>
                  <option value="boost">Aumentar peso</option>
                  <option value="exclude">Excluir</option>
                </select>
                <input
                  type="text"
                  placeholder='Parámetros (JSON: {"key": "value"})'
                  value={JSON.stringify(newAction.params)}
                  onChange={(e) => {
                    try {
                      const params = JSON.parse(e.target.value)
                      setNewAction({ ...newAction, params })
                    } catch {
                      // Ignorar si no es JSON válido aún
                    }
                  }}
                  className="px-4 py-2 border-2 border-gray-200 rounded-lg focus:outline-none focus:border-green-500"
                />
              </div>
              <button
                type="button"
                onClick={addAction}
                className="w-full px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
              >
                + Agregar Acción
              </button>
            </div>
          </div>

          <div className="flex space-x-4 pt-4">
            <button
              type="button"
              onClick={() => navigate('/dashboard/admin/rules')}
              className="flex-1 px-6 py-3 bg-gray-200 text-gray-700 font-semibold rounded-xl hover:bg-gray-300 transition-colors"
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={loading}
              className="flex-1 px-6 py-3 bg-gradient-to-r from-purple-600 to-pink-600 text-white font-semibold rounded-xl hover:shadow-lg transition-all disabled:opacity-50"
            >
              {loading ? 'Guardando...' : isEditMode ? 'Actualizar Regla' : 'Crear Regla'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default AdminRuleFormPage
