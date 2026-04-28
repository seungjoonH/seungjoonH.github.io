import { INTRO_LINK_DEFINITIONS } from '../common/sections/main/introLinksConfig.js';

const versionIntroLinks = import.meta.glob('../versions/*/data/introLinks.js');

/** @param {string} versionHash */
export async function loadMergedIntroLinks(versionHash) {
  const base = { ...INTRO_LINK_DEFINITIONS };
  if (!versionHash) return base;
  const key = `../versions/${versionHash}/data/introLinks.js`;
  if (!versionIntroLinks[key]) return base;
  const mod = await versionIntroLinks[key]();
  const patch = mod.default && typeof mod.default === 'object' ? mod.default : {};
  return { ...base, ...patch };
}
