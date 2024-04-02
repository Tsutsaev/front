import React, {useEffect} from 'react';
import UseAppDispatch from 'hooks/UseAppDispatch';
import {getUser} from 'store/user/actions';
import MonitoringTable from 'components/MonitoringTable';
import {getAllOrgMembers} from 'store/orgMembers/actions';
import SortingPanel from 'components/SortingPanel';
import {getAllClients} from 'store/clients/actions';
import {getProjectsByOrg} from 'store/projects/actions';
import {getProjMemberById} from 'store/projectMembers/actions';
import UseRoleRedirect from 'hooks/UseRoleRedirect';
import StatusChecker from 'components/StatusChecker';
import PageWrapper from 'components/new/Page/Wrapper';
import PageMenu from 'components/new/Page/Menu';
import Button from 'components/new/Button';

import styles from './index.module.scss';
import {connect} from 'react-redux';
import {RootState} from 'store';
import {selectFilters} from 'store/filters/selectors';
import {StateProps} from './type';
import {selectUser} from 'store/user/selectors';
import {formatDrpTime} from 'utils/FormatDrpTime';
import {UseDateContext} from 'hooks/UseDateContext';
import {baseURL} from 'shared';

const MonitoringPage = ({filters, user}: StateProps) => {
  UseRoleRedirect();
  const dispatch = UseAppDispatch();
  const {data, currentOrgId, status: userStatus} = user;
  const {date} = UseDateContext();
  const {client, fillingType, project, memberType} = filters;

  useEffect(() => {
    void dispatch(getUser());
    void dispatch(getAllClients({orgId: currentOrgId}));
    void dispatch(getProjectsByOrg(currentOrgId));
    void dispatch(getAllOrgMembers(currentOrgId));
    void dispatch(getProjMemberById({orgId: currentOrgId, id: Number(data.id)}));
  }, [currentOrgId, dispatch, data.id]);

  return (
    <StatusChecker statusArray={[userStatus]}>
      <PageWrapper>
        <PageMenu title="Мониторинг">
          <div className={styles.buttons}>
            <a
              href={`${baseURL}${currentOrgId}/report_monitor/export/?ordering=profile${formatDrpTime(
                date,
              )}&client=${client || ''}&project=${project || ''}&role=${
                memberType || ''
              }&fill_mode=${fillingType || ''}`}>
              <Button onClick={() => {}} type="submit">
                XLS
              </Button>
            </a>
          </div>
        </PageMenu>
        <SortingPanel
          isFillingType
          isMemberType
          isClient
          isProject
          selectPeriodType={'monitoring'}
          isSearching
        />

        <MonitoringTable />
      </PageWrapper>
    </StatusChecker>
  );
};

const mapStateToProps = (state: RootState) => ({
  filters: selectFilters(state),
  user: selectUser(state),
});

export default connect(mapStateToProps)(MonitoringPage);
