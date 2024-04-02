import {NavLink} from 'react-router-dom';

import React from 'react';

import Button from 'components/new/Button';
import PageMenu from 'components/new/Page/Menu';
import PageWrapper from 'components/new/Page/Wrapper';
import OrgMembersTable from 'components/OrgMembers/Table';
import SortingPanel from 'components/SortingPanel';

import UseRoleRedirect from 'hooks/UseRoleRedirect';

const OrgMembersPage = () => {
  UseRoleRedirect();

  return (
    <PageWrapper>
      <PageMenu title="Сотрудники">
        <NavLink to={'create'}>
          <Button type={'submit'}>Добавить</Button>
        </NavLink>
      </PageMenu>

      <SortingPanel
        selectPeriodType={'withYear'}
        isSheetOff
        isDepartment
        isSearching
        isFired
        isFillingType
        isMemberType
      />

      <OrgMembersTable />
    </PageWrapper>
  );
};

export default OrgMembersPage;
