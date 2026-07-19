// contact config 키별 필드 카드 + 복사
import type { ReactNode } from 'react';
import { useTranslation } from 'react-i18next';
import { useA11y } from '@hooks/useA11y';
import { FieldCard } from '@components/composed/card/FieldCard';
import { CopyIconButton } from '@components/feature/icon/CopyIconButton';
import { useConfigStore } from '@stores/configStore';
import config from '../../../config';
import styles from './contactFieldCard.module.css';

export type ContactFieldKey = 'email' | 'github' | 'linkedin' | 'tel';

interface ContactFieldDef {
  icon: string;
  labelKey: string;
  href: (raw: string) => string;
  display: (raw: string, language?: string) => string;
  copy: (raw: string) => string;
}

export const CONTACT_FIELD_DEFS: Record<ContactFieldKey, ContactFieldDef> = Object.freeze({
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

export const CONTACT_FIELD_KEYS = Object.keys(CONTACT_FIELD_DEFS) as ContactFieldKey[];

function decodeRaw(value: unknown): string | null {
  if (typeof value !== 'string' || !value) return null;
  if (!/%[0-9A-Fa-f]{2}/.test(value)) return value;
  try {
    return decodeURIComponent(value);
  } catch {
    return value;
  }
}

export interface ContactFieldCardProps {
  field: ContactFieldKey;
}

export function ContactFieldCard({ field }: ContactFieldCardProps): ReactNode {
  const { t } = useTranslation();
  const a11y = useA11y();
  const language = useConfigStore((s) => s.language);
  const def = CONTACT_FIELD_DEFS[field];
  const contact = config.contact as Partial<Record<ContactFieldKey, string>>;
  const raw = decodeRaw(contact[field]);
  const href = raw ? def.href(raw) : '#';
  const displayValue = raw ? def.display(raw, language) : '';
  const textToCopy = raw ? def.copy(raw) : '';
  const label = t(`contact.${def.labelKey}`);

  return (
    <li className={styles.item}>
      <FieldCard
        iconName={def.icon}
        label={label}
        value={displayValue}
        href={href}
        ariaLabel={a11y('contact.rowLink', { label, value: displayValue })}
        action={<CopyIconButton text={textToCopy} label={label} />}
      />
    </li>
  );
}
