import {DropdownSingleType} from 'components/new/Dropdown/Single/types';
import {getAllOrgMembers} from 'store/orgMembers/actions';
import {IOrgMembersListState} from 'store/orgMembers/types';

type StateProps = {
  orgMembers: IOrgMembersListState;
  currentOrgId: number | null;
};

type DispatchProps = {
  getAllOrgMembers: typeof getAllOrgMembers;
};

export type Props = StateProps & DispatchProps;

export type ResponceBitrixUsers = {
  users: BitrixUser[];
};

export type BitrixUser = {
  id: number;
  email: string;
  fio: string;
};

export type ResponceBitrixUsersAnswer = {
  users: BitrixUserAnsver[];
};

export type BitrixUserAnsver = {
  bitrix_uid: number;
  profile_id: number;
  integrity: boolean;
};

export type Pair = {
  bitrix_uid: number;
  value: DropdownSingleType;
};
