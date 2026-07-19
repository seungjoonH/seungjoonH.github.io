// Vite import.meta.glob 맵 (패턴 리터럴은 이 파일에만 둔다)
import type { ComponentType } from 'react';
import type { IntroLinkDefinition } from '../site/sections/main/introLinksConfig';

type DefaultModule<T> = { default: T };

export type SectionModule = DefaultModule<ComponentType<Record<string, unknown>>>;
type IntroLinksModule = DefaultModule<Record<string, IntroLinkDefinition>>;
type DataModule = DefaultModule<unknown>;
type AppModule = DefaultModule<ComponentType>;

export const siteSections = import.meta.glob<SectionModule>('../site/sections/**/*.tsx');
export const versionSections = import.meta.glob<SectionModule>(
  '../versions/*/sections/**/*.tsx'
);

export const versionDataModules = import.meta.glob<DataModule>('../versions/*/data/**/*.ts');
export const commonDataModules = import.meta.glob<DataModule>('../data/**/*.ts');

export const versionIntroLinks = import.meta.glob<IntroLinksModule>(
  '../versions/*/data/introLinks.ts'
);

export const versionApps = import.meta.glob<AppModule>('../versions/*/App.tsx');
