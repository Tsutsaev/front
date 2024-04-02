import {getProjectsByOrg} from 'store/projects/actions';
import {IProjectListState} from 'store/projects/types';

import {DropdownSingleType} from 'components/new/Dropdown/Single/types';

export type InfoData = {
  fio: string;
  email: string | null;
  phone: string | null;
  role: NonNullable<DropdownSingleType>;
  off: string;
  hour_rate: string;
  fill_mode: NonNullable<DropdownSingleType>;
  current_project: DropdownSingleType;
  start_time: string;
  date_in: Date | null;
  date_out: Date | null;
  department_id: number | null;
};

export type CheckBoxData = {
  sheet_off: boolean;
  off_other: boolean;
  fulltime: boolean;
  fired: boolean;
};
export type Data = InfoData & CheckBoxData;

type StateProps = {
  currentOrgId: number | null;
  projects: IProjectListState;
};

type DispatchProps = {
  getProjectsByOrg: typeof getProjectsByOrg;
};

export type Props = StateProps & DispatchProps;
