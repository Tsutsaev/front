import {createSlice} from '@reduxjs/toolkit';
import {initialState} from './state';
import {
  createOrganizations,
  deleteOrganizations,
  getAllOrganizations,
  patchOrganizations,
} from './actions';

const organizationsSlice = createSlice({
  name: 'organizations',
  initialState,
  reducers: {},
  extraReducers: builder => {
    builder
      .addCase(getAllOrganizations.pending, state => {
        state.status = 'loading';
      })
      .addCase(getAllOrganizations.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.organizations = action.payload.results;
      })
      .addCase(getAllOrganizations.rejected, state => {
        state.status = 'failed';
      })
      .addCase(patchOrganizations.fulfilled, (state, action) => {
        const updatedOrganizationIndex = state.organizations.findIndex(
          org => org.id === action.payload.id,
        );
        if (updatedOrganizationIndex !== -1) {
          state.organizations[updatedOrganizationIndex] = action.payload;
        }
      })
      .addCase(createOrganizations.fulfilled, (state, action) => {
        state.status = 'succeeded';

        state.organizations.push(action.payload);
      })
      .addCase(deleteOrganizations.fulfilled, (state, action) => {
        state.status = 'succeeded';
        const idToDelete = action.meta.arg;
        state.organizations = state.organizations.filter(org => org.id !== idToDelete);
      });
  },
});

export default organizationsSlice.reducer;
