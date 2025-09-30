import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { FileText, CheckCircle } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { checkMedicalHistoryExists } from '../api/medicalHistory';

interface MedicalRecordButtonProps {
  appointmentDate: string;
  appointmentId: number;
  patientId: number;
  patientName?: string;
  patientInfo?: {
    firstName: string;
    lastName: string;
    identification: string;
    phone: string;
    email: string;
    dateofbirth: string;
    gender: string;
  };
  hasMedicalHistory?: boolean;
}

const MedicalRecordButton: React.FC<MedicalRecordButtonProps> = ({
  appointmentDate,
  appointmentId,
  patientId,
  patientName,
  patientInfo,
  hasMedicalHistory = false
}) => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [actualHasMedicalHistory, setActualHasMedicalHistory] = useState(hasMedicalHistory);
  const [isChecking, setIsChecking] = useState(false);

  useEffect(() => {
    // Verificar si la cita ya tiene historial médico
    const checkHistory = async () => {
      if (appointmentId && user) {
        setIsChecking(true);
        try {
          const result = await checkMedicalHistoryExists(appointmentId);
          setActualHasMedicalHistory(result.has_medical_history);
        } catch (error) {
          console.error('Error verificando historial médico:', error);
          // En caso de error, usar el valor por defecto
          setActualHasMedicalHistory(hasMedicalHistory);
        } finally {
          setIsChecking(false);
        }
      }
    };

    checkHistory();
  }, [appointmentId, user, hasMedicalHistory]);

  const getButtonContent = () => {
    if (isChecking) {
      return {
        icon: <div className="w-4 h-4 border-2 border-blue-500 border-t-transparent rounded-full animate-spin" />,
        text: 'Verificando...',
        className: 'bg-gray-100 text-gray-500 border-gray-200'
      };
    }

    if (actualHasMedicalHistory) {
      return {
        icon: <CheckCircle className="w-4 h-4" />,
        text: 'Historial Completado',
        className: 'bg-green-100 text-green-700 border-green-200 hover:bg-green-200'
      };
    }

    return {
      icon: <FileText className="w-4 h-4" />,
      text: 'Registrar Clínico',
      className: 'bg-blue-100 text-blue-700 border-blue-200 hover:bg-blue-200'
    };
  };

  const buttonContent = getButtonContent();
  const isDisabled = actualHasMedicalHistory || isChecking; // Deshabilitar si ya hay historial médico o está verificando

  const handleClick = () => {
    navigate('/medical-history', {
      state: {
        appointmentId,
        patientId,
        doctorId: user?.id || 0,
        patientName,
        appointmentDate,
        patientInfo
      }
    });
  };

  return (
    <button
      onClick={handleClick}
      disabled={isDisabled}
      className={`
        flex items-center space-x-2 px-3 py-2 rounded-lg border text-sm font-medium transition-all duration-200
        ${buttonContent.className}
        ${isDisabled ? 'cursor-not-allowed opacity-60' : 'cursor-pointer'}
      `}
      title={
        isChecking
          ? 'Verificando si existe historial médico...'
          : actualHasMedicalHistory
          ? 'El historial médico ya ha sido completado'
          : 'Hacer clic para registrar el historial clínico'
      }
    >
      {buttonContent.icon}
      <span>{buttonContent.text}</span>
    </button>
  );
};

export default MedicalRecordButton;
