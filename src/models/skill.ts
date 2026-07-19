// 스킬 카테고리·이름으로 아이콘 이름을 만드는 모델

export interface SkillModelInput {
  category: string;
  name: string;
}

/**
 * 표시 이름 → `src/assets/icons/{iconName}.svg` 파일명.
 * @param name - 데이터에 적힌 스킬 이름 (예: Next.js)
 * @returns 아이콘 파일 stem (예: nextjs)
 */
export function skillIconName(name: string): string {
  return name
    .replace(/\s+/g, '')
    .toLowerCase()
    .replace(/\+/g, 'p')
    .replace(/\./g, '');
}

export default class SkillModel {
  category: string;
  name: string;
  /** `Icon` 컴포넌트용 이름 (`src/assets/icons` 기준) */
  iconName: string;

  constructor({ category, name }: SkillModelInput) {
    this.category = category;
    this.name = name;
    this.iconName = skillIconName(name);
  }

  static fromJson(category: string, name: string): SkillModel {
    return new SkillModel({ category, name });
  }
}
