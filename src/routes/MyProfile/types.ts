import {getOrgMemberById} from 'store/orgMembers/actions';
import {IOrgMembersListState} from 'store/orgMembers/types';
import {getProjMemberById} from 'store/projectMembers/actions';
import {IUserState} from 'store/user/types';

type StateProps = {
  orgMembers: IOrgMembersListState;
  user: IUserState;
};

type DispatchProps = {
  getProjMemberById: typeof getProjMemberById;
  getOrgMemberById: typeof getOrgMemberById;
};

export type Props = StateProps & DispatchProps;
