import React, {PropsWithChildren} from 'react';
import styles from './index.module.css';

interface TableCellProps extends PropsWithChildren {
  style?: React.CSSProperties;
}

const TableCell = ({children, style}: TableCellProps) => {
  return (
    <div style={style} className={styles.container}>
      {children}
    </div>
  );
};

export default TableCell;
