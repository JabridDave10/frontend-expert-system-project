import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { FileText, CheckCircle } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';

interface MedicalRecordButtonProps {
  appointmentDate: string;
  status: string;
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
  status,
  appointmentId,
  patientId,
  patientName,
  patientInfo,
  hasMedicalHistory = false
}) => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [isBlinking, setIsBlinking] = useState(false);

  useEffect(() => {
    // Para pruebas: siempre habilitar el botón
    setIsBlinking(false);
  }, [appointmentDate, status, hasMedicalHistory]);

  const getButtonContent = () => {
    if (hasMedicalHistory) {
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
  const isDisabled = hasMedicalHistory; // Solo deshabilitar si ya hay historial médico

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
        hasMedicalHistory
          ? 'El historial médico ya ha sido completado'
          : 'Hacer clic para registrar el historial clínico'
      }
    >
      {buttonContent.icon}
      <span>{buttonContent.text}</span>
      {isBlinking && (
        <div className="w-2 h-2 bg-red-500 rounded-full animate-ping"></div>
      )}
    </button>
  );
};

export default MedicalRecordButton;
