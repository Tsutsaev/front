import {createDepartment, getDepartmentsByOrg} from 'store/department/actions';
import {IDepartmentsListState} from 'store/department/types';
import {IUserState} from 'store/user/types';

export type StateProps = {
  currentOrgId: number | null;
  departments: IDepartmentsListState;
  user: IUserState;
};

type DispatchProps = {
  getDepartmentsByOrg: typeof getDepartmentsByOrg;
  createDepartment: typeof createDepartment;
};

export type Props = StateProps & DispatchProps;
