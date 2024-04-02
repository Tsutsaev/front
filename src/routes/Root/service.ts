import {IApiResponse, instance} from 'shared';
import {IOrganization} from 'store/organizations/types';
import {IOrgMembers} from 'store/orgMembers/types';

type GetOneOrgId = () => Promise<number | null>;

export const getOneOrgId: GetOneOrgId = async () => {
  const org = await instance.get<IApiResponse<IOrganization>>('orgs/');
  if (org.data.results.length === 0) return null;
  return org.data.results[0].id;
};

type GetUserRole = (
  orgId: string | number,
  userId: string,
) => Promise<'employee' | 'manager' | null>;

export const getUserRole: GetUserRole = async (orgId, userId) => {
  const user = await instance.get<IApiResponse<IOrgMembers>>(
    orgId + '/org_member/?profile=' + userId,
  );
  if (user.data.results.length === 0) return null;
  return user.data.results[0].role;
};
