import { Icon } from './Icon';
import styles from './iconButton.module.css';
import { buildCls } from '../../../utils/cssUtil';
import { ICON_BUTTON_SIZES, ICON_BUTTON_VARIANTS } from './types';

const sizeToClass = { sm: 'iconButtonSm', md: 'iconButtonMd', lg: 'iconButtonLg' };
const variantToClass = { default: 'iconButtonDefault', ghost: 'iconButtonGhost' };

export function IconButton({ name, size = 'md', variant = 'default', className, children, ...rest }) {
  const sizeClass = ICON_BUTTON_SIZES.includes(size) ? styles[sizeToClass[size]] : styles.iconButtonMd;
  const variantClass = ICON_BUTTON_VARIANTS.includes(variant) ? styles[variantToClass[variant]] : styles.iconButtonDefault;
  return (
    <button type="button" className={buildCls(styles.iconButton, sizeClass, variantClass, className)} {...rest}>
      <Icon name={name} size={size} />
      {children}
    </button>
  );
}

export default IconButton;
