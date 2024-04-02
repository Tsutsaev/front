import {instance} from 'shared';

export type OrgMemberReportItem = {
  profile_id: string;
  fio: string;
  hours: number | null;
  earn: number | null;
};

export type OrgMemberReportResponse = {
  count: number;
  next: null;
  previous: null;
  results: OrgMemberReportItem[];
  total_hours: number;
  total_expenses: number;
};

type GetOrgMemberReport = (orgId: number | null) => Promise<OrgMemberReportResponse>;

export const getOrgMemberReport: GetOrgMemberReport = async orgId => {
  const response = await instance.get<OrgMemberReportResponse>(orgId + '/report_employee/');
  return response.data;
};

type FilterOrgMemberReport = (
  orgId: number | null,
  client?: string | null,
  date_start?: string,
  date_end?: string,
  project?: number | string | null,
  ordering?: string,
  isActive?: boolean,
  isFills?: boolean,
  department?: string | null,
) => Promise<OrgMemberReportResponse>;

export const filterOrgMemberReport: FilterOrgMemberReport = async (
  orgId,
  client = '',
  date_start = '',
  date_end = '',
  project = '',
  ordering = '',
  isActive = false,
  isFills = false,
  department = '',
) => {
  const response = await instance.get<OrgMemberReportResponse>(
    orgId +
      '/report_employee/?client=' +
      client +
      '&date_start=' +
      date_start +
      '&date_end=' +
      date_end +
      '&project=' +
      project +
      '&ordering=' +
      ordering +
      'fio' +
      '&active=' +
      isActive +
      '&fills=' +
      isFills +
      '&department=' +
      department,
  );
  return response.data;
};
