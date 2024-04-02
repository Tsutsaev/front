import {IHoliday} from 'components/HolidaysTable/types';
import {UserRole} from 'constants/UserRole';

export type StateProps = {
  holiday: IHoliday;
  templateColumns: string;
  onRemove: (id: number) => void;
  userRole: UserRole;
  currentOrgId: number | null;
  color?: 'gray' | 'white';
};
