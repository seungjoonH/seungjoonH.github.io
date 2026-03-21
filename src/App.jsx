import { Nav } from '@components/layout/Nav';
import { Main } from '@sections/Main';
import { Education } from '@sections/Education';
import { Experience } from '@sections/Experience';
import { Skills } from '@sections/Skills';
import { Projects } from '@sections/Projects';
import { Docs } from '@sections/Docs';
import { Contact } from '@sections/Contact';
import { CardCursor } from '@components/CardCursor';
import { useApp } from './hooks/useApp';
import config from './config.js';

function App() {
  const { narrow, educationFadeInTriggered, configStyleProps } = useApp();

  return (
    <div className="columnContainer">
      <style dangerouslySetInnerHTML={configStyleProps} />
      <CardCursor />
      <Nav />
      <div className="section" id="main"><Main /></div>
      <div className="section" id="education"><Education narrow={narrow} shouldFadeIn={educationFadeInTriggered} /></div>
      <div className="section" id="experience"><Experience /></div>
      <div className="section" id="skills"><Skills /></div>
      <div className="section" id="project"><Projects /></div>
      <div className="section" id="docs"><Docs /></div>
      <div className="section" id="contact"><Contact /></div>
      <span className="versionLabel" aria-hidden="true">
        v{config.version?.number} - {config.version?.buildDate}
      </span>
    </div>
  );
}

export default App;
