const versionDataJs = import.meta.glob('../versions/*/data/**/*.js');
const commonDataJs = import.meta.glob('../data/**/*.js');
const versionDataJson = import.meta.glob('../versions/*/data/**/*.json');
const commonDataJson = import.meta.glob('../data/**/*.json');

/**
 * Load one data file for a locale. Version path wins when present; otherwise common `src/data`.
 * @param {{ versionHash: string, lang: string, fileName: string }} opts fileName e.g. "projects.js" or "accessabilities.json"
 */
export async function loadDataFile({ versionHash, lang, fileName }) {
  if (versionHash) {
    const vKeyJs = `../versions/${versionHash}/data/${lang}/${fileName}`;
    if (versionDataJs[vKeyJs]) {
      const mod = await versionDataJs[vKeyJs]();
      return mod.default;
    }
    if (fileName.endsWith('.json')) {
      const vKeyJson = `../versions/${versionHash}/data/${lang}/${fileName}`;
      if (versionDataJson[vKeyJson]) {
        const mod = await versionDataJson[vKeyJson]();
        return mod.default;
      }
    }
  }

  const cKeyJs = `../data/${lang}/${fileName}`;
  if (commonDataJs[cKeyJs]) {
    const mod = await commonDataJs[cKeyJs]();
    return mod.default;
  }
  if (fileName.endsWith('.json')) {
    const cKeyJson = `../data/${lang}/${fileName}`;
    if (commonDataJson[cKeyJson]) {
      const mod = await commonDataJson[cKeyJson]();
      return mod.default;
    }
  }

  throw new Error(`Missing data file: ${lang}/${fileName}`);
}
