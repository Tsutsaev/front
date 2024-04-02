import {OrgMemberReportResponse} from 'routes/OrgMemberReport/service';

export type DatePickerType = Date | null;

export type TableData = Pick<OrgMemberReportResponse, 'results' | 'total_expenses' | 'total_hours'>;

type InitialData = {
  cached: TableData;
  search: TableData;
};

export const initialData: InitialData = {
  cached: {results: [], total_hours: 0, total_expenses: 0},
  search: {results: [], total_hours: 0, total_expenses: 0},
};
