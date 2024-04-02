import {deleteRest, updateRest} from 'store/rest/actions';
import {RestData} from 'store/rest/types';
import {IUserState} from 'store/user/types';

type StateProps = {
  rest: RestData;
  user: IUserState;
  color?: 'gray' | 'white';
};

type DispatchProps = {
  updateRest: typeof updateRest;
  deleteRest: typeof deleteRest;
};

export type Props = StateProps & DispatchProps;
