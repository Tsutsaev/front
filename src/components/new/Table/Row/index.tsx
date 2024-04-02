import React from 'react';
import styles from './index.module.scss';
import {ITableRowProps} from './types';

const TableRow = ({
  dayType = 'working__day',
  color = 'gray',
  templateColumns,
  children,
  isNotActive = false,
}: ITableRowProps) => {
  return (
    <div
      className={`${styles.container} ${styles[dayType]} ${styles[color]} ${
        isNotActive && styles.not__active
      }`}
      style={{gridTemplateColumns: templateColumns}}>
      {children}
    </div>
  );
};

export default TableRow;
