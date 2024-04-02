import React, {useEffect, useState, useCallback} from 'react';
import {connect} from 'react-redux';
import {IApiResponse, baseURL, instance} from 'shared';
import {RootState} from 'store';

import Button from 'components/new/Button';
import PageMenu from 'components/new/Page/Menu';
import PageWrapper from 'components/new/Page/Wrapper';
import Table from 'components/new/Table';
import TableHeader from 'components/new/Table/Header';
import {ITitle} from 'components/new/Table/Header/types';
import TableRow from 'components/new/Table/Row';
import SortingPanel from 'components/SortingPanel';

import UseRoleRedirect from 'hooks/UseRoleRedirect';

import Loader from 'shared/uIkit/Loader';

import {formatDatePatchPoint} from 'utils/DateFormat';
import {setCurrentMonth} from 'utils/SetCurrentMonth';

import styles from './index.module.scss';
import SummaryItem from './item';
import {Props, SummaryReportType} from './types';

const templateColumns =
  '100px minmax(100px, 1fr) minmax(125px, 1fr)  minmax(125px, 1fr)  minmax(125px, 1fr)';
const peopleTitles: ITitle[] = [
  {title: 'Сотрудники'},
  {title: 'Всего', align: 'center'},
  {title: 'Устроены', align: 'center'},
  {title: 'Уволены', align: 'center'},
  {title: 'Активные', align: 'center'},
];
const timeTitles: ITitle[] = [
  {title: 'Часы'},
  {title: 'Всего', align: 'center'},
  {title: 'Бесплатные', align: 'center'},
  {title: 'Не списано', align: 'center'},
  {title: 'Отсутствия', align: 'center'},
];
const clientsTitles: ITitle[] = [
  {title: 'Клиенты'},
  {title: 'Всего', align: 'center'},
  {title: 'Активные', align: 'center'},
  {title: 'Новые', align: 'center'},

  {title: '', align: 'center'},
];
const projectsTitles: ITitle[] = [
  {title: 'Проекты'},
  {title: 'Всего', align: 'center'},
  {title: 'Активные', align: 'center'},
  {title: 'Новые', align: 'center'},
  {title: 'Закрытые', align: 'center'},
];

const moneyTitles: ITitle[] = [
  {title: 'Деньги'},
  {title: 'Всего', align: 'center'},
  {title: 'Средняя ставка', align: 'center'},
  {title: 'Средняя стоимость проекта', align: 'center'},
  {title: '', align: 'center'},
];

const SummaryPage = ({currentOrgId}: Props) => {
  UseRoleRedirect();
  const [selectedDate, setSelectedDate] = useState(setCurrentMonth());

  const [loading, setLoading] = useState(true);
  const [summaryReport, setSummaryReport] = useState<SummaryReportType>();

  const fetchData = useCallback(async () => {
    try {
      setLoading(true);
      const response = await instance.get<IApiResponse<SummaryReportType>>(
        `/${currentOrgId}/report_summary/?date_start=${formatDatePatchPoint(
          selectedDate[0],
        )}&date_end=${formatDatePatchPoint(selectedDate[1])}`,
      );
      setSummaryReport(response.data.results[0]);
      setLoading(false);
    } catch (error) {
      console.error('Ошибка при загрузке данных:', error);
      setLoading(false);
    }
  }, [currentOrgId, selectedDate]);

  useEffect(() => {
    void fetchData();
  }, [fetchData]);

  return (
    <PageWrapper>
      <PageMenu title={'Общий'}>
        <div className={styles.buttons}>
          <a
            href={`${baseURL}${currentOrgId}/report_summary/export/?date_start=${formatDatePatchPoint(
              selectedDate[0],
            )}&date_end=${formatDatePatchPoint(selectedDate[1])}`}>
            <Button onClick={() => {}} type="submit">
              XLS
            </Button>
          </a>
        </div>
      </PageMenu>
      <SortingPanel
        selectedDate={selectedDate}
        setSelectedDate={setSelectedDate}
        selectPeriodType={'summary'}
      />
      {loading ? (
        <Loader />
      ) : (
        <Table>
          <TableHeader isSmall titles={moneyTitles} templateColumns={templateColumns} />
          <TableRow color={'white'} templateColumns={templateColumns}>
            <SummaryItem />
            <SummaryItem content={summaryReport?.money.sheeted_money} />
            <SummaryItem content={summaryReport?.money.average_off} />
            <SummaryItem content={summaryReport?.money.average_project_cost} />
          </TableRow>

          <TableHeader isSmall titles={timeTitles} templateColumns={templateColumns} />
          <TableRow color={'white'} templateColumns={templateColumns}>
            <SummaryItem />
            <SummaryItem content={summaryReport?.sheet.hours_sheeted} />
            <SummaryItem content={summaryReport?.sheet.hours_free_sheeted} />
            <SummaryItem content={summaryReport?.sheet.hours_not_sheeted} />
            <SummaryItem content={summaryReport?.sheet.days_in_rest} />
          </TableRow>

          <TableHeader isSmall titles={clientsTitles} templateColumns={templateColumns} />
          <TableRow color={'white'} templateColumns={templateColumns}>
            <SummaryItem />
            <SummaryItem content={summaryReport?.clients.all_clients} />
            <SummaryItem content={summaryReport?.clients.active_clients} />
            <SummaryItem content={summaryReport?.clients.new_clients} />
          </TableRow>

          <TableHeader isSmall titles={projectsTitles} templateColumns={templateColumns} />
          <TableRow color={'white'} templateColumns={templateColumns}>
            <SummaryItem />
            <SummaryItem content={summaryReport?.projects.all_projects} />
            <SummaryItem content={summaryReport?.projects.active_projects} />
            <SummaryItem content={summaryReport?.projects.new_projects} />
            <SummaryItem content={summaryReport?.projects.closed_projects} />
          </TableRow>

          <TableHeader isSmall titles={peopleTitles} templateColumns={templateColumns} />
          <TableRow color={'white'} templateColumns={templateColumns}>
            <SummaryItem />
            <SummaryItem content={summaryReport?.employees.people_active} />
            <SummaryItem content={summaryReport?.employees.people_join} />
            <SummaryItem content={summaryReport?.employees.people_fired} />
            <SummaryItem content={summaryReport?.employees.people_sheets} />
          </TableRow>
        </Table>
      )}
    </PageWrapper>
  );
};

const mapStateToProps = (state: RootState) => ({
  currentOrgId: state.user.currentOrgId,
});

export default connect(mapStateToProps)(SummaryPage);
