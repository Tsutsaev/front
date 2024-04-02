import {IOrganization} from 'store/organizations/types';
import {IUserSmall} from 'store/user/types';

import {DropdownMultipleType} from 'components/new/Dropdown/Multiple/types';

export type IDepartmentsListState = {
  departmentsStatus: string;
  departments: Department[];
};

export type Department = {
  id: number;
  organization: IOrganization;
  organization_id: number;
  name: string;
  created_by: IUserSmall;
  created_by_id: number;
  created_at: string;
};

export type DepartmentInfoType = {
  name: string;
  created_at: string;
  created_by: string;
  managers: DropdownMultipleType;
};
