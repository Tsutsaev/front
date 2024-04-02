import React, {FormEvent, useEffect, useState} from 'react';
import UseAppSelector from 'hooks/UseAppSelector';
import styles from './index.module.scss';
import {instance} from 'shared';
import {ExpectedType, IAuthResponse} from './types';
import Loader from 'shared/uIkit';
import {useNavigate} from 'react-router-dom';
import UseAppDispatch from 'hooks/UseAppDispatch';
import {authUser} from 'store/user/slice';
import {AxiosError} from 'axios';

const LoginPage = () => {
  const dispatch = UseAppDispatch();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const {isLogged} = UseAppSelector(state => state.user);

  const navigate = useNavigate();

  useEffect(() => {
    if (isLogged) {
      navigate('/');
    }
  }, [isLogged, navigate]);

  const onSubmit = async (event: FormEvent) => {
    setIsLoading(true);
    event.preventDefault();
    await instance
      .post<IAuthResponse>('/api-token-auth/', {username, password})
      .then(({data}) => {
        localStorage.setItem('token', data.token);
        localStorage.setItem('profile_id', data.profile.id);
        instance.defaults.headers.common['Authorization'] = `Token ${data.token}`;
        dispatch(authUser(data.profile));
        setError('');
      })
      .catch((e: AxiosError) => {
        if (e.response) {
          const responseData = e.response.data as ExpectedType; // Replace YourExpectedType with the actual expected type

          setError(responseData.error || responseData.non_field_errors);
        }
      })
      .finally(() => setIsLoading(false));
  };

  return (
    <div className={styles.container}>
      <form className={styles.form} onSubmit={(e: FormEvent) => onSubmit(e)}>
        <h1 className={styles.text}>Пожалуйста, авторизуйтесь</h1>
        <div className={styles.fields}>
          <input
            type={'email'}
            value={username}
            autoComplete={'on'}
            onChange={e => setUsername(e.target.value)}
            placeholder={'Email'}
          />
          <input
            type={'password'}
            value={password}
            autoComplete={'on'}
            onChange={e => setPassword(e.target.value)}
            placeholder={'Пароль'}
          />
        </div>
        <button className={styles.button} type="submit">
          Войти
        </button>
        <button type="button" className={styles.link} onClick={() => navigate('/password_reset')}>
          Забыли пароль
        </button>
        {isLoading && <Loader />}
        {error && <p className={styles.text}>{error}</p>}
      </form>
      <div className={styles.footer_container}>
        <p className={styles.copyrighy}>Billed © 2023</p>
      </div>
    </div>
  );
};

export default LoginPage;
