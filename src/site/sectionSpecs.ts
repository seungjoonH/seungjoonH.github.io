// 메인 앱 섹션 domId·경로·props 팩토리 정의
import type { ComponentType } from 'react';

export interface SectionSpecContext {
  narrow: boolean;
  educationFadeInTriggered: boolean;
}

export interface SectionSpec {
  domId: string;
  relPath: string;
  getProps?: (ctx: SectionSpecContext) => Record<string, unknown>;
}

export const DEFAULT_SECTION_SPECS: SectionSpec[] = [
  { domId: 'main', relPath: 'Main.tsx' },
  {
    domId: 'education',
    relPath: 'Education.tsx',
    getProps: ({ narrow, educationFadeInTriggered }) => ({
      narrow,
      shouldFadeIn: educationFadeInTriggered,
    }),
  },
  { domId: 'experience', relPath: 'Experience.tsx' },
  { domId: 'skills', relPath: 'Skills.tsx' },
  { domId: 'project', relPath: 'Projects.tsx' },
  { domId: 'docs', relPath: 'Docs.tsx' },
  { domId: 'contact', relPath: 'Contact.tsx' },
];

export type SectionComponent = ComponentType<Record<string, unknown>>;
