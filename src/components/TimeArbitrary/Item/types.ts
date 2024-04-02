import {ISheets} from 'store/sheet/types';
import {DropdownSingleType} from 'components/new/Dropdown/Single/types';
import {IUserState} from 'store/user/types';
import {IProjMembersListState} from 'store/projectMembers/types';
import {createSheets, deleteSheets, patchSheets} from 'store/sheet/actions';

type StateProps = {
  offOther?: boolean;
  templateColumns: string;
  sheet: ISheets;
  isNotDateFired: (date: Date) => boolean;
  onCopy?: (
    project: DropdownSingleType,
    duration: string,
    description: string,
    isPayment: boolean,
  ) => void;
  user: IUserState;
  projectMembers: IProjMembersListState;
};

type DispatchProps = {
  deleteSheets: typeof deleteSheets;
  patchSheets: typeof patchSheets;
  createSheets: typeof createSheets;
};

export type Props = StateProps & DispatchProps;

export type SheetData = {
  duration: string;
  project: DropdownSingleType;
  description: string;
  isPayment: boolean;
  date: Date;
  off: string;
};
