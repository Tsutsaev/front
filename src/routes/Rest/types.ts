import {getAllOrgMembers} from 'store/orgMembers/actions';
import {IOrgMembersListState} from 'store/orgMembers/types';
import {getAllRest} from 'store/rest/actions';
import {IRestListState} from 'store/rest/types';
import {IUserState} from 'store/user/types';

type StateProps = {
  user: IUserState;
  rest: IRestListState;
  orgMembers: IOrgMembersListState;
};

type DispatchProps = {
  getAllOrgMembers: typeof getAllOrgMembers;
  getAllRest: typeof getAllRest;
};

export type Props = StateProps & DispatchProps;
