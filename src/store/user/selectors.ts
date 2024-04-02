import {RootState} from 'store';

export const selectRole = (state: RootState) => {
  return state.user.role;
};

export const selectCurrentOrgId = (state: RootState) => {
  return state.user.currentOrgId;
};

export const selectUser = (state: RootState) => {
  return state.user;
};
