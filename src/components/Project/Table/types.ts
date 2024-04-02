import {getAllClients} from 'store/clients/actions';
import {IClientState} from 'store/clients/types';
import {IFiltersState} from 'store/filters/types';
import {getFilteredProjects} from 'store/projects/actions';
import {IProjectListState} from 'store/projects/types';

type StateProps = {
  clients: IClientState;
  filters: IFiltersState;
  currentOrgId: number | null;
  projects: IProjectListState;
};

type DispatchProps = {
  getAllClients: typeof getAllClients;
  getFilteredProjects: typeof getFilteredProjects;
};

export type Props = StateProps & DispatchProps;
