import React, {useState} from 'react';
import {setIsFired} from 'store/filters/slice';

import UseAppDispatch from 'hooks/UseAppDispatch';

import {ReactComponent as FiredIcon} from 'shared/assets/images/isFired.svg';

import styles from './index.module.scss';
import {Props} from './types';

const FiredFilter = ({text = 'Уволен'}: Props) => {
  const dispatch = UseAppDispatch();

  const [isFiredActive, setIsFiredActive] = useState(false);

  const toggleFired = () => {
    dispatch(setIsFired(!isFiredActive));
    setIsFiredActive(prev => !prev);
  };

  return (
    <button
      onClick={toggleFired}
      className={`${styles.container} ${isFiredActive ? styles.active : ''}`}>
      <FiredIcon />
      {text}
    </button>
  );
};

export default FiredFilter;
