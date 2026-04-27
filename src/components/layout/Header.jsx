import styles from './header.module.css';
import { buildCls } from '../../utils/cssUtil';

const alignMap = { left: 'alignLeft', center: 'alignCenter' };

export function Header({ text, align = 'left' }) {
  const alignClass = styles[alignMap[align] || alignMap.left];
  const headerCls = buildCls(styles.headerContainer, alignClass);
  return (
    <h2 className={headerCls}>{text}</h2>
  );
}
