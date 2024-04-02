import {IClient} from 'store/clients/types';

export type ClientTableItemType = {
  templateColumns: string;
  client: IClient;
  type: 'gray' | 'white';
};
