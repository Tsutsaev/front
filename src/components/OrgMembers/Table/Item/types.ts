import {IOrgMembers} from 'store/orgMembers/types';

export type OrgMembersTableItemType = {
  templateColumns: string;
  orgMember: IOrgMembers;
  type: 'gray' | 'white';
};
