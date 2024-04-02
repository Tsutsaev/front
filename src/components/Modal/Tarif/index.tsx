import Button from 'components/new/Button';
import React, {useState} from 'react';
import styles from './index.module.scss';
import {ReactComponent as CloseIcon} from 'shared/assets/images/fi-rr-cross.svg';
import {TarifModalProps} from './types';
import Input from 'components/new/Input';

const TarifModal = ({onSave, onClose}: TarifModalProps) => {
  const handleWrapperClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  const handleSave = () => {
    onSave(comment);
    onClose();
  };

  const [comment, setComment] = useState('');

  return (
    <div className={styles.wrapper} onClick={handleWrapperClick}>
      <div className={styles.container}>
        <div className={styles.close_button} onClick={onClose}>
          <CloseIcon />
        </div>
        <div className={styles.content}>
          <div className={styles.question}>
            Укажите причину, по которой вы желаете сменить тариф
          </div>
          <Input
            isMultiline
            isFocus
            value={comment}
            onChange={setComment}
            placeholder="Укажите причину"
          />
          <div className={styles.buttons}>
            <Button onClick={handleSave} type={'reset'}>
              Отправить запрос
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TarifModal;
