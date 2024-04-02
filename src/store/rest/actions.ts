import {createAsyncThunk} from '@reduxjs/toolkit';
import {IApiResponse, instance} from 'shared';

import {PostRestData, RestData} from './types';

export const getAllRest = createAsyncThunk('rest/getAllRest', async (orgId: number | null) => {
  if (!orgId) return {count: 0, next: null, previous: null, results: []};
  return (
    await instance.get<IApiResponse<RestData>>(
      `/${orgId}/rest/?ordering=-date_from&limit=500000&offset=0`,
    )
  ).data;
});

export const getFilteredRest = createAsyncThunk(
  'rest/getFilteredRest',
  async ({
    orgId,
    date_from,
    date_to,
    id,
  }: {
    orgId: number | null;
    date_from: string | null;
    date_to: string | null;
    id: number | null;
  }) => {
    if (!orgId) return {count: 0, next: null, previous: null, results: []};
    return (
      await instance.get<IApiResponse<RestData>>(
        `/${orgId}/rest/?ordering=-date_from&rest_period_after=${
          date_from || ''
        }&rest_period_before=${date_to || ''}&created_by=${id || ''}&limit=500000&offset=0`,
      )
    ).data;
  },
);

export const getRestForOneMember = createAsyncThunk(
  'rest/getRestForOneMember',
  async ({orgId, id}: {orgId: number | null; id: number}) => {
    if (!orgId) return {count: 0, next: null, previous: null, results: []};
    return (
      await instance.get<IApiResponse<RestData>>(
        `/${orgId}/rest/?ordering=-date_from&profile=${id}&limit=500000&offset=0`,
      )
    ).data;
  },
);

export const deleteRest = createAsyncThunk(
  'rest/deleteRest',
  async ({orgId, id}: {orgId: number | null; id: number}) => {
    return (await instance.delete<RestData>(`/${orgId}/rest/${id}/`)).data;
  },
);

export const createRest = createAsyncThunk(
  'rest/createRest',
  async ({orgId, data}: {orgId: number | null; data: PostRestData}) => {
    return (await instance.post<RestData>(`/${orgId}/rest/`, data)).data;
  },
);

export const updateRest = createAsyncThunk(
  'rest/updateRest',
  async ({orgId, id, agreed}: {orgId: number | null; id: number; agreed: boolean}) => {
    return (await instance.patch<RestData>(`/${orgId}/rest/${id}/`, {agreed})).data;
  },
);
