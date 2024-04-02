import {deleteDepartment, getDepartmentById} from 'store/department/actions';
import {IDepartmentsListState} from 'store/department/types';
import {IOrganizationListState} from 'store/organizations/types';
import {getFilteredOrgMembers} from 'store/orgMembers/actions';
import {IUserState} from 'store/user/types';

type StateProps = {
  currentOrgId: number | null;
  organizations: IOrganizationListState;
  user: IUserState;
  departments: IDepartmentsListState;
};

type DispatchProps = {
  getDepartmentById: typeof getDepartmentById;
  deleteDepartment: typeof deleteDepartment;
  getFilteredOrgMembers: typeof getFilteredOrgMembers;
};

export type Props = StateProps & DispatchProps;
