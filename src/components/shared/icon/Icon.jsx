import { useState, useEffect } from 'react';
import Paths from '../../../utils/paths';
import { buildCls } from '../../../utils/cssUtil';
import { fetchSvgContent, injectSvgSize } from '../../../utils/inlineSvg';
import styles from './icon.module.css';
import { ICON_SIZES } from './types';

export function Icon({
  name,
  src: srcProp,
  size,
  className,
  alt = '',
  'aria-hidden': ariaHidden = true,
  onError,
  onLoad,
  ...rest
}) {
  const [svgContent, setSvgContent] = useState(null);
  const [failed, setFailed] = useState(false);

  const resolvedSrc = srcProp || (name ? Paths.icons(name) : '');
  const isFullBleed = Boolean(srcProp);

  const sizeClass = !isFullBleed && size && ICON_SIZES.includes(size)
    ? styles[size === 'sm' ? 'iconSm' : size === 'lg' ? 'iconLg' : 'iconMd']
    : null;

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

  const wrapperStyle = isFullBleed
    ? { display: 'block', width: '100%', height: '100%', lineHeight: 0 }
    : { display: 'inline-block', lineHeight: 0 };

  return (
    <span
      role="img"
      aria-label={alt || undefined}
      aria-hidden={ariaHidden}
      className={buildCls(styles.iconRoot, sizeClass, className)}
      style={wrapperStyle}
      dangerouslySetInnerHTML={{ __html: svgWithSize }}
      {...rest}
    />
  );
}

export default Icon;
