import React from 'react';
import {IPaginationTimeButton} from './types';
import {ReactComponent as LeftArrow} from 'shared/assets/images/fi-rr-angle-double-small-left.svg';
import {ReactComponent as RightArrow} from 'shared/assets/images/fi-rr-angle-double-small-right.svg';
import styles from './index.module.scss';

const PaginationTimeButton = ({setPage, page}: IPaginationTimeButton) => {
  return (
    <div className={styles.container}>
      <button onClick={() => setPage(page - 1)} className={`${styles.button} ${styles.left}`}>
        {<LeftArrow />} Пред. неделя
      </button>
      <button onClick={() => setPage(0)} className={`${styles.button} ${styles.center}`}>
        Тек. неделя
      </button>
      <button onClick={() => setPage(page + 1)} className={`${styles.button} ${styles.right}`}>
        След. неделя {<RightArrow />}
      </button>
    </div>
  );
};

export default PaginationTimeButton;
