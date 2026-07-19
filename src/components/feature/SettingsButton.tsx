// IconButton(settings) + SettingsModal 열기 완성형
import {
  forwardRef,
  useRef,
  useState,
  type MutableRefObject,
  type ReactNode,
  type Ref,
} from 'react';
import { createPortal } from 'react-dom';
import { useTranslation } from 'react-i18next';
import { useA11y } from '@hooks/useA11y';
import { IconButton } from '@components/interactive/icon/IconButton';
import { SettingsModal } from '@components/feature/SettingsModal';

function assignRef<T>(ref: Ref<T> | undefined, value: T | null): void {
  if (!ref) return;
  if (typeof ref === 'function') {
    ref(value);
    return;
  }
  (ref as MutableRefObject<T | null>).current = value;
}

export const SettingsButton = forwardRef<HTMLButtonElement | HTMLAnchorElement>(
  function SettingsButton(_props, ref): ReactNode {
    const a11y = useA11y();
    const { t } = useTranslation();
    const [open, setOpen] = useState(false);
    const buttonRef = useRef<HTMLButtonElement | HTMLAnchorElement | null>(null);

    return (
      <>
        <IconButton.Secondary
          ref={(node) => {
            buttonRef.current = node;
            assignRef(ref, node);
          }}
          name="settings"
          shape="full"
          size="large"
          onClick={() => setOpen(true)}
          ariaLabel={a11y('nav.settingsOpen')}
          title={t('settings.open') || '설정'}
        />
        {open &&
          createPortal(
            <SettingsModal onClose={() => setOpen(false)} returnFocusRef={buttonRef} />,
            document.body
          )}
      </>
    );
  }
);
