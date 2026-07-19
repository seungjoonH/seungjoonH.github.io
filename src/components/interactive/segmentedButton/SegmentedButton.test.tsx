// 선택된 옵션에만 segmentActive 클래스가 토글되는지 검증
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';
import { SegmentedButton } from '@components/interactive/segmentedButton/SegmentedButton';

vi.mock('@components/design/icon/Icon', () => {
  const IconMock = ({ name }: { name: string }) => <span data-testid={`icon-${name}`} />;
  return { Icon: { Primary: IconMock, Secondary: IconMock, Outlined: IconMock } };
});

const options = [
  { value: 'a', label: 'A' },
  { value: 'b', label: 'B' },
];

describe('SegmentedButton', () => {
  it('선택된 옵션의 wrapper에만 segmentActive가 붙는다', () => {
    render(
      <SegmentedButton options={options} value="a" onChange={vi.fn()} ariaLabel="test segmented" />
    );
    const [wrapperA, wrapperB] = screen.getAllByRole('button').map((btn) => btn.closest('div'));
    expect(wrapperA?.className).toMatch(/segmentActive/);
    expect(wrapperB?.className).not.toMatch(/segmentActive/);
  });

  it('클릭한 옵션의 value로 onChange를 호출한다', async () => {
    const user = userEvent.setup();
    const onChange = vi.fn();
    render(
      <SegmentedButton options={options} value="a" onChange={onChange} ariaLabel="test segmented" />
    );
    await user.click(screen.getByRole('button', { name: 'B' }));
    expect(onChange).toHaveBeenCalledWith('b');
  });
});
