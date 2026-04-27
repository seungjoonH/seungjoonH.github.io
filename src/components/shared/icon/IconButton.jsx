import { Icon } from './Icon';
import styles from './iconButton.module.css';
import { buildCls } from '../../../utils/cssUtil';
import { ICON_BUTTON, ICON_BUTTON_SIZES, ICON_BUTTON_VARIANTS } from './types';

export function IconButton({ name, size = 'md', variant = 'default', children, ...rest }) {
  const sizeKey = ICON_BUTTON_SIZES.includes(size) ? size : 'md';
  const variantKey = ICON_BUTTON_VARIANTS.includes(variant) ? variant : 'default';
  const sizeClass = styles[ICON_BUTTON.sizes[sizeKey]];
  const variantClass = styles[ICON_BUTTON.variants[variantKey]];
  const btnCls = buildCls(styles.iconButton, sizeClass, variantClass);
  return (
    <button type="button" className={btnCls} {...rest}>
      <Icon name={name} size={size} />
      {children}
    </button>
  );
}

export default IconButton;
