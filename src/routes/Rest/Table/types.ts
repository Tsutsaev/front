import {IFiltersState} from 'store/filters/types';
import {getAllOrgMembers} from 'store/orgMembers/actions';
import {IOrgMembersListState} from 'store/orgMembers/types';
import {createRest, getAllRest, getFilteredRest} from 'store/rest/actions';
import {IRestListState} from 'store/rest/types';
import {IUserState} from 'store/user/types';

import {DropdownSingleType} from 'components/new/Dropdown/Single/types';

export type NewRest = {
  date_from: Date | null;
  date_to: Date | null;
  tags: NonNullable<DropdownSingleType>;
  profile: NonNullable<DropdownSingleType>;
};

interface RestTableProps {
  addingLine: boolean;
  setAddingLine: (value: boolean) => void;
}

interface StateProps {
  filters: IFiltersState;
  user: IUserState;
  rest: IRestListState;
  orgMembers: IOrgMembersListState;
}

interface DispatchProps {
  getAllOrgMembers: typeof getAllOrgMembers;
  getAllRest: typeof getAllRest;
  createRest: typeof createRest;
  getFilteredRest: typeof getFilteredRest;
}

export type Props = RestTableProps & StateProps & DispatchProps;
