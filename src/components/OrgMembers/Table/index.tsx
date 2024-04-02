import {Dispatch, bindActionCreators} from '@reduxjs/toolkit';
import React, {memo, useState, useEffect, useCallback, useMemo} from 'react';
import {connect} from 'react-redux';
import {RootState} from 'store';
import {selectFilters} from 'store/filters/selectors';
import {getFilteredOrgMembers} from 'store/orgMembers/actions';
import {selectOrgMembers} from 'store/orgMembers/selectors';
import {selectCurrentOrgId} from 'store/user/selectors';

import Table from 'components/new/Table';
import TableHeader from 'components/new/Table/Header';
import StatusChecker from 'components/StatusChecker';

import {UseDateContext} from 'hooks/UseDateContext';

import {formatDatePatch} from 'utils/DateFormat';

import OrgMembersTableItem from './Item';
import {Props} from './types';

const templateColumns = 'auto 100px 120px 150px 125px 125px';

const OrgMembersTable = ({currentOrgId, orgMembers, filters, getFilteredOrgMembers}: Props) => {
  const {orgMembers: orgMembersData, status} = orgMembers;
  const {search, memberType, fillingType, isFired, isSheetOff, department} = filters;
  const [isSorting, setIsSorting] = useState(true);
  const {date} = UseDateContext();
  const [filteredOrgMembers, setFilteredOrgMembers] = useState(orgMembersData);

  const filterOrgMembers = useCallback(() => {
    const lowercaseSearch = search.toLowerCase();

    if (lowercaseSearch.trim() === '') {
      return orgMembersData;
    } else {
      return orgMembersData.filter(orgMember =>
        orgMember.profile.fio.toLowerCase().includes(lowercaseSearch),
      );
    }
  }, [search, orgMembersData]);

  useEffect(() => {
    getFilteredOrgMembers({
      orgId: currentOrgId,
      role: memberType,
      fill_mode: fillingType,
      sheet_off: isSheetOff,
      fired: isFired,
      start_in: formatDatePatch(date[0]),
      end_in: formatDatePatch(date[1]),
      isSorting,
      department,
    });
  }, [
    date,
    getFilteredOrgMembers,
    currentOrgId,
    isSheetOff,
    memberType,
    fillingType,
    isFired,
    isSorting,
    department,
  ]);

  useEffect(() => {
    setFilteredOrgMembers(filterOrgMembers());
  }, [search, orgMembersData, filterOrgMembers]);

  const titles = useMemo(
    () => [
      {title: 'Имя', sort: () => setIsSorting(prev => !prev)},
      {title: 'Роль'},
      {title: 'Заполняет часы'},
      {title: 'Тип заполнения'},
      {title: 'Устроен'},
      {title: 'Уволен'},
    ],
    [],
  );

  return (
    <StatusChecker statusArray={[status]}>
      <Table>
        <TableHeader titles={titles} templateColumns={templateColumns} />
        {filteredOrgMembers.map((orgMember, index) => {
          return (
            <OrgMembersTableItem
              key={orgMember.id}
              orgMember={orgMember}
              templateColumns={templateColumns}
              type={index % 2 === 0 ? 'gray' : 'white'}
            />
          );
        })}
      </Table>
    </StatusChecker>
  );
};

const mapStateToProps = (state: RootState) => ({
  orgMembers: selectOrgMembers(state),
  filters: selectFilters(state),
  currentOrgId: selectCurrentOrgId(state),
});

const mapDispatchToProps = (dispatch: Dispatch) =>
  bindActionCreators(
    {
      getFilteredOrgMembers,
    },
    dispatch,
  );

export default connect(mapStateToProps, mapDispatchToProps)(memo(OrgMembersTable));
