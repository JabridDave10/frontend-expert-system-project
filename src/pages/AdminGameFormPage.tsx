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

  // Arrays para géneros, plataformas y tags
  const [genres, setGenres] = useState<Array<{ id?: number; name: string; slug: string }>>([])
  const [platforms, setPlatforms] = useState<Array<{ platform: { id?: number; name: string; slug: string } }>>([])
  const [tags, setTags] = useState<Array<{ id?: number; name: string; slug: string }>>([])

  // Estados para nuevos items
  const [newGenre, setNewGenre] = useState({ name: '', slug: '' })
  const [newPlatform, setNewPlatform] = useState({ name: '', slug: '' })
  const [newTag, setNewTag] = useState({ name: '', slug: '' })

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

      // Parse JSON arrays directly to state
      if (game.genres_json) {
        setGenres(game.genres_json)
      }
      if (game.parent_platforms_json) {
        setPlatforms(game.parent_platforms_json)
      }
      if (game.tags_json) {
        setTags(game.tags_json)
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
      const payload = {
        ...formData,
        metacritic: formData.metacritic ? parseInt(formData.metacritic) : null,
        rating: formData.rating ? parseFloat(formData.rating) : null,
        playtime: formData.playtime ? parseInt(formData.playtime) : null,
        genres_json: genres.length > 0 ? genres : null,
        parent_platforms_json: platforms.length > 0 ? platforms : null,
        tags_json: tags.length > 0 ? tags : null,
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

  // Funciones para manejar géneros
  const addGenre = () => {
    if (newGenre.name && newGenre.slug) {
      setGenres([...genres, newGenre])
      setNewGenre({ name: '', slug: '' })
    }
  }

  const removeGenre = (index: number) => {
    setGenres(genres.filter((_, i) => i !== index))
  }

  // Funciones para manejar plataformas
  const addPlatform = () => {
    if (newPlatform.name && newPlatform.slug) {
      setPlatforms([...platforms, { platform: newPlatform }])
      setNewPlatform({ name: '', slug: '' })
    }
  }

  const removePlatform = (index: number) => {
    setPlatforms(platforms.filter((_, i) => i !== index))
  }

  // Funciones para manejar tags
  const addTag = () => {
    if (newTag.name && newTag.slug) {
      setTags([...tags, newTag])
      setNewTag({ name: '', slug: '' })
    }
  }

  const removeTag = (index: number) => {
    setTags(tags.filter((_, i) => i !== index))
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

          {/* Géneros */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-3">Géneros</label>
            <div className="space-y-3">
              {/* Lista de géneros agregados */}
              {genres.map((genre, index) => (
                <div key={index} className="flex items-center gap-2 p-3 bg-purple-50 rounded-lg">
                  <span className="flex-1 font-medium">{genre.name}</span>
                  <span className="text-sm text-gray-500">({genre.slug})</span>
                  <button
                    type="button"
                    onClick={() => removeGenre(index)}
                    className="px-3 py-1 bg-red-500 text-white text-sm rounded-lg hover:bg-red-600"
                  >
                    ✕
                  </button>
                </div>
              ))}

              {/* Formulario para agregar nuevo género */}
              <div className="grid grid-cols-2 gap-3">
                <input
                  type="text"
                  placeholder="Nombre (ej: Action)"
                  value={newGenre.name}
                  onChange={(e) => setNewGenre({ ...newGenre, name: e.target.value })}
                  className="px-4 py-2 border-2 border-gray-200 rounded-lg focus:outline-none focus:border-purple-500"
                />
                <input
                  type="text"
                  placeholder="Slug (ej: action)"
                  value={newGenre.slug}
                  onChange={(e) => setNewGenre({ ...newGenre, slug: e.target.value })}
                  className="px-4 py-2 border-2 border-gray-200 rounded-lg focus:outline-none focus:border-purple-500"
                />
              </div>
              <button
                type="button"
                onClick={addGenre}
                className="w-full px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700"
              >
                + Agregar Género
              </button>
            </div>
          </div>

          {/* Plataformas */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-3">Plataformas</label>
            <div className="space-y-3">
              {/* Lista de plataformas agregadas */}
              {platforms.map((platform, index) => (
                <div key={index} className="flex items-center gap-2 p-3 bg-blue-50 rounded-lg">
                  <span className="flex-1 font-medium">{platform.platform.name}</span>
                  <span className="text-sm text-gray-500">({platform.platform.slug})</span>
                  <button
                    type="button"
                    onClick={() => removePlatform(index)}
                    className="px-3 py-1 bg-red-500 text-white text-sm rounded-lg hover:bg-red-600"
                  >
                    ✕
                  </button>
                </div>
              ))}

              {/* Formulario para agregar nueva plataforma */}
              <div className="grid grid-cols-2 gap-3">
                <input
                  type="text"
                  placeholder="Nombre (ej: PC)"
                  value={newPlatform.name}
                  onChange={(e) => setNewPlatform({ ...newPlatform, name: e.target.value })}
                  className="px-4 py-2 border-2 border-gray-200 rounded-lg focus:outline-none focus:border-blue-500"
                />
                <input
                  type="text"
                  placeholder="Slug (ej: pc)"
                  value={newPlatform.slug}
                  onChange={(e) => setNewPlatform({ ...newPlatform, slug: e.target.value })}
                  className="px-4 py-2 border-2 border-gray-200 rounded-lg focus:outline-none focus:border-blue-500"
                />
              </div>
              <button
                type="button"
                onClick={addPlatform}
                className="w-full px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
              >
                + Agregar Plataforma
              </button>
            </div>
          </div>

          {/* Tags */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-3">Tags</label>
            <div className="space-y-3">
              {/* Lista de tags agregados */}
              {tags.map((tag, index) => (
                <div key={index} className="flex items-center gap-2 p-3 bg-green-50 rounded-lg">
                  <span className="flex-1 font-medium">{tag.name}</span>
                  <span className="text-sm text-gray-500">({tag.slug})</span>
                  <button
                    type="button"
                    onClick={() => removeTag(index)}
                    className="px-3 py-1 bg-red-500 text-white text-sm rounded-lg hover:bg-red-600"
                  >
                    ✕
                  </button>
                </div>
              ))}

              {/* Formulario para agregar nuevo tag */}
              <div className="grid grid-cols-2 gap-3">
                <input
                  type="text"
                  placeholder="Nombre (ej: Singleplayer)"
                  value={newTag.name}
                  onChange={(e) => setNewTag({ ...newTag, name: e.target.value })}
                  className="px-4 py-2 border-2 border-gray-200 rounded-lg focus:outline-none focus:border-green-500"
                />
                <input
                  type="text"
                  placeholder="Slug (ej: singleplayer)"
                  value={newTag.slug}
                  onChange={(e) => setNewTag({ ...newTag, slug: e.target.value })}
                  className="px-4 py-2 border-2 border-gray-200 rounded-lg focus:outline-none focus:border-green-500"
                />
              </div>
              <button
                type="button"
                onClick={addTag}
                className="w-full px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
              >
                + Agregar Tag
              </button>
            </div>
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
