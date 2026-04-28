/** @typedef {{ domId: string, relPath: string, getProps?: (ctx: { narrow: boolean, educationFadeInTriggered: boolean }) => Record<string, unknown> }} SectionSpec */

/** @type {SectionSpec[]} */
export const DEFAULT_SECTION_SPECS = [
  { domId: 'main', relPath: 'Main.jsx' },
  {
    domId: 'education',
    relPath: 'Education.jsx',
    getProps: ({ narrow, educationFadeInTriggered }) => ({
      narrow,
      shouldFadeIn: educationFadeInTriggered,
    }),
  },
  { domId: 'experience', relPath: 'Experience.jsx' },
  { domId: 'skills', relPath: 'Skills.jsx' },
  { domId: 'project', relPath: 'Projects.jsx' },
  { domId: 'docs', relPath: 'Docs.jsx' },
  { domId: 'contact', relPath: 'Contact.jsx' },
];
