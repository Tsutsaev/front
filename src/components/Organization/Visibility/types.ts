import {patchOrganizations} from 'store/organizations/actions';
import {IOrganization} from 'store/organizations/types';
import {getAllOrgMembers} from 'store/orgMembers/actions';
import {IOrgMembersListState} from 'store/orgMembers/types';
import {IUserState} from 'store/user/types';

type StateProps = {
  organization: IOrganization;
  currentOrgId: number | null;
  user: IUserState;
  orgMembers: IOrgMembersListState;
};

type DispatchProps = {
  patchOrganizations: typeof patchOrganizations;
  getAllOrgMembers: typeof getAllOrgMembers;
};

export type Props = StateProps & DispatchProps;
