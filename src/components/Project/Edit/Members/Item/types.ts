import {deleteProjectMember, patchProjectMember} from 'store/projectMembers/actions';
import {IProjMembersListState, ProjectMembers} from 'store/projectMembers/types';

export type ProjMemberData = {
  date_out: Date | null;
  off: string;
};

type StateProps = {
  currentOrgId: number | null;
  projectMembers: IProjMembersListState;
  data: ProjectMembers;
  templateColumns: string;
};

type DispatchProps = {
  deleteProjectMember: typeof deleteProjectMember;
  patchProjectMember: typeof patchProjectMember;
};

export type Props = StateProps & DispatchProps;
