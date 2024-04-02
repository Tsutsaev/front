import {deleteClient, getAllClients, getClientById} from 'store/clients/actions';
import {IClientState} from 'store/clients/types';
import {getProjectsByClient} from 'store/projects/actions';
import {IUserState} from 'store/user/types';

type StateProps = {
  clients: IClientState;
  user: IUserState;
};

type DispatchProps = {
  deleteClient: typeof deleteClient;
  getClientById: typeof getClientById;
  getProjectsByClient: typeof getProjectsByClient;
  getAllClients: typeof getAllClients;
};

export type Props = StateProps & DispatchProps;
