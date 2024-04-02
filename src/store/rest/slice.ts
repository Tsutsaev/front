import {createSlice} from '@reduxjs/toolkit';
import {initialState} from './state';
import {
  createRest,
  deleteRest,
  getAllRest,
  getFilteredRest,
  getRestForOneMember,
  updateRest,
} from './actions';

export const restSlice = createSlice({
  name: 'rest',
  initialState,
  reducers: {},
  extraReducers: builder => {
    builder
      .addCase(getAllRest.pending, state => {
        state.status = 'loading';
      })
      .addCase(getAllRest.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.rest = action.payload.results;
      })
      .addCase(getAllRest.rejected, state => {
        state.status = 'failed';
      })
      .addCase(getFilteredRest.pending, state => {
        state.status = 'loading';
      })
      .addCase(getFilteredRest.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.rest = action.payload.results;
      })
      .addCase(getFilteredRest.rejected, state => {
        state.status = 'failed';
      })
      .addCase(getRestForOneMember.pending, state => {
        state.status = 'loading';
      })
      .addCase(getRestForOneMember.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.rest = action.payload.results;
      })
      .addCase(getRestForOneMember.rejected, state => {
        state.status = 'failed';
      })
      .addCase(updateRest.fulfilled, (state, action) => {
        state.status = 'succeeded';

        const updatedRest = action.payload;
        const index = state.rest.findIndex(rest => rest.id === updatedRest.id);
        if (index !== -1) {
          state.rest[index] = updatedRest;
        }
      })
      .addCase(deleteRest.fulfilled, (state, action) => {
        state.status = 'succeeded';
        const idToDelete = action.meta.arg.id;
        state.rest = state.rest.filter(rest => rest.id !== idToDelete);
      })
      .addCase(createRest.fulfilled, (state, action) => {
        const newRest = action.payload;
        const indexToInsert = state.rest.findIndex(rest => rest.created_at < newRest.created_at);

        if (indexToInsert === -1) {
          state.rest.push(newRest);
        } else {
          state.rest.splice(indexToInsert, 0, newRest);
        }
      });
  },
});

export default restSlice.reducer;
