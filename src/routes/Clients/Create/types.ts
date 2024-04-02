import {createClient} from 'store/clients/actions';

export type Data = {
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
  createClient: typeof createClient;
};

export type Props = StateProps & DispatchProps;
