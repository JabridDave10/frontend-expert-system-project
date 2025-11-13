import type { Recommendation } from '../types/expertSystem'

interface RecommendationCardProps {
  recommendation: Recommendation
}

export default function RecommendationCard({ recommendation }: RecommendationCardProps) {
  const {
    game_title,
    confidence,
    rank,
    justification,
    reasons,
  } = recommendation

  const imageUrl = reasons?.image_url || ''
  const genres = reasons?.genres || []
  const platforms = reasons?.platforms || []
  const rating = reasons?.rating || 0
  const metacritic = reasons?.metacritic
  const released = reasons?.released || ''
  const playtime = reasons?.playtime || 0
  const esrbRating = reasons?.esrb_rating || 'N/A'

  // Color del rank badge
  const getRankColor = (r: number) => {
    if (r === 1) return 'bg-gradient-to-r from-yellow-400 to-orange-400 text-white'
    if (r === 2) return 'bg-gradient-to-r from-gray-300 to-gray-400 text-gray-800'
    if (r === 3) return 'bg-gradient-to-r from-amber-600 to-amber-700 text-white'
    return 'bg-gray-200 text-gray-700'
  }

  // Color de la confianza
  const getConfidenceColor = (c: number) => {
    if (c >= 0.9) return 'text-green-600'
    if (c >= 0.7) return 'text-blue-600'
    if (c >= 0.5) return 'text-yellow-600'
    return 'text-orange-600'
  }

  return (
    <div className="group bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-xl transition-all duration-300 border-2 border-transparent hover:border-purple-200">
      {/* Rank Badge */}
      <div className="absolute top-3 left-3 z-10">
        <div className={`${getRankColor(rank)} px-3 py-1.5 rounded-full text-sm font-bold shadow-lg flex items-center gap-1`}>
          {rank === 1 && '🥇'}
          {rank === 2 && '🥈'}
          {rank === 3 && '🥉'}
          #{rank}
        </div>
      </div>

      {/* Confidence Badge */}
      <div className="absolute top-3 right-3 z-10">
        <div className="bg-black/70 backdrop-blur-sm px-3 py-1.5 rounded-full text-white text-xs font-semibold shadow-lg">
          <span className={getConfidenceColor(confidence)}>
            {(confidence * 100).toFixed(0)}%
          </span> confianza
        </div>
      </div>

      {/* Image */}
      <div className="relative h-56 overflow-hidden">
        {imageUrl ? (
          <>
            <img
              src={imageUrl}
              alt={game_title}
              className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-60 group-hover:opacity-40 transition-opacity" />
          </>
        ) : (
          <div className="w-full h-full bg-gradient-to-br from-gray-200 to-gray-300 flex items-center justify-center">
            <div className="text-6xl opacity-20">🎮</div>
          </div>
        )}
      </div>

      {/* Content */}
      <div className="p-5 space-y-3">
        {/* Title */}
        <h3 className="text-xl font-bold text-gray-900 line-clamp-2 min-h-[3.5rem]">
          {game_title}
        </h3>

        {/* Ratings & Scores */}
        <div className="flex items-center gap-2 flex-wrap">
          {rating > 0 && (
            <div className="flex items-center gap-1 bg-yellow-50 text-yellow-800 px-3 py-1 rounded-full text-sm font-semibold">
              ⭐ {rating.toFixed(1)}/5.0
            </div>
          )}
          {metacritic && metacritic > 0 && (
            <div className={`px-3 py-1 rounded-full text-sm font-semibold ${
              metacritic >= 75 ? 'bg-green-100 text-green-800' :
              metacritic >= 50 ? 'bg-yellow-100 text-yellow-800' :
              'bg-red-100 text-red-800'
            }`}>
              MC: {metacritic}
            </div>
          )}
          {esrbRating && (
            <div className="bg-indigo-50 text-indigo-700 px-3 py-1 rounded-full text-xs font-medium">
              {esrbRating}
            </div>
          )}
        </div>

        {/* Details */}
        <div className="space-y-2 text-sm text-gray-600">
          {released && (
            <div className="flex items-center gap-2">
              <span className="text-gray-400">📅</span>
              <span>{released}</span>
            </div>
          )}
          {playtime > 0 && (
            <div className="flex items-center gap-2">
              <span className="text-gray-400">⏱️</span>
              <span>{playtime}h promedio</span>
            </div>
          )}
        </div>

        {/* Genres */}
        {genres.length > 0 && (
          <div className="flex flex-wrap gap-2 pt-2">
            {genres.slice(0, 3).map((genre) => (
              <span
                key={genre}
                className="bg-purple-50 text-purple-700 px-3 py-1 rounded-full text-xs font-medium"
              >
                {genre}
              </span>
            ))}
          </div>
        )}

        {/* Platforms */}
        {platforms.length > 0 && (
          <div className="flex flex-wrap gap-2">
            {platforms.slice(0, 3).map((platform) => (
              <span
                key={platform}
                className="bg-gray-100 text-gray-700 px-3 py-1 rounded-full text-xs font-medium"
              >
                {platform}
              </span>
            ))}
            {platforms.length > 3 && (
              <span className="bg-gray-100 text-gray-500 px-3 py-1 rounded-full text-xs font-medium">
                +{platforms.length - 3}
              </span>
            )}
          </div>
        )}

        {/* Justification */}
        {justification && (
          <div className="pt-3 border-t border-gray-100">
            <p className="text-xs text-gray-600 italic line-clamp-3">
              💡 {justification}
            </p>
          </div>
        )}
      </div>

      {/* Hover Effect Border */}
      <div className="absolute inset-0 border-2 border-purple-500 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none" />
    </div>
  )
}
