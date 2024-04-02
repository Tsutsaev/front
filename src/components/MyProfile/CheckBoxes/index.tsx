import React from 'react';
import styles from './index.module.scss';
import MeCheckBoxesItem from './Item';
import {MeCheckBoxesProps} from './types';

const MeCheckBoxes = ({orgMember}: MeCheckBoxesProps) => {
  return (
    <div className={styles.container}>
      <div className={styles.row}>
        <MeCheckBoxesItem access={orgMember.sheet_off} title="Заполнение часов" />
        <MeCheckBoxesItem access={orgMember.off_other} title="Списание часов в системе заказчика" />
        <MeCheckBoxesItem access={orgMember.fulltime} title="Работает полный день" />
        <MeCheckBoxesItem access={orgMember.fired} title="Уволен" />
      </div>
    </div>
  );
};

export default MeCheckBoxes;
