// Chip / ChipButton / TextButton / ControlSlider / IconButton / Modal shared 위젯 테스트
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';
import { Chip } from '@components/design/chip/Chip';
import { ChipButton } from '@components/interactive/chip/ChipButton';
import { TextButton } from '@components/interactive/button/TextButton';
import { GotoButton } from '@components/interactive/button/GotoButton';
import { ControlSlider } from '@components/interactive/controlSlider/ControlSlider';
import { IconButton } from '@components/interactive/icon/IconButton';
import { Modal } from '@components/interactive/modal/Modal';
import { SettingsButton } from '@components/feature/SettingsButton';
import { ThemeToggleButton } from '@components/feature/icon/ThemeToggleButton';

vi.mock('@components/design/icon/Icon', () => {
  const IconMock = ({ name }: { name: string }) => <span data-testid={`icon-${name}`} />;
  return { Icon: { Primary: IconMock, Secondary: IconMock, Outlined: IconMock } };
});

vi.mock('@hooks/useA11y', () => ({
  useA11y: () => (key: string) => key,
}));

vi.mock('react-i18next', () => ({
  useTranslation: () => ({ t: (key: string) => key }),
}));

vi.mock('@hooks/useModal', () => ({
  useModal: () => ({ requestClose: vi.fn() }),
}));

vi.mock('@components/interactive/modal/usePreventBackgroundScroll', () => ({
  usePreventBackgroundScroll: () => undefined,
}));

describe('Chip', () => {
  it('라벨을 렌더하고 버튼 역할이 없다', () => {
    render(<Chip.Primary label="React" iconName="react" />);
    expect(screen.getByText('React')).toBeInTheDocument();
    expect(screen.queryByRole('button')).not.toBeInTheDocument();
    expect(screen.getByTestId('icon-react')).toBeInTheDocument();
  });
});

describe('ChipButton', () => {
  it('라벨을 렌더하고 클릭을 전달한다', async () => {
    const user = userEvent.setup();
    const onClick = vi.fn();
    render(
      <ChipButton.Primary label="React" iconName="react" onClick={onClick} ariaLabel="React chip" />
    );
    expect(screen.getByRole('button', { name: 'React chip' })).toBeInTheDocument();
    expect(screen.getByText('React')).toBeInTheDocument();
    await user.click(screen.getByRole('button', { name: 'React chip' }));
    expect(onClick).toHaveBeenCalledTimes(1);
  });
});

describe('TextButton', () => {
  it('아이콘 버튼을 렌더하고 클릭한다', async () => {
    const user = userEvent.setup();
    const onClick = vi.fn();
    render(<TextButton.Primary iconName="copy" ariaLabel="copy" onClick={onClick} />);
    await user.click(screen.getByRole('button', { name: 'copy' }));
    expect(onClick).toHaveBeenCalledTimes(1);
    expect(screen.getByTestId('icon-copy')).toBeInTheDocument();
  });
});

describe('GotoButton', () => {
  it('라벨과 chevron을 렌더하고 클릭을 전달한다', async () => {
    const user = userEvent.setup();
    const onClick = vi.fn();
    render(
      <GotoButton ariaLabel="go" onClick={onClick}>
        Go to projects
      </GotoButton>
    );
    expect(screen.getByText('Go to projects')).toBeInTheDocument();
    expect(screen.getByTestId('icon-angle-right')).toBeInTheDocument();
    await user.click(screen.getByRole('button', { name: 'go' }));
    expect(onClick).toHaveBeenCalledTimes(1);
  });

  it('href면 링크로 렌더한다', () => {
    render(
      <GotoButton href="#project" ariaLabel="go">
        Go to projects
      </GotoButton>
    );
    expect(screen.getByRole('link', { name: 'go' })).toHaveAttribute('href', '#project');
  });
});

vi.mock('@components/feature/SettingsModal', () => ({
  SettingsModal: ({ onClose }: { onClose: () => void }) => (
    <div role="dialog" data-testid="settings-modal">
      <button type="button" onClick={onClose}>
        close
      </button>
    </div>
  ),
}));

describe('SettingsButton', () => {
  it('IconButton을 렌더하고 클릭하면 SettingsModal을 연다', async () => {
    const user = userEvent.setup();
    render(<SettingsButton />);
    expect(screen.getByTestId('icon-settings')).toBeInTheDocument();
    expect(screen.queryByTestId('settings-modal')).not.toBeInTheDocument();
    await user.click(screen.getByRole('button', { name: 'nav.settingsOpen' }));
    expect(screen.getByTestId('settings-modal')).toBeInTheDocument();
  });
});

describe('IconButton', () => {
  it('아이콘 이름을 전달한다', () => {
    render(<IconButton.Primary name="settings" ariaLabel="settings" />);
    expect(screen.getByRole('button', { name: 'settings' })).toBeInTheDocument();
    expect(screen.getByTestId('icon-settings')).toBeInTheDocument();
  });

  it('pressed면 aria-pressed를 반영한다', () => {
    render(<IconButton.Primary pressed name="eye" onClick={() => undefined} ariaLabel="toggle hidden" />);
    expect(screen.getByRole('button', { name: 'toggle hidden' })).toHaveAttribute(
      'aria-pressed',
      'true'
    );
  });
});

describe('ThemeToggleButton', () => {
  it('기본 shape는 rounded다', () => {
    render(<ThemeToggleButton />);
    const button = screen.getByRole('button');
    expect(button.className).not.toMatch(/full/);
    expect(button.className).not.toMatch(/square/);
  });
});

describe('ControlSlider', () => {
  it('감소 버튼으로 값을 줄인다', async () => {
    const user = userEvent.setup();
    const onChange = vi.fn();
    render(
      <ControlSlider
        legend="Columns"
        value={3}
        min={1}
        max={5}
        onChange={onChange}
        ariaLabel="columns"
        ariaValueText="3"
        decreaseLabel="decrease"
        increaseLabel="increase"
      />
    );
    await user.click(screen.getByRole('button', { name: 'decrease' }));
    expect(onChange).toHaveBeenCalledWith(2);
  });
});

describe('Modal', () => {
  it('제목과 닫기 버튼을 렌더한다', () => {
    render(
      <Modal titleId="modal-title" title="Settings" onClose={() => undefined}>
        <p>body</p>
      </Modal>
    );
    expect(screen.getByText('Settings')).toBeInTheDocument();
    expect(screen.getByText('body')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'common.close' })).toBeInTheDocument();
  });
});
