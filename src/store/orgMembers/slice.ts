import {createSlice} from '@reduxjs/toolkit';
import {initialState} from './state';
import {
  deleteOrgMembers,
  getAllOrgMembers,
  getFilteredOrgMembers,
  getOrgMemberById,
  getOrgMembersByClientProjectDate,
  patchOrgMembers,
} from './actions';

const orgMembersSlice = createSlice({
  name: 'orgMembers',
  initialState,
  reducers: {},
  extraReducers: builder => {
    builder
      .addCase(getAllOrgMembers.pending, state => {
        state.status = 'loading';
      })
      .addCase(getAllOrgMembers.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.orgMembers = action.payload.results;
      })
      .addCase(getAllOrgMembers.rejected, state => {
        state.status = 'failed';
      })
      .addCase(getOrgMembersByClientProjectDate.pending, state => {
        state.status = 'loading';
      })
      .addCase(getOrgMembersByClientProjectDate.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.orgMembers = action.payload.results;
      })
      .addCase(getOrgMembersByClientProjectDate.rejected, state => {
        state.status = 'failed';
      })
      .addCase(getFilteredOrgMembers.pending, state => {
        state.status = 'loading';
      })
      .addCase(getFilteredOrgMembers.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.orgMembers = action.payload.results;
      })
      .addCase(getFilteredOrgMembers.rejected, state => {
        state.status = 'failed';
      })
      .addCase(getOrgMemberById.pending, state => {
        state.status = 'loading';
      })
      .addCase(getOrgMemberById.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.orgMembers = action.payload.results;
      })
      .addCase(getOrgMemberById.rejected, state => {
        state.status = 'failed';
      })
      .addCase(patchOrgMembers.fulfilled, (state, action) => {
        state.status = 'succeeded';

        const updatedOrgMember = action.payload;
        const index = state.orgMembers.findIndex(orgMember => orgMember.id === updatedOrgMember.id);
        if (index !== -1) {
          state.orgMembers[index] = updatedOrgMember;
        }
      })
      .addCase(deleteOrgMembers.fulfilled, (state, action) => {
        state.status = 'succeeded';
        const idToDelete = action.meta.arg.id;
        state.orgMembers = state.orgMembers.filter(orgMember => orgMember.id !== idToDelete);
      });
  },
});

export default orgMembersSlice.reducer;
