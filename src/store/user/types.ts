import {UserRole} from 'constants/UserRole';

export type IUser = {
  avatar: string;
  current_organization: number | null;
  date_joined: string;
  email: string;
  fio: string;
  id: string;
  is_active: boolean;
  is_staff: boolean;
  is_superuser: boolean;
  last_login: string | null;
  phone: string | null;
  short_name: string | null;
};

export type IUserSmall = {
  fio: string;
  id: number;
  email: string;
};

export type IUserState = {
  data: IUser;
  isLogged: boolean;
  status: string;
  currentOrgId: number | null;
  role: UserRole;
  sheetOff: boolean;
  isTopManager: boolean;
};
