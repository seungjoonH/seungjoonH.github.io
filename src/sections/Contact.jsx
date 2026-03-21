import React, { useCallback, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useA11y } from '../hooks/useA11y';
import { Header } from '@components/layout/Header';
import { Icon } from '@components/shared/icon/Icon';
import { useConfigStore } from '../stores/configStore';
import config from '../config';
import styles from './contact.module.css';

const CONTACT_KEYS = ['email', 'github', 'linkedin', 'tel'];
const ICON_MAP = { email: 'email', github: 'github', linkedin: 'linkedin', tel: 'tel' };
const LABEL_KEYS = { email: 'email', github: 'github', linkedin: 'linkedin', tel: 'tel' };

function decode(value) {
  if (typeof value !== 'string') return value;
  try { return decodeURIComponent(value); }
  catch { return value; }
}

function getContactHref(key, value) {
  const raw = decode(value);
  if (!raw) return '#';
  switch (key) {
    case 'email': return `mailto:${raw}`;
    case 'tel': return `tel:${raw.replace(/\s/g, '')}`;
    case 'github':
    case 'linkedin': return raw.startsWith('http') ? raw : `https://${raw}`;
    default: return raw;
  }
}

function getDisplayValue(key, value, language) {
  const raw = decode(value);
  if (key === 'github' && raw) return raw.replace(/^https?:\/\/github\.com\/?/i, 'github.com/') || raw;
  if (key === 'linkedin' && raw) return raw.replace(/^https?:\/\/[^/]+/i, 'linkedin.com') || raw;
  if (key === 'tel' && raw) {
    const isKo = language === 'ko' || String(language).startsWith('ko');
    if (isKo) return raw.replace(/^\+82\s*10\s*/, '010 ').trim() || raw;
    return raw.replace(/^010\s*/, '+82 10 ').trim() || raw;
  }
  return raw;
}

function getCopyText(key, value) {
  const raw = decode(value);
  if (!raw) return '';
  if (key === 'github' && !raw.startsWith('http')) return `https://github.com/${raw.replace(/^\/+/, '')}`;
  if (key === 'linkedin' && !raw.startsWith('http')) return `https://${raw}`;
  return raw;
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
          <Header text={t('nav.contact')} align="center" className={styles.contactTitle} />
        </div>
        <div className={styles.cardGrid} role="list">
          {CONTACT_KEYS.map((key) => {
            const value = contact[key];
            const href = getContactHref(key, value);
            const displayValue = getDisplayValue(key, value, language);
            const copyText = getCopyText(key, value);
            const label = t(`contact.${LABEL_KEYS[key]}`);
            const copied = copiedKeys[key] === true;
            const copyAriaLabel = copied 
              ? a11y('contact.copied', { label }) 
              : a11y('contact.copy', { label });

            return (
              <div key={key} className={styles.card} role="listitem">
                <a
                  href={href}
                  className={styles.cardLink}
                  target="_blank"
                  rel="noreferrer"
                  aria-label={a11y('contact.rowLink', { label, value: displayValue })}
                >
                  <Icon name={ICON_MAP[key]} className={styles.cardIcon} aria-hidden="true" />
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
                  <Icon name={copied ? 'check' : 'copy'} className={styles.copyIcon} aria-hidden="true" />
                </button>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

export default Contact;
