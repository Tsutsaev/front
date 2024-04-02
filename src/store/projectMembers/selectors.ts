import {RootState} from 'store';

export const selectProjectMembers = (state: RootState) => {
  return state.projMembers;
};
