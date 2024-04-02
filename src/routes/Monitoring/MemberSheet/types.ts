import {IFiltersState} from 'store/filters/types';
import {Day} from './Item/types';
import {getProjMemberById} from 'store/projectMembers/actions';
import {getAllOrgMembers} from 'store/orgMembers/actions';

export interface IMemberSheetProps {
  currentOrgId: number | null;
  filters: IFiltersState;
  getProjMemberById: typeof getProjMemberById;
  getAllOrgMembers: typeof getAllOrgMembers;
}

export type MonitoringProfileType = {
  profile_id: number;
  profile: Profile;
  days: Day[];
  off_other: boolean;
  fill_mode: 'regular' | 'table_week';
};

type Profile = {
  id: number;
  email: string;
  fio: string;
  short_name: null | string;
  phone: null | string;
};
