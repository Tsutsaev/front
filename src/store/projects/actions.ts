import {createAsyncThunk} from '@reduxjs/toolkit';

import Tag from 'components/new/TagsDropdown/Tag';

import {IApiResponse, instance} from 'shared/lib';

import {CreateProjectData, IProjectState} from './types';

export const getProjectsByOrg = createAsyncThunk(
  'projects/getProjectsByOrg',
  async (orgId: number | null) => {
    if (!orgId) return {count: 0, next: null, previous: null, results: []};
    return (
      await instance.get<IApiResponse<IProjectState>>(`/${orgId}/project/?limit=500000&offset=0`)
    ).data;
  },
);

export const getProjectsByClient = createAsyncThunk(
  'projects/getProjectsByClient',
  async ({orgId, clientId}: {orgId: number | null; clientId: number}) => {
    if (!orgId) return {count: 0, next: null, previous: null, results: []};
    return (
      await instance.get<IApiResponse<IProjectState>>(
        `/${orgId}/project/?client=${clientId}&limit=500000&offset=0`,
      )
    ).data;
  },
);

export const getProjectsById = createAsyncThunk(
  'projects/getProjectsById',
  async ({orgId, id}: {orgId: number | null; id?: string}) => {
    return (await instance.get<IProjectState>(`/${orgId}/project/${id}/`)).data;
  },
);

type FilterProjects = {
  orgId: number | null;
  client?: number | string | null;
  ordering: string;
};

export const getFilteredProjects = createAsyncThunk(
  'projects/getFilteredProjects',
  async ({orgId, client, ordering}: FilterProjects) => {
    if (!orgId) return {count: 0, next: null, previous: null, results: []};

    return (
      await instance.get<IApiResponse<IProjectState>>(
        `/${orgId}/project/?ordering=${ordering}&client=${client || ''}`,
      )
    ).data;
  },
);

export const cloneProject = createAsyncThunk(
  'projects/cloneProject',
  async ({orgId, id}: {orgId: number | null; id: string}) => {
    return (await instance.get<IProjectState>(`/${orgId}/project/${id}/duplicate/`)).data;
  },
);

export const patchProject = createAsyncThunk(
  'projects/patchProject',
  async ({orgId, id, data}: {orgId: number | null; id: number; data: Partial<IProjectState>}) => {
    return (await instance.patch<IProjectState>(`/${orgId}/project/${id}/`, data)).data;
  },
);

export const deleteProject = createAsyncThunk(
  'projects/deleteProject',
  async ({orgId, id}: {orgId: number | null; id: number}) => {
    await instance.delete<IProjectState>(`/${orgId}/project/${id}/`);
  },
);

export const createProject = createAsyncThunk(
  'projects/createProject',
  async ({orgId, data}: {orgId: number | null; data: CreateProjectData}) => {
    return (await instance.post<IProjectState>(`/${orgId}/project/`, data)).data;
  },
);

export type Tag = {
  id: number;
  name: string;
  slug: string;
};

export const getAllTags = async (orgId: number | null) => {
  if (!orgId) return [];
  return (await instance.get<IApiResponse<Tag>>(orgId + '/tag/')).data.results;
};
