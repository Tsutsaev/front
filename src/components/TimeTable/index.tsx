import React, {memo, useEffect, useCallback, useState} from 'react';
import TimeTableItem from './Item';
import {Props} from './types';
import {getSheetsByWeek} from 'store/sheet/actions';
import {connect} from 'react-redux';
import {Dispatch, bindActionCreators} from '@reduxjs/toolkit';
import {RootState} from 'store';
import {selectOrgMembers} from 'store/orgMembers/selectors';
import {selectUser} from 'store/user/selectors';
import StatusChecker from 'components/StatusChecker';
import {selectSheets} from 'store/sheet/selectors';
import Table from 'components/new/Table';
import TableHeader from 'components/new/Table/Header';

import {ReactComponent as IconClock} from 'shared/assets/images/fi-rr-clock.svg';
import {ReactComponent as IconProject} from 'shared/assets/images/fi-rr-layers.svg';
import {ReactComponent as IconDate} from 'shared/assets/images/fi-rr-calendar.svg';
import {ReactComponent as IconDescription} from 'shared/assets/images/fi-rr-document.svg';
import {IApiResponse, instance} from 'shared';
import {TimeTableData} from './Item/types';
import {isBefore, isSameDay} from 'date-fns';

const templateColumns = '120px 80px auto 23% 10%';

const TimeTable = ({page, orgMembers, user}: Props) => {
  const {currentOrgId, data, status: userStatus} = user;
  const {orgMembers: orgMembersData, status: orgMembersStatus} = orgMembers;
  const offOther = orgMembersData.find(({profile_id}) => profile_id === Number(data.id))?.off_other;

  const currentProject =
    orgMembersData.find(orgMember => orgMember.profile.id === Number(data.id))?.current_project ||
    null;

  const isNotDateFired = useCallback(
    (date: string) => {
      const dateFired = orgMembersData.find(({profile_id}) => profile_id === Number(data.id))
        ?.date_out;
      return (
        !dateFired ||
        isSameDay(new Date(dateFired), new Date(date)) ||
        isBefore(new Date(date), new Date(dateFired))
      );
    },
    [orgMembersData, data.id],
  );

  const [timeTableData, setTimeTableData] = useState<TimeTableData[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const responce = await instance.get<IApiResponse<TimeTableData>>(
          `/${currentOrgId}/table_sheet/?week=${page}`,
        );

        setTimeTableData(responce.data.results);
        setLoading(false);
      } catch (e) {
        console.warn(e);
      }
    };

    void fetchData();
  }, [currentOrgId, page, loading]);

  return (
    <StatusChecker statusArray={[userStatus, orgMembersStatus]}>
      <Table>
        <TableHeader
          titles={[
            {icon: <IconDate />},
            {icon: <IconClock />},
            {icon: <IconDescription />, title: 'Что сделал'},
            {icon: <IconProject />, title: 'Проект'},
          ]}
          templateColumns={templateColumns}
        />

        {timeTableData.map(data => {
          return (
            <TimeTableItem
              offOther={offOther}
              isNotDateFired={isNotDateFired}
              key={data.id}
              templateColumns={templateColumns}
              data={data}
              currentProject={currentProject}
              setLoading={setLoading}
            />
          );
        })}
      </Table>
    </StatusChecker>
  );
};

const mapStateToProps = (state: RootState) => ({
  orgMembers: selectOrgMembers(state),
  user: selectUser(state),
  sheets: selectSheets(state),
});

const mapDispatchToProps = (dispatch: Dispatch) =>
  bindActionCreators(
    {
      getSheetsByWeek,
    },
    dispatch,
  );

export default connect(mapStateToProps, mapDispatchToProps)(memo(TimeTable));
