import React, {useEffect, useState} from 'react';
import {useLocation, useNavigate, useParams} from 'react-router-dom';
import UseAppSelector from 'hooks/UseAppSelector';
import SortingPanel from 'components/SortingPanel';

import styles from './index.module.scss';

import {ReactComponent as IconClock} from 'shared/assets/images/fi-rr-clock.svg';
import {ReactComponent as IconProject} from 'shared/assets/images/fi-rr-layers.svg';
import {ReactComponent as IconDate} from 'shared/assets/images/fi-rr-calendar.svg';
import {ReactComponent as IconDescription} from 'shared/assets/images/fi-rr-document.svg';
import UseRoleRedirect from 'hooks/UseRoleRedirect';
import Loader from 'shared/uIkit/Loader';
import {instance} from 'shared';
import {formatDatePatchPoint} from 'utils/DateFormat';
import {IMemberSheetProps, MonitoringProfileType} from './types';
import {RootState} from 'store';
import {selectCurrentOrgId} from 'store/user/selectors';
import {connect} from 'react-redux';
import {selectFilters} from 'store/filters/selectors';
import Button from 'components/new/Button';
import Table from 'components/new/Table';
import TableHeader from 'components/new/Table/Header';
import MemberSheetItem from 'routes/Monitoring/MemberSheet/Item';
import {getProjMemberById} from 'store/projectMembers/actions';
import {Dispatch, bindActionCreators} from '@reduxjs/toolkit';
import {getAllOrgMembers} from 'store/orgMembers/actions';
import {setCurrentAndPrevMonth} from 'utils/SetCurrentAndPrevMonth';
import {FiltersStateProps} from 'store/filters/types';

const templateColumns = '120px 80px auto 23% 10%';
const titles = [
  {icon: <IconDate />},
  {icon: <IconClock />},
  {icon: <IconDescription />, title: 'Что сделал'},
  {icon: <IconProject />, title: 'Проект'},
];

const MemberSheet = ({
  currentOrgId,
  filters,
  getProjMemberById,
  getAllOrgMembers,
}: IMemberSheetProps) => {
  UseRoleRedirect();
  const location = useLocation();
  const propsData = location.state as FiltersStateProps;
  const initialDate =
    propsData?.date && propsData.date[0] !== null && propsData.date[1] !== null
      ? propsData?.date
      : setCurrentAndPrevMonth();
  const {id} = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [monitoringProfile, setMonitoringProfile] = useState<MonitoringProfileType>();
  const {isFilled, project, client} = filters;
  const orgMember = UseAppSelector(state => state.orgMembers.orgMembers).find(
    ({profile_id}) => profile_id === Number(id),
  );

  const [selectedDate, setSelectedDate] = useState(initialDate);

  useEffect(() => {
    getProjMemberById({orgId: currentOrgId, id: Number(id)});
    getAllOrgMembers(currentOrgId);
  }, [currentOrgId, getProjMemberById, getAllOrgMembers, id]);

  useEffect(() => {
    async function fetchData() {
      try {
        setLoading(true);
        const response = await instance.get<MonitoringProfileType>(
          `/${currentOrgId}/report_monitor_profile/${id}/?date_start=${formatDatePatchPoint(
            selectedDate[0],
          )}&date_end=${formatDatePatchPoint(selectedDate[1])}&filled=${isFilled || ''}&project=${
            project || ''
          }&client=${client || ''}`,
        );
        setMonitoringProfile(response.data);

        setLoading(false);
      } catch (error) {
        console.error('Ошибка при загрузке данных:', error);
        setLoading(false);
      }
    }

    void fetchData();
  }, [selectedDate, currentOrgId, isFilled, id, project, client]);

  return (
    <div className={styles.container}>
      <div className={styles.menu}>
        <h1 className={styles.header}>{orgMember?.profile.fio}</h1>
        <Button type="submit" onClick={() => navigate(-1)}>
          Назад
        </Button>
      </div>
      <SortingPanel
        selectedDate={selectedDate}
        setSelectedDate={setSelectedDate}
        selectPeriodType={'common'}
        isProject
        isClient
        isFilled={monitoringProfile?.fill_mode === 'table_week'}
        initialState={propsData}
      />
      {loading ? (
        <Loader />
      ) : (
        <Table>
          <TableHeader titles={titles} templateColumns={templateColumns} />
          {monitoringProfile?.days.map(day => {
            return (
              <MemberSheetItem
                off_other={monitoringProfile.off_other}
                fill_mode={monitoringProfile.fill_mode}
                templateColumns={templateColumns}
                orgMemberId={orgMember?.profile.id}
                key={day.id}
                day={day}
              />
            );
          })}
        </Table>
      )}
    </div>
  );
};

const mapStateToProps = (state: RootState) => ({
  currentOrgId: selectCurrentOrgId(state),
  filters: selectFilters(state),
});

const mapDispatchToProps = (dispatch: Dispatch) =>
  bindActionCreators(
    {
      getProjMemberById,
      getAllOrgMembers,
    },
    dispatch,
  );

export default connect(mapStateToProps, mapDispatchToProps)(MemberSheet);
