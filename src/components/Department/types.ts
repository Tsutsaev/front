import {patchDepartment} from 'store/department/actions';
import {Department} from 'store/department/types';
import {patchOrgMembers} from 'store/orgMembers/actions';
import {IOrgMembersListState} from 'store/orgMembers/types';

type StateProps = {
  department: Department;
  orgMembers: IOrgMembersListState;
  currentOrgId: number | null;
};

type DispatchProps = {
  patchDepartment: typeof patchDepartment;
  patchOrgMembers: typeof patchOrgMembers;
};

export type Props = StateProps & DispatchProps;
