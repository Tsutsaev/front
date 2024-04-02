import React, {useState} from 'react';
import styles from './index.module.scss';
import {ReactComponent as FiredIcon} from 'shared/assets/images/isFired.svg';

interface ISwitchContainer {
  onChange: (value: boolean) => void;
  title: string;
}

const SwitchFilter = ({onChange, title}: ISwitchContainer) => {
  const [isActive, setIsActive] = useState(false);
  const handleClick = () => {
    onChange(!isActive);
    setIsActive(prev => !prev);
  };
  return (
    <button
      onClick={handleClick}
      className={`${styles.container} ${isActive ? styles.active : ''}`}>
      <FiredIcon /> {title}
    </button>
  );
};

export default SwitchFilter;
