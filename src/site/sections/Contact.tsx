// 연락처 카드 그리드
import type { ReactNode } from 'react';
import { useTranslation } from 'react-i18next';
import { Heading } from '@components/design/heading/Heading';
import {
  ContactFieldCard,
  CONTACT_FIELD_KEYS,
} from '@components/feature/card/ContactFieldCard';
import styles from './contact.module.css';

export function Contact(): ReactNode {
  const { t } = useTranslation();

  return (
    <div className={styles.contactContainer}>
      <div className={styles.contactContent}>
        <div className={styles.contactHeaderWrap}>
          <div className={styles.contactTitle}>
            <Heading text={t('nav.contact')} align="center" />
          </div>
        </div>
        <ul className={styles.cardGrid}>
          {CONTACT_FIELD_KEYS.map((key) => (
            <ContactFieldCard key={key} field={key} />
          ))}
        </ul>
      </div>
    </div>
  );
}

export default Contact;
