import {RootState} from 'store';

export const selectSearch = (state: RootState) => {
  return state.filters.search;
};

export const selectFilters = (state: RootState) => {
  return state.filters;
};
