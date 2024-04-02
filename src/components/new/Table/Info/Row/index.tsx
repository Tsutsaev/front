import React, {memo} from 'react';

import styles from './index.module.scss';
import {TableInfoRowProps} from './types';
import SwitchContainer from 'components/new/SwitchContainer';

const TableInfoRow = (props: TableInfoRowProps) => {
  const {title, children, value} = props;
  return (
    <div className={styles.row}>
      <div className={styles.title}>{title}</div>
      <div className={styles.action}>
        <SwitchContainer {...props} value={value || 'Заполните поле'}>
          {children}
        </SwitchContainer>
      </div>
    </div>
  );
};

export default memo(TableInfoRow);
