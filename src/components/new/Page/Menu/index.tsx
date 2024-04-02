import React from 'react';
import styles from './index.module.scss';
import {IMenu} from './types';
import TooltipCustom from 'components/new/Tooltip';
import {reduceName} from 'utils';

const PageMenu = ({children, title}: IMenu) => {
  return (
    <div className={styles.menu}>
      <TooltipCustom limit={40} content={title}>
        <h1 className={styles.header}>{reduceName(title, 40)}</h1>
      </TooltipCustom>

      {children}
    </div>
  );
};

export default PageMenu;
