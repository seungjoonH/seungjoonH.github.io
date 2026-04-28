import { useCallback, useEffect, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import { useA11y } from '../hooks/useA11y';
import { useConfigStore } from '../stores/configStore';
import { useProjectSearchStore } from '../stores/projectSearchStore';
import { translateProjectSearchQuery } from '@sections/projects/search/translateQuery';
import { useVersionHash } from '../versioning/VersionContext.jsx';
import { loadDataFile } from '../versioning/loadDataModule.js';
import styles from './settingsPopup.module.css';
import { useFocusTrap } from '../hooks/useFocusTrap';
import { SegmentedButton } from './shared/SegmentedButton';
import { Icon } from './shared/icon/Icon';
import { trackEvent } from '../utils/analytics.js';

const SETTINGS_SPEED_MIN = 0.5;
const SETTINGS_SPEED_MAX = 1.5;
const SETTINGS_FONT_MIN = 0.5;
const SETTINGS_FONT_MAX = 1.5;
const SETTINGS_SLIDER_STEP = 0.25;

export function SettingsPopup({ onClose, returnFocusRef }) {
  const { t } = useTranslation();
  const a11y = useA11y();
  const versionHash = useVersionHash();
  const panelRef = useRef(null);
  const titleRef = useRef(null);
  const {
    isLight,
    isDark,
    language,
    typographyScale,
    speedScale,
    toggleTheme,
    setLanguage,
    setTypographyScale,
    setSpeedScale,
  } = useConfigStore();
  const rawQuery = useProjectSearchStore((s) => s.rawQuery);
  const setQuery = useProjectSearchStore((s) => s.setQuery);

  useFocusTrap(panelRef, true, titleRef);

  const handleClose = useCallback(() => {
    returnFocusRef?.current?.focus?.();
    onClose();
  }, [onClose, returnFocusRef]);

  useEffect(() => {
    const handleEscape = (e) => {
      if (e.key === 'Escape') handleClose();
    };
    window.addEventListener('keydown', handleEscape);
    return () => window.removeEventListener('keydown', handleEscape);
  }, [handleClose]);
  useEffect(() => {
    trackEvent({
      event: 'ui:settings_open',
      versionHash,
      locale: language,
      dedupeKey: 'ui:settings_open',
      cooldownMs: 800,
    });
  }, [versionHash, language]);

  return (
    <dialog
      className={styles.overlay}
      open
      onClick={(e) => e.target === e.currentTarget && handleClose()}
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
        <h2 id="settings-title" className={styles.title} ref={titleRef} tabIndex={-1}>
          {t('settings.title')}
        </h2>

        <div className={styles.panelBody}>
        <fieldset className={styles.section}>
          <legend>{t('settings.speed')}</legend>
          <div className={styles.sliderWrap}>
            <button
              type="button"
              onClick={() => setSpeedScale(Math.max(SETTINGS_SPEED_MIN, speedScale - SETTINGS_SLIDER_STEP))}
              aria-label={a11y('settings.speedDecrease')}
              disabled={speedScale <= SETTINGS_SPEED_MIN}
            >
              <span aria-hidden="true">−</span>
            </button>
            <input
              type="range"
              min={SETTINGS_SPEED_MIN}
              max={SETTINGS_SPEED_MAX}
              step={SETTINGS_SLIDER_STEP}
              value={speedScale}
              onChange={(e) => setSpeedScale(Number(e.target.value))}
              aria-label={a11y('settings.speedSlider', { min: SETTINGS_SPEED_MIN, max: SETTINGS_SPEED_MAX, value: speedScale })}
              aria-valuemin={SETTINGS_SPEED_MIN}
              aria-valuemax={SETTINGS_SPEED_MAX}
              aria-valuenow={speedScale}
              aria-valuetext={a11y('settings.speedValue', { value: speedScale })}
            />
            <button
              type="button"
              onClick={() => setSpeedScale(Math.min(SETTINGS_SPEED_MAX, speedScale + SETTINGS_SLIDER_STEP))}
              aria-label={a11y('settings.speedIncrease')}
              disabled={speedScale >= SETTINGS_SPEED_MAX}
            >
              <span aria-hidden="true">+</span>
            </button>
          </div>
          <span className={styles.sliderValue} aria-hidden="true">{speedScale}x</span>
        </fieldset>

        <fieldset className={styles.section}>
          <legend>{t('settings.fontSize')}</legend>
          <div className={styles.sliderWrap}>
            <button
              type="button"
              onClick={() => setTypographyScale(Math.max(SETTINGS_FONT_MIN, typographyScale - SETTINGS_SLIDER_STEP))}
              aria-label={a11y('settings.fontDecrease')}
              disabled={typographyScale <= SETTINGS_FONT_MIN}
            >
              <span aria-hidden="true">−</span>
            </button>
            <input
              type="range"
              min={SETTINGS_FONT_MIN}
              max={SETTINGS_FONT_MAX}
              step={SETTINGS_SLIDER_STEP}
              value={typographyScale}
              onChange={(e) => setTypographyScale(Number(e.target.value))}
              aria-label={a11y('settings.fontSlider', { min: SETTINGS_FONT_MIN, max: SETTINGS_FONT_MAX, value: typographyScale })}
              aria-valuemin={SETTINGS_FONT_MIN}
              aria-valuemax={SETTINGS_FONT_MAX}
              aria-valuenow={typographyScale}
              aria-valuetext={a11y('settings.fontValue', { value: typographyScale })}
            />
            <button
              type="button"
              onClick={() => setTypographyScale(Math.min(SETTINGS_FONT_MAX, typographyScale + SETTINGS_SLIDER_STEP))}
              aria-label={a11y('settings.fontIncrease')}
              disabled={typographyScale >= SETTINGS_FONT_MAX}
            >
              <span aria-hidden="true">+</span>
            </button>
          </div>
          <span className={styles.sliderValue} aria-hidden="true">{typographyScale}x</span>
        </fieldset>

        <div className={styles.section}>
          <label>{t('settings.language')}</label>
          <SegmentedButton
            options={[
              { value: 'ko', label: '한국어', ariaLabel: a11y('settings.langKo') },
              { value: 'en', label: 'English', ariaLabel: a11y('settings.langEn') },
            ]}
            value={language}
            onChange={async (newLang) => {
              if (rawQuery && newLang !== language) {
                const [en, ko] = await Promise.all([
                  loadDataFile({ versionHash, lang: 'en', fileName: 'projects.js' }),
                  loadDataFile({ versionHash, lang: 'ko', fileName: 'projects.js' }),
                ]);
                const translated = translateProjectSearchQuery(rawQuery, language, newLang, { en, ko });
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
            onClick={toggleTheme}
            aria-label={isLight ? a11y('settings.themeToDark') : a11y('settings.themeToLight')}
            aria-pressed={isDark}
          >
            <Icon name={isLight ? 'sun' : 'moon'} aria-hidden="true" />
          </button>
        </div>
        </div>
      </div>
    </dialog>
  );
}

export default SettingsPopup;
