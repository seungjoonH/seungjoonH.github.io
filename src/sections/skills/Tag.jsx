import { useProjectSearchStore } from '../../stores/projectSearchStore';
import styles from './tag.module.css';

export function Tag({ skill }) {
  const setQueryFromShortcut = useProjectSearchStore((s) => s.setQueryFromShortcut);

  const handleClick = () => {
    setQueryFromShortcut(`stack:"${skill.name}"`);
    const el = document.getElementById('project');
    if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  return (
    <button
      type="button"
      className={styles.tagContainer}
      onClick={handleClick}
      aria-label={`${skill.name} 사용 프로젝트 검색`}
    >
      <img src={skill.imageUrl} alt="" className={styles.tagIcon} aria-hidden="true" />
      <span className={styles.tagText}>{skill.name}</span>
    </button>
  );
}