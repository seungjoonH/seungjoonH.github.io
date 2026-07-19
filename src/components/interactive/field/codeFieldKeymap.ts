// CodeField 키맵 — Tab/Shift+Tab 들여쓰기, Option+↑↓ 줄 이동, Enter 들여쓰기 유지
export const CODE_INDENT = '  ';

export interface CodeSelectionEdit {
  value: string;
  selectionStart: number;
  selectionEnd: number;
}

function lineStartAt(value: string, index: number): number {
  const i = value.lastIndexOf('\n', Math.max(0, index - 1));
  return i === -1 ? 0 : i + 1;
}

function lineEndAt(value: string, index: number): number {
  const i = value.indexOf('\n', index);
  return i === -1 ? value.length : i;
}

/** 선택 줄 블록 [start, endExclusive). 끝 개행 포함(다음 줄 이동용). */
function selectedLineBlock(
  value: string,
  selectionStart: number,
  selectionEnd: number
): { start: number; endExclusive: number } {
  const start = lineStartAt(value, selectionStart);
  let last = Math.max(selectionStart, selectionEnd);
  if (selectionEnd > selectionStart && value[selectionEnd - 1] === '\n') {
    last = selectionEnd - 1;
  }
  let endExclusive = lineEndAt(value, last);
  if (endExclusive < value.length && value[endExclusive] === '\n') {
    endExclusive += 1;
  }
  return { start, endExclusive: Math.max(start, endExclusive) };
}

export function indentSelection(
  value: string,
  selectionStart: number,
  selectionEnd: number,
  indent = CODE_INDENT
): CodeSelectionEdit {
  if (selectionStart === selectionEnd) {
    const next = value.slice(0, selectionStart) + indent + value.slice(selectionStart);
    const caret = selectionStart + indent.length;
    return { value: next, selectionStart: caret, selectionEnd: caret };
  }

  const { start, endExclusive } = selectedLineBlock(value, selectionStart, selectionEnd);
  const block = value.slice(start, endExclusive);
  const endsWithNl = block.endsWith('\n');
  const core = endsWithNl ? block.slice(0, -1) : block;
  const indentedCore = core
    .split('\n')
    .map((line) => indent + line)
    .join('\n');
  const indented = indentedCore + (endsWithNl ? '\n' : '');
  const next = value.slice(0, start) + indented + value.slice(endExclusive);
  const lineCount = core.split('\n').length;
  return {
    value: next,
    selectionStart: selectionStart + indent.length,
    selectionEnd: selectionEnd + indent.length * lineCount,
  };
}

export function outdentSelection(
  value: string,
  selectionStart: number,
  selectionEnd: number,
  indent = CODE_INDENT
): CodeSelectionEdit {
  const { start, endExclusive } = selectedLineBlock(value, selectionStart, selectionEnd);
  const block = value.slice(start, endExclusive);
  const endsWithNl = block.endsWith('\n');
  const core = endsWithNl ? block.slice(0, -1) : block;
  const lines = core.split('\n');

  let cursor = start;
  let nextStart = selectionStart;
  let nextEnd = selectionEnd;

  const outdentedLines = lines.map((line) => {
    let cut = 0;
    if (line.startsWith(indent)) cut = indent.length;
    else if (line.startsWith('\t') || line.startsWith(' ')) cut = 1;

    if (cut > 0) {
      if (selectionStart > cursor) nextStart -= Math.min(cut, selectionStart - cursor);
      if (selectionEnd > cursor) nextEnd -= Math.min(cut, selectionEnd - cursor);
    }
    cursor += line.length + 1;
    return line.slice(cut);
  });

  const outdented = outdentedLines.join('\n') + (endsWithNl ? '\n' : '');
  const next = value.slice(0, start) + outdented + value.slice(endExclusive);
  return {
    value: next,
    selectionStart: Math.max(start, nextStart),
    selectionEnd: Math.max(Math.max(start, nextStart), nextEnd),
  };
}

export function moveSelectedLines(
  value: string,
  selectionStart: number,
  selectionEnd: number,
  direction: 'up' | 'down'
): CodeSelectionEdit | null {
  const { start, endExclusive } = selectedLineBlock(value, selectionStart, selectionEnd);
  const selected = value.slice(start, endExclusive);

  if (direction === 'up') {
    if (start === 0) return null;
    const prevStart = lineStartAt(value, start - 1);
    const prev = value.slice(prevStart, start);
    const nextValue = value.slice(0, prevStart) + selected + prev + value.slice(endExclusive);
    return {
      value: nextValue,
      selectionStart: selectionStart - prev.length,
      selectionEnd: selectionEnd - prev.length,
    };
  }

  if (endExclusive >= value.length) return null;
  let nextEnd = lineEndAt(value, endExclusive);
  if (nextEnd < value.length && value[nextEnd] === '\n') nextEnd += 1;
  const nextLine = value.slice(endExclusive, nextEnd);
  if (!nextLine) return null;
  const nextValue = value.slice(0, start) + nextLine + selected + value.slice(nextEnd);
  return {
    value: nextValue,
    selectionStart: selectionStart + nextLine.length,
    selectionEnd: selectionEnd + nextLine.length,
  };
}

/** Option+Shift+↑↓ — 선택 줄 복제 (위/아래) */
export function duplicateSelectedLines(
  value: string,
  selectionStart: number,
  selectionEnd: number,
  direction: 'up' | 'down'
): CodeSelectionEdit {
  const { start, endExclusive } = selectedLineBlock(value, selectionStart, selectionEnd);
  let selected = value.slice(start, endExclusive);
  if (!selected.endsWith('\n') && endExclusive >= value.length && !value.endsWith('\n')) {
    selected = `${selected}\n`;
  } else if (!selected.endsWith('\n') && endExclusive === value.length) {
    selected = `${selected}\n`;
  }

  if (direction === 'up') {
    const nextValue = value.slice(0, start) + selected + value.slice(start);
    return {
      value: nextValue,
      selectionStart,
      selectionEnd,
    };
  }

  const nextValue = value.slice(0, endExclusive) + selected + value.slice(endExclusive);
  return {
    value: nextValue,
    selectionStart: selectionStart + selected.length,
    selectionEnd: selectionEnd + selected.length,
  };
}

export function insertNewlineWithIndent(
  value: string,
  selectionStart: number,
  selectionEnd: number
): CodeSelectionEdit {
  const start = lineStartAt(value, selectionStart);
  const prefix = value.slice(start, selectionStart).match(/^[ \t]*/)?.[0] ?? '';
  const insert = `\n${prefix}`;
  const next = value.slice(0, selectionStart) + insert + value.slice(selectionEnd);
  const caret = selectionStart + insert.length;
  return { value: next, selectionStart: caret, selectionEnd: caret };
}
