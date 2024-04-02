import {IUserState} from './types';

export const initialState: IUserState = {
  isLogged: false,
  status: 'loading',
  currentOrgId: null,
  role: 'employee',
  sheetOff: true,
  isTopManager: false,
  data: {
    avatar: '',
    current_organization: 11,
    date_joined: '111',
    email: '111',
    fio: '111',
    id: '46',
    is_active: true,
    is_staff: true,
    is_superuser: true,
    last_login: null,
    phone: null,
    short_name: null,
  },
};
