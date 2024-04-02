import {createSlice} from '@reduxjs/toolkit';

import {
  cloneProject,
  createProject,
  deleteProject,
  getFilteredProjects,
  getProjectsByClient,
  getProjectsById,
  getProjectsByOrg,
  patchProject,
} from './actions';
import {initialState} from './state';

const projectSlice = createSlice({
  name: 'projects',
  initialState,
  reducers: {},
  extraReducers: builder => {
    builder
      .addCase(getProjectsByOrg.pending, state => {
        state.status = 'loading';
      })
      .addCase(getProjectsByOrg.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.projects = action.payload.results;
      })
      .addCase(getProjectsByOrg.rejected, state => {
        state.status = 'failed';
      })
      .addCase(getProjectsByClient.pending, state => {
        state.status = 'loading';
      })
      .addCase(getProjectsByClient.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.projects = action.payload.results;
      })
      .addCase(getProjectsByClient.rejected, state => {
        state.status = 'failed';
      })
      .addCase(getProjectsById.pending, state => {
        state.status = 'loading';
      })
      .addCase(getProjectsById.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.projects = [action.payload];
      })
      .addCase(getProjectsById.rejected, state => {
        state.status = 'failed';
      })
      .addCase(cloneProject.pending, state => {
        state.status = 'loading';
      })
      .addCase(cloneProject.fulfilled, (state, action) => {
        state.status = 'succeeded';
        const newProject = action.payload;
        state.projects = [...state.projects, newProject];
      })
      .addCase(cloneProject.rejected, state => {
        state.status = 'failed';
      })
      .addCase(getFilteredProjects.pending, state => {
        state.status = 'loading';
      })
      .addCase(getFilteredProjects.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.projects = action.payload.results;
      })
      .addCase(getFilteredProjects.rejected, state => {
        state.status = 'failed';
      })
      .addCase(patchProject.fulfilled, (state, action) => {
        state.status = 'succeeded';

        const updatedProject = action.payload;
        const index = state.projects.findIndex(({id}) => id === updatedProject.id);
        if (index !== -1) {
          state.projects[index] = updatedProject;
        }
      })
      .addCase(deleteProject.fulfilled, (state, action) => {
        state.status = 'succeeded';
        const idToDelete = action.meta.arg.id;
        state.projects = state.projects.filter(project => project.id !== idToDelete);
      })
      .addCase(createProject.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.projects.push(action.payload);
      });
  },
});

export default projectSlice.reducer;
