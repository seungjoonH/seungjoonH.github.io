// 브레이크포인트·타이포 스케일에 따른 태그·스택 칩 최대 표시 개수
import {
  projectCard,
  TYPO_SCALE_MIN,
  TYPO_SCALE_MAX,
  type ScreenSizeType,
} from '../../../config';

export interface MaxVisibleChipsResult {
  maxTags: number;
  maxStacks: number;
}

/**
 * 브레이크포인트·타이포 스케일에 따른 태그·스택 칩 최대 표시 개수를 계산한다.
 * @param breakpointType - `mobile` | `tablet` | `desktop` | `wide`
 * @param typographyScale - 타이포 스케일 (config min~max로 clamp)
 * @returns maxTags / maxStacks
 * @throws chip bounds 배열 길이가 fontScaleSteps와 다르면 Error
 */
export function getMaxVisibleChips(
  breakpointType: ScreenSizeType,
  typographyScale: number
): MaxVisibleChipsResult {
  const steps = projectCard.fontScaleSteps;
  const tagRow = projectCard.maxVisibleTags[breakpointType];
  const stackRow = projectCard.maxVisibleStacks[breakpointType];

  if (tagRow.length !== steps.length || stackRow.length !== steps.length) {
    throw new Error(
      `projectCard.maxVisible*[${breakpointType}] length must match fontScaleSteps (${steps.length})`
    );
  }

  const scale = Math.max(TYPO_SCALE_MIN, Math.min(TYPO_SCALE_MAX, typographyScale));
  const i = steps.findIndex((s) => s >= scale);

  if (i <= 0) {
    return { maxTags: tagRow[0], maxStacks: stackRow[0] };
  }
  if (i >= steps.length) {
    const last = steps.length - 1;
    return { maxTags: tagRow[last], maxStacks: stackRow[last] };
  }

  const t = (scale - steps[i - 1]) / (steps[i] - steps[i - 1]);
  return {
    maxTags: Math.round(tagRow[i - 1] + t * (tagRow[i] - tagRow[i - 1])),
    maxStacks: Math.round(stackRow[i - 1] + t * (stackRow[i] - stackRow[i - 1])),
  };
}
