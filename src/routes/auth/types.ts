import {IUser} from 'store/user/types';

export type IAuthResponse = {
  token: string;
  profile: IUser;
};

export type ExpectedType = {
  error?: string;
  non_field_errors: string;
};
