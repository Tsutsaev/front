import React from 'react';
import {ReactComponent as IconNotAcces} from 'shared/assets/images/fi-rr-cross.svg';
import {ReactComponent as IconAccess} from 'shared/assets/images/fi-rr-check.svg';
import styles from './index.module.scss';
import {MeCheckBoxesItemProps} from './types';

const MeCheckBoxesItem = ({title, access}: MeCheckBoxesItemProps) => {
  return (
    <div className={styles.variable}>
      <div className={`${styles.checkbox} ${access ? styles.access : styles.not__access} `}>
        {access ? <IconAccess /> : <IconNotAcces />}
      </div>
      <div className={styles.title}>{title}</div>
    </div>
  );
};

export default React.memo(MeCheckBoxesItem);
