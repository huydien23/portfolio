/** Wraps the public site and swaps in the maintenance page when active.
 *  Bypassed for `/admin` routes so the admin can always reach the dashboard. */

import { ReactNode } from 'react';
import { useLocation } from 'react-router-dom';
import { useMaintenance } from '../../entities/maintenance/hooks';
import { MaintenancePage } from './ui/MaintenancePage';

interface MaintenanceGateProps {
  children: ReactNode;
}

export const MaintenanceGate = ({ children }: MaintenanceGateProps) => {
  const { isActive, profile, loading } = useMaintenance();
  const location = useLocation();

  if (location.pathname.startsWith('/admin')) {
    return <>{children}</>;
  }

  // First-paint loading: render children to avoid flashing a blank screen.
  if (loading) {
    return <>{children}</>;
  }

  if (isActive) {
    return <MaintenancePage profile={profile} />;
  }

  return <>{children}</>;
};
