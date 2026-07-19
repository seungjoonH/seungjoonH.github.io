// 프로젝트 그리드 컬럼 수·gap을 계산하는 훅
import { useEffect, useMemo, useRef, useState } from 'react';
import { useResponsive } from '@hooks/useResponsive';
import config from '../../../../config';

const MIN_CARD_WIDTH = 300;
const BASE_GAP = 12;
const ROW_GAP_BASE_COLUMNS = 6;
const ROW_GAP_SCALE = 6;
const ROW_GAP_MIN_PX = 20;

export interface ColumnBounds {
  min: number;
  max: number;
}

/** 브레이크포인트별 bounds + 컨테이너 실측 폭으로 컬럼 수·gap을 계산·조정한다. */
export function useProjectsGrid() {
  const { type } = useResponsive();
  const columnBounds = config.breakpoints.projectsGrid[type];

  const [columns, setColumns] = useState(4);
  const [containerWidth, setContainerWidth] = useState(window.innerWidth);
  const rowsContainerRef = useRef<HTMLDivElement>(null);
  const prevMaxColumnsRef = useRef<number | null>(null);

  useEffect(() => {
    const handleResize = () => {
      const width = rowsContainerRef.current?.clientWidth ?? window.innerWidth;
      setContainerWidth(width);
    };

    window.addEventListener('resize', handleResize);
    handleResize();
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  useEffect(() => {
    const target = rowsContainerRef.current;
    if (!target || typeof ResizeObserver === 'undefined') return;

    const observer = new ResizeObserver((entries) => {
      const width = entries[0]?.contentRect?.width;
      if (width) setContainerWidth(width);
    });
    observer.observe(target);
    return () => observer.disconnect();
  }, []);

  const effectiveBounds = useMemo<ColumnBounds>(() => {
    const theoreticalMax = Math.floor((containerWidth + BASE_GAP) / (MIN_CARD_WIDTH + BASE_GAP));
    const layoutMax = Math.max(1, theoreticalMax);
    let min = columnBounds.min;
    const max = Math.max(columnBounds.min, Math.min(columnBounds.max, layoutMax));
    if (min === max && columnBounds.max > columnBounds.min) {
      min = Math.max(1, columnBounds.min - 1);
    }
    return { min, max };
  }, [columnBounds, containerWidth]);

  useEffect(() => {
    const { min, max } = effectiveBounds;
    const prevMax = prevMaxColumnsRef.current;
    prevMaxColumnsRef.current = max;
    if (prevMax != null && max > prevMax) {
      setColumns(max);
      return;
    }
    setColumns((prev) => Math.min(max, Math.max(min, prev)));
  }, [effectiveBounds]);

  const handleChangeColumn = (next: number) =>
    setColumns(Math.min(effectiveBounds.max, Math.max(effectiveBounds.min, next)));

  const gap = `${Math.max(ROW_GAP_MIN_PX, (ROW_GAP_BASE_COLUMNS - columns) * ROW_GAP_SCALE)}px`;

  return {
    columns,
    gap,
    columnBounds,
    effectiveBounds,
    rowsContainerRef,
    handleChangeColumn,
  };
}
