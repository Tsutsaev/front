import {createAsyncThunk} from '@reduxjs/toolkit';
import {IApiResponse, instance} from 'shared/lib';
import {IPatchSheetType, IPostSheetType, ISheets} from './types';
import {format} from 'date-fns';

export const getAllSheetsByOrg = createAsyncThunk(
  'sheets/getAllSheets',
  async (orgId: number | null) => {
    if (!orgId) return {count: 0, next: null, previous: null, results: []};
    const response = await instance.get<IApiResponse<ISheets>>(
      `/${orgId}/sheet/?limit=500000&offset=0`,
    );

    response.data.results.sort(
      (a, b) => new Date(b.start_at).getTime() - new Date(a.start_at).getTime(),
    );

    return response.data;
  },
);

export const getAllMySheets = createAsyncThunk(
  'sheets/getAllMySheets',
  async ({orgId, id}: {orgId: number | null; id: number}) => {
    if (!orgId) return {count: 0, next: null, previous: null, results: []};
    const response = await instance.get<IApiResponse<ISheets>>(
      `/${orgId}/sheet/?created_by=${id}&limit=50000&offset=0`,
    );

    response.data.results.sort(
      (a, b) => new Date(b.start_at).getTime() - new Date(a.start_at).getTime(),
    );

    return response.data;
  },
);

export const getAllMySheetsByDate = createAsyncThunk(
  'sheets/getAllMySheetsByDate',
  async ({
    orgId,
    id,
    startDate,
    endDate,
  }: {
    orgId: number | null;
    id: number;
    startDate: Date;
    endDate: Date;
  }) => {
    if (!orgId) return {count: 0, next: null, previous: null, results: []};
    const startDateString = format(startDate, 'yyyy-MM-dd');
    const endDateString = format(endDate, 'yyyy-MM-dd');

    const response = await instance.get<IApiResponse<ISheets>>(
      `/${orgId}/sheet/?created_by=${id}&start_at__gte=${startDateString}&end_at__lte=${endDateString}&limit=50000&offset=0`,
    );

    response.data.results.sort(
      (a, b) => new Date(b.start_at).getTime() - new Date(a.start_at).getTime(),
    );

    return response.data;
  },
);

export const getSheetsByWeek = createAsyncThunk(
  'sheets/getSheetsByWeek',
  async ({orgId, page, id}: {orgId: number | null; page: number; id: number}) => {
    if (!orgId) return {count: 0, next: null, previous: null, results: []};
    const response = await instance.get<IApiResponse<ISheets>>(
      `/${orgId}/sheet/?week=${page}&created_by=${id}`,
    );

    response.data.results.sort(
      (a, b) => new Date(b.start_at).getTime() - new Date(a.start_at).getTime(),
    );

    return response.data;
  },
);

export const patchSheets = createAsyncThunk(
  'sheets/patchSheets',
  async ({orgId, id, data}: {orgId: number | null; id: number; data: IPatchSheetType}) => {
    const response = await instance.patch<ISheets>(`/${orgId}/sheet/${id}/`, data);

    return response.data;
  },
);

export const createSheets = createAsyncThunk(
  'sheets/createSheets',
  async ({orgId, data}: {orgId: number | null; data: IPostSheetType}) => {
    const response = await instance.post<ISheets>(`/${orgId}/sheet/`, data);

    return response.data;
  },
);

export const deleteSheets = createAsyncThunk(
  'sheets/deleteSheets',
  async ({orgId, id}: {orgId: number | null; id: number}) => {
    const response = await instance.delete<ISheets>(`/${orgId}/sheet/${id}/`);

    return response.data;
  },
);
