import {createSlice} from '@reduxjs/toolkit';

import {
  createProjectMember,
  deleteProjectMember,
  getAllProjMembers,
  getProjMemberById,
  getProjMemberByProject,
  patchProjectMember,
} from './actions';
import {initialState} from './state';

const projMembersSlice = createSlice({
  name: 'projMembers',
  initialState,
  reducers: {},
  extraReducers: builder => {
    builder
      .addCase(getAllProjMembers.pending, state => {
        state.status = 'loading';
      })
      .addCase(getAllProjMembers.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.projMembers = action.payload.results;
      })
      .addCase(getAllProjMembers.rejected, state => {
        state.status = 'failed';
      })
      .addCase(getProjMemberByProject.pending, state => {
        state.status = 'loading';
      })
      .addCase(getProjMemberByProject.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.projMembers = action.payload.results;
      })
      .addCase(getProjMemberByProject.rejected, state => {
        state.status = 'failed';
      })
      .addCase(getProjMemberById.pending, state => {
        state.status = 'loading';
      })
      .addCase(getProjMemberById.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.projMembers = action.payload.results;
      })
      .addCase(getProjMemberById.rejected, state => {
        state.status = 'failed';
      })
      .addCase(patchProjectMember.fulfilled, (state, action) => {
        state.status = 'succeeded';

        const updateProjMember = action.payload;
        const index = state.projMembers.findIndex(({id}) => id === updateProjMember.id);
        if (index !== -1) {
          state.projMembers[index] = updateProjMember;
        }
      })
      .addCase(deleteProjectMember.fulfilled, (state, action) => {
        state.status = 'succeeded';

        const deletedId = action.meta.arg.id;
        state.projMembers = state.projMembers.filter(({id}) => id !== deletedId);
      })
      .addCase(createProjectMember.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.projMembers.push(action.payload);
      });
  },
});

export default projMembersSlice.reducer;
