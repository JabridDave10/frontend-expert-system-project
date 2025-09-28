import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { ArrowLeft, FileText, Pill, Stethoscope, AlertCircle, Check, Bot, Sparkles } from 'lucide-react';
import { useMedicalHistoryForm } from '../hooks/useMedicalHistoryForm';
import { createMedicalHistory } from '../api/medicalHistory';
import { diagnosticSymptoms} from '../api/axiosAssistantAI';
import AIAssistantBubble from '../components/AIAssistantBubble';
import { type DiagnosticResponse } from '../types/assistantAITypes.ts';

const MedicalHistoryPage: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [submitError, setSubmitError] = useState<string>('');
  const [aiResponse, setAiResponse] = useState<DiagnosticResponse | null>(null);
  const [isAiLoading, setIsAiLoading] = useState(false);
  const [aiError, setAiError] = useState<string>('');

  // Obtener datos de la cita desde la navegación
  const appointmentData = location.state as {
    appointmentId: number;
    patientId: number;
    doctorId: number;
    patientName?: string;
    appointmentDate?: string;
    patientInfo?: {
      firstName: string;
      lastName: string;
      identification: string;
      phone: string;
      email: string;
      dateofbirth: string;
      gender: string;
    };
  };

  const {
    formData,
    errors,
    isLoading,
    setFieldValue,
    validateForm,
    setIsLoading
  } = useMedicalHistoryForm();

  const handleInputChange = (field: keyof typeof formData, value: string) => {
    setFieldValue(field, value);
  };

  const handleAIDiagnosis = async () => {
    if (!formData.symptoms.trim()) {
      setAiError('Por favor, ingrese los síntomas para obtener un diagnóstico de IA');
      return;
    }

    if (!appointmentData?.patientInfo) {
      setAiError('No se encontró información del paciente');
      return;
    }

    setIsAiLoading(true);
    setAiError('');
    setAiResponse(null);

    try {
      const diagnosticData: any = {
        symptoms: formData.symptoms.trim()
      };

      // Añadir edad si está disponible
      if (appointmentData.patientInfo?.dateofbirth) {
        const birthDate = new Date(appointmentData.patientInfo.dateofbirth);
        const today = new Date();
        const age = Math.floor((today.getTime() - birthDate.getTime()) / (365.25 * 24 * 60 * 60 * 1000));
        diagnosticData.age = age;
      }

      // Añadir género si está disponible
      if (appointmentData.patientInfo?.gender) {
        diagnosticData.gender = appointmentData.patientInfo.gender;
      }

      const response = await diagnosticSymptoms(diagnosticData);
      setAiResponse(response);
    } catch (error: any) {
      console.error('❌ Error al obtener diagnóstico de IA:', error);
      setAiError(error.response?.data?.detail || error.message || 'Error al obtener diagnóstico de IA');
    } finally {
      setIsAiLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitError('');

    if (!validateForm()) {
      return;
    }

    if (!appointmentData) {
      setSubmitError('No se encontraron datos de la cita');
      return;
    }

    setIsLoading(true);

    try {
      await createMedicalHistory({
        id_patient: appointmentData.patientId,
        id_doctor: appointmentData.doctorId,
        id_appointment: appointmentData.appointmentId,
        diagnosis: formData.diagnosis.trim(),
        treatment: formData.treatment.trim(),
        medication: formData.medication.trim() || undefined,
        symptoms: formData.symptoms.trim(),
        notes: formData.notes.trim() || undefined
      });

      // Success - navegar de vuelta a las citas
      navigate('/dashboard/citas', { 
        state: { 
          successMessage: 'Historial médico creado exitosamente' 
        } 
      });

    } catch (error: any) {
      console.error('Error creating medical history:', error);
      setSubmitError(error.message || 'Error al crear el historial médico');
    } finally {
      setIsLoading(false);
    }
  };

  if (!appointmentData) {
    return (
      <div className="space-y-6">
        <div className="text-center py-12">
          <AlertCircle className="w-12 h-12 text-red-500 mx-auto mb-4" />
          <h2 className="text-xl font-semibold text-gray-900 mb-2">Error</h2>
          <p className="text-gray-600 mb-4">No se encontraron datos de la cita</p>
          <button
            onClick={() => navigate('/dashboard/citas')}
            className="px-4 py-2 bg-teal-600 text-white rounded-lg hover:bg-teal-700 transition-colors"
          >
            Volver a Citas
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <p className="text-gray-600">Registra el historial clínico del paciente</p>
        </div>
        <button
          onClick={() => navigate('/dashboard/citas')}
          className="flex items-center text-gray-600 hover:text-gray-900 transition-colors"
        >
          <ArrowLeft className="w-5 h-5 mr-2" />
          Volver a Citas
        </button>
      </div>

      {/* Información del paciente */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
          <Stethoscope className="w-5 h-5 mr-2 text-teal-600" />
          Información del Paciente
        </h2>
        
        {appointmentData.patientInfo ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {/* Información personal */}
            <div className="space-y-4">
              <h3 className="text-sm font-medium text-gray-500 uppercase tracking-wide">Información Personal</h3>
              <div>
                <label className="block text-sm font-medium text-gray-700">Nombre Completo</label>
                <p className="text-gray-900">{appointmentData.patientInfo.firstName} {appointmentData.patientInfo.lastName}</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Identificación</label>
                <p className="text-gray-900">{appointmentData.patientInfo.identification}</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Género</label>
                <p className="text-gray-900 capitalize">{appointmentData.patientInfo.gender}</p>
              </div>
            </div>

            {/* Información de contacto */}
            <div className="space-y-4">
              <h3 className="text-sm font-medium text-gray-500 uppercase tracking-wide">Contacto</h3>
              <div>
                <label className="block text-sm font-medium text-gray-700">Teléfono</label>
                <p className="text-gray-900">{appointmentData.patientInfo.phone}</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Email</label>
                <p className="text-gray-900">{appointmentData.patientInfo.email}</p>
              </div>
            </div>

            {/* Información médica */}
            <div className="space-y-4">
              <h3 className="text-sm font-medium text-gray-500 uppercase tracking-wide">Información Médica</h3>
              <div>
                <label className="block text-sm font-medium text-gray-700">Fecha de Nacimiento</label>
                <p className="text-gray-900">
                  {appointmentData.patientInfo.dateofbirth && new Date(appointmentData.patientInfo.dateofbirth).toLocaleDateString()}
                </p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Edad</label>
                <p className="text-gray-900">
                  {appointmentData.patientInfo.dateofbirth && 
                    Math.floor((new Date().getTime() - new Date(appointmentData.patientInfo.dateofbirth).getTime()) / (365.25 * 24 * 60 * 60 * 1000))
                  } años
                </p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Fecha de la Cita</label>
                <p className="text-gray-900">
                  {appointmentData.appointmentDate && new Date(appointmentData.appointmentDate).toLocaleDateString()}
                </p>
              </div>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">Paciente</label>
              <p className="text-gray-900">{appointmentData.patientName}</p>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Fecha de la Cita</label>
              <p className="text-gray-900">
                {appointmentData.appointmentDate && new Date(appointmentData.appointmentDate).toLocaleDateString()}
              </p>
            </div>
          </div>
        )}
      </div>

      {/* Formulario */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        {submitError && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 text-red-700 rounded-lg">
            {submitError}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Síntomas */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <label htmlFor="symptoms" className="block text-sm font-medium text-gray-700">
                Síntomas <span className="text-red-500">*</span>
              </label>
              <button
                type="button"
                onClick={handleAIDiagnosis}
                disabled={isAiLoading || !formData.symptoms.trim()}
                className={`flex items-center space-x-2 px-3 py-1.5 text-sm rounded-lg transition-colors ${
                  isAiLoading || !formData.symptoms.trim()
                    ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                    : 'bg-purple-100 text-purple-700 hover:bg-purple-200 border border-purple-200'
                }`}
              >
                {isAiLoading ? (
                  <>
                    <div className="w-3 h-3 border-2 border-purple-500 border-t-transparent rounded-full animate-spin" />
                    <span>Analizando...</span>
                  </>
                ) : (
                  <>
                    <Bot className="w-4 h-4" />
                    <span>Diagnóstico IA</span>
                    <Sparkles className="w-3 h-3" />
                  </>
                )}
              </button>
            </div>
            <div className="relative">
              <Stethoscope className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
              <textarea
                id="symptoms"
                value={formData.symptoms}
                onChange={(e) => handleInputChange('symptoms', e.target.value)}
                placeholder="Describa los síntomas presentados por el paciente..."
                rows={4}
                className={`w-full pl-10 pr-4 py-3 border rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent transition-colors resize-none ${
                  errors.symptoms ? 'border-red-500' : 'border-gray-300'
                }`}
                required
              />
            </div>
            {errors.symptoms && (
              <p className="mt-1 text-sm text-red-600">{errors.symptoms}</p>
            )}
            {aiError && (
              <p className="mt-1 text-sm text-red-600">{aiError}</p>
            )}
          </div>

          {/* Respuesta de la IA */}
          {(isAiLoading || aiResponse || aiError) && (
            <div className="bg-gray-50 rounded-lg p-4 border border-gray-200 animate-in slide-in-from-top-2 duration-300">
              <AIAssistantBubble
                message={aiResponse?.diagnosis || ''}
                isLoading={isAiLoading}
                error={aiError}
                urgencyLevel={aiResponse?.urgency_level as 'low' | 'medium' | 'high'}
                possibleConditions={aiResponse?.possible_conditions}
                recommendations={aiResponse?.recommendations}
              />
            </div>
          )}

          {/* Diagnóstico */}
          <div>
            <label htmlFor="diagnosis" className="block text-sm font-medium text-gray-700 mb-2">
              Diagnóstico <span className="text-red-500">*</span>
            </label>
            <div className="relative">
              <FileText className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
              <textarea
                id="diagnosis"
                value={formData.diagnosis}
                onChange={(e) => handleInputChange('diagnosis', e.target.value)}
                placeholder="Establezca el diagnóstico médico..."
                rows={4}
                className={`w-full pl-10 pr-4 py-3 border rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent transition-colors resize-none ${
                  errors.diagnosis ? 'border-red-500' : 'border-gray-300'
                }`}
                required
              />
            </div>
            {errors.diagnosis && (
              <p className="mt-1 text-sm text-red-600">{errors.diagnosis}</p>
            )}
          </div>

          {/* Tratamiento */}
          <div>
            <label htmlFor="treatment" className="block text-sm font-medium text-gray-700 mb-2">
              Tratamiento <span className="text-red-500">*</span>
            </label>
            <div className="relative">
              <Stethoscope className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
              <textarea
                id="treatment"
                value={formData.treatment}
                onChange={(e) => handleInputChange('treatment', e.target.value)}
                placeholder="Describa el tratamiento recomendado..."
                rows={4}
                className={`w-full pl-10 pr-4 py-3 border rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent transition-colors resize-none ${
                  errors.treatment ? 'border-red-500' : 'border-gray-300'
                }`}
                required
              />
            </div>
            {errors.treatment && (
              <p className="mt-1 text-sm text-red-600">{errors.treatment}</p>
            )}
          </div>

          {/* Medicación */}
          <div>
            <label htmlFor="medication" className="block text-sm font-medium text-gray-700 mb-2">
              Medicación
            </label>
            <div className="relative">
              <Pill className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
              <textarea
                id="medication"
                value={formData.medication}
                onChange={(e) => handleInputChange('medication', e.target.value)}
                placeholder="Especifique los medicamentos recetados (opcional)..."
                rows={3}
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent transition-colors resize-none"
              />
            </div>
          </div>

          {/* Notas */}
          <div>
            <label htmlFor="notes" className="block text-sm font-medium text-gray-700 mb-2">
              Notas Adicionales
            </label>
            <div className="relative">
              <FileText className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
              <textarea
                id="notes"
                value={formData.notes}
                onChange={(e) => handleInputChange('notes', e.target.value)}
                placeholder="Agregue cualquier observación adicional (opcional)..."
                rows={3}
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent transition-colors resize-none"
              />
            </div>
          </div>

          {/* Botones */}
          <div className="flex space-x-4 pt-6">
            <button
              type="button"
              onClick={() => navigate('/dashboard/citas')}
              className="flex-1 px-6 py-3 text-gray-700 bg-gray-100 border border-gray-300 rounded-lg hover:bg-gray-200 transition-colors"
              disabled={isLoading}
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={isLoading}
              className={`flex-1 px-6 py-3 text-white rounded-lg transition-colors flex items-center justify-center ${
                isLoading
                  ? 'bg-gray-400 cursor-not-allowed'
                  : 'bg-teal-600 hover:bg-teal-700'
              }`}
            >
              {isLoading ? (
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
              ) : (
                <>
                  <Check className="w-5 h-5 mr-2" />
                  Guardar Historial
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default MedicalHistoryPage;