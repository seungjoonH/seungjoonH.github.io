/// <reference types="vite/client" />
/// <reference types="vite-plugin-svgr/client" />
/// <reference types="vitest/globals" />

interface ImportMetaEnv {
  readonly VITE_ANALYTICS_API_URL?: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
