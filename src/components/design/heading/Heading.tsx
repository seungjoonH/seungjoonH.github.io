// 섹션 제목 정렬을 지원하는 공통 Heading 컴포넌트
import styles from './heading.module.css';
import { buildCls } from '@utils/cssUtil';

const alignMap = { left: 'alignLeft', center: 'alignCenter' } as const;

type HeadingAlign = keyof typeof alignMap;

interface HeadingProps {
  text: string;
  align?: HeadingAlign;
}

export function Heading({ text, align = 'left' }: HeadingProps) {
  const alignClass = styles[alignMap[align] || alignMap.left];
  const headingCls = buildCls(styles.headingContainer, alignClass);
  return (
    <h2 className={headingCls}>{text}</h2>
  );
}
