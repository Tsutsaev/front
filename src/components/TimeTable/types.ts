import {IOrgMembersListState} from 'store/orgMembers/types';
import {getSheetsByWeek} from 'store/sheet/actions';
import {ISheetListState} from 'store/sheet/types';
import {IUserState} from 'store/user/types';

type StateProps = {
  orgMembers: IOrgMembersListState;
  user: IUserState;
  sheets: ISheetListState;
  page: number;
};

type DispatchProps = {
  getSheetsByWeek: typeof getSheetsByWeek;
};

export type Props = StateProps & DispatchProps;
