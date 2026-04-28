const commonSections = import.meta.glob('../common/sections/**/*.jsx');
const versionSections = import.meta.glob('../versions/*/sections/**/*.jsx');

function pickExport(relPath, mod) {
  if (mod.default) return mod.default;
  const base = relPath.replace(/\.jsx$/i, '').split('/').pop();
  const Comp = mod[base];
  if (!Comp) {
    throw new Error(`Section ${relPath}: expected default or named export "${base}"`);
  }
  return Comp;
}

/**
 * @param {string} relPath path under sections/, e.g. "Main.jsx" or "experience/ExperienceCard.jsx"
 * @param {string} versionHash
 * @returns {Promise<{ default: import('react').ComponentType<any> }>}
 */
export async function loadSectionModule(relPath, versionHash) {
  const vKey = `../versions/${versionHash}/sections/${relPath}`;
  if (versionHash && versionSections[vKey]) {
    const mod = await versionSections[vKey]();
    return { default: pickExport(relPath, mod) };
  }
  const cKey = `../common/sections/${relPath}`;
  if (!commonSections[cKey]) {
    throw new Error(`Missing common section: ${relPath} (key ${cKey})`);
  }
  const mod = await commonSections[cKey]();
  return { default: pickExport(relPath, mod) };
}
