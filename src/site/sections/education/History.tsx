// 학력 연도·내용 한 줄을 표시하는 History 컴포넌트
import { buildCls } from '@utils/cssUtil';
import styles from './history.module.css';

interface HistoryProps {
  education: { year?: string | number; content?: string };
}

export function History({ education }: HistoryProps) {
  return (
    <div className={styles.historyContainer}>
      <div className={buildCls('columnContainer', styles.historyColumn)}>
        <p className={styles.year}>{education.year}</p>
        <p className={styles.content}>{education.content}</p>
      </div>
    </div>
  );
}
