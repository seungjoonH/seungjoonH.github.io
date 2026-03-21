import { useEffect, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import { useA11y } from '../hooks/useA11y';
import { useConfigStore } from '../stores/configStore';
import { useProjectSearchStore } from '../stores/projectSearchStore';
import { translateProjectSearchQuery } from '../sections/projects/search/translateQuery';
import styles from './settingsPopup.module.css';
import { useFocusTrap } from '../hooks/useFocusTrap';
import { SegmentedButton } from './shared/SegmentedButton';
import { Icon } from './shared/icon/Icon';

export function SettingsPopup({ onClose, returnFocusRef }) {
  const { t } = useTranslation();
  const a11y = useA11y();
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
  const rawQuery = useProjectSearchStore((s) => s.rawQuery);
  const setQuery = useProjectSearchStore((s) => s.setQuery);

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

  const speedMin = 0.5;
  const speedMax = 1.5;
  const fontMin = 0.5;
  const fontMax = 1.5;

  return (
    <div
      className={styles.overlay}
      onClick={(e) => e.target === e.currentTarget && handleClose()}
      role="dialog"
      aria-modal="true"
      aria-labelledby="settings-title"
      aria-label={a11y('settings.dialog')}
    >
      <div ref={panelRef} className={styles.panel} onClick={(e) => e.stopPropagation()}>
        <button
          type="button"
          className={styles.closeBtn}
          onClick={handleClose}
          aria-label={a11y('settings.close')}
        >
          <Icon name="close" aria-hidden="true" />
        </button>
        <h2 id="settings-title" className={styles.title}>
          {t('settings.title')}
        </h2>

        <div className={styles.panelBody}>
        <div className={styles.section}>
          <label id="settings-speed-label">{t('settings.speed')}</label>
          <div className={styles.sliderWrap} role="group" aria-labelledby="settings-speed-label">
            <button
              type="button"
              onClick={() => setSpeedScale(Math.max(speedMin, speedScale - 0.25))}
              aria-label={a11y('settings.speedDecrease')}
              disabled={speedScale <= speedMin}
            >
              <span aria-hidden="true">−</span>
            </button>
            <input
              type="range"
              min={speedMin}
              max={speedMax}
              step={0.25}
              value={speedScale}
              onChange={(e) => setSpeedScale(Number(e.target.value))}
              aria-label={a11y('settings.speedSlider', { min: speedMin, max: speedMax, value: speedScale })}
              aria-valuemin={speedMin}
              aria-valuemax={speedMax}
              aria-valuenow={speedScale}
              aria-valuetext={a11y('settings.speedValue', { value: speedScale })}
            />
            <button
              type="button"
              onClick={() => setSpeedScale(Math.min(speedMax, speedScale + 0.25))}
              aria-label={a11y('settings.speedIncrease')}
              disabled={speedScale >= speedMax}
            >
              <span aria-hidden="true">+</span>
            </button>
          </div>
          <span className={styles.sliderValue} aria-hidden="true">{speedScale}x</span>
        </div>

        <div className={styles.section}>
          <label id="settings-font-label">{t('settings.fontSize')}</label>
          <div className={styles.sliderWrap} role="group" aria-labelledby="settings-font-label">
            <button
              type="button"
              onClick={() => setTypographyScale(Math.max(fontMin, typographyScale - 0.25))}
              aria-label={a11y('settings.fontDecrease')}
              disabled={typographyScale <= fontMin}
            >
              <span aria-hidden="true">−</span>
            </button>
            <input
              type="range"
              min={fontMin}
              max={fontMax}
              step={0.25}
              value={typographyScale}
              onChange={(e) => setTypographyScale(Number(e.target.value))}
              aria-label={a11y('settings.fontSlider', { min: fontMin, max: fontMax, value: typographyScale })}
              aria-valuemin={fontMin}
              aria-valuemax={fontMax}
              aria-valuenow={typographyScale}
              aria-valuetext={a11y('settings.fontValue', { value: typographyScale })}
            />
            <button
              type="button"
              onClick={() => setTypographyScale(Math.min(fontMax, typographyScale + 0.25))}
              aria-label={a11y('settings.fontIncrease')}
              disabled={typographyScale >= fontMax}
            >
              <span aria-hidden="true">+</span>
            </button>
          </div>
          <span className={styles.sliderValue} aria-hidden="true">{typographyScale}x</span>
        </div>

        <div className={styles.section}>
          <label>{t('settings.language')}</label>
          <SegmentedButton
            options={[
              { value: 'ko', label: '한국어', ariaLabel: a11y('settings.langKo') },
              { value: 'en', label: 'English', ariaLabel: a11y('settings.langEn') },
            ]}
            value={language}
            onChange={(newLang) => {
              if (rawQuery && newLang !== language) {
                const translated = translateProjectSearchQuery(rawQuery, language, newLang);
                setQuery(translated);
              }
              setLanguage(newLang);
            }}
            ariaLabel={a11y('settings.languageGroup')}
          />
        </div>

        <div className={styles.section}>
          <label>{t('settings.theme')}</label>
          <button
            type="button"
            className={styles.themeToggleBtn}
            onClick={() => setTheme(theme === 'light' ? 'dark' : 'light')}
            aria-label={theme === 'light' ? a11y('settings.themeToDark') : a11y('settings.themeToLight')}
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
