import React from 'react';
import {WaveSpinner} from 'react-spinners-kit';
import styles from './Loader.module.scss';

const Loader = () => {
  return (
    <div className={styles.container}>
      <WaveSpinner size={50} color="#EF5D22" />
    </div>
  );
};

export default Loader;
