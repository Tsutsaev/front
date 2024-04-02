import React, {PropsWithChildren, useEffect, useState} from 'react';
import {axiosDocument, instance} from 'shared';
import {authUser} from 'store/user/slice';
import {IUser} from 'store/user/types';

import UseAppDispatch from 'hooks/UseAppDispatch';

import Loader from 'shared/uIkit';

type GetUserData = (token: string) => Promise<IUser>;

const getUserData: GetUserData = async token => {
  instance.defaults.headers.common['Authorization'] = `Token ${token}`;
  axiosDocument.defaults.headers.common['Authorization'] = `Token ${token}`;
  const res = await instance.get<IUser>('/me/');
  return res.data;
};

const AuthProvider = ({children}: PropsWithChildren) => {
  const token = localStorage.getItem('token');
  const profile_id = localStorage.getItem('profile_id');
  const dispatch = UseAppDispatch();
  const [isDataLoading, setIsDataLoading] = useState<boolean>(true);

  useEffect(() => {
    if (token && profile_id) {
      void getUserData(token)
        .then(data => dispatch(authUser(data)))
        .catch(() => localStorage.clear())
        .finally(() => setIsDataLoading(false));
    } else {
      localStorage.clear();
      setIsDataLoading(false);
    }
  }, [dispatch, profile_id, token]);

  if (isDataLoading) return <Loader />;

  return <>{children}</>;
};

export default AuthProvider;
