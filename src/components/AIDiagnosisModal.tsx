import React from 'react';
import { X, Bot, Check } from 'lucide-react';
import AIAssistantBubble from './AIAssistantBubble';
import { type DiagnosticResponse } from '../types/assistantAITypes';

interface AIDiagnosisModalProps {
  isOpen: boolean;
  onClose: () => void;
  onUseDiagnosis: (diagnosis: string) => void;
  aiResponse: DiagnosticResponse | null;
  isLoading: boolean;
  error: string | null;
  urgencyLevel: 'low' | 'medium' | 'high';
}

const AIDiagnosisModal: React.FC<AIDiagnosisModalProps> = ({
  isOpen,
  onClose,
  onUseDiagnosis,
  aiResponse,
  isLoading,
  error,
  urgencyLevel
}) => {
  if (!isOpen) return null;

  const handleBackdropClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      style={{ backgroundColor: 'rgba(0, 0, 0, 0.5)' }}
      onClick={handleBackdropClick}
    >
      <div className="bg-white rounded-lg shadow-xl max-w-4xl w-full max-h-[90vh] overflow-hidden">
        {/* Header del Modal */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200 bg-white">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-teal-100 rounded-full flex items-center justify-center">
              <Bot className="w-5 h-5 text-teal-600" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-gray-900">Diagnóstico con IA</h3>
              <p className="text-sm text-gray-500">Análisis de síntomas del paciente</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-full transition-colors"
            aria-label="Cerrar modal"
          >
            <X className="w-5 h-5 text-gray-500" />
          </button>
        </div>

        {/* Contenido del Modal */}
        <div className="p-6 bg-gray-50 max-h-[60vh] overflow-y-auto">
          <AIAssistantBubble
            message={aiResponse?.posibles_diagnosticos || ''}
            isLoading={isLoading}
            error={error || undefined}
            urgencyLevel={urgencyLevel}
            possibleConditions={aiResponse?.sintomas || []}
            recommendations={aiResponse?.recomendaciones ? [aiResponse.recomendaciones] : []}
          />
        </div>

        {/* Footer del Modal */}
        <div className="flex justify-end space-x-3 p-6 border-t border-gray-200 bg-white">
          <button
            onClick={onClose}
            className="px-4 py-2 text-gray-700 bg-gray-100 border border-gray-300 rounded-lg hover:bg-gray-200 transition-colors"
          >
            Cerrar
          </button>
          {aiResponse && !isLoading && !error && (
            <button
              onClick={() => {
                onUseDiagnosis(aiResponse.posibles_diagnosticos);
                onClose();
              }}
              className="px-4 py-2 bg-teal-600 text-white rounded-lg hover:bg-teal-700 transition-colors flex items-center space-x-2"
            >
              <Check className="w-4 h-4" />
              <span>Usar Diagnóstico</span>
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default AIDiagnosisModal;
