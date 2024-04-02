import {IFiltersState} from 'store/filters/types';
import {IUserState} from 'store/user/types';

export type StateProps = {
  filters: IFiltersState;
  user: IUserState;
};
