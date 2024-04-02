import {MyOption} from 'components/new/Dropdown/Single/types';

import {reduceName} from './stringFormat';

interface DataItem {
  id: number;
  name?: string;
  profile?: {
    fio: string;
    id: number;
  };
  project?: {
    name: string;
    id: number;
    color: string;
  };
}

export function transformDropdownData<T extends DataItem>(data?: T[]): MyOption[] {
  return (
    data?.map(item => ({
      value: item.project?.id.toString() || item.id.toString(),
      label: reduceName(item.name || item.project?.name || item.profile?.fio || '', 40),
      color: item.project?.color || '',
    })) || []
  );
}

export function transformOrgMembersData<T extends DataItem>(data: T[]): MyOption[] {
  return data.map(item => ({
    value: item.profile?.id.toString() || item.id.toString(),
    label: reduceName(item.profile?.fio || '', 40),
    color: '',
  }));
}
