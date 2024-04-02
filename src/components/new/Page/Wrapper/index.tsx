import React, {PropsWithChildren} from 'react';
import styles from './index.module.scss';

const PageWrapper = ({children}: PropsWithChildren) => {
  return <div className={styles.container}>{children}</div>;
};

export default PageWrapper;
