import React, { useState, useEffect } from 'react'
import { useNavigate, useLocation, Link } from 'react-router-dom'

const AdminGameFormPage: React.FC = () => {
  const navigate = useNavigate()
  const location = useLocation()

  // Extraer el ID del pathname
  const pathParts = location.pathname.split('/')
  const id = pathParts[pathParts.length - 1]
  const isEditMode = id !== 'new' && !isNaN(Number(id))

  const [formData, setFormData] = useState({
    name: '',
    slug: '',
    released: '',
    metacritic: '',
    rating: '',
    playtime: '',
    esrb_rating: '',
    background_image: '',
  })

  const [genres, setGenres] = useState<string>('')
  const [platforms, setPlatforms] = useState<string>('')
  const [tags, setTags] = useState<string>('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    console.log('useEffect ejecutado - isEditMode:', isEditMode, 'id:', id)
    if (isEditMode && id) {
      fetchGame()
    }
  }, [location.pathname])

  const fetchGame = async () => {
    try {
      console.log('Fetching game with ID:', id)
      const response = await fetch(`http://localhost:8000/admin/games/${id}`)
      console.log('Response status:', response.status)
      const game = await response.json()
      console.log('Game data received:', game)

      setFormData({
        name: game.name || '',
        slug: game.slug || '',
        released: game.released || '',
        metacritic: game.metacritic?.toString() || '',
        rating: game.rating?.toString() || '',
        playtime: game.playtime?.toString() || '',
        esrb_rating: game.esrb_rating || '',
        background_image: game.background_image || '',
      })

      // Parse JSON arrays to string for textarea
      if (game.genres_json) {
        setGenres(JSON.stringify(game.genres_json, null, 2))
      }
      if (game.parent_platforms_json) {
        setPlatforms(JSON.stringify(game.parent_platforms_json, null, 2))
      }
      if (game.tags_json) {
        setTags(JSON.stringify(game.tags_json, null, 2))
      }

      console.log('Form data set successfully')
    } catch (error) {
      console.error('Error fetching game:', error)
      setError('Error al cargar el juego')
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    try {
      // Parse JSON fields
      let genresJson = null
      let platformsJson = null
      let tagsJson = null

      if (genres.trim()) {
        try {
          genresJson = JSON.parse(genres)
        } catch {
          setError('El formato JSON de géneros es inválido')
          setLoading(false)
          return
        }
      }

      if (platforms.trim()) {
        try {
          platformsJson = JSON.parse(platforms)
        } catch {
          setError('El formato JSON de plataformas es inválido')
          setLoading(false)
          return
        }
      }

      if (tags.trim()) {
        try {
          tagsJson = JSON.parse(tags)
        } catch {
          setError('El formato JSON de tags es inválido')
          setLoading(false)
          return
        }
      }

      const payload = {
        ...formData,
        metacritic: formData.metacritic ? parseInt(formData.metacritic) : null,
        rating: formData.rating ? parseFloat(formData.rating) : null,
        playtime: formData.playtime ? parseInt(formData.playtime) : null,
        genres_json: genresJson,
        parent_platforms_json: platformsJson,
        tags_json: tagsJson,
      }

      const url = isEditMode
        ? `http://localhost:8000/admin/games/${id}`
        : 'http://localhost:8000/admin/games'

      const method = isEditMode ? 'PUT' : 'POST'

      const response = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      })

      if (response.ok) {
        navigate('/dashboard/admin/games')
      } else {
        const data = await response.json()
        setError(data.detail || 'Error al guardar el juego')
      }
    } catch (error) {
      console.error('Error saving game:', error)
      setError('Error al guardar el juego')
    } finally {
      setLoading(false)
    }
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    })
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50 p-6">
      <div className="max-w-4xl mx-auto">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">
            {isEditMode ? 'Editar Juego' : 'Nuevo Juego'}
          </h1>
          <Link
            to="/dashboard/admin/games"
            className="text-purple-600 hover:text-purple-700 font-medium"
          >
            ← Volver a Gestión de Juegos
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
                className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-purple-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Slug * <span className="text-xs text-gray-500">(obligatorio, URL-friendly)</span>
              </label>
              <input
                type="text"
                name="slug"
                value={formData.slug}
                onChange={handleChange}
                required
                className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-purple-500"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Fecha de Lanzamiento
              </label>
              <input
                type="date"
                name="released"
                value={formData.released}
                onChange={handleChange}
                className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-purple-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Metacritic (0-100)
              </label>
              <input
                type="number"
                name="metacritic"
                value={formData.metacritic}
                onChange={handleChange}
                min="0"
                max="100"
                className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-purple-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Rating (0-5)
              </label>
              <input
                type="number"
                name="rating"
                value={formData.rating}
                onChange={handleChange}
                min="0"
                max="5"
                step="0.01"
                className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-purple-500"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Tiempo de Juego (horas)
              </label>
              <input
                type="number"
                name="playtime"
                value={formData.playtime}
                onChange={handleChange}
                min="0"
                className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-purple-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Rating ESRB
              </label>
              <input
                type="text"
                name="esrb_rating"
                value={formData.esrb_rating}
                onChange={handleChange}
                placeholder="Everyone, Teen, Mature..."
                className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-purple-500"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              URL de Imagen
            </label>
            <input
              type="url"
              name="background_image"
              value={formData.background_image}
              onChange={handleChange}
              className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-purple-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Géneros (JSON)
              <span className="text-xs text-gray-500 ml-2">
                Ejemplo: [{`{"id": 4, "name": "Action", "slug": "action"}`}]
              </span>
            </label>
            <textarea
              value={genres}
              onChange={(e) => setGenres(e.target.value)}
              rows={4}
              className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-purple-500 font-mono text-sm"
              placeholder='[{"id": 4, "name": "Action", "slug": "action"}]'
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Plataformas (JSON)
              <span className="text-xs text-gray-500 ml-2">
                Ejemplo: [{`{"platform": {"id": 1, "name": "PC", "slug": "pc"}}`}]
              </span>
            </label>
            <textarea
              value={platforms}
              onChange={(e) => setPlatforms(e.target.value)}
              rows={4}
              className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-purple-500 font-mono text-sm"
              placeholder='[{"platform": {"id": 1, "name": "PC", "slug": "pc"}}]'
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Tags (JSON)
              <span className="text-xs text-gray-500 ml-2">
                Ejemplo: [{`{"id": 31, "name": "Singleplayer", "slug": "singleplayer"}`}]
              </span>
            </label>
            <textarea
              value={tags}
              onChange={(e) => setTags(e.target.value)}
              rows={4}
              className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-purple-500 font-mono text-sm"
              placeholder='[{"id": 31, "name": "Singleplayer", "slug": "singleplayer"}]'
            />
          </div>

          <div className="flex space-x-4 pt-4">
            <button
              type="button"
              onClick={() => navigate('/dashboard/admin/games')}
              className="flex-1 px-6 py-3 bg-gray-200 text-gray-700 font-semibold rounded-xl hover:bg-gray-300 transition-colors"
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={loading}
              className="flex-1 px-6 py-3 bg-gradient-to-r from-purple-600 to-pink-600 text-white font-semibold rounded-xl hover:shadow-lg transition-all disabled:opacity-50"
            >
              {loading ? 'Guardando...' : isEditMode ? 'Actualizar Juego' : 'Crear Juego'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default AdminGameFormPage
