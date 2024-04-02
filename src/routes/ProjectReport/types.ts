import {IFiltersState} from 'store/filters/types';

export type ReportProjectItem = {
  project_id: number;
  project_name: string | null;
  project_budget: number | null;
  hours: number;
  earn: number;
  client: {
    id: string;
    name: string;
  } | null;
  client_id: string | null;
  tags: string[] | null;
};

export type ReportProjectsResponse = {
  count: number;
  next: null;
  previous: null;
  results: ReportProjectItem[];
  total_hours: number;
  total_expenses: number;
  total_budget: number;
};

export type Props = {
  filters: IFiltersState;
  currentOrgId: number | null;
};
