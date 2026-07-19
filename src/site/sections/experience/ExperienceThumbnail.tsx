// 경력 카드 썸네일 (SVG/이미지). 카드 aria-label이 의미를 담당하므로 장식 처리.
import { useState, useEffect, type ReactNode } from 'react';
import { SvgIcon } from '@components/design/icon/Icon';
import { buildCls } from '@utils/cssUtil';
import styles from '@components/composed/card/experienceSlotCard.module.css';

const EXPERIENCE_PLACEHOLDER_SRC = '/assets/images/experience-placeholder.svg';

function DefaultImage(): ReactNode {
  return (
    <div className={styles.placeholderImage} aria-hidden="true">
      <img src={EXPERIENCE_PLACEHOLDER_SRC} alt="" className={styles.placeholderGraphic} />
    </div>
  );
}

export interface ExperienceThumbnailProps {
  experienceId: string | number;
  imageUrl: string | null;
}

export function ExperienceThumbnail({ experienceId, imageUrl }: ExperienceThumbnailProps): ReactNode {
  const [imageError, setImageError] = useState(false);
  const [hoveredReady, setHoveredReady] = useState(false);
  useEffect(() => setImageError(false), [experienceId]);
  useEffect(() => setHoveredReady(false), [experienceId]);

  const showSvg = Boolean(imageUrl) && !imageError && imageUrl!.toLowerCase().endsWith('.svg');
  const showImg = Boolean(imageUrl) && !imageError && !showSvg;

  if (showSvg) {
    const hoveredUrl = imageUrl!.replace(/\.svg$/i, '-hovered.svg');
    const thumbWrapCls = buildCls(styles.experienceThumbWrap, hoveredReady && styles.hasHovered);
    return (
      <div className={thumbWrapCls} aria-hidden="true">
        <span className={styles.experienceThumbDefault}>
          <span className={styles.experienceThumbSvg}>
            <SvgIcon src={imageUrl!} onError={() => setImageError(true)} />
          </span>
        </span>
        <span className={styles.experienceThumbHovered}>
          <span className={styles.experienceThumbSvg}>
            <SvgIcon src={hoveredUrl} onLoad={() => setHoveredReady(true)} />
          </span>
        </span>
      </div>
    );
  }

  if (showImg) {
    return <img src={imageUrl!} alt="" onError={() => setImageError(true)} />;
  }

  return <DefaultImage />;
}

export default ExperienceThumbnail;
