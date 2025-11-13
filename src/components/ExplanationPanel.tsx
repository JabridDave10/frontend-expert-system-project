import { useState } from 'react'
import type { Explanation, InferenceResponse } from '../types/expertSystem'
import { ChevronDown, ChevronUp, Info, Lightbulb, BarChart3, Clock } from 'lucide-react'

interface ExplanationPanelProps {
  inferenceResult: InferenceResponse
}

export default function ExplanationPanel({ inferenceResult }: ExplanationPanelProps) {
  const [isExpanded, setIsExpanded] = useState(false)
  const [activeTab, setActiveTab] = useState<'summary' | 'reasoning' | 'confidence'>('summary')

  const { explanation, iterations, execution_time, rules_fired_count } = inferenceResult

  return (
    <div className="bg-white rounded-2xl shadow-lg overflow-hidden border border-gray-100">
      {/* Header */}
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className="w-full px-6 py-4 flex items-center justify-between bg-gradient-to-r from-purple-50 to-blue-50 hover:from-purple-100 hover:to-blue-100 transition-colors"
      >
        <div className="flex items-center gap-3">
          <div className="bg-purple-600 p-2 rounded-lg">
            <Lightbulb className="w-5 h-5 text-white" />
          </div>
          <div className="text-left">
            <h3 className="text-lg font-bold text-gray-800">Explicación del Razonamiento</h3>
            <p className="text-sm text-gray-600">
              Entender por qué el sistema recomendó estos juegos
            </p>
          </div>
        </div>
        <div className="flex items-center gap-4">
          {/* Stats Preview */}
          <div className="hidden md:flex items-center gap-4 text-sm">
            <div className="flex items-center gap-1 text-gray-600">
              <BarChart3 className="w-4 h-4" />
              <span>{rules_fired_count} reglas</span>
            </div>
            <div className="flex items-center gap-1 text-gray-600">
              <Clock className="w-4 h-4" />
              <span>{(execution_time * 1000).toFixed(0)}ms</span>
            </div>
          </div>
          {isExpanded ? (
            <ChevronUp className="w-5 h-5 text-gray-400" />
          ) : (
            <ChevronDown className="w-5 h-5 text-gray-400" />
          )}
        </div>
      </button>

      {/* Expanded Content */}
      {isExpanded && (
        <div className="p-6 space-y-6">
          {/* Stats Bar */}
          <div className="grid grid-cols-3 gap-4 pb-6 border-b border-gray-100">
            <div className="bg-blue-50 rounded-xl p-4">
              <div className="text-sm text-blue-600 font-medium mb-1">Iteraciones</div>
              <div className="text-2xl font-bold text-blue-900">{iterations}</div>
            </div>
            <div className="bg-purple-50 rounded-xl p-4">
              <div className="text-sm text-purple-600 font-medium mb-1">Reglas Disparadas</div>
              <div className="text-2xl font-bold text-purple-900">{rules_fired_count}</div>
            </div>
            <div className="bg-green-50 rounded-xl p-4">
              <div className="text-sm text-green-600 font-medium mb-1">Tiempo</div>
              <div className="text-2xl font-bold text-green-900">
                {(execution_time * 1000).toFixed(0)}ms
              </div>
            </div>
          </div>

          {/* Tabs */}
          <div className="flex gap-2 border-b border-gray-200">
            <button
              onClick={() => setActiveTab('summary')}
              className={`px-4 py-2 text-sm font-medium border-b-2 transition-colors ${
                activeTab === 'summary'
                  ? 'border-purple-600 text-purple-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700'
              }`}
            >
              📋 Resumen
            </button>
            <button
              onClick={() => setActiveTab('reasoning')}
              className={`px-4 py-2 text-sm font-medium border-b-2 transition-colors ${
                activeTab === 'reasoning'
                  ? 'border-purple-600 text-purple-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700'
              }`}
            >
              🧠 Cadena de Razonamiento
            </button>
            <button
              onClick={() => setActiveTab('confidence')}
              className={`px-4 py-2 text-sm font-medium border-b-2 transition-colors ${
                activeTab === 'confidence'
                  ? 'border-purple-600 text-purple-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700'
              }`}
            >
              📊 Confianza
            </button>
          </div>

          {/* Tab Content */}
          <div className="min-h-[200px]">
            {/* Summary Tab */}
            {activeTab === 'summary' && (
              <div className="space-y-4">
                <div className="bg-blue-50 border-l-4 border-blue-600 p-4 rounded-r-lg">
                  <div className="flex items-start gap-3">
                    <Info className="w-5 h-5 text-blue-600 mt-0.5 flex-shrink-0" />
                    <div>
                      <h4 className="font-semibold text-blue-900 mb-2">Resumen General</h4>
                      <p className="text-sm text-blue-800">{explanation.summary}</p>
                    </div>
                  </div>
                </div>

                {explanation.conclusions_explanation && explanation.conclusions_explanation.length > 0 && (
                  <div className="space-y-2">
                    <h4 className="font-semibold text-gray-900">Conclusiones</h4>
                    <ul className="space-y-2">
                      {explanation.conclusions_explanation.map((conclusion, idx) => (
                        <li key={idx} className="flex items-start gap-2 text-sm text-gray-700">
                          <span className="text-purple-600 font-bold">•</span>
                          <span>{conclusion}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            )}

            {/* Reasoning Chain Tab */}
            {activeTab === 'reasoning' && (
              <div className="space-y-3">
                <p className="text-sm text-gray-600 mb-4">
                  Estas son las reglas que se dispararon durante el proceso de inferencia:
                </p>
                {explanation.reasoning_chain && explanation.reasoning_chain.length > 0 ? (
                  <div className="space-y-3">
                    {explanation.reasoning_chain.map((rule, idx) => (
                      <div
                        key={idx}
                        className="bg-gray-50 border border-gray-200 rounded-lg p-4 hover:bg-gray-100 transition-colors"
                      >
                        <div className="flex items-start gap-3">
                          <div className="bg-purple-600 text-white rounded-full w-7 h-7 flex items-center justify-center text-sm font-bold flex-shrink-0">
                            {rule.iteration}
                          </div>
                          <div className="flex-1 min-w-0">
                            <h5 className="font-semibold text-gray-900 mb-2">{rule.rule_name}</h5>

                            {rule.facts_matched && rule.facts_matched.length > 0 && (
                              <div className="mb-2">
                                <p className="text-xs text-gray-500 font-medium mb-1">Hechos coincidentes:</p>
                                <div className="flex flex-wrap gap-1">
                                  {rule.facts_matched.map((fact, fidx) => (
                                    <span
                                      key={fidx}
                                      className="text-xs bg-blue-100 text-blue-700 px-2 py-1 rounded"
                                    >
                                      {fact.entity}.{fact.attribute} = {String(fact.value)}
                                    </span>
                                  ))}
                                </div>
                              </div>
                            )}

                            {rule.facts_added && rule.facts_added.length > 0 && (
                              <div>
                                <p className="text-xs text-gray-500 font-medium mb-1">Hechos agregados:</p>
                                <div className="flex flex-wrap gap-1">
                                  {rule.facts_added.map((fact, fidx) => (
                                    <span
                                      key={fidx}
                                      className="text-xs bg-green-100 text-green-700 px-2 py-1 rounded"
                                    >
                                      {fact.entity}.{fact.attribute} = {String(fact.value)}
                                    </span>
                                  ))}
                                </div>
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-sm text-gray-500 italic">No hay información de razonamiento disponible.</p>
                )}
              </div>
            )}

            {/* Confidence Tab */}
            {activeTab === 'confidence' && (
              <div className="space-y-4">
                <p className="text-sm text-gray-600 mb-4">
                  Desglose del nivel de confianza para cada recomendación:
                </p>
                {explanation.confidence_breakdown && explanation.confidence_breakdown.length > 0 ? (
                  <div className="space-y-3">
                    {explanation.confidence_breakdown.map((item, idx) => (
                      <div key={idx} className="bg-gradient-to-r from-gray-50 to-white border border-gray-200 rounded-lg p-4">
                        <div className="flex items-center justify-between mb-3">
                          <h5 className="font-semibold text-gray-900">{item.conclusion}</h5>
                          <span className="text-lg font-bold text-purple-600">
                            {(item.confidence * 100).toFixed(0)}%
                          </span>
                        </div>

                        {/* Progress Bar */}
                        <div className="w-full bg-gray-200 rounded-full h-2 mb-3">
                          <div
                            className="bg-gradient-to-r from-purple-600 to-blue-600 h-2 rounded-full transition-all duration-500"
                            style={{ width: `${item.confidence * 100}%` }}
                          />
                        </div>

                        {item.contributing_rules && item.contributing_rules.length > 0 && (
                          <div>
                            <p className="text-xs text-gray-500 font-medium mb-2">
                              Reglas que contribuyeron:
                            </p>
                            <div className="flex flex-wrap gap-1">
                              {item.contributing_rules.map((ruleName, ridx) => (
                                <span
                                  key={ridx}
                                  className="text-xs bg-purple-50 text-purple-700 px-2 py-1 rounded"
                                >
                                  {ruleName}
                                </span>
                              ))}
                            </div>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-sm text-gray-500 italic">
                    No hay información de confianza disponible.
                  </p>
                )}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  )
}
