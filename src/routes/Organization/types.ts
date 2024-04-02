import {deleteOrganizations, getAllOrganizations} from 'store/organizations/actions';
import {IOrganizationListState} from 'store/organizations/types';
import {setCurrentOrgId} from 'store/user/slice';
import {IUserState} from 'store/user/types';

type StateProps = {
  currentOrgId: number | null;
  organizations: IOrganizationListState;
  user: IUserState;
};

type DispatchProps = {
  getAllOrganizations: typeof getAllOrganizations;
  deleteOrganizations: typeof deleteOrganizations;
  setCurrentOrgId: typeof setCurrentOrgId;
};

export type Props = StateProps & DispatchProps;
