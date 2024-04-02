import {createSlice} from '@reduxjs/toolkit';

import {
  getDepartmentsByOrg,
  getDepartmentById,
  patchDepartment,
  deleteDepartment,
  createDepartment,
} from './actions';
import {initialState} from './state';

const departmentsSlice = createSlice({
  name: 'departments',
  initialState,
  reducers: {},
  extraReducers: builder => {
    builder
      .addCase(getDepartmentsByOrg.pending, state => {
        state.departmentsStatus = 'loading';
      })
      .addCase(getDepartmentsByOrg.fulfilled, (state, action) => {
        state.departmentsStatus = 'succeeded';
        state.departments = action.payload.results;
      })
      .addCase(getDepartmentsByOrg.rejected, state => {
        state.departmentsStatus = 'failed';
      })
      .addCase(getDepartmentById.pending, state => {
        state.departmentsStatus = 'loading';
      })
      .addCase(getDepartmentById.fulfilled, (state, action) => {
        state.departmentsStatus = 'succeeded';
        state.departments = [action.payload];
      })
      .addCase(getDepartmentById.rejected, state => {
        state.departmentsStatus = 'failed';
      })
      .addCase(patchDepartment.fulfilled, (state, action) => {
        state.departmentsStatus = 'succeeded';

        const updatedDepartment = action.payload;
        const index = state.departments.findIndex(
          department => department.id === updatedDepartment.id,
        );
        if (index !== -1) {
          state.departments[index] = updatedDepartment;
        }
      })
      .addCase(deleteDepartment.fulfilled, (state, action) => {
        state.departmentsStatus = 'succeeded';
        const idToDelete = action.meta.arg.id;
        state.departments = state.departments.filter(department => department.id !== +idToDelete);
      })
      .addCase(createDepartment.fulfilled, (state, action) => {
        state.departmentsStatus = 'succeeded';
        state.departments.push(action.payload);
      });
  },
});

export default departmentsSlice.reducer;
