// configStore 테마 토글 Feature — ToggleIconButton 바인딩
import { forwardRef, type ReactNode } from 'react';
import { useA11y } from '@hooks/useA11y';
import { useConfigStore } from '@stores/configStore';
import { ToggleIconButton } from '@components/interactive/icon/ToggleIconButton';
import { buildCls } from '@utils/cssUtil';
import styles from './themeToggleButton.module.css';

const THEME_ICON = { light: 'sun', dark: 'moon' } as const;
const THEME_LABEL_KEY = { light: 'settings.themeToDark', dark: 'settings.themeToLight' } as const;

export const ThemeToggleButton = forwardRef<HTMLButtonElement | HTMLAnchorElement>(
  function ThemeToggleButton(_props, ref): ReactNode {
    const a11y = useA11y();
    const theme = useConfigStore((s) => s.theme);
    const isDark = useConfigStore((s) => s.isDark);
    const toggleTheme = useConfigStore((s) => s.toggleTheme);

    return (
      <span className={buildCls(styles.root, isDark ? styles.dark : styles.light)}>
        <ToggleIconButton
          ref={ref}
          name={THEME_ICON[theme]}
          pressed={isDark}
          offVariant="primary"
          onVariant="primary"
          size="large"
          shape="rounded"
          onClick={toggleTheme}
          ariaLabel={a11y(THEME_LABEL_KEY[theme])}
        />
      </span>
    );
  }
);
