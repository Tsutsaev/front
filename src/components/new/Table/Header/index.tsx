import React from 'react';
import styles from './index.module.scss';
import {ITableHeaderProps} from './types';
import {ReactComponent as IconSort} from 'shared/assets/images/sort.svg';

const TableHeader = ({titles, templateColumns, isSmall}: ITableHeaderProps) => {
  return (
    <div
      className={`${styles.container} ${isSmall ? styles.small_container : ''}`}
      style={{gridTemplateColumns: templateColumns}}>
      {titles.map((item, index) => (
        <div
          key={item.title || index}
          className={`${styles.cell} ${isSmall ? styles.small_cell : ''}`}
          style={{textAlign: item.align, justifyContent: `${item.align}`}}>
          {item.icon} {item.title}
          {item.sort && (
            <button onClick={item.sort} className={styles.sort}>
              <IconSort />
            </button>
          )}
        </div>
      ))}
    </div>
  );
};

export default TableHeader;
