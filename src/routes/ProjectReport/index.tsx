import {Link} from 'react-router-dom';

import React, {useCallback, useEffect, useState} from 'react';
import {connect} from 'react-redux';
import {baseURL} from 'shared';
import {RootState} from 'store';
import {selectFilters} from 'store/filters/selectors';
import {selectCurrentOrgId} from 'store/user/selectors';
import {reduceName, reduceValue} from 'utils';

import {filterReportProjects} from 'routes/ProjectReport/service';

import {TagsList} from 'components/new';
import Button from 'components/new/Button';
import PageMenu from 'components/new/Page/Menu';
import PageWrapper from 'components/new/Page/Wrapper';
import Table from 'components/new/Table';
import TableCell from 'components/new/Table/Cell';
import TableHeader from 'components/new/Table/Header';
import TableRow from 'components/new/Table/Row';
import TooltipCustom from 'components/new/Tooltip';
import SortingPanel from 'components/SortingPanel';

import UseRoleRedirect from 'hooks/UseRoleRedirect';

import {formatDate, formatDatePatchPoint} from 'utils/DateFormat';
import {setCurrentMonth} from 'utils/SetCurrentMonth';

import styles from './index.module.css';
import {Props, ReportProjectsResponse} from './types';

const templateColumns = '250px 150px 100px 110px 110px auto';

const ProjectReport = ({currentOrgId, filters}: Props) => {
  UseRoleRedirect();
  const [projectReportData, setProjectReportData] = useState<undefined | ReportProjectsResponse>(
    undefined,
  );

  const {client, orgMember, search} = filters;

  const [selectedDate, setSelectedDate] = useState(setCurrentMonth());

  const [filteredProjectList, setFilteredProjectList] = useState(projectReportData);

  const [projectNameSort, setProjectNameSort] = useState('');

  const submitForm = useCallback(async () => {
    const dateStart = formatDate(selectedDate[0]);
    const dateEnd = formatDate(selectedDate[1]);

    return await filterReportProjects(
      currentOrgId,
      client,
      dateStart,
      dateEnd,
      orgMember,
      projectNameSort,
    );
  }, [client, currentOrgId, selectedDate, orgMember, projectNameSort]);

  useEffect(() => {
    void submitForm().then(data => {
      setProjectReportData(data);
    });
  }, [submitForm]);

  useEffect(() => {
    const lowercaseSearch = search.toLowerCase();
    if (lowercaseSearch.trim() !== '') {
      setFilteredProjectList(prevState => {
        if (prevState)
          return {
            ...prevState,
            results:
              projectReportData?.results.filter(project => {
                if (project.project_name) {
                  return (
                    project.project_name.toLowerCase().includes(search.toLowerCase()) ||
                    project.tags?.filter(tag => tag.toLowerCase().includes(search.toLowerCase()))
                      .length
                  );
                }
              }) || [],
          };
      });
    } else {
      setFilteredProjectList(projectReportData);
    }
  }, [search, projectReportData]);

  return (
    <PageWrapper>
      <PageMenu title="Проекты">
        <div className={styles.buttons}>
          <a
            href={`${baseURL}${currentOrgId}/report_project/export/?ordering=${projectNameSort}&date_start=${formatDatePatchPoint(
              selectedDate[0],
            )}&date_end=${formatDatePatchPoint(selectedDate[1])}&client=${client || ''}&profile=${
              orgMember || ''
            }`}>
            <Button onClick={() => {}} type="submit">
              XLS
            </Button>
          </a>
        </div>
      </PageMenu>

      <SortingPanel
        selectedDate={selectedDate}
        setSelectedDate={setSelectedDate}
        isSearching
        isClient
        isOrgMembers
        selectPeriodType="report"
      />

      <Table>
        <TableHeader
          titles={[
            {
              title: 'Название',
              sort: () => setProjectNameSort(prevState => (prevState ? '' : '-')),
            },
            {title: 'Клиент'},
            {title: 'Часы', align: 'end'},
            {title: 'Сумма', align: 'end'},
            {title: 'Бюджет', align: 'end'},
            {title: 'Теги'},
          ]}
          templateColumns={templateColumns}
        />
        <TableRow templateColumns={templateColumns}>
          <TableCell>Всего</TableCell>
          <TableCell>-</TableCell>
          <TableCell style={{textAlign: 'right'}}>
            {reduceValue(projectReportData?.total_hours)}
          </TableCell>

          <TooltipCustom
            limit={15}
            content={projectReportData?.total_expenses.toLocaleString('ru')}>
            <TableCell style={{textAlign: 'right'}}>
              {reduceValue(projectReportData?.total_expenses, 15)}
            </TableCell>
          </TooltipCustom>

          <TableCell style={{textAlign: 'right'}}>-</TableCell>
          <TableCell>-</TableCell>
        </TableRow>

        {filteredProjectList?.results?.map((report, index) => (
          <TableRow
            key={report.project_id}
            color={index % 2 ? 'gray' : 'white'}
            templateColumns={templateColumns}>
            <TableCell>
              <TooltipCustom content={report?.project_name || ''}>
                <Link
                  className={styles.link__to__project}
                  state={{
                    date: selectedDate,
                    project: report.project_id.toString(),
                    orgMember,
                    client,
                  }}
                  to={'/org_member_report/'}>
                  {reduceName(report.project_name || 'Без проекта')}
                </Link>
              </TooltipCustom>
            </TableCell>
            <TableCell>
              <TooltipCustom content={report.client?.name || ''}>
                {reduceName(report.client?.name || '-', 15)}
              </TooltipCustom>
            </TableCell>
            <TableCell style={{textAlign: 'right'}}>{reduceValue(report.hours) || '-'}</TableCell>

            <TooltipCustom limit={15} content={report.earn.toLocaleString('ru')}>
              <TableCell style={{textAlign: 'right'}}>
                {reduceValue(report.earn, 15) || '-'}
              </TableCell>
            </TooltipCustom>

            <TooltipCustom limit={15} content={report.project_budget?.toLocaleString('ru')}>
              <TableCell style={{textAlign: 'right'}}>
                {reduceValue(report.project_budget, 15) || '-'}
              </TableCell>
            </TooltipCustom>

            <TableCell>
              <TagsList tags={report.tags || []} />
            </TableCell>
          </TableRow>
        ))}
      </Table>
    </PageWrapper>
  );
};

const mapStateToProps = (state: RootState) => ({
  filters: selectFilters(state),
  currentOrgId: selectCurrentOrgId(state),
});

export default connect(mapStateToProps)(ProjectReport);
