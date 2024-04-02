import {getAllClients} from 'store/clients/actions';
import {IClientState} from 'store/clients/types';
import {getDepartmentsByOrg} from 'store/department/actions';
import {IDepartmentsListState} from 'store/department/types';

import {DropdownMultipleType} from 'components/new/Dropdown/Multiple/types';
import {DropdownSingleType} from 'components/new/Dropdown/Single/types';

export type InfoData = {
  name: string;
  client_id: DropdownSingleType;
  date_start: Date | null;
  date_end: Date | null;
  tags: DropdownMultipleType;
  budget: string;
  department_id: DropdownSingleType;
};

type StateProps = {
  currentOrgId: number | null;
  clients: IClientState;
  departments: IDepartmentsListState;
};

type DispatchProps = {
  getAllClients: typeof getAllClients;
  getDepartmentsByOrg: typeof getDepartmentsByOrg;
};

export type Props = StateProps & DispatchProps;
