import { HeroSection } from "../../widgets/hero";
import { SkillsStack } from "../../widgets/skills-stack";
import { ProjectsBoard } from "../../widgets/projects-board";
import { ContactFooter } from "../../widgets/contact-footer";

const SectionDivider = () => (
  <div className="h-px w-full bg-gradient-to-r from-transparent via-slate-200 to-transparent" />
);

export const HomePage = () => {
  return (
    <main className="w-full bg-slate-50 min-h-screen">
       <HeroSection />
       <SectionDivider />
       <SkillsStack />
       <SectionDivider />
       <ProjectsBoard />
       <ContactFooter />
    </main>
  );
};
