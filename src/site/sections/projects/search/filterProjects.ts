// 프로젝트 목록을 parse 조건·스택 정규화로 필터링
import type ProjectModel from '@models/project';
import { getSearchableText, getDescText, getProjectLinkTypes } from './getSearchableText';
import { stringContains, isSingleChoseong, tagMatchesQuery } from './hangul';
import type { ParsedClauses, NormalizeStackFn, StackConditionValue } from './parseQuery';
import { stackHasAnd, stackHasOr } from './parseQuery';

function stackContainsQuery(stackLower: string, queryLower: string): boolean {
  return stackLower.includes(queryLower) || queryLower.includes(stackLower);
}

function singleStackMatchesCondValue(
  stackName: string,
  condValue: StackConditionValue,
  normalizeStack: NormalizeStackFn,
  exactMatch = false,
): boolean {
  const norm = normalizeStack(String(stackName)).toLowerCase();
  const matchOne = (queryNorm: string) => {
    if (exactMatch) return norm === queryNorm;
    return stackContainsQuery(norm, queryNorm);
  };
  if (typeof condValue === 'string') return matchOne(normalizeStack(condValue).toLowerCase());
  if (stackHasAnd(condValue)) return condValue.and.every((t) => matchOne(normalizeStack(t).toLowerCase()));
  if (stackHasOr(condValue)) return condValue.or.some((t) => matchOne(normalizeStack(t).toLowerCase()));
  return false;
}

export function isStackMatchedByQuery(
  stackName: string,
  parsedClauses: ParsedClauses,
  normalizeStack: NormalizeStackFn,
): boolean {
  if (!parsedClauses || parsedClauses.length === 0) return false;
  const stackNorm = normalizeStack(String(stackName)).toLowerCase();
  for (const conditions of parsedClauses) {
    for (const cond of conditions) {
      switch (cond.type) {
        case 'stack':
          if (singleStackMatchesCondValue(stackName, cond.value as StackConditionValue, normalizeStack, cond.exact)) return true;
          break;
        case 'fullText':
          if (cond.value && !isSingleChoseong(String(cond.value))) {
            const queryNorm = normalizeStack(String(cond.value)).toLowerCase();
            if (stackContainsQuery(stackNorm, queryNorm)) return true;
          }
          break;
        default:
          break;
      }
    }
  }
  return false;
}

function matchesStack(
  project: ProjectModel,
  condValue: StackConditionValue,
  normalizeStack: NormalizeStackFn,
  exactMatch = false,
): boolean {
  const stacks = project.techStackNames || project.techStacks || [];
  const normalizedStacks = stacks.map((s) => normalizeStack(String(s)).toLowerCase());

  const matchOne = (queryNorm: string) => {
    if (exactMatch) return normalizedStacks.some((s) => s === queryNorm);
    return normalizedStacks.some((s) => stackContainsQuery(s, queryNorm));
  };

  if (typeof condValue === 'string') {
    const queryNorm = normalizeStack(condValue).toLowerCase();
    return matchOne(queryNorm);
  }
  if (stackHasAnd(condValue)) {
    return condValue.and.every((token) => {
      const queryNorm = normalizeStack(token).toLowerCase();
      return matchOne(queryNorm);
    });
  }
  if (stackHasOr(condValue)) {
    return condValue.or.some((token) => {
      const queryNorm = normalizeStack(token).toLowerCase();
      return matchOne(queryNorm);
    });
  }
  return false;
}

function matchesTeam(project: ProjectModel, value: string): boolean {
  const n = project.teamSize != null ? Number(project.teamSize) : NaN;
  if (Number.isNaN(n)) return false;
  const v = value.trim();
  if (/^\d+$/.test(v)) return n === Number(v);
  const upTo = v.match(/^~(\d+)$/);
  if (upTo) return n <= Number(upTo[1]);
  const from = v.match(/^(\d+)~$/);
  if (from) return n >= Number(from[1]);
  const range = v.match(/^(\d+)~(\d+)$/);
  if (range) return n >= Number(range[1]) && n <= Number(range[2]);
  return false;
}

