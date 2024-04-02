import {IFiltersState} from 'store/filters/types';

type StateProps = {
  filters: IFiltersState;
  currentOrgId: number | null;
};

export type Props = StateProps;
