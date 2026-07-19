// ChipSelect: 선택 시 Secondary, 클릭 시 onChange
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';
import { ChipSelect } from '@components/interactive/chipSelect/ChipSelect';

vi.mock('@components/design/icon/Icon', () => {
  const IconMock = ({ name }: { name: string }) => <span data-testid={`icon-${name}`} />;
  return { Icon: { Primary: IconMock, Secondary: IconMock, Outlined: IconMock } };
});

const options = [
  { value: 'a', label: 'A' },
  { value: 'b', label: 'B' },
];

describe('ChipSelect', () => {
  it('선택된 옵션은 Secondary 칩 aria에 selected가 붙는다', () => {
    render(
      <ChipSelect options={options} value="a" onChange={vi.fn()} ariaLabel="test chips" />
    );
    expect(screen.getByRole('button', { name: 'A, selected' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'B' })).toBeInTheDocument();
  });

  it('왼쪽 라벨이 보인다', () => {
    render(
      <ChipSelect options={options} value="a" onChange={vi.fn()} ariaLabel="direction" />
    );
    expect(screen.getByText('direction')).toBeInTheDocument();
  });

  it('클릭한 옵션의 value로 onChange를 호출한다', async () => {
    const user = userEvent.setup();
    const onChange = vi.fn();
    render(
      <ChipSelect options={options} value="a" onChange={onChange} ariaLabel="test chips" />
    );
    await user.click(screen.getByRole('button', { name: 'B' }));
    expect(onChange).toHaveBeenCalledWith('b');
  });
});
