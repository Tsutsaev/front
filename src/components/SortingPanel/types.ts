import {DropdownDateType} from 'components/new/Dropdown/Date/types';

export interface SortingPanelProps {
  isFilled?: boolean;
  isFillingType?: boolean;
  isMemberType?: boolean;
  isSearching?: boolean;
  selectPeriodType?: DropdownDateType;
  isProject?: boolean;
  isClient?: boolean;
  isFired?: boolean;
  isSheetOff?: boolean;
  isOrgMembers?: boolean;
  isActive?: boolean;
  isFills?: boolean;
  isDepartment?: boolean;
  selectedDate?: [Date | null, Date | null];
  setSelectedDate?: (date: [Date | null, Date | null]) => void;

  initialState?: FiltersState;
}

export type FiltersState = {
  project?: string | null;
  client?: string | null;
};

interface StateProps {
  canUseDepartments?: boolean;
}

export type Props = StateProps & SortingPanelProps;
