import {IClientState} from 'store/clients/types';
import {getDepartmentsByOrg} from 'store/department/actions';
import {IDepartmentsListState} from 'store/department/types';
import {patchProject} from 'store/projects/actions';
import {IProjectState} from 'store/projects/types';

import {DropdownMultipleType} from 'components/new/Dropdown/Multiple/types';
import {DropdownSingleType} from 'components/new/Dropdown/Single/types';

export type ProjectInfoInput = {
  name: string;

  budget: string | null;
};

export type ProjectInfoDropdown = {
  client_id: DropdownSingleType;
  tags: DropdownMultipleType;
  department_id: DropdownSingleType;
};

export type ProjectInfoDate = {
  date_start: Date;
  date_end: Date | null;
};

export type ProjectInfoDataType = ProjectInfoInput & ProjectInfoDropdown & ProjectInfoDate;

type StateProps = {
  project: IProjectState;
  currentOrgId: number | null;
  clients: IClientState;
  onCreate?: (data: ProjectInfoDataType) => void;
  departments: IDepartmentsListState;
};

type DispatchProps = {
  patchProject: typeof patchProject;
  getDepartmentsByOrg: typeof getDepartmentsByOrg;
};

export type Props = StateProps & DispatchProps;
