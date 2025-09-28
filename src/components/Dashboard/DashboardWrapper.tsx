import React from 'react';
import { useLocation } from 'react-router-dom';
import DashboardLayout from './DashboardLayout';
import DashboardPage from '../../pages/DashboardPage';
import AdminDashboard from '../../pages/AdminDashboard';
import DoctorDashboard from '../../pages/DoctorDashboard';
import PatientDashboard from '../../pages/PatientDashboard';
import CitasPage from '../../pages/CitasPage';
import CreateCitaPage from '../../pages/CreateCitaPage';
import { useAuth } from '../../contexts/AuthContext';

const DashboardWrapper: React.FC = () => {
  const { user, logout } = useAuth();
  const location = useLocation();

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

  // Obtener título de página basado en la ruta
  const getPageTitle = (pathname: string): string => {
    switch (pathname) {
      case '/dashboard/citas':
        return 'Mis Citas';
      case '/crear-cita':
        return 'Nueva Cita';
      case '/dashboard/patients':
        return 'Pacientes';
      case '/dashboard/schedule':
        return 'Horarios';
      case '/dashboard/reports':
        return 'Reportes';
      case '/dashboard/doctors':
        return 'Doctores';
      case '/dashboard/settings':
        return 'Configuración';
      default:
        return 'Dashboard';
    }
  };

  // Renderizar contenido basado en la ruta
  const renderContent = (pathname: string, userType: 'patient' | 'doctor' | 'admin') => {
    switch (pathname) {
      case '/dashboard/citas':
        return <CitasPage />;
      case '/crear-cita':
        return <CreateCitaPage />;
      case '/dashboard':
      default:
        // Renderizar el dashboard específico según el tipo de usuario para la ruta principal
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
    }
  };

  const userType = getUserType(user.id_role);
  const userName = `${user.firstName} ${user.lastName}`;
  const pageTitle = getPageTitle(location.pathname);

  return (
    <DashboardLayout
      userType={userType}
      userName={userName}
      onLogout={logout}
      pageTitle={pageTitle}
    >
      {renderContent(location.pathname, userType)}
    </DashboardLayout>
  );
};

export default DashboardWrapper;
