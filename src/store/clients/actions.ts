import {createAsyncThunk} from '@reduxjs/toolkit';

import {IApiResponse, instance} from 'shared/lib';

import {IClient, PatchClientType, PostClientType} from './types';

export const getAllClients = createAsyncThunk(
  'clients/getAllClients',
  async ({orgId, isSorting}: {orgId: number | null; isSorting?: boolean}) => {
    if (!orgId) return {count: 0, next: null, previous: null, results: []};
    return (
      await instance.get<IApiResponse<IClient>>(
        `/${orgId}/client/?ordering=${isSorting ? '' : '-'}name&limit=500000&offset=0`,
      )
    ).data;
  },
);

export const getClientById = createAsyncThunk(
  'clients/getClientById',
  async ({orgId, id}: {orgId: number | null; id: number}) => {
    if (!orgId) return {count: 0, next: null, previous: null, results: []};
    return (await instance.get<IApiResponse<IClient>>(`/${orgId}/client/${id}/`)).data;
  },
);

export const deleteClient = createAsyncThunk(
  'clients/deleteClient',
  async ({orgId, id}: {orgId: number | null; id: number}) => {
    await instance.delete<IClient>(`/${orgId}/client/${id}/`);
  },
);

export const patchClient = createAsyncThunk(
  'clients/patchClient',
  async ({orgId, id, data}: {orgId: number | null; id: number; data: PatchClientType}) => {
    return (await instance.patch<IClient>(`/${orgId}/client/${id}/`, data)).data;
  },
);

export const createClient = createAsyncThunk(
  'clients/createClient',
  async ({orgId, data}: {orgId: number | null; data: PostClientType}) => {
    return (await instance.post<IClient>(`/${orgId}/client/`, data)).data;
  },
);
