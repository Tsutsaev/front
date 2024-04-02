import {IOrgMembersListState} from 'store/orgMembers/types';
import {IProjMembersListState} from 'store/projectMembers/types';
import {createSheets, getAllMySheets} from 'store/sheet/actions';
import {ISheetListState} from 'store/sheet/types';
import {IUserState} from 'store/user/types';

type StateProps = {
  orgMembers: IOrgMembersListState;
  user: IUserState;
  sheets: ISheetListState;
  projectMembers: IProjMembersListState;
};

type DispatchProps = {
  getAllMySheets: typeof getAllMySheets;
  createSheets: typeof createSheets;
};

export type Props = StateProps & DispatchProps;
