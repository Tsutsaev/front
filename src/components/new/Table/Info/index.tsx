import React, {PropsWithChildren} from 'react';
import styles from './index.module.scss';
const TableInfo = ({children}: PropsWithChildren) => {
  return <div className={styles.container}>{children}</div>;
};

export default TableInfo;
