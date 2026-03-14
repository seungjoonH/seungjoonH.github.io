import styles from './header.module.css';
import { buildCls } from '../../utils/cssUtil';

const alignMap = { left: 'alignLeft', center: 'alignCenter' };

export function Header({ text, align = "left", className = "" }) {
  const alignClass = styles[alignMap[align] || alignMap.left];
  return (
    <h2 className={buildCls(styles.headerContainer, alignClass, className)}>{text}</h2>
  );
}
