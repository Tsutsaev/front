import {Link} from 'react-router-dom';

import React from 'react';
import {connect} from 'react-redux';
import {RootState} from 'store';
import {selectFilters} from 'store/filters/selectors';
import {IFiltersState} from 'store/filters/types';
import {reduceValue} from 'utils';

import styles from 'routes/OrgMemberReport/index.module.css';
import {TableData} from 'routes/OrgMemberReport/state';

import Table from 'components/new/Table';
import TableCell from 'components/new/Table/Cell';
import TableHeader from 'components/new/Table/Header';
import TableRow from 'components/new/Table/Row';
import TooltipCustom from 'components/new/Tooltip';

const templateColumns = '350px 240px auto';

interface IOrgMemberReportTable {
  sort: () => void;
  data: TableData | undefined;
  selectedDate: [null | Date, null | Date];
  filters: IFiltersState;
}

const OrgMemberReportTable = ({sort, data, selectedDate, filters}: IOrgMemberReportTable) => {
  const {client, project} = filters;
  return (
    <Table>
      <TableHeader
        titles={[
          {
            title: 'Сотрудник',
            sort,
          },
          {title: 'Часы', align: 'end'},
          {title: 'Сумма', align: 'end'},
        ]}
        templateColumns={templateColumns}
      />
      <TableRow templateColumns={templateColumns}>
        <TableCell>Всего</TableCell>
        <TooltipCustom content={data?.total_hours.toLocaleString('ru')}>
          <TableCell style={{textAlign: 'right'}}>{reduceValue(data?.total_hours, 25)}</TableCell>
        </TooltipCustom>
        <TooltipCustom limit={10} content={data?.total_expenses.toLocaleString('ru')}>
          <TableCell style={{textAlign: 'right'}}>
            {reduceValue(data?.total_expenses, 25)}
          </TableCell>
        </TooltipCustom>
      </TableRow>
      {data &&
        data.results?.map((report, index) => (
          <TableRow
            key={report.profile_id}
            color={index % 2 ? 'gray' : 'white'}
            templateColumns={templateColumns}>
            <TableCell>
              <Link
                state={{date: selectedDate, client, project}}
                className={styles.link__to__project}
                to={`/monitoring/sheet/${report.profile_id}/plain`}>
                {report.fio}
              </Link>
            </TableCell>
            <TooltipCustom content={report.hours?.toLocaleString('ru')}>
              <TableCell style={{textAlign: 'right'}}>
                {reduceValue(report.hours, 25) || '-'}
              </TableCell>
            </TooltipCustom>
            <TooltipCustom content={report.earn?.toLocaleString('ru')}>
              <TableCell style={{textAlign: 'right'}}>
                {reduceValue(report.earn, 25) || '-'}
              </TableCell>
            </TooltipCustom>
          </TableRow>
        ))}
    </Table>
  );
};

const mapStateToProps = (state: RootState) => ({
  filters: selectFilters(state),
});

export default connect(mapStateToProps)(OrgMemberReportTable);
