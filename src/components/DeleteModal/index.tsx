import Button from 'components/new/Button';
import React from 'react';
import styles from './index.module.scss';
import {DeleteModalProps} from './types';
import {ReactComponent as CloseIcon} from 'shared/assets/images/fi-rr-cross.svg';

const DeleteModal = ({onDelete, onClose, title}: DeleteModalProps) => {
  const handleWrapperClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  return (
    <div className={styles.wrapper} onClick={handleWrapperClick}>
      <div className={styles.container}>
        <div className={styles.close_button} onClick={onClose}>
          <CloseIcon />
        </div>
        <div className={styles.content}>
          <div className={styles.question}>Вы действительно хотите удалить {title} ?</div>
          <div className={styles.buttons}>
            <Button onClick={onDelete} type={'submit'}>
              Да
            </Button>
            <Button onClick={onClose} type={'reset'}>
              Нет
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DeleteModal;
