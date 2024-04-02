import React, {useEffect, useState} from 'react';
import styles from './index.module.scss';
import TimeTable from 'components/TimeTable';
import TimeArbitrary from 'components/TimeArbitrary';
import {getUser} from 'store/user/actions';
import PaginationTimeButton from 'shared/uIkit/Button/PagintationTime';
import {getProjMemberById} from 'store/projectMembers/actions';
import {getAllOrgMembers} from 'store/orgMembers/actions';
import StatusChecker from 'components/StatusChecker';
import {connect} from 'react-redux';
import {Dispatch, bindActionCreators} from '@reduxjs/toolkit';
import {RootState} from 'store';
import {selectUser} from 'store/user/selectors';
import {selectOrgMembers} from 'store/orgMembers/selectors';
import {Props} from './types';
import {selectOrganizations} from 'store/organizations/selectors';
import Button from 'components/new/Button';
import {NavLink} from 'react-router-dom';
import PageWrapper from 'components/new/Page/Wrapper';
import PageMenu from 'components/new/Page/Menu';

const TimePage = ({
  orgMembers,
  user,
  organizations,
  getUser,
  getProjMemberById,
  getAllOrgMembers,
}: Props) => {
  const {currentOrgId, data, status: userStatus} = user;
  const {orgMembers: orgMembersData, status: orgMemberStatus} = orgMembers;
  const {organizations: orgData, status: orgStatus} = organizations;

  const orgMember = orgMembersData.find(({profile}) => profile.id === Number(data.id));
  const organization = orgData.find(({id}) => id === currentOrgId);
  const [page, setPage] = useState(0);

  useEffect(() => {
    getUser();
    getProjMemberById({orgId: currentOrgId, id: Number(data.id)});
    getAllOrgMembers(currentOrgId);
  }, [currentOrgId, data.id, getUser, getProjMemberById, getAllOrgMembers]);

  if (organization?.is_blocked) {
    return (
      <div className={styles.blocked_container}>
        <div className={styles.blocked}>Списание времени недоступно. Оплатите тариф</div>
        <NavLink state={{isPaymentTarif: true}} to={'/organization'}>
          <Button type="submit" onClick={() => {}}>
            Оплатить
          </Button>
        </NavLink>
      </div>
    );
  }

  return (
    <StatusChecker statusArray={[orgMemberStatus, userStatus, orgStatus]}>
      <PageWrapper>
        <PageMenu title="Время">
          {orgMember?.fill_mode === 'table_week' && (
            <PaginationTimeButton page={page} setPage={setPage} />
          )}
        </PageMenu>

        {currentOrgId ? (
          orgMember?.fill_mode === 'table_week' ? (
            <TimeTable page={page} />
          ) : (
            <TimeArbitrary />
          )
        ) : (
          <p>Выберите организазцию</p>
        )}
      </PageWrapper>
    </StatusChecker>
  );
};

const mapStateToProps = (state: RootState) => ({
  orgMembers: selectOrgMembers(state),
  organizations: selectOrganizations(state),
  user: selectUser(state),
});

const mapDispatchToProps = (dispatch: Dispatch) =>
  bindActionCreators(
    {
      getUser,
      getProjMemberById,
      getAllOrgMembers,
    },
    dispatch,
  );

export default connect(mapStateToProps, mapDispatchToProps)(TimePage);
