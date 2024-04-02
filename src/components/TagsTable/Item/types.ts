import {ITag} from 'components/TagsTable/types';
import {UserRole} from 'constants/UserRole';

export type StateProps = {
  tag: ITag;
  templateColumns: string;
  onRemove: (id: number) => void;
  color?: 'gray' | 'white';
  userRole: UserRole;
  currentOrgId: number | null;
};
