import {DropdownSingleType} from 'components/new/Dropdown/Single/types';
import {createOrganizations} from 'store/organizations/actions';

export type InfoData = {
  name: string;
  fill_mode: DropdownSingleType;

  inn: null | string;
  kpp: null | string;
  mail_address: null | string;
  jur_address: null | string;
};

export type PostOrganizationsInfo = {
  name: string;
  inn: string;
  kpp: string;
  mail_address: string;
  jur_address: string;
};

type StateProps = {
  currentOrgId: number | null;
};

type DispatchProps = {
  createOrganizations: typeof createOrganizations;
};

export type Props = StateProps & DispatchProps;
