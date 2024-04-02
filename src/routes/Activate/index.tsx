import React, {useEffect, useState} from 'react';
import Loader from 'shared/uIkit';
import styles from './index.module.scss';
import {useLocation, useNavigate} from 'react-router-dom';
import {SearchParams} from './types';
import {instance} from 'shared';

const Activate = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [data, setData] = useState({
    passwordFirst: '',
    passwordSecond: '',
  });
  const [isErrorShown, setIsErrorShown] = useState(false);
  const [searchParams, setSearchParams] = useState<SearchParams>({
    uid: '',
    token: '',
  });
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const urlSearchParams = new URLSearchParams(location.search);

    setSearchParams({
      uid: urlSearchParams.get('uid'),
      token: urlSearchParams.get('token'),
    });
  }, [location.search]);

  const onSubmit = async () => {
    if (data.passwordFirst === data.passwordSecond) {
      setIsLoading(true);
      const postData = {
        password: data.passwordFirst,
        ...searchParams,
      };
      await instance.post('/activate/', postData);
      setIsErrorShown(false);
      navigate('/auth');
    } else {
      setIsErrorShown(true);
    }
  };

  return (
    <div className={styles.container}>
      <div className={styles.form}>
        <h1 className={styles.text}>Активация</h1>
        <div className={styles.fields}>
          <input
            type={'password'}
            value={data.passwordFirst}
            autoComplete={'on'}
            onChange={e => setData(prev => ({...prev, passwordFirst: e.target.value}))}
            placeholder={'Пароль'}
          />
          <input
            type={'password'}
            value={data.passwordSecond}
            autoComplete={'on'}
            onChange={e => setData(prev => ({...prev, passwordSecond: e.target.value}))}
            placeholder={'Повторите пароль'}
          />
        </div>
        <button className={styles.button} onClick={onSubmit}>
          Активировать
        </button>
        <button type="button" className={styles.link} onClick={() => navigate('/auth')}>
          Войти
        </button>
        {isLoading && <Loader />}
        {isErrorShown && <p className={styles.text}>Проверьте введённые данные</p>}
      </div>

      <div className={styles.footer_container}>
        <p className={styles.copyrighy}>Billed © 2023</p>
      </div>
    </div>
  );
};

export default Activate;
