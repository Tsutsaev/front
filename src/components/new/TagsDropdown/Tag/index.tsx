import React from 'react';
import {ReactComponent as CrossIcon} from 'shared/assets/images/fi-rr-cross.svg';
import styles from './index.module.css';

type DropdownTagProps = {
  value: string;
  onClick: () => void;
};

const DropdownTag = ({value, onClick}: DropdownTagProps) => {
  return (
    <div className={styles.tag__container}>
      <span>{value}</span>
      <CrossIcon onClick={onClick} />
    </div>
  );
};

export default DropdownTag;
