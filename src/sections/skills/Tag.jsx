import { useA11y } from '../../hooks/useA11y';
import { useProjectSearchStore } from '../../stores/projectSearchStore';
import styles from './tag.module.css';

export function Tag({ skill }) {
  const a11y = useA11y();
  const setQueryFromShortcut = useProjectSearchStore((s) => s.setQueryFromShortcut);

  const handleClick = () => {
    setQueryFromShortcut(`stack:"${skill.name}"`);
  };

  return (
    <button
      type="button"
      className={styles.tagContainer}
      onClick={handleClick}
      aria-label={a11y('skills.tagSearch', { name: skill.name })}
    >
      <img src={skill.imageUrl} alt={a11y('skills.icon', { name: skill.name })} className={styles.tagIcon} />
      <span className={styles.tagText}>{skill.name}</span>
    </button>
  );
}