function matchesLink(project: ProjectModel, typeWanted: string): boolean {
  const types = getProjectLinkTypes(project);
  if (typeWanted === 'github') {
    return types.some((t) => t === 'github' || t === 'github-wiki');
  }
  return types.includes(typeWanted);
}

function projectMatchesConditions(
  project: ProjectModel,
  conditions: ParsedClauses[number],
  normalizeStack: NormalizeStackFn,
): boolean {
  const fullText = getSearchableText(project);
  const descText = getDescText(project);

  for (const cond of conditions) {
    switch (cond.type) {
      case 'sort': continue;
      case 'fullText':
        if (isSingleChoseong(String(cond.value))) continue;
        if (stringContains(fullText, String(cond.value))) continue;
        if (matchesStack(project, cond.value as StackConditionValue, normalizeStack)) continue;
        return false;
      case 'tag': {
        const tags = project.tagNames || project.tags || [];
        const q = String(cond.value);
        const matched = cond.exact
          ? tags.some((t) => String(t).toLowerCase() === q.toLowerCase())
          : tags.some((t) => tagMatchesQuery(String(t), q));
        if (!matched) return false;
        continue;
      }
      case 'title': {
        if (isSingleChoseong(String(cond.value))) continue;
        const title = project.title || '';
        const matched = cond.exact
          ? title.toLowerCase() === String(cond.value).toLowerCase()
          : stringContains(title, String(cond.value));
        if (!matched) return false;
        continue;
      }
      case 'desc':
        if (isSingleChoseong(String(cond.value))) continue;
        if (!stringContains(descText, String(cond.value))) return false;
        continue;
      case 'stack':
        if (!matchesStack(project, cond.value as StackConditionValue, normalizeStack, cond.exact)) return false;
        continue;
      case 'is': {
        const projectType = (project.type ?? (project.teamSize > 1 ? 'group' : 'personal')).toLowerCase();
        const want = cond.value;
        const match = Array.isArray(want)
          ? want.some((w) => projectType === String(w).toLowerCase())
          : projectType === String(want).toLowerCase();
        if (cond.negate ? match : !match) return false;
        continue;
      }
      case 'team':
        if (!matchesTeam(project, String(cond.value))) return false;
        continue;
      case 'link':
        if (!matchesLink(project, String(cond.value))) return false;
        continue;
      case 'show': {
        const v = cond.value;
        if (v === 'public' && project.hidden) return false;
        if (v === 'hidden' && !project.hidden) return false;
        continue;
      }
      default: continue;
    }
  }
  return true;
}

function hasActiveSearchConditions(conditions: ParsedClauses[number]): boolean {
  return conditions.some((c) => c.type !== 'show' && c.type !== 'sort');
}

function injectShowDefault(parsedClauses: ParsedClauses): ParsedClauses {
  const hasShow = parsedClauses?.some((conditions) => conditions.some((c) => c.type === 'show'));
  if (hasShow) return parsedClauses;
  const hasSearch = parsedClauses?.some((conditions) => hasActiveSearchConditions(conditions));
  if (hasSearch) return parsedClauses;
  return (parsedClauses || []).map((conditions) => [...conditions, { type: 'show', value: 'public' }]);
}

export function filterProjects(
  projects: ProjectModel[],
  parsedClauses: ParsedClauses,
  stackNormalizeFn?: NormalizeStackFn,
): ProjectModel[] {
  if (!Array.isArray(projects)) return [];
  if (!parsedClauses || parsedClauses.length === 0) {
    return projects.filter((p) => !p.hidden);
  }

  const normalizeStack = stackNormalizeFn ?? ((s: string) => s);
  const clausesWithShow = injectShowDefault(parsedClauses);

  return projects.filter((project) => {
    for (const conditions of clausesWithShow) {
      if (projectMatchesConditions(project, conditions, normalizeStack)) return true;
    }
    return false;
  });
}

export type ShowValue = 'public' | 'hidden' | 'all';

export function getShowValue(parsedClauses: ParsedClauses | null): ShowValue {
  for (const conditions of parsedClauses || []) {
    const showCond = conditions.find((c) => c.type === 'show');
    if (showCond && (showCond.value === 'public' || showCond.value === 'hidden' || showCond.value === 'all'))
      return showCond.value as ShowValue;
  }
  return 'public';
}

