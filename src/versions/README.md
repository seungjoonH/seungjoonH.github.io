# Site versions (`/:versionHash`)

Allowed hashes and the default redirect target live in [`src/config.js`](../config.js) under `siteVersions` (`defaultHash`, `hashes`). Only keys with `hashes[id] === true` can be opened; anything else (including `hashes[id] === false`) redirects to `defaultHash`.

### Current hashes (examples)

| Hash | Role |
|------|------|
| `k9nq7wx` | Default (`/` → here). Custom `main.introduction` + 물방울톡 `projects.js` under `versions/k9nq7wx/data/{ko,en}/`. |
| `v3m8rj2` | Legacy “common-only” portfolio (same content as the old single-site default). Folder has no `data/` overrides. |
| `vmain` | **Disabled** in config — visiting `/vmain` redirects to `defaultHash` like any unknown slug. |

## Optional layout per version

- `src/versions/<hash>/App.jsx` — optional root for that version. If omitted, [`src/common/App.jsx`](../common/App.jsx) is used.
- A custom `App.jsx` should render [`CommonApp`](../common/App.jsx) from `../common/App.jsx` and may pass a custom `sectionSpecs` array (copy from `DEFAULT_SECTION_SPECS` in [`common/sectionSpecs.js`](../common/sectionSpecs.js), then reorder or filter) to change section order or hide sections. Keep `domId` values aligned with [`Nav`](../components/layout/Nav.jsx) scroll targets (`main`, `education`, `experience`, `skills`, `project`, `docs`, `contact`).

## Optional sections

- `src/versions/<hash>/sections/**` mirrors `src/common/sections/**`. If a file exists here, it replaces the common file for that path (e.g. `sections/Main.jsx`, `sections/experience/ExperienceCard.jsx`).
- **Note:** Overriding a nested file (e.g. only `experience/ExperienceCard.jsx`) while keeping the parent `Experience.jsx` from common will not switch imports inside the common parent. To override nested UI, also provide the parent section file under this version tree (or re-export from common and swap children).

## Optional data (per locale)

- `src/versions/<hash>/data/ko/*.js` and `src/versions/<hash>/data/en/*.js` use the **same filenames** as `src/data/ko` / `src/data/en` (e.g. `projects.js`, `translations.js`, `experiences.js`, `educations.js`, `docs.js`). Optional `accessabilities.json` per locale is supported.
- If a version file is **missing** for a locale, the app falls back to the common `src/data/<lang>/` file for that name.

## Optional intro link map (per version, not per locale)

- `src/versions/<hash>/data/introLinks.js` — default export is a **partial** object merged over [`common/sections/main/introLinksConfig.js`](../common/sections/main/introLinksConfig.js). Use it to override or add `@(linkId)[label]` targets for that hash only.
- Row fields: `query` (project search), `targetId` (scroll to section id), `docId` (scroll to **Docs**, open the folder that contains that doc id, scroll the row into view), `labelKey` / optional `label`, optional `icon`.
