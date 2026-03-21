import { useState, useRef, useEffect } from 'react';
import { Link } from 'react-scroll';
import { createPortal } from 'react-dom';
import styles from './nav.module.css';
import { buildCls } from '../../utils/cssUtil';
import { useTranslation } from 'react-i18next';
import { useA11y } from '../../hooks/useA11y';
import { Icon } from '../shared/icon/Icon';
import { SettingsPopup } from '../SettingsPopup';
import { useConfigStore } from '../../stores/configStore';
import { useZoomHintStore } from '../../stores/zoomHintStore';
import { markZoomHintShownThisSession } from '../../utils/zoomDetection';
import '../../i18n';

const SCROLL_DURATION_BASE_MS = 2000;

function useTooltipPosition(anchorRef, visible) {
  const [position, setPosition] = useState(null);
  useEffect(() => {
    if (!visible || !anchorRef.current) return;
    const update = () => {
      if (!anchorRef.current) return;
      const rect = anchorRef.current.getBoundingClientRect();
      setPosition({ top: rect.bottom + 8, right: window.innerWidth - rect.right });
    };
    update();
    window.addEventListener('scroll', update, true);
    window.addEventListener('resize', update);
    return () => {
      window.removeEventListener('scroll', update, true);
      window.removeEventListener('resize', update);
    };
  }, [visible, anchorRef]);
  return position;
}

export function Nav() {
  const speedScale = useConfigStore((s) => s.speedScale ?? 1);
  const duration = Math.round(SCROLL_DURATION_BASE_MS / speedScale);
  const { t } = useTranslation();
  const a11y = useA11y();
  const [settingsOpen, setSettingsOpen] = useState(false);
  const settingsBtnRef = useRef(null);
  const zoomHintVisible = useZoomHintStore((s) => s.visible);
  const dismissZoomHint = useZoomHintStore((s) => s.dismissZoomHint);
  const tooltipPosition = useTooltipPosition(settingsBtnRef, zoomHintVisible);

  useEffect(() => {
    if (zoomHintVisible) markZoomHintShownThisSession();
  }, [zoomHintVisible]);

  const zoomTooltipEl = zoomHintVisible && tooltipPosition && (
    <div
      className={styles.zoomSettingsTooltip}
      role="status"
      aria-live="polite"
      style={{ top: tooltipPosition.top, right: tooltipPosition.right }}
    >
      <span className={styles.zoomSettingsTooltipArrow} aria-hidden="true" />
      <span className={styles.zoomSettingsTooltipText}>
        {t('zoom.tooltipMessage')}
      </span>
      <button
        type="button"
        className={styles.zoomSettingsTooltipClose}
        onClick={dismissZoomHint}
        aria-label={a11y('nav.zoomDismiss')}
      >
        <Icon name="close" aria-hidden="true" />
      </button>
    </div>
  );

  return (
    <nav className={buildCls(styles.navbar)}>
      <div className={styles.navbarInner}>
        <ul className={styles.navLinks}>
          <li>
            <Link to="education" smooth={true} duration={duration}>
              {t('nav.education')}
            </Link>
          </li>
          <li>
            <Link to="experience" smooth={true} duration={duration}>
              {t('nav.experience')}
            </Link>
          </li>
          <li>
            <Link to="skills" smooth={true} duration={duration}>
              {t('nav.skills')}
            </Link>
          </li>
          <li className={styles.navItemPano}>
            <Link to="main" smooth={true} duration={duration}>
              <Icon name="pano" className={styles.mainImg} aria-hidden="true" />
            </Link>
          </li>
          <li>
            <Link to="project" smooth={true} duration={duration}>
              {t('nav.project')}
            </Link>
          </li>
          <li>
            <Link to="docs" smooth={true} duration={duration}>
              {t('nav.docs')}
            </Link>
          </li>
          <li>
            <Link to="contact" smooth={true} duration={duration}>
              {t('nav.contact')}
            </Link>
          </li>
        </ul>
        <div className={styles.settingsWrap}>
          <button
            ref={settingsBtnRef}
            type="button"
            className={styles.settingsBtn}
            onClick={() => setSettingsOpen(true)}
            aria-label={a11y('nav.settingsOpen')}
            title={t('settings.open') || '설정'}
          >
            <Icon name="settings" aria-hidden="true" />
          </button>
        </div>
      </div>
      {settingsOpen && createPortal(
        <SettingsPopup onClose={() => setSettingsOpen(false)} returnFocusRef={settingsBtnRef} />,
        document.body
      )}
      {zoomTooltipEl && createPortal(zoomTooltipEl, document.body)}
    </nav>
  );
}
