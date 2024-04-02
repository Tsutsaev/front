import Button from 'components/new/Button';
import React, {useState} from 'react';
import styles from './index.module.scss';
import {ReactComponent as CloseIcon} from 'shared/assets/images/fi-rr-cross.svg';
import {SupportModalProps} from './types';
import Input from 'components/new/Input';

const SupportModal = ({onSave, onClose}: SupportModalProps) => {
  const handleWrapperClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  const [question, setQuestion] = useState('');

  const handleSave = () => {
    onSave(question);
    onClose();
  };

  return (
    <div className={styles.wrapper} onClick={handleWrapperClick}>
      <div className={styles.container}>
        <div className={styles.close_button} onClick={onClose}>
          <CloseIcon />
        </div>
        <div className={styles.content}>
          <div className={styles.question}>
            Задайте вопрос в поддержку и мы ответим Вам в ближайшее время
          </div>
          <Input
            isMultiline
            isFocus
            value={question}
            onChange={setQuestion}
            placeholder="Введите вопрос"
          />
          <div className={styles.buttons}>
            <Button onClick={handleSave} type={'reset'}>
              Отправить вопрос
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SupportModal;
