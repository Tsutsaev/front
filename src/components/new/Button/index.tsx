import React, {useMemo} from 'react';

import ButtonProps from 'components/new/Button/types';

import styles from './index.module.scss';

const className = {
  ['icon']: styles.button__with__icon,
  ['submit']: styles.submit__button,
  ['reset']: styles.reset__button,
  ['check']: styles.check__button,
  ['disabled']: styles.disabled,
};

const Button = ({onClick, children, type, style}: ButtonProps) => {
  const classList = useMemo(() => className[type] || '', [type]);

  return (
    <button style={style} onClick={onClick} className={classList}>
      {children}
    </button>
  );
};

export default Button;
