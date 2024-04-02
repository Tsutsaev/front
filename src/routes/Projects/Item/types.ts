import {getAllClients} from 'store/clients/actions';
import {getProjMemberByProject} from 'store/projectMembers/actions';
import {IProjMembersListState} from 'store/projectMembers/types';
import {getProjectsById} from 'store/projects/actions';
import {IProjectListState} from 'store/projects/types';

type StateProps = {
  currentOrgId: number | null;
  projects: IProjectListState;
  projectMembers: IProjMembersListState;
};

type DispatchProps = {
  getProjectsById: typeof getProjectsById;
  getAllClients: typeof getAllClients;
  getProjMemberByProject: typeof getProjMemberByProject;
};

export type Props = StateProps & DispatchProps;
