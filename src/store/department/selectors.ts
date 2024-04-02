import {RootState} from 'store';

export const selectDepartments = (state: RootState) => {
  return state.departments;
};
