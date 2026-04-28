import { useCallback, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useA11y } from '../../hooks/useA11y';
import { Header } from '@components/layout/Header';
import { Icon } from '@components/shared/icon/Icon';
import { useConfigStore } from '../../stores/configStore';
import config from '../../config.js';
import styles from './contact.module.css';

const CONTACT_FIELDS = Object.freeze({
  email: {
    icon: 'email',
    labelKey: 'email',
    href: (raw) => `mailto:${raw}`,
    display: (raw) => raw,
    copy: (raw) => raw,
  },
  github: {
    icon: 'github',
    labelKey: 'github',
    href: (raw) => (raw.startsWith('http') ? raw : `https://${raw}`),
    display: (raw) => raw.replace(/^https?:\/\/github\.com\/?/i, 'github.com/') || raw,
    copy: (raw) => (raw.startsWith('http') ? raw : `https://github.com/${raw.replace(/^\/+/, '')}`),
  },
  linkedin: {
    icon: 'linkedin',
    labelKey: 'linkedin',
    href: (raw) => (raw.startsWith('http') ? raw : `https://${raw}`),
    display: (raw) => raw.replace(/^https?:\/\/[^/]+/i, 'linkedin.com') || raw,
    copy: (raw) => (raw.startsWith('http') ? raw : `https://${raw}`),
  },
  tel: {
    icon: 'tel',
    labelKey: 'tel',
    href: (raw) => `tel:${raw.replace(/\s/g, '')}`,
    display: (raw, language) => {
      const isKo = language === 'ko' || String(language).startsWith('ko');
      if (isKo) return raw.replace(/^\+82\s*10\s*/, '010 ').trim() || raw;
      return raw.replace(/^010\s*/, '+82 10 ').trim() || raw;
    },
    copy: (raw) => raw,
  },
});
const CONTACT_KEYS = Object.keys(CONTACT_FIELDS);

function decodeContactConfigValue(value) {
  if (typeof value !== 'string') return value;
  if (!/%[0-9A-Fa-f]{2}/.test(value)) return value;
  try { return decodeURIComponent(value); } 
  catch { return value; }
}

function getContactHref(key, value) {
  const raw = decodeContactConfigValue(value);
  if (!raw) return '#';
  const field = CONTACT_FIELDS[key];
  return field?.href ? field.href(raw) : raw;
}

function getDisplayValue(key, value, language) {
  const raw = decodeContactConfigValue(value);
  if (!raw) return raw;
  const field = CONTACT_FIELDS[key];
  return field?.display ? field.display(raw, language) : raw;
}

function getCopyText(key, value) {
  const raw = decodeContactConfigValue(value);
  if (!raw) return '';
  const field = CONTACT_FIELDS[key];
  return field?.copy ? field.copy(raw) : raw;
}

export function Contact() {
  const { t } = useTranslation();
  const a11y = useA11y();
  const language = useConfigStore((s) => s.language) ?? config.language?.initial ?? 'en';
  const contact = config.contact || {};
  const [copiedKeys, setCopiedKeys] = useState({});
  const copyTimeoutsRef = useRef({});

  const handleCopy = useCallback((key, text) => {
    if (!text) return;
    if (copyTimeoutsRef.current[key] != null) {
      clearTimeout(copyTimeoutsRef.current[key]);
      copyTimeoutsRef.current[key] = null;
    }
    navigator.clipboard?.writeText(text).then(() => {
      setCopiedKeys((prev) => ({ ...prev, [key]: true }));
      copyTimeoutsRef.current[key] = setTimeout(() => {
        setCopiedKeys((prev) => {
          const next = { ...prev };
          delete next[key];
          return next;
        });
        copyTimeoutsRef.current[key] = null;
      }, 1500);
    });
  }, []);

  return (
    <div className={styles.contactContainer}>
      <div className={styles.contactContent}>
        <div className={styles.contactHeaderWrap}>
          <div className={styles.contactTitle}>
            <Header text={t('nav.contact')} align="center" />
          </div>
        </div>
        <ul className={styles.cardGrid}>
          {CONTACT_KEYS.map((key) => {
            const value = contact[key];
            const { icon, labelKey } = CONTACT_FIELDS[key];
            const href = getContactHref(key, value);
            const displayValue = getDisplayValue(key, value, language);
            const copyText = getCopyText(key, value);
            const label = t(`contact.${labelKey}`);
            const copied = copiedKeys[key] === true;
            const copyAriaLabel = copied
              ? a11y('contact.copied', { label })
              : a11y('contact.copy', { label });

            return (
              <li key={key} className={styles.card}>
                <a
                  href={href}
                  className={styles.cardLink}
                  target="_blank"
                  rel="noreferrer"
                  aria-label={a11y('contact.rowLink', { label, value: displayValue })}
                >
                  <span className={styles.cardIcon} aria-hidden="true">
                    <Icon name={icon} />
                  </span>
                  <span className={styles.cardLabel}>{label}</span>
                  <span className={styles.cardValue}>{displayValue}</span>
                </a>
                <button
                  type="button"
                  className={styles.copyBtn}
                  onClick={() => handleCopy(key, copyText)}
                  disabled={!copyText}
                  aria-label={copyAriaLabel}
                  title={copyAriaLabel}
                >
                  <span className={styles.copyIcon} aria-hidden="true">
                    <Icon name={copied ? 'check' : 'copy'} />
                  </span>
                </button>
              </li>
            );
          })}
        </ul>
      </div>
    </div>
  );
}

export default Contact;
