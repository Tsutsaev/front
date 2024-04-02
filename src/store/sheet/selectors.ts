import {RootState} from 'store';

export const selectSheets = (state: RootState) => {
  return state.sheets;
};
