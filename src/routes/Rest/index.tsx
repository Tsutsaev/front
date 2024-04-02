import {Dispatch, bindActionCreators} from '@reduxjs/toolkit';
import React, {useEffect, useState} from 'react';
import {connect} from 'react-redux';
import {RootState} from 'store';
import {getAllOrgMembers} from 'store/orgMembers/actions';
import {selectOrgMembers} from 'store/orgMembers/selectors';
import {getAllRest} from 'store/rest/actions';
import {selectRest} from 'store/rest/selectors';
import {selectUser} from 'store/user/selectors';

import RestTable from 'routes/Rest/Table';

import Button from 'components/new/Button';
import PageMenu from 'components/new/Page/Menu';
import PageWrapper from 'components/new/Page/Wrapper';
import SortingPanel from 'components/SortingPanel';
import StatusChecker from 'components/StatusChecker';

import {Props} from './types';

const RestPage = ({user, getAllRest, getAllOrgMembers}: Props) => {
  const {currentOrgId, role, status: userStatus} = user;
  const [addingLine, setAddingLine] = useState(false);

  useEffect(() => {
    void getAllRest(currentOrgId);
    void getAllOrgMembers(currentOrgId);
  }, [getAllRest, getAllOrgMembers, currentOrgId]);

  return (
    <PageWrapper>
      <PageMenu title="Отсутствия">
        <Button type={addingLine ? 'disabled' : 'submit'} onClick={() => setAddingLine(true)}>
          Добавить
        </Button>
      </PageMenu>

      {role === 'manager' && <SortingPanel isSearching selectPeriodType="common" />}

      <StatusChecker statusArray={[userStatus]}>
        <RestTable addingLine={addingLine} setAddingLine={setAddingLine} />
      </StatusChecker>
    </PageWrapper>
  );
};
const mapStateToProps = (state: RootState) => ({
  rest: selectRest(state),
  orgMembers: selectOrgMembers(state),
  user: selectUser(state),
});

const mapDispatchToProps = (dispatch: Dispatch) =>
  bindActionCreators(
    {
      getAllOrgMembers,
      getAllRest,
    },
    dispatch,
  );

export default connect(mapStateToProps, mapDispatchToProps)(RestPage);
