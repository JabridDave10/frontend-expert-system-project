import { useState } from 'react'
import { runInference } from '../api/expertSystem'
import type { InferenceResponse, InitialFact, GENRES, BudgetLevel } from '../types/expertSystem'
import RecommendationCard from '../components/RecommendationCard'
import ExplanationPanel from '../components/ExplanationPanel'
import { Sparkles, ArrowRight, ArrowLeft, RotateCcw } from 'lucide-react'

type Step = 'welcome' | 'genre' | 'quality' | 'age' | 'platform' | 'budget' | 'results'

const GENRE_OPTIONS: (typeof GENRES[number])[] = [
  'Action',
  'Adventure',
  'RPG',
  'Strategy',
  'Simulation',
  'Sports',
  'Racing',
  'Shooter',
  'Platformer',
  'Puzzle',
  'Fighting',
  'Indie',
]

export default function ExpertSystemPage() {
  const [currentStep, setCurrentStep] = useState<Step>('welcome')

  // User preferences
  const [selectedGenre, setSelectedGenre] = useState<string>('RPG')
  const [wantsQuality, setWantsQuality] = useState<boolean>(true)
  const [minAge, setMinAge] = useState<number>(18)
  const [selectedPlatform, setSelectedPlatform] = useState<string | null>(null)
  const [budgetLevel, setBudgetLevel] = useState<BudgetLevel | null>(null)

  // Results
  const [inferenceResult, setInferenceResult] = useState<InferenceResponse | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  function goNext(nextStep: Step) {
    setCurrentStep(nextStep)
  }

  function goBack(prevStep: Step) {
    setCurrentStep(prevStep)
  }

  function resetWizard() {
    setCurrentStep('welcome')
    setInferenceResult(null)
    setError(null)
  }

  async function runExpertSystem() {
    try {
      setLoading(true)
      setError(null)

      // Construir hechos iniciales
      const initialFacts: InitialFact[] = []

      // Género (obligatorio)
      initialFacts.push({
        entity: 'user',
        attribute: 'prefers_genre',
        value: selectedGenre,
      })

      // Calidad
      if (wantsQuality) {
        initialFacts.push({
          entity: 'user',
          attribute: 'wants_quality',
          value: true,
        })
      }

      // Edad
      initialFacts.push({
        entity: 'user',
        attribute: 'min_age',
        value: minAge,
      })

      // Plataforma
      if (selectedPlatform) {
        initialFacts.push({
          entity: 'user',
          attribute: 'prefers_platform',
          value: selectedPlatform,
        })
      }

      // Presupuesto
      if (budgetLevel) {
        initialFacts.push({
          entity: 'user',
          attribute: 'budget_level',
          value: budgetLevel,
        })
      }

      // Ejecutar inferencia
      const result = await runInference({
        initial_facts: initialFacts,
        goal: 'recommend_game',
        max_iterations: 50,
        conflict_strategy: 'combined',
      })

      setInferenceResult(result)
      setCurrentStep('results')
    } catch (e: any) {
      setError(e.message || 'Error al ejecutar el sistema experto')
    } finally {
      setLoading(false)
    }
  }

  const stepNumber = ['welcome', 'genre', 'quality', 'age', 'platform', 'budget', 'results'].indexOf(currentStep)
  const totalSteps = 5 // Excluding welcome and results

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50 p-6">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center gap-2 bg-white px-4 py-2 rounded-full shadow-sm mb-4">
            <Sparkles className="w-5 h-5 text-purple-600" />
            <span className="text-sm font-semibold text-gray-700">Sistema Experto con IA</span>
          </div>
          <h1 className="text-5xl font-bold text-gray-900 mb-3">
            Recomendador Inteligente de Juegos
          </h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Nuestro motor de inferencia con 187 reglas y 1600 juegos te ayudará a encontrar tu próxima aventura
          </p>
        </div>

        {/* Progress Bar */}
        {currentStep !== 'welcome' && currentStep !== 'results' && (
          <div className="mb-8 bg-white rounded-2xl shadow-sm p-6">
            <div className="flex items-center justify-between text-sm text-gray-600 mb-3">
              <span className="font-medium">Progreso del Diagnóstico</span>
              <span className="font-bold">{stepNumber} de {totalSteps}</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-3 overflow-hidden">
              <div
                className="bg-gradient-to-r from-purple-600 via-blue-600 to-indigo-600 h-3 rounded-full transition-all duration-500 ease-out"
                style={{ width: `${(stepNumber / totalSteps) * 100}%` }}
              />
            </div>
          </div>
        )}

        {/* Welcome Step */}
        {currentStep === 'welcome' && (
          <div className="bg-white rounded-3xl shadow-2xl p-12 text-center space-y-8 max-w-3xl mx-auto">
            <div className="text-8xl animate-bounce">🎮</div>
            <h2 className="text-4xl font-bold text-gray-900">¡Bienvenido!</h2>
            <p className="text-xl text-gray-600 leading-relaxed">
              Te haré algunas preguntas simples sobre tus preferencias de juego.<br/>
              <span className="text-purple-600 font-semibold">El proceso toma menos de 1 minuto.</span>
            </p>
            <div className="bg-gradient-to-r from-purple-50 to-blue-50 rounded-xl p-6 space-y-3">
              <h3 className="font-semibold text-gray-900">✨ Lo que hace especial nuestro sistema:</h3>
              <ul className="text-left space-y-2 text-gray-700">
                <li className="flex items-start gap-2">
                  <span className="text-purple-600">🧠</span>
                  <span><strong>Motor de Inferencia</strong> - Razona como un experto humano</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-blue-600">⚡</span>
                  <span><strong>187 Reglas Inteligentes</strong> - Decisiones basadas en conocimiento real</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-green-600">📊</span>
                  <span><strong>Explicación Completa</strong> - Entenderás por qué recomendamos cada juego</span>
                </li>
              </ul>
            </div>
            <button
              onClick={() => goNext('genre')}
              className="group bg-gradient-to-r from-purple-600 to-blue-600 text-white px-10 py-4 rounded-xl text-xl font-bold hover:shadow-2xl hover:scale-105 transition-all duration-300 flex items-center gap-3 mx-auto"
            >
              Comenzar Diagnóstico
              <ArrowRight className="w-6 h-6 group-hover:translate-x-1 transition-transform" />
            </button>
          </div>
        )}

        {/* Step 1: Genre */}
        {currentStep === 'genre' && (
          <div className="bg-white rounded-3xl shadow-xl p-10 space-y-6 max-w-4xl mx-auto">
            <h2 className="text-3xl font-bold text-gray-900">¿Qué género te gusta?</h2>
            <p className="text-lg text-gray-600">Selecciona tu género favorito de videojuegos</p>

            <div className="grid grid-cols-2 md:grid-cols-3 gap-4 pt-4">
              {GENRE_OPTIONS.map((genre) => (
                <button
                  key={genre}
                  onClick={() => setSelectedGenre(genre)}
                  className={`group relative py-6 px-4 rounded-2xl font-bold text-lg transition-all duration-300 ${
                    selectedGenre === genre
                      ? 'bg-gradient-to-br from-purple-600 to-blue-600 text-white shadow-xl scale-105'
                      : 'bg-gray-50 text-gray-700 hover:bg-gray-100 hover:scale-102'
                  }`}
                >
                  {selectedGenre === genre && (
                    <div className="absolute -top-2 -right-2 bg-green-500 text-white rounded-full w-8 h-8 flex items-center justify-center text-sm">
                      ✓
                    </div>
                  )}
                  {genre}
                </button>
              ))}
            </div>

            <div className="flex gap-4 pt-6">
              <button
                onClick={() => goBack('welcome')}
                className="flex-1 flex items-center justify-center gap-2 border-2 border-gray-300 text-gray-700 px-6 py-4 rounded-xl font-bold text-lg hover:bg-gray-50 transition-colors"
              >
                <ArrowLeft className="w-5 h-5" />
                Atrás
              </button>
              <button
                onClick={() => goNext('quality')}
                className="flex-1 flex items-center justify-center gap-2 bg-gradient-to-r from-purple-600 to-blue-600 text-white px-6 py-4 rounded-xl font-bold text-lg hover:shadow-xl transition-all"
              >
                Siguiente
                <ArrowRight className="w-5 h-5" />
              </button>
            </div>
          </div>
        )}

        {/* Step 2: Quality */}
        {currentStep === 'quality' && (
          <div className="bg-white rounded-3xl shadow-xl p-10 space-y-6 max-w-4xl mx-auto">
            <h2 className="text-3xl font-bold text-gray-900">¿Te importa la calidad?</h2>
            <p className="text-lg text-gray-600">
              ¿Prefieres juegos bien valorados por crítica y jugadores?
            </p>

            <div className="grid grid-cols-2 gap-6 pt-4">
              <button
                onClick={() => setWantsQuality(true)}
                className={`group py-12 px-6 rounded-2xl transition-all duration-300 ${
                  wantsQuality
                    ? 'bg-gradient-to-br from-purple-600 to-blue-600 text-white shadow-2xl scale-105'
                    : 'bg-gray-50 text-gray-700 hover:bg-gray-100'
                }`}
              >
                <div className="text-6xl mb-4">⭐</div>
                <h3 className="text-2xl font-bold mb-2">Sí, calidad primero</h3>
                <p className={`text-sm ${wantsQuality ? 'text-white/90' : 'text-gray-600'}`}>
                  Solo juegos con excelentes valoraciones
                </p>
              </button>
              <button
                onClick={() => setWantsQuality(false)}
                className={`group py-12 px-6 rounded-2xl transition-all duration-300 ${
                  !wantsQuality
                    ? 'bg-gradient-to-br from-purple-600 to-blue-600 text-white shadow-2xl scale-105'
                    : 'bg-gray-50 text-gray-700 hover:bg-gray-100'
                }`}
              >
                <div className="text-6xl mb-4">🎲</div>
                <h3 className="text-2xl font-bold mb-2">No importa</h3>
                <p className={`text-sm ${!wantsQuality ? 'text-white/90' : 'text-gray-600'}`}>
                  Cualquier juego está bien
                </p>
              </button>
            </div>

            <div className="flex gap-4 pt-6">
              <button
                onClick={() => goBack('genre')}
                className="flex-1 flex items-center justify-center gap-2 border-2 border-gray-300 text-gray-700 px-6 py-4 rounded-xl font-bold text-lg hover:bg-gray-50"
              >
                <ArrowLeft className="w-5 h-5" />
                Atrás
              </button>
              <button
                onClick={() => goNext('age')}
                className="flex-1 flex items-center justify-center gap-2 bg-gradient-to-r from-purple-600 to-blue-600 text-white px-6 py-4 rounded-xl font-bold text-lg hover:shadow-xl"
              >
                Siguiente
                <ArrowRight className="w-5 h-5" />
              </button>
            </div>
          </div>
        )}

        {/* Step 3: Age */}
        {currentStep === 'age' && (
          <div className="bg-white rounded-3xl shadow-xl p-10 space-y-6 max-w-4xl mx-auto">
            <h2 className="text-3xl font-bold text-gray-900">¿Cuál es tu edad?</h2>
            <p className="text-lg text-gray-600">
              Esto nos ayuda a filtrar juegos apropiados según la clasificación ESRB
            </p>

            <div className="pt-6">
              <label className="block text-lg font-semibold text-gray-900 mb-4">
                Edad del jugador
              </label>
              <input
                type="number"
                min="5"
                max="99"
                className="w-full border-4 border-gray-200 rounded-2xl px-6 py-5 text-3xl font-bold text-center focus:outline-none focus:border-purple-500 transition-colors"
                placeholder="18"
                value={minAge}
                onChange={(e) => setMinAge(Number(e.target.value))}
              />
              <p className="text-sm text-gray-500 mt-3 text-center">
                Filtraremos juegos apropiados según la clasificación ESRB
              </p>

              {/* Quick age buttons */}
              <div className="grid grid-cols-4 gap-3 mt-6">
                {[7, 13, 17, 18].map((age) => (
                  <button
                    key={age}
                    onClick={() => setMinAge(age)}
                    className={`py-3 rounded-xl font-bold transition-all ${
                      minAge === age
                        ? 'bg-purple-600 text-white shadow-lg'
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}
                  >
                    {age} años
                  </button>
                ))}
              </div>
            </div>

            <div className="flex gap-4 pt-6">
              <button
                onClick={() => goBack('quality')}
                className="flex-1 flex items-center justify-center gap-2 border-2 border-gray-300 text-gray-700 px-6 py-4 rounded-xl font-bold text-lg hover:bg-gray-50"
              >
                <ArrowLeft className="w-5 h-5" />
                Atrás
              </button>
              <button
                onClick={() => goNext('platform')}
                className="flex-1 flex items-center justify-center gap-2 bg-gradient-to-r from-purple-600 to-blue-600 text-white px-6 py-4 rounded-xl font-bold text-lg hover:shadow-xl"
              >
                Siguiente
                <ArrowRight className="w-5 h-5" />
              </button>
            </div>
          </div>
        )}

        {/* Step 4: Platform */}
        {currentStep === 'platform' && (
          <div className="bg-white rounded-3xl shadow-xl p-10 space-y-6 max-w-4xl mx-auto">
            <h2 className="text-3xl font-bold text-gray-900">¿En qué plataforma juegas?</h2>
            <p className="text-lg text-gray-600">Opcional - Filtra juegos disponibles en tu plataforma</p>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-6 pt-4">
              <button
                onClick={() => setSelectedPlatform('PC')}
                className={`py-10 px-6 rounded-2xl transition-all ${
                  selectedPlatform === 'PC'
                    ? 'bg-gradient-to-br from-blue-600 to-indigo-600 text-white shadow-2xl scale-105'
                    : 'bg-gray-50 text-gray-700 hover:bg-gray-100'
                }`}
              >
                <div className="text-5xl mb-4">🖥️</div>
                <h3 className="text-xl font-bold">PC</h3>
              </button>

              <button
                onClick={() => setSelectedPlatform('PlayStation')}
                className={`py-10 px-6 rounded-2xl transition-all ${
                  selectedPlatform === 'PlayStation'
                    ? 'bg-gradient-to-br from-blue-700 to-blue-900 text-white shadow-2xl scale-105'
                    : 'bg-gray-50 text-gray-700 hover:bg-gray-100'
                }`}
              >
                <div className="text-5xl mb-4">🎮</div>
                <h3 className="text-xl font-bold">PlayStation</h3>
              </button>

              <button
                onClick={() => setSelectedPlatform('Xbox')}
                className={`py-10 px-6 rounded-2xl transition-all ${
                  selectedPlatform === 'Xbox'
                    ? 'bg-gradient-to-br from-green-600 to-green-800 text-white shadow-2xl scale-105'
                    : 'bg-gray-50 text-gray-700 hover:bg-gray-100'
                }`}
              >
                <div className="text-5xl mb-4">🎯</div>
                <h3 className="text-xl font-bold">Xbox</h3>
              </button>

              <button
                onClick={() => setSelectedPlatform('Nintendo')}
                className={`py-10 px-6 rounded-2xl transition-all ${
                  selectedPlatform === 'Nintendo'
                    ? 'bg-gradient-to-br from-red-600 to-red-800 text-white shadow-2xl scale-105'
                    : 'bg-gray-50 text-gray-700 hover:bg-gray-100'
                }`}
              >
                <div className="text-5xl mb-4">🕹️</div>
                <h3 className="text-xl font-bold">Nintendo</h3>
              </button>
            </div>

            {selectedPlatform && (
              <button
                onClick={() => setSelectedPlatform(null)}
                className="w-full py-3 text-purple-600 hover:text-purple-700 font-medium"
              >
                Limpiar selección
              </button>
            )}

            <div className="flex gap-4 pt-6">
              <button
                onClick={() => goBack('age')}
                className="flex-1 flex items-center justify-center gap-2 border-2 border-gray-300 text-gray-700 px-6 py-4 rounded-xl font-bold text-lg hover:bg-gray-50"
              >
                <ArrowLeft className="w-5 h-5" />
                Atrás
              </button>
              <button
                onClick={() => goNext('budget')}
                className="flex-1 flex items-center justify-center gap-2 bg-gradient-to-r from-purple-600 to-blue-600 text-white px-6 py-4 rounded-xl font-bold text-lg hover:shadow-xl"
              >
                Siguiente
                <ArrowRight className="w-5 h-5" />
              </button>
            </div>
          </div>
        )}

        {/* Step 6: Budget */}
        {currentStep === 'budget' && (
          <div className="bg-white rounded-3xl shadow-xl p-10 space-y-6 max-w-4xl mx-auto">
            <h2 className="text-3xl font-bold text-gray-900">¿Cuál es tu presupuesto?</h2>
            <p className="text-lg text-gray-600">Opcional - Puedes saltar este paso</p>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-4">
              <button
                onClick={() => setBudgetLevel('low')}
                className={`py-10 px-6 rounded-2xl transition-all ${
                  budgetLevel === 'low'
                    ? 'bg-gradient-to-br from-green-600 to-emerald-600 text-white shadow-2xl scale-105'
                    : 'bg-gray-50 text-gray-700 hover:bg-gray-100'
                }`}
              >
                <div className="text-5xl mb-4">💵</div>
                <h3 className="text-xl font-bold mb-2">Bajo</h3>
                <p className={`text-sm ${budgetLevel === 'low' ? 'text-white/90' : 'text-gray-600'}`}>
                  Juegos gratuitos o económicos
                </p>
              </button>

              <button
                onClick={() => setBudgetLevel('medium')}
                className={`py-10 px-6 rounded-2xl transition-all ${
                  budgetLevel === 'medium'
                    ? 'bg-gradient-to-br from-blue-600 to-cyan-600 text-white shadow-2xl scale-105'
                    : 'bg-gray-50 text-gray-700 hover:bg-gray-100'
                }`}
              >
                <div className="text-5xl mb-4">💰</div>
                <h3 className="text-xl font-bold mb-2">Medio</h3>
                <p className={`text-sm ${budgetLevel === 'medium' ? 'text-white/90' : 'text-gray-600'}`}>
                  Precio estándar de juegos
                </p>
              </button>

              <button
                onClick={() => setBudgetLevel('high')}
                className={`py-10 px-6 rounded-2xl transition-all ${
                  budgetLevel === 'high'
                    ? 'bg-gradient-to-br from-purple-600 to-pink-600 text-white shadow-2xl scale-105'
                    : 'bg-gray-50 text-gray-700 hover:bg-gray-100'
                }`}
              >
                <div className="text-5xl mb-4">💎</div>
                <h3 className="text-xl font-bold mb-2">Alto</h3>
                <p className={`text-sm ${budgetLevel === 'high' ? 'text-white/90' : 'text-gray-600'}`}>
                  Juegos AAA sin límite
                </p>
              </button>
            </div>

            {budgetLevel && (
              <button
                onClick={() => setBudgetLevel(null)}
                className="w-full py-3 text-purple-600 hover:text-purple-700 font-medium"
              >
                Limpiar selección
              </button>
            )}

            <div className="flex gap-4 pt-6">
              <button
                onClick={() => goBack('platform')}
                className="flex-1 flex items-center justify-center gap-2 border-2 border-gray-300 text-gray-700 px-6 py-4 rounded-xl font-bold text-lg hover:bg-gray-50"
              >
                <ArrowLeft className="w-5 h-5" />
                Atrás
              </button>
              <button
                onClick={runExpertSystem}
                disabled={loading}
                className="flex-1 flex items-center justify-center gap-3 bg-gradient-to-r from-green-600 to-emerald-600 text-white px-6 py-4 rounded-xl font-bold text-lg hover:shadow-2xl disabled:opacity-50 disabled:cursor-not-allowed transition-all"
              >
                {loading ? (
                  <>
                    <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-white" />
                    Analizando...
                  </>
                ) : (
                  <>
                    <Sparkles className="w-6 h-6" />
                    Ver Recomendaciones
                  </>
                )}
              </button>
            </div>
          </div>
        )}

        {/* Results */}
        {currentStep === 'results' && inferenceResult && (
          <div className="space-y-8">
            {/* Header */}
            <div className="bg-white rounded-2xl shadow-lg p-8">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-3xl font-bold text-gray-900 mb-2">
                    🎉 Tus Recomendaciones Personalizadas
                  </h2>
                  <p className="text-gray-600">
                    Basado en {inferenceResult.rules_fired_count} reglas analizadas en {inferenceResult.iterations} iteraciones
                  </p>
                </div>
                <button
                  onClick={resetWizard}
                  className="flex items-center gap-2 bg-gradient-to-r from-purple-600 to-blue-600 text-white px-6 py-3 rounded-xl font-bold hover:shadow-xl transition-all"
                >
                  <RotateCcw className="w-5 h-5" />
                  Nueva Búsqueda
                </button>
              </div>
            </div>

            {error && (
              <div className="bg-red-50 border-2 border-red-200 text-red-700 px-6 py-4 rounded-2xl">
                ❌ {error}
              </div>
            )}

            {/* Recommendations Grid */}
            {inferenceResult.recommendations.length > 0 ? (
              <>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {inferenceResult.recommendations.map((rec) => (
                    <RecommendationCard key={rec.id} recommendation={rec} />
                  ))}
                </div>

                {/* Explanation Panel */}
                <ExplanationPanel inferenceResult={inferenceResult} />
              </>
            ) : (
              <div className="bg-white rounded-2xl shadow-lg p-12 text-center">
                <div className="text-6xl mb-4">😢</div>
                <h3 className="text-2xl font-bold text-gray-900 mb-3">
                  No encontramos recomendaciones
                </h3>
                <p className="text-gray-600 mb-6">
                  No hay juegos que cumplan con todos tus criterios. Intenta ajustar tus preferencias.
                </p>
                <button
                  onClick={resetWizard}
                  className="bg-gradient-to-r from-purple-600 to-blue-600 text-white px-8 py-3 rounded-xl font-bold hover:shadow-xl"
                >
                  Intentar de Nuevo
                </button>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  )
}
