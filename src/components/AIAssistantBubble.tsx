import React from 'react';
import { Bot, Loader2, AlertTriangle, CheckCircle, Info } from 'lucide-react';

interface AIAssistantBubbleProps {
  message: string;
  isLoading?: boolean;
  error?: string;
  urgencyLevel?: 'low' | 'medium' | 'high';
  possibleConditions?: string[];
  recommendations?: string[];
}

const AIAssistantBubble: React.FC<AIAssistantBubbleProps> = ({
  message,
  isLoading = false,
  error,
  urgencyLevel = 'low',
  possibleConditions = [],
  recommendations = []
}) => {
  const getUrgencyColor = (level: string) => {
    switch (level) {
      case 'high':
        return 'text-red-600 bg-red-50 border-red-200';
      case 'medium':
        return 'text-yellow-600 bg-yellow-50 border-yellow-200';
      default:
        return 'text-blue-600 bg-blue-50 border-blue-200';
    }
  };

  const getUrgencyIcon = (level: string) => {
    switch (level) {
      case 'high':
        return <AlertTriangle className="w-4 h-4" />;
      case 'medium':
        return <Info className="w-4 h-4" />;
      default:
        return <CheckCircle className="w-4 h-4" />;
    }
  };

  return (
    <div className="flex justify-start mb-4">
      <div className="flex items-start space-x-3 max-w-2xl">
        {/* Avatar del asistente */}
        <div className="flex-shrink-0">
          <div className="w-8 h-8 bg-teal-100 rounded-full flex items-center justify-center">
            {isLoading ? (
              <Loader2 className="w-4 h-4 text-teal-600 animate-spin" />
            ) : (
              <Bot className="w-4 h-4 text-teal-600" />
            )}
          </div>
        </div>

        {/* Burbuja de mensaje */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 flex-1">
          {/* Header del asistente */}
          <div className="flex items-center space-x-2 mb-3">
            <Bot className="w-4 h-4 text-teal-600" />
            <span className="text-sm font-medium text-gray-900">Asistente Médico IA</span>
            {!isLoading && urgencyLevel && (
              <div className={`flex items-center space-x-1 px-2 py-1 rounded-full text-xs font-medium border ${getUrgencyColor(urgencyLevel)}`}>
                {getUrgencyIcon(urgencyLevel)}
                <span className="capitalize">
                  {urgencyLevel === 'high' ? 'Alta' : urgencyLevel === 'medium' ? 'Media' : 'Baja'} Prioridad
                </span>
              </div>
            )}
          </div>

          {/* Contenido del mensaje */}
          {isLoading ? (
            <div className="flex items-center space-x-2 text-gray-600">
              <Loader2 className="w-4 h-4 animate-spin" />
              <span>Analizando síntomas con IA...</span>
            </div>
          ) : error ? (
            <div className="space-y-4">
              <div className="flex items-center space-x-2 text-red-600">
                <AlertTriangle className="w-4 h-4" />
                <span className="font-medium">Error en el diagnóstico</span>
              </div>
              <p className="text-gray-700">{error}</p>
              <div className="p-3 bg-red-50 rounded-lg border border-red-200">
                <p className="text-xs text-red-600">
                  <strong>Nota:</strong> No se pudo obtener el diagnóstico de IA. 
                  Puede continuar completando el formulario manualmente.
                </p>
              </div>
            </div>
          ) : (
            <div className="space-y-4">
              {/* Diagnóstico principal */}
              <div>
                <h4 className="text-sm font-medium text-gray-900 mb-2">Diagnóstico Preliminar:</h4>
                <p className="text-gray-700 leading-relaxed">{message}</p>
              </div>

              {/* Condiciones posibles */}
              {possibleConditions.length > 0 && (
                <div>
                  <h4 className="text-sm font-medium text-gray-900 mb-2">Posibles Condiciones:</h4>
                  <ul className="space-y-1">
                    {possibleConditions.map((condition, index) => (
                      <li key={index} className="flex items-start space-x-2">
                        <span className="w-1.5 h-1.5 bg-teal-500 rounded-full mt-2 flex-shrink-0"></span>
                        <span className="text-sm text-gray-700">{condition}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Recomendaciones */}
              {recommendations.length > 0 && (
                <div>
                  <h4 className="text-sm font-medium text-gray-900 mb-2">Recomendaciones:</h4>
                  <ul className="space-y-1">
                    {recommendations.map((recommendation, index) => (
                      <li key={index} className="flex items-start space-x-2">
                        <CheckCircle className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
                        <span className="text-sm text-gray-700">{recommendation}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Disclaimer */}
              <div className="mt-4 p-3 bg-gray-50 rounded-lg border border-gray-200">
                <p className="text-xs text-gray-600">
                  <strong>Nota:</strong> Este es un diagnóstico preliminar generado por IA. 
                  Siempre consulte con un profesional médico para un diagnóstico definitivo.
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AIAssistantBubble;
