import React from 'react';

import {Tooltip} from 'react-tooltip';
import {ITooltipProps} from './types';

import styles from './index.module.scss';

const TooltipCustom = ({children, content, limit = 25}: ITooltipProps) => {
  return (
    <>
      <div data-tooltip-id={'my-tooltip' + content} data-tooltip-content={content}>
        {children}
      </div>
      {content && content.length >= limit && (
        <Tooltip id={'my-tooltip' + content} className={styles.tooltip} />
      )}
    </>
  );
};

export default TooltipCustom;
