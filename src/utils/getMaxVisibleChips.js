import { projectCard, TYPO_SCALE_MIN, TYPO_SCALE_MAX } from '../config.js';

export function getMaxVisibleChips(breakpointType, typographyScale, cfg = projectCard) {
  const type = cfg.maxVisibleTags[breakpointType] != null ? breakpointType : 'mobile';
  const steps = cfg.fontScaleSteps ?? [0.5, 0.75, 1, 1.25, 1.5];
  const scale = Math.max(TYPO_SCALE_MIN, Math.min(TYPO_SCALE_MAX, Number(typographyScale) || 1));

  const tagRow = cfg.maxVisibleTags[type];
  const stackRow = cfg.maxVisibleStacks[type];
  if (!tagRow?.length || !stackRow?.length) {
    return { maxTags: 0, maxStacks: 0 };
  }

  const i = steps.findIndex((s) => s >= scale);
  if (i <= 0) {
    return {
      maxTags: Math.max(0, tagRow[0]),
      maxStacks: Math.max(0, stackRow[0]),
    };
  }
  if (i >= steps.length) {
    const last = steps.length - 1;
    return {
      maxTags: Math.max(0, tagRow[last]),
      maxStacks: Math.max(0, stackRow[last]),
    };
  }
  const t = (scale - steps[i - 1]) / (steps[i] - steps[i - 1]);
  const maxTags = Math.round(tagRow[i - 1] + t * (tagRow[i] - tagRow[i - 1]));
  const maxStacks = Math.round(stackRow[i - 1] + t * (stackRow[i] - stackRow[i - 1]));
  return {
    maxTags: Math.max(0, maxTags),
    maxStacks: Math.max(0, maxStacks),
  };
}
