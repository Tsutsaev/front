import {patchMyProfileAvatar} from 'store/Profile/actions';
import {IUser} from 'store/user/types';

type StateProps = {
  userData: IUser;
};

type DispatchProps = {
  patchMyProfileAvatar: typeof patchMyProfileAvatar;
};

export type Props = StateProps & DispatchProps;
