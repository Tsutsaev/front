import {IFiltersState} from 'store/filters/types';
import {MonitoringReportType} from '../types';

export type ITableMonitoringItem = {
  templateColumns: string;
  period: [Date | null, Date | null];
  monitoringField: MonitoringReportType;
  type: 'gray' | 'white';

  filters: IFiltersState;
};
