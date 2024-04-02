import {createSlice, PayloadAction} from '@reduxjs/toolkit';

import {initialState} from './state';

const filtersSlice = createSlice({
  name: 'filters',
  initialState,
  reducers: {
    setProject: (state, action: PayloadAction<string | null>) => {
      state.project = action.payload;
    },
    setClient: (state, action: PayloadAction<string | null>) => {
      state.client = action.payload;
    },
    setOrgMember: (state, action: PayloadAction<string | null>) => {
      state.orgMember = action.payload;
    },
    setMemberType: (state, action: PayloadAction<string | null>) => {
      state.memberType = action.payload;
    },
    setFillingType: (state, action: PayloadAction<string | null>) => {
      state.fillingType = action.payload;
    },
    setIsFilled: (state, action: PayloadAction<string | null>) => {
      state.isFilled = action.payload;
    },
    setSearch: (state, action: PayloadAction<string>) => {
      state.search = action.payload;
    },
    setIsFired: (state, action: PayloadAction<boolean | null>) => {
      state.isFired = action.payload;
    },
    setDepartment: (state, action: PayloadAction<string | null>) => {
      state.department = action.payload;
    },
    setIsSheetOff: (state, action: PayloadAction<string | null>) => {
      state.isSheetOff = action.payload;
    },
    setIsActive: (state, action: PayloadAction<boolean>) => {
      state.isActive = action.payload;
    },
    setIsFills: (state, action: PayloadAction<boolean>) => {
      state.isFills = action.payload;
    },
  },
});

export const {
  setProject,
  setOrgMember,
  setMemberType,
  setClient,
  setFillingType,
  setIsFilled,
  setSearch,
  setIsFired,
  setIsSheetOff,
  setIsFills,
  setIsActive,
  setDepartment,
} = filtersSlice.actions;
export default filtersSlice.reducer;
