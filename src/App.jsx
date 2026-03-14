import React, { useEffect } from 'react';
import { Nav } from '@components/layout/Nav';
import { Main } from '@sections/Main';
import { Education } from '@sections/Education';
import { Experience } from '@sections/Experience';
import { Skills } from '@sections/Skills';
import { Projects } from '@sections/Projects';
import { Docs } from '@sections/Docs';
import { Contact } from '@sections/Contact';
import { CardCursor } from '@components/CardCursor';
import { useConfigStore } from './stores/configStore';
import config from './config.js';
import { useTranslation } from 'react-i18next';
import { useBreakpoint } from './hooks/useBreakpoint';
import { useZoomDetection } from './hooks/useZoomDetection';

const NARROW_MAX_WIDTH = 768;

function App() {
  const { theme, language, typographyScale, speedScale } = useConfigStore();
  const { i18n } = useTranslation();
  const { type: breakpointType } = useBreakpoint();
  useZoomDetection();
  const [narrow, setNarrow] = React.useState(typeof window !== 'undefined' ? window.innerWidth <= NARROW_MAX_WIDTH : false);
  React.useEffect(() => {
    const m = window.matchMedia(`(max-width: ${NARROW_MAX_WIDTH}px)`);
    const update = () => setNarrow(m.matches);
    update();
    m.addEventListener('change', update);
    return () => m.removeEventListener('change', update);
  }, []);

  useEffect(() => {
    if ('scrollRestoration' in history) history.scrollRestoration = 'manual';
    window.scrollTo(0, 0);
  }, []);

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme || config.theme.initial);
  }, [theme]);

  useEffect(() => {
    const scale = typeof typographyScale === 'number' && typographyScale >= 0.5 && typographyScale <= 1.5
      ? typographyScale
      : config.typography.scale;
    document.documentElement.style.setProperty('--font-scale', String(scale));
  }, [typographyScale]);

  useEffect(() => {
    document.documentElement.style.setProperty('--speed-scale', String(speedScale ?? 1));
  }, [speedScale]);

  useEffect(() => {
    if (language) i18n.changeLanguage(language);
  }, [language, i18n]);

  useEffect(() => {
    document.body.setAttribute('data-breakpoint', breakpointType);
    document.body.setAttribute('data-narrow', narrow ? 'true' : 'false');
  }, [breakpointType, narrow]);

  return (
    <div className="columnContainer">
      <CardCursor />
      <Nav/>

      <div className="section" id="main"><Main/></div>
      <div className="section" id="education"><Education/></div>
      <div className="section" id="experience"><Experience/></div>
      <div className="section" id="skills"><Skills/></div>
      <div className="section" id="project"><Projects/></div>
      <div className="section" id="docs"><Docs/></div>
      <div className="section" id="contact"><Contact/></div>

      <span className="versionLabel" aria-hidden="true">
        v{config.version?.number ?? '1.0.0'} - {config.version?.buildDate ?? '20260314'}
      </span>
    </div>
  );
}

export default App;