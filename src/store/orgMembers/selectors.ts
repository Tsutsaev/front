import {RootState} from 'store';

export const selectOrgMembers = (state: RootState) => {
  return state.orgMembers;
};
