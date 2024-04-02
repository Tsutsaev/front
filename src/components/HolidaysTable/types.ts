import {UserRole} from 'constants/UserRole';

interface StateProps {
  userRole: UserRole;
  currentOrgId: number | null;
  search: string;
}

interface HolidaysTableProps {
  addingLine: boolean;
  setAddingLine: (value: boolean) => void;
}

export type Props = HolidaysTableProps & StateProps;

export type IHoliday = {
  id: number;
  organization: number;
  date_at: string;
  description: string;
  created_at: string;
  created_by: number;
};

export type IPatchHoliday = {
  date_at?: string;
  description?: string;
};

export type IPostHoliday = {
  date_at: string;
  description: string;
};
