import React from 'react';
import { AdminContext } from './AdminContext';
import useAdminState from './hooks/useAdminState';

export const AdminProvider = ({ children }) => {
  const adminState = useAdminState();

  return (
    <AdminContext.Provider value={adminState}>
      {children}
    </AdminContext.Provider>
  );
};