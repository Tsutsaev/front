import {DropdownSingleType} from 'components/new/Dropdown/Single/types';
import {patchProfile} from 'store/Profile/actions';
import {getAllOrgMembers, getOrgMemberById} from 'store/orgMembers/actions';
import {IOrgMembersListState} from 'store/orgMembers/types';
import {patchOrganizations} from 'store/organizations/actions';
import {IOrganization} from 'store/organizations/types';
import {IUser} from 'store/user/types';

export type OrgInfoInput = {
  name: string;
  inn: string;
  kpp: string;
  mail_address: string;
  jur_address: string;
  phone: string;
  email: string;
};

export type OrgInfoDropdown = {
  fill_mode: NonNullable<DropdownSingleType>;
  fio: DropdownSingleType;
};

export type OrgInfoDataType = OrgInfoInput & OrgInfoDropdown;

type StateProps = {
  organization: IOrganization;
  orgMembers: IOrgMembersListState;
  currentOrgId: number | null;
  onCreate?: (data: OrgInfoDataType) => void;
  user: IUser;
};

type DispatchProps = {
  patchOrganizations: typeof patchOrganizations;
  patchProfile: typeof patchProfile;
  getAllOrgMembers: typeof getAllOrgMembers;
  getOrgMemberById: typeof getOrgMemberById;
};

export type Props = StateProps & DispatchProps;
