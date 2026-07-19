// configStore 언어 전환 Feature — SegmentedButton + 검색어 번역
import type { ReactNode } from 'react';
import { useA11y } from '@hooks/useA11y';
import { useConfigStore } from '@stores/configStore';
import { useProjectSearchStore } from '@stores/projectSearchStore';
import { translateProjectSearchQuery } from '@sections/projects/search/translateQuery';
import { DATA_FILE, loadData, useVersion } from '@versioning';
import { SegmentedButton } from '@components/interactive/segmentedButton/SegmentedButton';
import type { LayoutWidthProps } from '@components/design/designTokens';

export function LanguageSegmentedButton({ width = 'stretch' }: LayoutWidthProps): ReactNode {
  const a11y = useA11y();
  const { hash } = useVersion();
  const language = useConfigStore((s) => s.language);
  const setLanguage = useConfigStore((s) => s.setLanguage);
  const rawQuery = useProjectSearchStore((s) => s.rawQuery);
  const setQuery = useProjectSearchStore((s) => s.setQuery);

  const handleLanguageChange = async (newLang: string) => {
    if (rawQuery && newLang !== language) {
      const [en, ko] = await Promise.all([
        loadData({ hash, lang: 'en', file: DATA_FILE.projects }),
        loadData({ hash, lang: 'ko', file: DATA_FILE.projects }),
      ]);
      const translated = translateProjectSearchQuery(rawQuery, language, newLang, {
        en: en as unknown[],
        ko: ko as unknown[],
      });
      setQuery(translated);
    }
    setLanguage(newLang);
  };

  return (
    <SegmentedButton
      options={[
        { value: 'ko', label: '한국어', ariaLabel: a11y('settings.langKo') },
        { value: 'en', label: 'English', ariaLabel: a11y('settings.langEn') },
      ]}
      value={language}
      onChange={handleLanguageChange}
      ariaLabel={a11y('settings.languageGroup')}
      width={width}
    />
  );
}
