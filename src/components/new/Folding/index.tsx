import React, {useState} from 'react';

import Button from 'components/new/Button';

import {ReactComponent as IconArrowDown} from 'shared/assets/images/fi-rr-angle-down.svg';
import {ReactComponent as IconArrowUp} from 'shared/assets/images/fi-rr-angle-up.svg';

import styles from './index.module.scss';
import {FoldingProps} from './types';

const Folding = ({children, title}: FoldingProps) => {
  const [isShownContent, setIsShownContent] = useState(false);
  const handleShow = () => {
    setIsShownContent(prev => !prev);
  };

  return (
    <div className={styles.wrapper}>
      <div className={styles.panel}>
        <div className={styles.header}>{title}</div>
        <Button type="icon" onClick={handleShow}>
          {isShownContent ? <IconArrowUp /> : <IconArrowDown />}
        </Button>
      </div>
      {isShownContent && children}
    </div>
  );
};

export default Folding;
