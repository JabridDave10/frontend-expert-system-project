/**
 * TypeScript Types para el Sistema Experto con Motor de Inferencia
 */

// ============================================================================
// INITIAL FACTS - Hechos iniciales para el motor de inferencia
// ============================================================================

export interface InitialFact {
  entity: string
  attribute: string
  value: string | number | boolean
  value_type?: 'string' | 'number' | 'boolean'
  confidence?: number
}

// ============================================================================
// INFERENCE REQUEST - Payload para /api/expert-system/infer
// ============================================================================

export type ConflictStrategy = 'priority' | 'specificity' | 'recency' | 'combined'

export interface InferenceRequest {
  initial_facts: InitialFact[]
  goal?: string
  max_iterations?: number
  conflict_strategy?: ConflictStrategy
}

// ============================================================================
// RECOMMENDATION - Recomendación individual
// ============================================================================

export interface Recommendation {
  id: number
  session_id: number
  game_id: number
  game_title: string
  confidence: number
  score?: number
  justification?: string
  rules_applied?: string[]
  reasons?: {
    rule_reason?: string
    genres?: string[]
    platforms?: string[]
    rating?: number
    metacritic?: number
    image_url?: string
    released?: string
    playtime?: number
    esrb_rating?: string
  }
  rank: number
  created_at?: string
}

// ============================================================================
// EXPLANATION - Explicación del razonamiento
// ============================================================================

export interface RuleFired {
  rule_id: number
  rule_name: string
  iteration: number
  facts_matched: Array<{
    entity: string
    attribute: string
    value: string | number | boolean
  }>
  facts_added: Array<{
    entity: string
    attribute: string
    value: string | number | boolean
  }>
}

export interface Explanation {
  summary: string
  reasoning_chain: RuleFired[]
  conclusions_explanation: string[]
  confidence_breakdown: Array<{
    conclusion: string
    confidence: number
    contributing_rules: string[]
  }>
}

// ============================================================================
// INFERENCE RESPONSE - Respuesta completa del endpoint
// ============================================================================

export interface InferenceResponse {
  session_id: number
  success: boolean
  status: string
  goal: string
  iterations: number
  execution_time: number
  conclusions: Array<{
    type: string
    game_id?: number
    confidence?: number
    reason?: string
    [key: string]: any
  }>
  recommendations: Recommendation[]
  rules_fired_count: number
  explanation: Explanation
  error?: string
}

// ============================================================================
// UI STATE - Estado para la interfaz del wizard
// ============================================================================

export interface WizardState {
  currentStep: 'welcome' | 'genre' | 'quality' | 'multiplayer' | 'age' | 'budget' | 'results'
  preferences: {
    genre?: string
    wantsQuality: boolean
    prefersMultiplayer?: boolean | null
    prefersSingleplayer?: boolean | null
    minAge?: number
    budgetLevel?: 'low' | 'medium' | 'high' | null
  }
}

// ============================================================================
// HELPER TYPES
// ============================================================================

export const GENRES = [
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
] as const

export type Genre = typeof GENRES[number]

export const BUDGET_LEVELS = {
  low: 'Bajo (juegos gratuitos o económicos)',
  medium: 'Medio (juegos de precio estándar)',
  high: 'Alto (juegos AAA sin límite de presupuesto)',
} as const

export type BudgetLevel = keyof typeof BUDGET_LEVELS
