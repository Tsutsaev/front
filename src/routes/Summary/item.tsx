import React from 'react';
import {reduceValue} from 'utils';

import TooltipCustom from 'components/new/Tooltip';

import styles from './index.module.scss';

type Props = {
  content?: number;
};

const SummaryItem = ({content}: Props) => {
  return (
    <TooltipCustom content={content?.toLocaleString()}>
      <p className={styles.text}>{reduceValue(content, 15) || ''}</p>
    </TooltipCustom>
  );
};

export default SummaryItem;
