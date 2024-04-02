import {RootState} from 'store';

export const selectOrganizations = (state: RootState) => {
  return state.organizations;
};

export const selectCanUseDepartments = (state: RootState) => {
  const orgId = state.user.currentOrgId;
  return state.organizations.organizations.find(({id}) => id === orgId)?.can_use_departments;
};
