import { useEffect, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import { useConfigStore } from '../stores/configStore';
import styles from './settingsPopup.module.css';
import { useFocusTrap } from '../hooks/useFocusTrap';
import { SegmentedButton } from './shared/SegmentedButton';
import { Icon } from './shared/icon/Icon';

const LANGUAGE_OPTIONS = [
  { value: 'ko', label: '한국어' },
  { value: 'en', label: 'English' },
];

export function SettingsPopup({ onClose, returnFocusRef }) {
  const { t } = useTranslation();
  const panelRef = useRef(null);
  const {
    theme,
    language,
    typographyScale,
    speedScale,
    setTheme,
    setLanguage,
    setTypographyScale,
    setSpeedScale,
  } = useConfigStore();

  useFocusTrap(panelRef, true);

  useEffect(() => {
    const handleEscape = (e) => {
      if (e.key === 'Escape') {
        returnFocusRef?.current?.focus?.();
        onClose();
      }
    };
    window.addEventListener('keydown', handleEscape);
    return () => window.removeEventListener('keydown', handleEscape);
  }, [onClose, returnFocusRef]);

  const handleClose = () => {
    returnFocusRef?.current?.focus?.();
    onClose();
  };

  return (
    <div
      className={styles.overlay}
      onClick={(e) => e.target === e.currentTarget && handleClose()}
      role="dialog"
      aria-modal="true"
      aria-labelledby="settings-title"
    >
      <div ref={panelRef} className={styles.panel} onClick={(e) => e.stopPropagation()}>
        <button
          type="button"
          className={styles.closeBtn}
          onClick={handleClose}
          aria-label={t('settings.close') || '닫기'}
        >
          <Icon name="close" aria-hidden="true" />
        </button>
        <h2 id="settings-title" className={styles.title}>
          {t('settings.title') || '설정'}
        </h2>

        <div className={styles.panelBody}>
        <div className={styles.section}>
          <label>{t('settings.speed') || '전체 속도'}</label>
          <div className={styles.sliderWrap}>
            <button type="button" onClick={() => setSpeedScale(Math.max(0.5, speedScale - 0.5))}>−</button>
            <input
              type="range"
              min={0.5}
              max={1.5}
              step={0.5}
              value={speedScale}
              onChange={(e) => setSpeedScale(Number(e.target.value))}
              aria-label={t('settings.speed')}
            />
            <button type="button" onClick={() => setSpeedScale(Math.min(1.5, speedScale + 0.5))}>+</button>
          </div>
          <span className={styles.sliderValue}>{speedScale}x</span>
        </div>

        <div className={styles.section}>
          <label>{t('settings.fontSize') || '글자 크기'}</label>
          <div className={styles.sliderWrap}>
            <button type="button" onClick={() => setTypographyScale(Math.max(0.5, typographyScale - 0.25))}>−</button>
            <input
              type="range"
              min={0.5}
              max={1.5}
              step={0.25}
              value={typographyScale}
              onChange={(e) => setTypographyScale(Number(e.target.value))}
              aria-label={t('settings.fontSize')}
            />
            <button type="button" onClick={() => setTypographyScale(Math.min(1.5, typographyScale + 0.25))}>+</button>
          </div>
          <span className={styles.sliderValue}>{typographyScale}x</span>
        </div>

        <div className={styles.section}>
          <label>{t('settings.language') || '언어'}</label>
          <SegmentedButton
            options={LANGUAGE_OPTIONS}
            value={language}
            onChange={setLanguage}
            ariaLabel={t('settings.language')}
          />
        </div>

        <div className={styles.section}>
          <label>{t('settings.theme') || '테마'}</label>
          <button
            type="button"
            className={styles.themeToggleBtn}
            onClick={() => setTheme(theme === 'light' ? 'dark' : 'light')}
            aria-label={theme === 'light' ? (t('settings.dark') || '다크 모드로 전환') : (t('settings.light') || '라이트 모드로 전환')}
            aria-pressed={theme === 'dark'}
          >
            <Icon name={theme === 'light' ? 'sun' : 'moon'} aria-hidden="true" />
          </button>
        </div>
        </div>
      </div>
    </div>
  );
}

export default SettingsPopup;
