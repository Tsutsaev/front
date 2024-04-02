import {configureStore} from '@reduxjs/toolkit';
import clientsReducer from 'store/clients/slice';
import departmentsReducer from 'store/department/slice';
import filtersReducer from 'store/filters/slice';
import organizationsReducer from 'store/organizations/slice';
import orgMembersReducer from 'store/orgMembers/slice';
import projMembersReducer from 'store/projectMembers/slice';
import projectsReducer from 'store/projects/slice';
import sheetsReducer from 'store/sheet/slice';
import userReducer from 'store/user/slice';

import restReducer from './rest/slice';

const store = configureStore({
  reducer: {
    sheets: sheetsReducer,
    user: userReducer,
    organizations: organizationsReducer,
    projects: projectsReducer,
    orgMembers: orgMembersReducer,
    filters: filtersReducer,
    clients: clientsReducer,
    rest: restReducer,
    projMembers: projMembersReducer,
    departments: departmentsReducer,
  },
});

export default store;

export type RootState = ReturnType<typeof store.getState>;

export type AppDispatch = typeof store.dispatch;
