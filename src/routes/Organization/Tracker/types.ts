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

export type Pair = {
  yandex_uid: number;
  value: DropdownSingleType;
};

export type ResponceYandexUsers = {
  yandex_users: YandexUser[];
};

export type YandexUser = {
  yandex_uid: number;
  email: string;
  display: string;
};

export type ResponceYandexUsersAnswer = {
  users: YandexUserAnsver[];
};

export type YandexUserAnsver = {
  yandex_uid: number;
  profile_id: number;
  integrity?: boolean;
};

export type Props = StateProps & DispatchProps;
