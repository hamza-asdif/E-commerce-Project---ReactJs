import { useContext } from 'react';
import { AdminContext } from '../AdminContext';

export const useAdminGlobalContext = () => {
  const context = useContext(AdminContext);
  if (!context) {
    throw new Error('useAdminGlobalContext must be used within an AdminProvider');
  }
  return context;
};