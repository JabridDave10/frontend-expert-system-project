import React from 'react';
import { useLocation } from 'react-router-dom';
import DashboardLayout from './DashboardLayout';
import DashboardPage from '../../pages/DashboardPage';
import AdminDashboard from '../../pages/AdminDashboard';
import DoctorDashboard from '../../pages/DoctorDashboard';
import PatientDashboard from '../../pages/PatientDashboard';
import CitasPage from '../../pages/CitasPage';
import CreateCitaPage from '../../pages/CreateCitaPage';
import BookAppointmentPage from '../../pages/BookAppointmentPage';
import ScheduleManagementPage from '../../pages/ScheduleManagementPage';
import { useAuth } from '../../contexts/AuthContext';
import ExplorePage from '../../pages/ExplorePage';
import DiagnosePage from '../../pages/DiagnosePage';
import ExpertSystemPage from '../../pages/ExpertSystemPage';
import AdminMainPage from '../../pages/AdminMainPage';
import AdminGamesPage from '../../pages/AdminGamesPage';
import AdminRulesPage from '../../pages/AdminRulesPage';
import AdminGameFormPage from '../../pages/AdminGameFormPage';
import AdminRuleDetailPage from '../../pages/AdminRuleDetailPage';

const DashboardWrapper: React.FC = () => {
  const { user, logout } = useAuth();
  const location = useLocation();

  if (!user) {
    return null; // O un componente de loading
  }

  // Mapear id_role a userType (debe coincidir con el mapeo en RegisterPage)
  const getUserType = (roleId: number): 'player' | 'admin' => {
    switch (roleId) {
      case 1:
        return 'player';
      case 2:
        return 'admin';
      default:
        return 'player';
    }
  };

  // Obtener título de página basado en la ruta
  const getPageTitle = (pathname: string): string => {
    switch (pathname) {
      case '/dashboard/citas':
        return 'Mis Citas';
      case '/crear-cita':
        return 'Nueva Cita';
      case '/agendar-cita':
        return 'Agendar Cita';
      case '/gestion-horarios':
        return 'Gestión de Horarios';
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
      case '/dashboard/discover':
        return 'Descubrir';
      case '/dashboard/expert-system':
        return 'Sistema Experto con IA';
      case '/dashboard/recommendations':
        return 'Diagnóstico Rápido';
      case '/dashboard/admin':
        return 'Administración';
      case '/dashboard/admin/games':
        return 'Gestión de Juegos';
      case '/dashboard/admin/rules':
        return 'Gestión de Reglas';
      case '/dashboard/admin/games/new':
        return 'Nuevo Juego';
      case '/dashboard/admin/rules/new':
        return 'Nueva Regla';
      default:
        if (pathname.startsWith('/dashboard/admin/games/')) {
          return 'Editar Juego';
        }
        if (pathname.startsWith('/dashboard/admin/rules/')) {
          return 'Detalle de Regla';
        }
        return 'Dashboard';
    }
  };

  // Renderizar contenido basado en la ruta
  const renderContent = (pathname: string, userType: 'player' | 'admin') => {
    switch (pathname) {
      case '/dashboard/citas':
        return <CitasPage />;
      case '/crear-cita':
        return <CreateCitaPage />;
      case '/agendar-cita':
        return <BookAppointmentPage />;
      case '/gestion-horarios':
        return <ScheduleManagementPage />;
      case '/dashboard/discover':
        return <ExplorePage />;
      case '/dashboard/expert-system':
        return <ExpertSystemPage />;
      case '/dashboard/recommendations':
        return <DiagnosePage />;
      case '/dashboard/admin':
        return <AdminMainPage />;
      case '/dashboard/admin/games':
        return <AdminGamesPage />;
      case '/dashboard/admin/rules':
        return <AdminRulesPage />;
      case '/dashboard/admin/games/new':
        return <AdminGameFormPage />;
      case '/dashboard/admin/rules/new':
        return <div>Nueva Regla (por implementar)</div>;
      case '/dashboard':
      default:
        // Check for dynamic routes
        if (pathname.startsWith('/dashboard/admin/games/') && pathname !== '/dashboard/admin/games/new') {
          return <AdminGameFormPage />;
        }
        if (pathname.startsWith('/dashboard/admin/rules/') && pathname !== '/dashboard/admin/rules/new') {
          return <AdminRuleDetailPage />;
        }
        // Renderizar el dashboard específico según el tipo de usuario para la ruta principal
        switch (userType) {
          case 'admin':
            return <AdminDashboard />;
          case 'player':
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
