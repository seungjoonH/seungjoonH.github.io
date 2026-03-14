import styles from './history.module.css';

export function History({ education }) {
  return (
    <div className={styles.historyContainer}>
      <div className="columnContainer" style={{ '--column-gap': '4px' }}>
        <p className={styles.year}>{education.year}</p>
        <p className={styles.content}>{education.content}</p>
      </div>
    </div>
  );
}