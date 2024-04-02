import React from 'react';
import styles from './index.module.scss';
import {INotActiveTableRowProps} from './types';
import TableRow from 'components/new/Table/Row';

const NotActiveTableRow = ({
  templateColumns,
  valueTime,
  valueDescription,
  date,
}: INotActiveTableRowProps) => {
  return (
    <TableRow isNotActive={true} color={'gray'} templateColumns={templateColumns}>
      <p className={styles.text}> {date}</p>
      <div className={styles.editing}>
        <p className={styles.text}>{valueTime}</p>{' '}
      </div>

      <div className={styles.editing}>
        <p className={styles.text}>{valueDescription}</p>
      </div>
    </TableRow>
  );
};

export default NotActiveTableRow;
