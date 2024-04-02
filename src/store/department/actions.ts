import {createAsyncThunk} from '@reduxjs/toolkit';

import {IApiResponse, instance} from 'shared/lib';

import {Department} from './types';

export const getDepartmentsByOrg = createAsyncThunk(
  'departments/getDepartmentsByOrg',
  async (orgId: number | null) => {
    if (!orgId) return {count: 0, next: null, previous: null, results: []};
    return (
      await instance.get<IApiResponse<Department>>(
        `/${orgId}/org_department/?limit=500000&offset=0`,
      )
    ).data;
  },
);

export const getDepartmentById = createAsyncThunk(
  'departments/getDepartmentById',
  async ({orgId, id}: {orgId: number | null; id?: string}) => {
    return (await instance.get<Department>(`/${orgId}/org_department/${id}/`)).data;
  },
);

export const patchDepartment = createAsyncThunk(
  'departments/patchDepartment',
  async ({orgId, id, data}: {orgId: number | null; data: Partial<Department>; id?: string}) => {
    return (await instance.patch<Department>(`/${orgId}/org_department/${id}/`, data)).data;
  },
);

export const deleteDepartment = createAsyncThunk(
  'departments/deleteDepartment',
  async ({orgId, id}: {orgId: number | null; id: string}) => {
    await instance.delete<Department>(`/${orgId}/org_department/${id}/`);
  },
);

export const createDepartment = createAsyncThunk(
  'departments/createDepartment',
  async ({orgId, name}: {orgId: number | null; name: string}) => {
    return (await instance.post<Department>(`/${orgId}/org_department/`, {name})).data;
  },
);
