import React from 'react';

import Button from 'components/new/Button';

import styles from './index.module.css';
import {IModalOff} from './types';

const ProjectMemberOffModal = ({handleSave}: IModalOff) => {
  return (
    <div className={styles.page}>
      <div className={styles.container}>
        <span>Обновить существующие?</span>
        <div className={styles.buttons}>
          <Button onClick={() => handleSave(true)} type={'submit'}>
            Да
          </Button>
          <Button type={'reset'} onClick={() => handleSave(false)}>
            Нет
          </Button>
        </div>
      </div>
    </div>
  );
};

export default ProjectMemberOffModal;
