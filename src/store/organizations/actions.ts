import {createAsyncThunk} from '@reduxjs/toolkit';

import {IApiResponse, instance} from 'shared/lib';

import {IOrganization, PatchOrganization, PostOrganizations} from './types';

export const getAllOrganizations = createAsyncThunk(
  'organizations/getAllOrganizations',
  async () => {
    return (await instance.get<IApiResponse<IOrganization>>('/orgs/?limit=500000&offset=0')).data;
  },
);

export const patchOrganizations = createAsyncThunk(
  'organizations/patchOrganizations',
  async ({orgId, data}: {orgId: number | null; data: PatchOrganization}) => {
    return (await instance.patch<IOrganization>(`/orgs/${orgId}/`, data)).data;
  },
);

export const createOrganizations = createAsyncThunk(
  'organizations/createOrganizations',
  async (data: PostOrganizations) => {
    return (await instance.post<IOrganization>('/orgs/', data)).data;
  },
);

export const deleteOrganizations = createAsyncThunk(
  'organizations/deleteOrganizations',
  async (orgId: number) => {
    await instance.delete<IOrganization>(`/orgs/${orgId}/`);
  },
);
