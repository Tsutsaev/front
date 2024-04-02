import {IProjectState} from 'store/projects/types';

export type ClientTableItemType = {
  templateColumns: string;
  project: IProjectState;
  type: 'gray' | 'white';
};
