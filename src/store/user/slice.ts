import {createSlice, PayloadAction} from '@reduxjs/toolkit';

import {getUser} from './actions';
import {initialState} from './state';
import {IUser} from './types';

import {patchMyProfileAvatar} from 'store/Profile/actions';
const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    authUser: (state, action: PayloadAction<IUser>) => {
      state.data = action.payload;
      state.isLogged = true;
    },
    logoutUser: state => {
      state.isLogged = false;
      state.data = initialState.data;
    },
    setCurrentOrgId: (state, action: PayloadAction<number>) => {
      state.currentOrgId = action.payload;
    },
    setRole: (state, action: PayloadAction<'manager' | 'employee'>) => {
      state.role = action.payload;
    },
    setIsTopManager: (state, action: PayloadAction<boolean>) => {
      state.isTopManager = action.payload;
    },
    setSheetOff: (state, action: PayloadAction<boolean>) => {
      state.sheetOff = action.payload;
    },
  },
  extraReducers: builder => {
    builder
      .addCase(getUser.pending, state => {
        state.status = 'loading';
      })
      .addCase(getUser.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.data = action.payload;
      })
      .addCase(getUser.rejected, state => {
        state.status = 'failed';
      })
      .addCase(patchMyProfileAvatar.fulfilled, (state, action) => {
        state.data = {...state.data, avatar: action.payload.avatar};
      });
  },
});

export default userSlice.reducer;
export const {setRole, setIsTopManager, authUser, logoutUser, setCurrentOrgId, setSheetOff} =
  userSlice.actions;
