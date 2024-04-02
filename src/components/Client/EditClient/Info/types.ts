import {patchClient} from 'store/clients/actions';
import {IClient} from 'store/clients/types';

export type ClientInfoDataType = {
  name: string;
  inn: string;
  kpp: string;
  mail_address: string;
  jur_address: string;
};

type StateProps = {
  client: IClient;
  currentOrgId: number | null;
};

type DispatchProps = {
  patchClient: typeof patchClient;
};

export type Props = StateProps & DispatchProps;
