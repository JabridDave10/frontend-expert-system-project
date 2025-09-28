import React from 'react';
import DashboardLayout from './DashboardLayout';
import DashboardPage from '../../pages/DashboardPage';
import { useAuth } from '../../contexts/AuthContext';

const DashboardWrapper: React.FC = () => {
  const { user, logout } = useAuth();

  if (!user) {
    return null; // O un componente de loading
  }

  // Mapear id_role a userType
  const getUserType = (roleId: number): 'patient' | 'doctor' | 'admin' => {
    switch (roleId) {
      case 1:
        return 'admin';
      case 2:
        return 'doctor';
      case 3:
        return 'patient';
      default:
        return 'patient';
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
      <DashboardPage />
    </DashboardLayout>
  );
};

export default DashboardWrapper;
