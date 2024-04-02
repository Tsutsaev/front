import {IApiResponse, instance} from 'shared';
import {IOrgMembers} from 'store/orgMembers/types';

import {ReportProjectsResponse} from 'routes/ProjectReport/types';

type GetAllReportProjects = (orgId: number | null) => Promise<ReportProjectsResponse>;

export const getAllReportProjects: GetAllReportProjects = async orgId => {
  const response = await instance.get<ReportProjectsResponse>(orgId + '/report_project/');
  return response.data;
};

type FilterReportProjects = (
  orgId: number | null,
  client?: string | null,
  date_start?: string,
  date_end?: string,
  profile?: number | string | null,
  ordering?: string,
) => Promise<ReportProjectsResponse>;

export const filterReportProjects: FilterReportProjects = async (
  orgId,
  client = '',
  date_start = '',
  date_end = '',
  profile = '',
  ordering = '',
) => {
  const response = await instance.get<ReportProjectsResponse>(
    orgId +
      '/report_project/?client=' +
      client +
      '&date_start=' +
      date_start +
      '&date_end=' +
      date_end +
      '&profile=' +
      profile +
      '&ordering=' +
      ordering +
      'project_name',
  );
  return response.data;
};

type GetAllOrgMembers = (orgId: number | null) => Promise<IOrgMembers[]>;

export const getAllOrgMembers: GetAllOrgMembers = async orgId => {
  const response = await instance.get<IApiResponse<IOrgMembers>>(
    orgId + '/org_member/?ordering=profile',
  );
  return response.data.results;
};
