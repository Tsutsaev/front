import {DropdownMultipleType} from 'components/new/Dropdown/Multiple/types';
import {DropdownSingleType} from 'components/new/Dropdown/Single/types';
import {getAllClients} from 'store/clients/actions';
import {IClientState} from 'store/clients/types';
import {getOrgMembersByClientProjectDate} from 'store/orgMembers/actions';
import {IOrgMembersListState} from 'store/orgMembers/types';
import {getProjectsByClient, getProjectsByOrg} from 'store/projects/actions';
import {IProjectListState} from 'store/projects/types';
import {IUserState} from 'store/user/types';

export type DropdownState = {
  project: DropdownSingleType;
  client: DropdownSingleType;
  orgMember: DropdownMultipleType;
};

type StateProps = {
  orgMembers: IOrgMembersListState;
  user: IUserState;
  clients: IClientState;
  projects: IProjectListState;
};

type DispatchProps = {
  getAllClients: typeof getAllClients;
  getProjectsByClient: typeof getProjectsByClient;
  getProjectsByOrg: typeof getProjectsByOrg;
  getOrgMembersByClientProjectDate: typeof getOrgMembersByClientProjectDate;
};

export type Props = StateProps & DispatchProps;
