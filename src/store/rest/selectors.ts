import {RootState} from 'store';

export const selectRest = (state: RootState) => {
  return state.rest;
};
