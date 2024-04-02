import {DropdownSingleType} from 'components/new/Dropdown/Single/types';
import {IProjMembersListState} from 'store/projectMembers/types';
import {createSheets, patchSheets} from 'store/sheet/actions';

type StateProps = {
  templateColumns: string;
  setLoading: (loading: boolean) => void;
  data: TimeTableData;
  isNotDateFired: (date: string) => boolean;
  offOther?: boolean;
  currentProject?: number | null;
  projectMembers: IProjMembersListState;
  currentOrgId: number | null;
};

type DispatchProps = {
  patchSheets: typeof patchSheets;
  createSheets: typeof createSheets;
};

export type Props = StateProps & DispatchProps;

export type SheetData = {
  duration: string;
  project: DropdownSingleType;
  description: string;
};

export type TimeTableData = {
  id: number;
  project: {
    id: number;
    name: string;
    color: string;
    client: {
      id: number;
      name: string;
    } | null;
    client_id: number | null;
    date_start: string;
    date_end: string | null;
  } | null;
  project_id: number | null;
  date: string;
  week_day: number;
  is_weekend: boolean;
  is_future: boolean;
  sheet_id: number | null;
  sheet_start_at: string | null;
  sheet_end_at: string | null;
  sheet_duration: string | null;
  sheet_off: number | null;
  is_payble: boolean | null;
  sheet_description: string | null;
  sheet_created_at: string;
  sheet_tags: null | string[];
  holiday_descr: null | string;
  rest_agreed: null | boolean;
  rest_tags: null | string[];
  rest_from: null | string;
  rest_to: null | string;
  in_org: number;
  profile: number;
  organization: number;
};
