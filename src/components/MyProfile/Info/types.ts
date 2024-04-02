import {getDepartmentsByOrg} from 'store/department/actions';
import {IDepartmentsListState} from 'store/department/types';
import {patchOrgMembers} from 'store/orgMembers/actions';
import {IOrgMembers} from 'store/orgMembers/types';
import {patchProfile} from 'store/Profile/actions';
import {getProjMemberById} from 'store/projectMembers/actions';
import {IProjMembersListState} from 'store/projectMembers/types';
import {IUserState} from 'store/user/types';

import {DropdownSingleType} from 'components/new/Dropdown/Single/types';

export type MyProfileInfoInput = {
  fio: string;
  phone: string;
  email: string;
  off: string;
  start_time: string;
  hour_rate: string;
};

export type MyProfileInfoDropdown = {
  fill_mode: DropdownSingleType;
  role: DropdownSingleType;
  current_project: DropdownSingleType;
  department_id: DropdownSingleType;
};

export type MyProfileInfoDate = {
  date_in: Date | null;
  date_out: Date | null;
};

export type MyProfileInfoDataType = MyProfileInfoInput & MyProfileInfoDropdown & MyProfileInfoDate;

type StateProps = {
  orgMember: IOrgMembers;
  user: IUserState;
  projectMembers: IProjMembersListState;
  canUseDepartments?: boolean;
  departments: IDepartmentsListState;
};

type DispatchProps = {
  patchOrgMembers: typeof patchOrgMembers;
  patchProfile: typeof patchProfile;
  getProjMemberById: typeof getProjMemberById;

  getDepartmentsByOrg: typeof getDepartmentsByOrg;
};

export type Props = StateProps & DispatchProps;
