import {RootState} from 'store';

export const selectClients = (state: RootState) => {
  return state.clients;
};
