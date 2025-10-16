import React from 'react';
import { 
  Gamepad2, 
  Star, 
  ChevronRight, 
  Sparkles, 
  Trophy, 
  Target, 
  BookOpen,
  Clock,
  User
} from 'lucide-react';

interface GameStats {
  label: string;
  value: string;
  icon: React.ComponentType<React.SVGProps<SVGSVGElement>>;
  color: string;
  sublabel: string;
}

interface GameRecommendation {
  title: string;
  genre: string;
  match: number;
  platform: string;
  status: string;
  statusColor: string;
}

interface QuickAction {
  title: string;
  subtitle: string;
  icon: React.ComponentType<React.SVGProps<SVGSVGElement>>;
  color: string;
  action: string;
}

const PatientDashboard: React.FC = () => {

  const stats: GameStats[] = [
    { label: 'Juegos en Lista', value: '24', icon: Gamepad2, color: 'bg-blue-500', sublabel: 'Biblioteca activa' },
    { label: 'Recomendaciones', value: '8', icon: Sparkles, color: 'bg-purple-500', sublabel: 'Nuevas sugerencias' },
    { label: 'Horas Jugadas', value: '156', icon: Clock, color: 'bg-green-500', sublabel: 'Este mes' },
    { label: 'Logros', value: '89%', icon: Trophy, color: 'bg-yellow-500', sublabel: 'Completitud promedio' }
  ];

  const quickActions: QuickAction[] = [
    { 
      title: 'Buscar Recomendación', 
      subtitle: 'Sistema experto de juegos', 
      icon: Sparkles, 
      color: 'from-blue-500 to-purple-600',
      action: 'recommendation'
    },
    { 
      title: 'Explorar Géneros', 
      subtitle: 'Navegar por categorías', 
      icon: Target, 
      color: 'from-green-500 to-teal-600',
      action: 'genres'
    },
    { 
      title: 'Mis Preferencias', 
      subtitle: 'Ajustar perfil de jugador', 
      icon: User, 
      color: 'from-purple-500 to-pink-600',
      action: 'preferences'
    },
    { 
      title: 'Guías y Tips', 
      subtitle: 'Aprende más sobre juegos', 
      icon: BookOpen, 
      color: 'from-orange-500 to-red-600',
      action: 'guides'
    }
  ];

  const recommendations: GameRecommendation[] = [
    {
      title: 'The Last of Us Part II',
      genre: 'Acción/Aventura',
      match: 95,
      platform: 'PS5',
      status: 'Recomendado',
      statusColor: 'bg-green-100 text-green-700'
    },
    {
      title: 'Elden Ring',
      genre: 'RPG/Souls-like',
      match: 88,
      platform: 'PC',
      status: 'Popular',
      statusColor: 'bg-blue-100 text-blue-700'
    },
    {
      title: 'Stardew Valley',
      genre: 'Simulación',
      match: 92,
      platform: 'Switch',
      status: 'Trending',
      statusColor: 'bg-purple-100 text-purple-700'
    }
  ];


  return (
    <div className="space-y-6">
          {/* Welcome Banner */}
          <div className="bg-gradient-to-r from-purple-600 to-blue-600 rounded-2xl p-8 text-white shadow-xl">
            <div className="flex justify-between items-center">
              <div>
                <h3 className="text-3xl font-bold mb-2">¡Bienvenido de vuelta, Juan! 🎮</h3>
                <p className="text-purple-100 text-lg">
                  Tenemos 8 nuevas recomendaciones basadas en tus preferencias
                </p>
              </div>
              <Sparkles className="w-16 h-16 opacity-50" />
            </div>
          </div>

          {/* Stats Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {stats.map((stat, index) => {
              const Icon = stat.icon;
              return (
                <div key={index} className="bg-white rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all">
                  <div className="flex items-start justify-between mb-4">
                    <div>
                      <p className="text-gray-500 text-sm font-medium">{stat.label}</p>
                      <h3 className="text-3xl font-bold text-gray-800 mt-1">{stat.value}</h3>
                      <p className="text-gray-400 text-xs mt-1">{stat.sublabel}</p>
                    </div>
                    <div className={`${stat.color} p-3 rounded-xl`}>
                      <Icon className="w-6 h-6 text-white" />
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Quick Actions */}
          <div>
            <h3 className="text-2xl font-bold text-gray-800 mb-4">Acciones Rápidas</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {quickActions.map((action, index) => {
                const Icon = action.icon;
                return (
                  <button
                    key={index}
                    className={`bg-gradient-to-r ${action.color} rounded-2xl p-6 text-white shadow-lg hover:shadow-xl transition-all flex items-center justify-between group`}
                  >
                    <div className="flex items-center gap-4">
                      <div className="bg-white bg-opacity-20 p-3 rounded-xl">
                        <Icon className="w-6 h-6" />
                      </div>
                      <div className="text-left">
                        <h4 className="font-bold text-lg">{action.title}</h4>
                        <p className="text-sm opacity-90">{action.subtitle}</p>
                      </div>
                    </div>
                    <ChevronRight className="w-6 h-6 group-hover:translate-x-1 transition-transform" />
                  </button>
                );
              })}
            </div>
          </div>

          {/* Recommendations List */}
          <div>
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-2xl font-bold text-gray-800">Recomendaciones Personalizadas</h3>
              <button className="text-purple-600 hover:text-purple-700 font-semibold flex items-center gap-2">
                Ver todas
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
            <div className="space-y-4">
              {recommendations.map((game, index) => (
                <div key={index} className="bg-white rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4 flex-1">
                      <div className="w-16 h-16 bg-gradient-to-br from-purple-400 to-blue-400 rounded-xl flex items-center justify-center">
                        <Gamepad2 className="w-8 h-8 text-white" />
                      </div>
                      <div className="flex-1">
                        <h4 className="font-bold text-lg text-gray-800">{game.title}</h4>
                        <p className="text-gray-500 text-sm">{game.genre}</p>
                        <div className="flex items-center gap-3 mt-2">
                          <span className="text-xs text-gray-400">📅 {game.platform}</span>
                          <span className="text-xs text-gray-400">⏰ Match: {game.match}%</span>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-4">
                      <span className={`${game.statusColor} px-4 py-2 rounded-lg font-semibold text-sm`}>
                        {game.status}
                      </span>
                      <div className="flex items-center gap-1">
                        <Star className="w-5 h-5 text-yellow-500 fill-yellow-500" />
                        <span className="font-bold text-gray-800">{game.match}%</span>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
    </div>
  );
};

export default PatientDashboard;