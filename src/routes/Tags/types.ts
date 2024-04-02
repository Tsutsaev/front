import {IUserState} from 'store/user/types';

export type IAuthResponse = {
  token: string;
  profile_id: string;
  profile: IUserState;
};
