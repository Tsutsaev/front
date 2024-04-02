import {createAsyncThunk} from '@reduxjs/toolkit';

import {IApiResponse, instance} from 'shared/lib';

import {NewProjMemberData, ProjectMembers} from './types';

export const getAllProjMembers = createAsyncThunk(
  'projMembers/getAllProjMembers',
  async (orgId: number | null) => {
    if (!orgId) return {count: 0, next: null, previous: null, results: []};
    return (
      await instance.get<IApiResponse<ProjectMembers>>(
        `/${orgId}/proj_member/?limit=500000&offset=0`,
      )
    ).data;
  },
);

export const getProjMemberById = createAsyncThunk(
  'projMembers/getProjMemberById',
  async ({orgId, id}: {orgId: number | null; id: number}) => {
    if (!orgId) return {count: 0, next: null, previous: null, results: []};

    return (
      await instance.get<IApiResponse<ProjectMembers>>(
        `/${orgId}/proj_member/?profile=${id}&limit=500000&offset=0`,
      )
    ).data;
  },
);

export const getProjMemberByProject = createAsyncThunk(
  'projMembers/getProjMemberByProject',
  async ({
    orgId,
    projectId,
    isFired,
  }: {
    orgId: number | null;
    projectId?: string;
    isFired?: boolean | null;
  }) => {
    if (!orgId || !projectId) return {count: 0, next: null, previous: null, results: []};

    return (
      await instance.get<IApiResponse<ProjectMembers>>(
        `/${orgId}/proj_member/?project=${projectId}&fired=${
          isFired || 'false'
        }&limit=500000&offset=0`,
      )
    ).data;
  },
);

export const deleteProjectMember = createAsyncThunk(
  'orgMembers/deleteProjectMember',
  async ({orgId, id}: {orgId: number | null; id: number}) => {
    return (await instance.delete<ProjectMembers>(`/${orgId}/proj_member/${id}/`)).data;
  },
);

type PatchFIeld = {
  off?: number;
  update_previous?: boolean;
  date_out?: string;
};

export const patchProjectMember = createAsyncThunk(
  'orgMembers/patchProjectMember',
  async ({orgId, id, data}: {orgId: number | null; id: number; data: PatchFIeld}) => {
    return (await instance.patch<ProjectMembers>(`/${orgId}/proj_member/${id}/`, data)).data;
  },
);

export const createProjectMember = createAsyncThunk(
  'orgMembers/createProjectMember',
  async ({orgId, data}: {orgId: number | null; data: NewProjMemberData}) => {
    return (await instance.post<ProjectMembers>(`/${orgId}/proj_member/`, data)).data;
  },
);
