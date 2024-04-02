import React, {FormEvent, useState} from 'react';
import Loader from 'shared/uIkit';
import styles from './index.module.scss';
import {instance} from 'shared';
import {useNavigate} from 'react-router-dom';

const ResetPasswordPage = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');

  const [isErrorShown, setIsErrorShown] = useState(false);
  const [isHelpShown, setIsHelpShown] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const onSubmit = async (event: FormEvent) => {
    setIsLoading(true);
    event.preventDefault();
    await instance
      .post('/password_reset/', {email})
      .catch(() => setIsErrorShown(true))
      .finally(() => setIsLoading(false));
    setIsErrorShown(false);
    setIsHelpShown(true);
  };

  return (
    <div className={styles.container}>
      <form className={styles.form} onSubmit={(e: FormEvent) => onSubmit(e)}>
        <h1 className={styles.text}>Восстановление пароля</h1>
        <div className={styles.fields}>
          <input
            type={'email'}
            value={email}
            autoComplete={'on'}
            onChange={e => setEmail(e.target.value)}
            placeholder={'Email'}
          />
        </div>
        <button className={styles.button} type="submit">
          Восстановить
        </button>
        <button type="button" className={styles.link} onClick={() => navigate('/auth')}>
          Войти
        </button>
        {isLoading && <Loader />}
        {isErrorShown && <p className={styles.text}>Проверьте введенные данные</p>}
        {isHelpShown && (
          <p className={styles.text}>
            На указанную почту было выслано письмо с ссылкой для восстановления
          </p>
        )}
      </form>

      <div className={styles.footer_container}>
        <p className={styles.copyrighy}>Billed © 2023</p>
      </div>
    </div>
  );
};

export default ResetPasswordPage;
