import {patchOrgMembers} from 'store/orgMembers/actions';
import {IOrgMembersListState} from 'store/orgMembers/types';
import {IUserState} from 'store/user/types';

export type StateProps = {
  currentOrgId: number | null;
  orgMembers: IOrgMembersListState;
  user: IUserState;
};

type DispatchProps = {
  patchOrgMembers: typeof patchOrgMembers;
};

export type Props = StateProps & DispatchProps;
