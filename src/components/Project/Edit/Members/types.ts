import {IFiltersState} from 'store/filters/types';
import {getFilteredOrgMembers} from 'store/orgMembers/actions';
import {IOrgMembersListState} from 'store/orgMembers/types';
import {createProjectMember, getProjMemberByProject} from 'store/projectMembers/actions';
import {IProjMembersListState} from 'store/projectMembers/types';

import {DropdownSingleType} from 'components/new/Dropdown/Single/types';

export type CreateData = {
  profile_id: DropdownSingleType;
  off: string;
};

type StateProps = {
  currentOrgId: number | null;
  projectMembers: IProjMembersListState;
  filters: IFiltersState;
  orgMembers: IOrgMembersListState;
};

type DispatchProps = {
  getProjMemberByProject: typeof getProjMemberByProject;
  getFilteredOrgMembers: typeof getFilteredOrgMembers;
  createProjectMember: typeof createProjectMember;
};

export type Props = StateProps & DispatchProps;
