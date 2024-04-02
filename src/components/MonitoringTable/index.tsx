import React, {memo, useMemo, useState, useEffect} from 'react';
import MonitoringTableItem from './Item';
import {format} from 'date-fns';
import {ru} from 'date-fns/locale';
import {IMonitoringTableProps, MonitoringReportType} from './types';
import {IApiResponse, instance} from 'shared';

import styles from './index.module.scss';
import Loader from 'shared/uIkit/Loader';
import {RootState} from 'store';
import {connect} from 'react-redux';
import {dateStringFormat} from 'utils/DateStringFormat';
import {selectFilters} from 'store/filters/selectors';
import Table from 'components/new/Table';
import TableHeader from 'components/new/Table/Header';
import {ITitle} from 'components/new/Table/Header/types';
import {UseDateContext} from 'hooks/UseDateContext';
import {selectCurrentOrgId} from 'store/user/selectors';

function formatTime(date: [Date | null, Date | null]) {
  if (!date[0] || !date[1]) return '';
  return '&drp=' + format(date[0], 'dd.MM.yy') + ' - ' + format(date[1], 'dd.MM.yy');
}

function getMonthName() {
  return format(new Date(), 'LLLL', {locale: ru});
}

const MonitoringTable = ({filters, currentOrgId}: IMonitoringTableProps) => {
  const [sort, setSort] = useState(true);
  const [loading, setLoading] = useState(true);
  const {client, fillingType, project, memberType, search} = filters;
  const [monitoringReport, setMonitoringReport] = useState<MonitoringReportType[]>([]);
  const [filteredMonitoringReport, setFilteredMonitoringReport] = useState(monitoringReport);
  const {date} = UseDateContext();
  useEffect(() => {
    async function fetchData() {
      try {
        setLoading(true);
        const response = await instance.get<IApiResponse<MonitoringReportType>>(
          `/${currentOrgId}/report_monitor/?ordering=${sort ? '' : '-'}profile${formatTime(
            date,
          )}&client=${client || ''}&project=${project || ''}&role=${memberType || ''}&fill_mode=${
            fillingType || ''
          }`,
        );

        setMonitoringReport(response.data.results);
        setLoading(false);
      } catch (error) {
        console.error('Ошибка при загрузке данных:', error);
        setLoading(false);
      }
    }

    void fetchData();
  }, [sort, date, client, fillingType, project, memberType, currentOrgId]);

  useEffect(() => {
    const lowercaseSearch = search.toLowerCase();

    if (lowercaseSearch.trim() === '') {
      setFilteredMonitoringReport(monitoringReport);
    } else {
      const filteredMonitoringReport = monitoringReport.filter(item =>
        item.profile.fio.toLowerCase().includes(lowercaseSearch),
      );
      setFilteredMonitoringReport(filteredMonitoringReport);
    }
  }, [search, monitoringReport]);

  const templateColumns =
    date[0] && date[1] ? 'minmax(125px, 1fr) 18% 18% 18% 18%' : 'minmax(125px, 1fr) 22% 22% 22%';

  const commonTitles: ITitle[] = useMemo(
    () => [
      {
        title: `${dateStringFormat(
          monitoringReport[0]?.curr_week_hours.week_range[0],
        )} - ${dateStringFormat(monitoringReport[0]?.curr_week_hours.week_range[1])}`,
        align: 'center',
      },
      {
        title: `${dateStringFormat(
          monitoringReport[0]?.prev_week_hours.week_range[0],
        )} - ${dateStringFormat(monitoringReport[0]?.prev_week_hours.week_range[1])}`,
        align: 'center',
      },
      {title: getMonthName(), align: 'center'},
    ],
    [monitoringReport],
  );

  const commonTitlesWithoutPeriod: ITitle[] = useMemo(
    () => [{title: 'Сотрудник', sort: () => setSort(prev => !prev)}, ...commonTitles],
    [commonTitles],
  );

  const commonTitlesWithPeriod: ITitle[] = useMemo(
    () => [
      {title: 'Сотрудник', sort: () => setSort(prev => !prev)},
      {
        title: `${dateStringFormat(
          monitoringReport[0]?.custom_period?.custom_range[0],
        )} - ${dateStringFormat(monitoringReport[0]?.custom_period?.custom_range[1])}`,
        align: 'center',
      },
      ...commonTitles,
    ],
    [commonTitles, monitoringReport],
  );

  if (loading) return <Loader />;
  if (!monitoringReport.length) return <div className={styles.empty}>Сотрудников нет</div>;

  return (
    <Table>
      <TableHeader
        titles={date[0] && date[1] ? commonTitlesWithPeriod : commonTitlesWithoutPeriod}
        templateColumns={templateColumns}
      />

      {filteredMonitoringReport.map((monitoringField, index) => {
        return (
          <MonitoringTableItem
            key={monitoringField.profile.id}
            type={index % 2 === 0 ? 'gray' : 'white'}
            templateColumns={templateColumns}
            monitoringField={monitoringField}
            period={date}
          />
        );
      })}
    </Table>
  );
};

const mapStateToProps = (state: RootState) => ({
  filters: selectFilters(state),
  currentOrgId: selectCurrentOrgId(state),
});

export default connect(mapStateToProps)(memo(MonitoringTable));
