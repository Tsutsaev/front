import React from 'react';
import {ITableMonitoringItem} from './types';
import styles from './index.module.scss';
import UseAppSelector from 'hooks/UseAppSelector';
import {NavLink} from 'react-router-dom';
import StatusChecker from 'components/StatusChecker';
import {formatNumberWithComma} from 'utils/FormatNumberWithComma';
import TableRow from 'components/new/Table/Row';
import {UseDateContext} from 'hooks/UseDateContext';
import {RootState} from 'store';
import {selectFilters} from 'store/filters/selectors';
import {connect} from 'react-redux';

const MonitoringTableItem = ({
  templateColumns,

  monitoringField,
  type,
  filters,
}: ITableMonitoringItem) => {
  const userStatus = UseAppSelector(state => state.user.status);
  const {client, project} = filters;
  const {date} = UseDateContext();

  return (
    <StatusChecker statusArray={[userStatus]}>
      <TableRow color={type} templateColumns={templateColumns}>
        <NavLink
          className={styles.profile}
          state={{date, client, project}}
          to={`/monitoring/sheet/${monitoringField.profile.id}/plain`}>
          {monitoringField.profile.fio}
        </NavLink>

        {date[0] && date[1] && (
          <p className={`${styles.text} ${styles[monitoringField.custom_period?.status || '']}`}>
            {formatNumberWithComma(monitoringField.custom_period?.actual)} /{' '}
            {formatNumberWithComma(monitoringField.custom_period?.plan)}
          </p>
        )}
        <p className={`${styles.text} ${styles[monitoringField.curr_week_hours.status]}`}>
          {formatNumberWithComma(monitoringField.curr_week_hours.actual)} /{' '}
          {formatNumberWithComma(monitoringField.curr_week_hours.plan)}
        </p>
        <p className={`${styles.text} ${styles[monitoringField.prev_week_hours.status]}`}>
          {formatNumberWithComma(monitoringField.prev_week_hours.actual)} /{' '}
          {formatNumberWithComma(monitoringField.prev_week_hours.plan)}
        </p>
        <p className={`${styles.text} ${styles[monitoringField.curr_month_hours.status]}`}>
          {formatNumberWithComma(monitoringField.curr_month_hours.actual)} /{' '}
          {formatNumberWithComma(monitoringField.curr_month_hours.plan)}
        </p>
      </TableRow>
    </StatusChecker>
  );
};

const mapStateToProps = (state: RootState) => ({
  filters: selectFilters(state),
});

export default connect(mapStateToProps)(MonitoringTableItem);
