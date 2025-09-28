import React from 'react';
import DashboardLayout from './DashboardLayout';
import DashboardPage from '../../pages/DashboardPage';
import AdminDashboard from '../../pages/AdminDashboard';
import DoctorDashboard from '../../pages/DoctorDashboard';
import PatientDashboard from '../../pages/PatientDashboard';
import { useAuth } from '../../contexts/AuthContext';

const DashboardWrapper: React.FC = () => {
  const { user, logout } = useAuth();

  if (!user) {
    return null; // O un componente de loading
  }

  // Mapear id_role a userType (debe coincidir con el mapeo en RegisterPage)
  const getUserType = (roleId: number): 'patient' | 'doctor' | 'admin' => {
    switch (roleId) {
      case 1:
        return 'patient';
      case 2:
        return 'doctor';
      case 3:
        return 'admin';
      default:
        return 'patient';
    }
  };

  // Renderizar el dashboard específico según el tipo de usuario
  const renderDashboard = (userType: 'patient' | 'doctor' | 'admin') => {
    switch (userType) {
      case 'admin':
        return <AdminDashboard />;
      case 'doctor':
        return <DoctorDashboard />;
      case 'patient':
        return <PatientDashboard />;
      default:
        return <DashboardPage />; // Fallback al dashboard genérico
    }
  };

  const userType = getUserType(user.id_role);
  const userName = `${user.firstName} ${user.lastName}`;

  return (
    <DashboardLayout
      userType={userType}
      userName={userName}
      onLogout={logout}
    >
      {renderDashboard(userType)}
    </DashboardLayout>
  );
};

export default DashboardWrapper;
