/// <reference types="vite/client" />

interface ImportMetaEnv {
    readonly VITE_GOOGLE_TAG_ENABLED: string;
    readonly VITE_GOOGLE_TAG_ID: string;
    readonly VITE_MAPS_API_KEY: string;
    readonly VITE_GEO_MAP_ID: string;
}

interface ImportMeta {
    readonly env: ImportMetaEnv;
}

declare module '*.pcss';
