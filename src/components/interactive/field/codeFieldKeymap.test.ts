// CodeField 키맵 단위 테스트
import { describe, expect, it } from 'vitest';
import {
  duplicateSelectedLines,
  indentSelection,
  insertNewlineWithIndent,
  moveSelectedLines,
  outdentSelection,
} from './codeFieldKeymap';

describe('codeFieldKeymap', () => {
  it('Tab: 커서 위치에 들여쓰기를 넣는다', () => {
    expect(indentSelection('ab', 1, 1)).toEqual({
      value: 'a  b',
      selectionStart: 3,
      selectionEnd: 3,
    });
  });

  it('Tab: 여러 줄 선택 시 각 줄 앞에 들여쓴다', () => {
    const edit = indentSelection('a\nb\n', 0, 3);
    expect(edit.value).toBe('  a\n  b\n');
  });

  it('Shift+Tab: 줄 앞 들여쓰기를 제거한다', () => {
    expect(outdentSelection('  a\n  b\n', 0, 8).value).toBe('a\nb\n');
  });

  it('Option+↑: 현재 줄을 위로 옮긴다', () => {
    expect(moveSelectedLines('a\nb\n', 2, 2, 'up')).toEqual({
      value: 'b\na\n',
      selectionStart: 0,
      selectionEnd: 0,
    });
  });

  it('Option+↓: 현재 줄을 아래로 옮긴다', () => {
    expect(moveSelectedLines('a\nb\n', 0, 0, 'down')).toEqual({
      value: 'b\na\n',
      selectionStart: 2,
      selectionEnd: 2,
    });
  });

  it('Option+Shift+↓: 현재 줄을 아래로 복제한다', () => {
    expect(duplicateSelectedLines('a\nb\n', 0, 0, 'down')).toEqual({
      value: 'a\na\nb\n',
      selectionStart: 2,
      selectionEnd: 2,
    });
  });

  it('Option+Shift+↑: 현재 줄을 위로 복제한다', () => {
    expect(duplicateSelectedLines('a\nb\n', 2, 2, 'up')).toEqual({
      value: 'a\nb\nb\n',
      selectionStart: 2,
      selectionEnd: 2,
    });
  });

  it('Enter: 이전 줄 들여쓰기를 유지한다', () => {
    expect(insertNewlineWithIndent('  hello', 7, 7)).toEqual({
      value: '  hello\n  ',
      selectionStart: 10,
      selectionEnd: 10,
    });
  });
});
