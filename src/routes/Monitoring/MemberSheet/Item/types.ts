import {SingleValue} from 'react-select';
import {IProjMembersListState} from 'store/projectMembers/types';
import {createSheets, deleteSheets, patchSheets} from 'store/sheet/actions';
import {IUserState} from 'store/user/types';

import {MyOption} from 'components/new/Dropdown/Single/types';

type StateProps = {
  templateColumns: string;
  day: Day;
  user: IUserState;
  projectMembers: IProjMembersListState;
  off_other: boolean;
  fill_mode: 'regular' | 'table_week';
  orgMemberId?: number;
};

type DispatchProps = {
  patchSheets: typeof patchSheets;
  createSheets: typeof createSheets;
  deleteSheets: typeof deleteSheets;
};

export type Props = StateProps & DispatchProps;

export type SheetData = {
  duration: string;
  description: string;
  project: SingleValue<MyOption>;
  off: string;
  is_payble: boolean;
  date: Date;
};

export type CommonDay = {
  id: number;
  date: string;

  week_day: number;
  is_weekend: boolean;
  is_future: boolean;
  organization: number;
  off_other: boolean;
  in_org: number;
  profile: number;
  rest_agreed: null | boolean;
  rest_tags: null | string[];
  rest_from: null | string;
  rest_to: null | string;
  holiday_descr: null | string;
};

export type FilledDay = {
  sheet_id: null | number;
  sheet_start_at: null | string;
  sheet_end_at: null | string;
  sheet_duration: null | string;
  sheet_off: null | number;
  sheet_description: null | string;
  sheet_created_at: string;
  sheet_tags: null | string;
  project_id: null | number;
  project: {
    id: number;
    name: string;
    color: string;
    client: {
      id: number;
      name: string;
    };
    client_id: number;
    date_start: string;
    date_end: string | null;
  } | null;
  is_payble: boolean;
};

export type NotFilledDay = {
  sheet_id: null;
  sheet_start_at: null;
  sheet_end_at: null;
  sheet_duration: null;
  sheet_off: null;
  sheet_description: null;
  sheet_created_at: null;
  sheet_tags: null;
  is_payble: null;
  project_id: null;
  project: null;
};

export type Day = CommonDay & (FilledDay | NotFilledDay);
