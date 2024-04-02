import React from 'react';
import {ReactComponent as AgreedIcon} from 'shared/assets/images/Yes.svg';
import DisagreeIcon from 'shared/assets/images/No.png';
import styles from './index.module.scss';

interface IAgreedSwitcherProps {
  agreed?: boolean;
  editable?: boolean;
  onClick?: () => void;
}

const AgreedSwitcher = ({agreed, editable, onClick}: IAgreedSwitcherProps) => {
  const statusIcon = agreed ? <AgreedIcon /> : <img src={DisagreeIcon} alt={'status'} />;

  if (!editable) return <div className={styles.agreed__button}>{statusIcon}</div>;

  return (
    <button onClick={onClick} className={styles.agreed__button}>
      {statusIcon}
    </button>
  );
};

export default AgreedSwitcher;
