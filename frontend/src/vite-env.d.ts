/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_API_URL?: string;
  readonly VITE_MAPLIBRE_STYLE?: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
