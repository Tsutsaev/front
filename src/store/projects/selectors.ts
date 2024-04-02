import {RootState} from 'store';

export const selectProjects = (state: RootState) => {
  return state.projects;
};
