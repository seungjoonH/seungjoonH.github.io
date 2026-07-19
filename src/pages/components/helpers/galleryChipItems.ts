// 갤러리에 나열할 Stack/Skill 칩 목록 (실데이터)
import projects from '../../../data/en/projects';
import skillsByCategory from '../../../data/en/skills';
import { skillIconName } from '@models/skill';
import { getStackIconName } from '@sections/projects/search/stackMapping';

export interface GalleryChipItem {
  label: string;
  iconName?: string;
}

function stackLabel(item: unknown): string | null {
  if (typeof item === 'string') return item.trim() || null;
  if (item && typeof item === 'object' && 'name' in item) {
    const name = (item as { name?: unknown }).name;
    return typeof name === 'string' && name.trim() ? name.trim() : null;
  }
  return null;
}

/** 프로젝트 techStack에 등장하는 스택 칩 전부 (라벨·아이콘) */
export function listStackChipItems(): GalleryChipItem[] {
  const names = new Set<string>();
  for (const project of projects as { techStack?: unknown[] }[]) {
    for (const item of project.techStack ?? []) {
      const label = stackLabel(item);
      if (label) names.add(label);
    }
  }
  return [...names]
    .sort((a, b) => a.localeCompare(b))
    .map((label) => {
      const iconName = getStackIconName(label);
      return { label, iconName: iconName || undefined };
    });
}

/** skills 데이터에 있는 스킬 칩 전부 */
export function listSkillChipItems(): GalleryChipItem[] {
  const names = Object.values(skillsByCategory).flat();
  return [...new Set(names)]
    .sort((a, b) => a.localeCompare(b))
    .map((label) => ({ label, iconName: skillIconName(label) }));
}
