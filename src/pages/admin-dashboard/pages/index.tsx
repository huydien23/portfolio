/**
 * Route-level page wrappers. Each page is a thin shell that pulls data from a
 * hook and forwards it to its section component. The editor route lives in
 * its own folder because it needs per-record fetching.
 */

import { useProjects } from '../../../entities/project/hooks';
import { OverviewSection } from '../sections/OverviewSection';
import { ProjectsSection } from '../sections/ProjectsSection';
import { SiteContentSection } from '../sections/SiteContentSection';
import { SkillsSection } from '../sections/SkillsSection';
import { MaintenanceSection } from '../sections/MaintenanceSection';
import { ProfilePageSection } from '../sections/ProfilePageSection';

export const OverviewPage = () => {
  const { projects, loading, source, error, refetch } = useProjects();
  return (
    <OverviewSection
      projects={projects}
      loading={loading}
      source={source}
      error={error}
      onRefresh={refetch}
    />
  );
};

export const ProjectsListPage = () => {
  const { projects, refetch } = useProjects();
  return <ProjectsSection projects={projects} onChanged={refetch} />;
};

export const SiteContentPage = () => {
  const { refetch } = useProjects();
  return <SiteContentSection onChanged={refetch} />;
};

export const SkillsPage = () => {
  const { refetch } = useProjects();
  return <SkillsSection onChanged={refetch} />;
};

export const MaintenanceAdminPage = () => <MaintenanceSection />;

export const ProfilePageAdminPage = () => <ProfilePageSection />;
