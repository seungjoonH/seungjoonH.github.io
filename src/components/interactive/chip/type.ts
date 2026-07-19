// ChipButton 타입
import type { ClickAction } from '../actionable';
import type { PressFeedback } from '../pressFeedback';
import type { ChipProps } from '@components/design/chip/type';

export type ChipButtonProps = ChipProps &
  ClickAction & {
    ariaLabel: string;
    disabled?: boolean;
    title?: string;
    /** 기본 press-shade */
    feedback?: PressFeedback;
  };
