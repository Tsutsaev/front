import {getAllOrgMembers} from 'store/orgMembers/actions';
import {IOrgMembersListState} from 'store/orgMembers/types';
import {IOrganizationListState} from 'store/organizations/types';
import {getProjMemberById} from 'store/projectMembers/actions';
import {getUser} from 'store/user/actions';
import {IUserState} from 'store/user/types';

type StateProps = {
  orgMembers: IOrgMembersListState;
  user: IUserState;
  organizations: IOrganizationListState;
};

type DispatchProps = {
  getUser: typeof getUser;
  getProjMemberById: typeof getProjMemberById;
  getAllOrgMembers: typeof getAllOrgMembers;
};

export type Props = StateProps & DispatchProps;
