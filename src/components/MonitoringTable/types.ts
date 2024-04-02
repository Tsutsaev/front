import {IFiltersState} from 'store/filters/types';

export type IMonitoringTableProps = {
  filters: IFiltersState;
  currentOrgId: number | null;
};

export type ProjectMember = {
  id: number;
  project: number;
  profile: number;
  off: number;
  dur_all_time: null | string;
};

export type MonitoringReportType = {
  profile: {
    id: number;
    email: string | null;
    fio: string;
    short_name: string | null;
    phone: string | null;
  };
  role: 'manager' | 'employee';
  fired: boolean;
  fill_mode: 'regular' | 'table_week';
  custom_period: {
    custom_range: [string, string];
    actual: number;
    plan: number;
    status: StatusType;
  } | null;
  curr_week_hours: {
    week_range: [string, string];
    actual: number;
    plan: number;
    status: StatusType;
  };
  prev_week_hours: {
    week_range: [string, string];
    actual: number;
    plan: number;
    status: StatusType;
  };
  curr_month_hours: {
    week_range: [string, string];
    actual: number;
    plan: number;
    status: StatusType;
  };
};

type StatusType = 'empty' | 'half' | 'full';
