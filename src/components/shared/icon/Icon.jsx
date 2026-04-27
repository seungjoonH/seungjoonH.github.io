import { useState, useEffect } from 'react';
import Paths from '../../../utils/paths';
import { buildCls } from '../../../utils/cssUtil';
import { fetchSvgContent, injectSvgSize } from '../../../utils/inlineSvg';
import styles from './icon.module.css';
import { ICON_SIZES } from './types';

function sizeClassForIcon(size) {
  if (!size || !ICON_SIZES.includes(size)) return null;
  return styles[size === 'sm' ? 'iconSm' : size === 'lg' ? 'iconLg' : 'iconMd'];
}

function SvgInlineSpan({
  resolvedSrc,
  sizeClass,
  layoutClass,
  alt = '',
  onError,
  onLoad,
  ...rest
}) {
  const [svgContent, setSvgContent] = useState(null);
  const [failed, setFailed] = useState(false);

  useEffect(() => {
    if (!resolvedSrc || !String(resolvedSrc).toLowerCase().endsWith('.svg')) {
      setSvgContent(null);
      setFailed(true);
      onError?.();
      return;
    }
    setFailed(false);
    setSvgContent(null);

    fetchSvgContent(resolvedSrc)
      .then((text) => {
        setSvgContent(text);
        onLoad?.();
      })
      .catch(() => {
        setFailed(true);
        onError?.();
      });
  }, [resolvedSrc, onError]);

  if (failed || !svgContent) return null;

  const svgWithSize = injectSvgSize(svgContent);
  const ariaHidden = !String(alt || '').trim();
  const rootCls = buildCls(styles.iconRoot, sizeClass, layoutClass);

  return (
    <span
      role="img"
      aria-label={ariaHidden ? undefined : alt}
      aria-hidden={ariaHidden}
      className={rootCls}
      dangerouslySetInnerHTML={{ __html: svgWithSize }}
      {...rest}
    />
  );
}

/** 이름 기반 아이콘 (`Paths.icons`). */
export function Icon({ name, size, alt = '', onError, onLoad, ...rest }) {
  if (!name) return null;
  const resolvedSrc = Paths.icons(name);
  return (
    <SvgInlineSpan
      resolvedSrc={resolvedSrc}
      sizeClass={sizeClassForIcon(size)}
      layoutClass={styles.iconRootInline}
      alt={alt}
      onError={onError}
      onLoad={onLoad}
      {...rest}
    />
  );
}

/** URL 기반 SVG(썸네일 등). `name`과 동시에 쓰지 않는다. */
export function SvgIcon({ src, alt = '', onError, onLoad, ...rest }) {
  if (!src) return null;
  return (
    <SvgInlineSpan
      resolvedSrc={src}
      sizeClass={null}
      layoutClass={styles.iconRootBlock}
      alt={alt}
      onError={onError}
      onLoad={onLoad}
      {...rest}
    />
  );
}

export default Icon;
