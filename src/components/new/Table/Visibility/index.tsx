import React from 'react';

import Button from 'components/new/Button';
import Folding from 'components/new/Folding';

import styles from './index.module.scss';
import {ITableVisibilityProps} from './types';

const TableVisibility = ({
  children,
  onSave,
  showSave,
  title = 'Видимость',
}: ITableVisibilityProps) => {
  return (
    <Folding title={title}>
      <div className={styles.row}>{children}</div>

      {showSave && (
        <Button type={'submit'} onClick={onSave}>
          Применить
        </Button>
      )}
    </Folding>
  );
};

export default TableVisibility;
