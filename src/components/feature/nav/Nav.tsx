// 상단 네비게이션과 설정/줌 힌트 툴팁
import { useEffect, useState, useRef, type CSSProperties, type ReactNode } from 'react';
import { createPortal } from 'react-dom';
import { useTranslation } from 'react-i18next';
import styles from './nav.module.css';
import { useA11y } from '@hooks/useA11y';
import { IconButton } from '@components/interactive/icon/IconButton';
import { SettingsButton } from '@components/feature/SettingsButton';
import { NavButton } from '@components/composed/nav/NavButton';
import { useZoomHintStore } from '@stores/zoomHintStore';
import '../../../i18n';

export function Nav(): ReactNode {
  const { t } = useTranslation();
  const a11y = useA11y();
  const [tooltipPosition, setTooltipPosition] = useState<{ top: number; right: number } | null>(null);
  const settingsBtnRef = useRef<HTMLButtonElement | HTMLAnchorElement>(null);
  const zoomHintVisible = useZoomHintStore((s) => s.visible);
  const dismissZoomHint = useZoomHintStore((s) => s.dismissZoomHint);

  useEffect(() => {
    if (!zoomHintVisible || !settingsBtnRef.current) {
      setTooltipPosition(null);
      return undefined;
    }
    const update = () => {
      const rect = settingsBtnRef.current!.getBoundingClientRect();
      setTooltipPosition({
        top: rect.bottom,
        right: window.innerWidth - rect.right,
      });
    };
    update();
    window.addEventListener('scroll', update, true);
    window.addEventListener('resize', update);
    return () => {
      window.removeEventListener('scroll', update, true);
      window.removeEventListener('resize', update);
    };
  }, [zoomHintVisible]);

  const tooltipStyle = tooltipPosition
    ? ({
        '--nav-tooltip-top': `${tooltipPosition.top}px`,
        '--nav-tooltip-right': `${tooltipPosition.right}px`,
      } as CSSProperties)
    : undefined;

  const zoomTooltipEl = zoomHintVisible && tooltipPosition && (
    <div
      className={styles.zoomSettingsTooltip}
      style={tooltipStyle}
      role="status"
      aria-live="polite"
    >
      <span className={styles.zoomSettingsTooltipArrow} aria-hidden="true" />
      <span className={styles.zoomSettingsTooltipText}>{t('zoom.tooltipMessage')}</span>
      <IconButton.Primary
        name="close"
        size="small"
        onClick={dismissZoomHint}
        ariaLabel={a11y('nav.zoomDismiss')}
      />
    </div>
  );

  return (
    <nav className={styles.navbar}>
      <div className={styles.navbarInner}>
        <ul className={styles.navLinks}>
          <li>
            <NavButton href="#education" ariaLabel={t('nav.education')}>
              {t('nav.education')}
            </NavButton>
          </li>
          <li>
            <NavButton href="#experience" ariaLabel={t('nav.experience')}>
              {t('nav.experience')}
            </NavButton>
          </li>
          <li>
            <NavButton href="#skills" ariaLabel={t('nav.skills')}>
              {t('nav.skills')}
            </NavButton>
          </li>
          <li className={styles.navItemPano}>
            <NavButton href="#main" ariaLabel={a11y('nav.toMain')} iconName="pano" />
          </li>
          <li>
            <NavButton href="#project" ariaLabel={t('nav.project')}>
              {t('nav.project')}
            </NavButton>
          </li>
          <li>
            <NavButton href="#docs" ariaLabel={t('nav.docs')}>
              {t('nav.docs')}
            </NavButton>
          </li>
          <li>
            <NavButton href="#contact" ariaLabel={t('nav.contact')}>
              {t('nav.contact')}
            </NavButton>
          </li>
        </ul>
        <div className={styles.settingsWrap}>
          <SettingsButton ref={settingsBtnRef} />
        </div>
      </div>
      {zoomTooltipEl && createPortal(zoomTooltipEl, document.body)}
    </nav>
  );
}
