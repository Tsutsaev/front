export type IOrgMembersListState = {
  status: string;
  orgMembers: IOrgMembers[];
};

export type IOrgMembers = {
  id: number;
  organization: number;
  profile: IOrgMembersProfile;
  profile_id: number;
  role: 'employee' | 'manager';
  fill_mode: 'regular' | 'table_week';
  date_in: null | string;
  date_out: null | string;
  off: number | null;
  sheet_off: boolean;
  off_other: boolean;
  fulltime: boolean;
  start_time: string;
  fired: boolean;
  current_project: null | number;
  bitrix_id: null | number;
  hour_rate: null | number;
  department_id: number | null;
};

export interface IOrgMembersProfile {
  id: number;
  email: string;
  avatar: string;
  fio: string;
  phone: string | null;
  short_name: string | null;
}

export type PatchOrgMembersInfoType = {
  role?: 'employee' | 'manager';
  fill_mode?: 'regular' | 'table_week';
  date_in?: string | null;
  date_out?: null | string;
  start_time?: string;
  off?: number;
  hour_rate?: null | number;
  current_project?: null | number;
  department_id?: number | null;
};

export type PatchOrgMembersAccessType = {
  sheet_off?: boolean;
  off_other?: boolean;
  fulltime?: boolean;

  fired?: boolean;
  current_project?: null | number;
  bitrix_id?: null | number;
  hour_rate?: null | number;
};

export type CreateOrgMembersType = {
  fio: string;
  email: string | null;
  fired: boolean;
  date_in: null | string;
  date_out: null | string;
  fill_mode: 'table_week' | 'regular';
  fulltime: boolean;
  off: null | number;
  hour_rate?: null | number;
  off_other: boolean;
  role: 'employee' | 'manager';
  sheet_off: boolean;
  start_time: string;
  current_project: number | null;
};

export type CreateOrgMembersResponse = {
  date_in: null;
  date_out: null;
  fill_mode: 'table_week';
  fired: false;
  fulltime: true;
  id: number;
  off: null | number;
  hour_rate: null | number;
  off_other: false;
  organization: number;
  profile: number;
  role: 'employee';
  sheet_off: true;
  start_time: '09:00:00';
};
