import {IFiltersState} from 'store/filters/types';

export interface Props {
  currentOrgId: number | null;
  filters: IFiltersState;
}
