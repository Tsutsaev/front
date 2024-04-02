import {createAsyncThunk} from '@reduxjs/toolkit';
import {initialState} from './state';
import {IUser} from './types';
import {instance} from 'shared/lib';

export const logout = createAsyncThunk('auth/logout', () => {
  return initialState;
});

export const getUser = createAsyncThunk('user/getUser', async () => {
  const response = await instance.get<IUser>('/me/');
  return response.data;
});
