import {createAsyncThunk} from '@reduxjs/toolkit';

import {axiosDocument, instance} from 'shared/lib';

import {PatchProfileType, ProfileType} from './types';

export const patchProfile = createAsyncThunk(
  'profile/patchProfile',
  async ({orgId, id, data}: {orgId: number | null; id: number; data: PatchProfileType}) => {
    const response = await instance.patch<ProfileType>(`/${orgId}/profile/${id}/`, data);

    return response.data;
  },
);

export const patchMyProfile = createAsyncThunk(
  'profile/patchMyProfile',
  async ({orgId, id, data}: {orgId: number | null; id: number; data: PatchProfileType}) => {
    const response = await instance.patch<ProfileType>(`/${orgId}/me/${id}/`, data);

    return response.data;
  },
);

export const patchMyProfileAvatar = createAsyncThunk(
  'profile/patchMyProfileAvatar',
  async ({id, avatar}: {id: string; avatar: File}) => {
    const formData = new FormData();
    formData.append('avatar', avatar);
    return (await axiosDocument.patch<ProfileType>(`/me/${id}/`, formData)).data;
  },
);
