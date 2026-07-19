import type { ReactNode, RefObject } from 'react';

export type ModalSize = 'default' | 'compact';

export interface ModalProps {
  titleId: string;
  title: string;
  onClose: () => void;
  returnFocusRef?: RefObject<HTMLElement | null>;
  initialFocusRef?: RefObject<HTMLElement | null>;
  closeDelayMs?: number;
  fitContent?: boolean;
  /** compact: 설정 팝업처럼 좁고 고정된 패널 */
  size?: ModalSize;
  /** visible이면 패널 안 제목을 화면에 표시 (srOnly 대신) */
  titleVisible?: boolean;
  /** 오버레이/포커스 트랩 없이 패널만 인라인 렌더 (갤러리 등) */
  embedded?: boolean;
  children: ReactNode;
}
