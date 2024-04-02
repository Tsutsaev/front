import {getAllClients} from 'store/clients/actions';
import {IClientState} from 'store/clients/types';
import {IFiltersState} from 'store/filters/types';

type StateProps = {
  clients: IClientState;
  filters: IFiltersState;
  currentOrgId: number | null;
  getAllClients: typeof getAllClients;
};

export type Props = StateProps;
