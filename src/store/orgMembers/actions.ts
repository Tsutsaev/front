import {createAsyncThunk} from '@reduxjs/toolkit';

import {IApiResponse, instance} from 'shared/lib';

import {
  CreateOrgMembersResponse,
  CreateOrgMembersType,
  IOrgMembers,
  PatchOrgMembersInfoType,
  PatchOrgMembersAccessType,
} from './types';

export const getAllOrgMembers = createAsyncThunk(
  'orgMembers/getAllOrgMembers',
  async (orgId: number | null) => {
    if (!orgId) return {count: 0, next: null, previous: null, results: []};
    return (
      await instance.get<IApiResponse<IOrgMembers>>(
        `/${orgId}/org_member/?ordering=profile&limit=500000&offset=0`,
      )
    ).data;
  },
);

export const getOrgMembersByClientProjectDate = createAsyncThunk(
  'orgMembers/getOrgMembersByClientProjectDate',
  async ({
    orgId,
    projectId,
    clientId,
    work_period_before,
    work_period_after,
  }: {
    orgId: number | null;
    projectId: string | null | undefined;
    clientId: string | null | undefined;
    work_period_before: string | null | undefined;
    work_period_after: string | null | undefined;
  }) => {
    if (!orgId) return {count: 0, next: null, previous: null, results: []};
    return (
      await instance.get<IApiResponse<IOrgMembers>>(
        `/${orgId}/org_member/?ordering=profile&project=${projectId || ''}&client=${
          clientId || ''
        }&work_period_before=${work_period_before || ''}&work_period_after=${
          work_period_after || ''
        }&limit=500000&offset=0`,
      )
    ).data;
  },
);

export const getFilteredOrgMembers = createAsyncThunk(
  'orgMembers/getFilteredOrgMembers',
  async ({
    orgId,
    role,
    fill_mode,
    sheet_off,
    fired,
    start_in,
    end_in,
    isSorting,
    department,
  }: {
    orgId: number | null;
    role?: string | null;
    fill_mode?: string | null;
    sheet_off?: string | null;
    fired?: boolean | null;
    start_in?: string | null;
    end_in?: string | null;
    isSorting?: boolean | null;
    department?: string | null;
  }) => {
    if (!orgId) return {count: 0, next: null, previous: null, results: []};

    return (
      await instance.get<IApiResponse<IOrgMembers>>(
        `/${orgId}/org_member/?ordering=${isSorting ? '' : '-'}profile&fired=${fired || ''}&role=${
          role || ''
        }&fill_mode=${fill_mode || ''}&sheet_off=${sheet_off || ''}&start_in=${
          start_in || ''
        }&end_in=${end_in || ''}&department=${department || ''}&limit=500000&offset=0`,
      )
    ).data;
  },
);

export const getOrgMemberById = createAsyncThunk(
  'orgMembers/getOrgMemberById',
  async ({orgId, id}: {orgId: number | null; id: number}) => {
    if (!orgId) return {count: 0, next: null, previous: null, results: []};
    return (
      await instance.get<IApiResponse<IOrgMembers>>(
        `/${orgId}/org_member/?profile=${id}&limit=500000&offset=0`,
      )
    ).data;
  },
);

export const patchOrgMembers = createAsyncThunk(
  'orgMembers/patchOrgMembers',
  async ({
    orgId,
    id,
    data,
  }: {
    orgId: number | null;
    id: number;
    data: PatchOrgMembersInfoType | PatchOrgMembersAccessType;
  }) => {
    return (await instance.patch<IOrgMembers>(`/${orgId}/org_member/${id}/`, data)).data;
  },
);

export const deleteOrgMembers = createAsyncThunk(
  'orgMembers/deleteOrgMembers',
  async ({orgId, id}: {orgId: number | null; id: number}) => {
    await instance.delete<IOrgMembers>(`/${orgId}/org_member/${id}/`);
  },
);

export const createOrgMembers = createAsyncThunk(
  'orgMembers/createOrgMembers',
  async ({orgId, data}: {orgId: number | null; data: CreateOrgMembersType}) => {
    const {fio, email, fired, off, current_project, ...orgMemberData} = data;
    const profile = await instance.post<CreateOrgMembersResponse>(`/${orgId}/org_member_add/`, {
      fio,
      email,
      fired,
      off,
      current_project,
    });

    const response = await instance.patch<IOrgMembers>(
      `/${orgId}/org_member/${profile.data.id}/`,
      orgMemberData,
    );

    return response.data;
  },
);
