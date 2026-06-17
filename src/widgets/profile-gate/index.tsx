/** Wraps the /profile route and renders a coming-soon page when the
 *  admin has toggled the page-level "coming soon" flag. Mirrors
 *  MaintenanceGate but reads the profile-page entity instead. */

import { ReactNode } from 'react';
import { useProfilePage } from '../../entities/profile-page/hooks';
import { ComingSoonPage } from './ui/ComingSoonPage';

interface ProfileGateProps {
  children: ReactNode;
}

export const ProfileGate = ({ children }: ProfileGateProps) => {
  const { data, loading } = useProfilePage();

  // First-paint loading: render children to avoid flashing the coming-soon page
  // while Firestore is still being read.
  if (loading) return <>{children}</>;

  if (data.comingSoon.enabled) {
    return <ComingSoonPage profile={data} />;
  }

  return <>{children}</>;
};
