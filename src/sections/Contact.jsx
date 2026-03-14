import React from 'react';
import { useTranslation } from 'react-i18next';
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
  try {
    return decodeURIComponent(value);
  } catch {
    return value;
  }
}

function getContactHref(key, value) {
  const raw = decode(value);
  if (!raw) return '#';
  switch (key) {
    case 'email':
      return `mailto:${raw}`;
    case 'tel':
      return `tel:${raw.replace(/\s/g, '')}`;
    case 'github':
    case 'linkedin':
      return raw.startsWith('http') ? raw : `https://${raw}`;
    default:
      return raw;
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

export function Contact() {
  const { t } = useTranslation();
  const language = useConfigStore((s) => s.language) ?? config.language?.initial ?? 'en';
  const contact = config.contact || {};

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
          const label = t(`contact.${LABEL_KEYS[key]}`);

          return (
            <a
              key={key}
              href={href}
              className={styles.card}
              role="listitem"
              target="_blank"
              rel="noreferrer"
              aria-label={`${label}: ${displayValue}`}
            >
              <Icon name={ICON_MAP[key]} className={styles.cardIcon} aria-hidden="true" />
              <span className={styles.cardLabel}>{label}</span>
              <span className={styles.cardValue}>{displayValue}</span>
            </a>
          );
        })}
        </div>
      </div>
    </div>
  );
}

export default Contact;
