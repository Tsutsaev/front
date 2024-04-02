import {IFiltersState} from 'store/filters/types';
import {getFilteredOrgMembers} from 'store/orgMembers/actions';
import {IOrgMembersListState} from 'store/orgMembers/types';

type StateProps = {
  orgMembers: IOrgMembersListState;
  filters: IFiltersState;
  currentOrgId: number | null;
};

type DispatchProps = {
  getFilteredOrgMembers: typeof getFilteredOrgMembers;
};

export type Props = StateProps & DispatchProps;
