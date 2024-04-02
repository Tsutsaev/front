import React from 'react';
import {ReactComponent as IconNotAcces} from 'shared/assets/images/fi-rr-cross.svg';
import {ReactComponent as IconAccess} from 'shared/assets/images/fi-rr-check.svg';
import styles from './index.module.scss';
import {IVisibilityToggleCheckBoxProps} from './types';

const VisibilityToggleCheckBox = <T,>({
  title,
  visibility,
  setVisibility,
  field,
}: IVisibilityToggleCheckBoxProps<T>) => {
  const toggleChange = () => {
    setVisibility({...visibility, [field]: !visibility[field as keyof typeof visibility]});
  };

  return (
    <div className={styles.variable}>
      <div
        onClick={toggleChange}
        className={`${styles.checkbox} ${
          visibility[field as keyof typeof visibility] ? styles.visible : styles.not__visible
        } `}>
        {visibility[field as keyof typeof visibility] ? <IconAccess /> : <IconNotAcces />}
      </div>
      <div className={styles.title}>{title}</div>
    </div>
  );
};

export default React.memo(VisibilityToggleCheckBox);
