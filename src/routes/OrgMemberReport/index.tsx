import {useLocation} from 'react-router-dom';

import React, {useEffect, useState, useMemo} from 'react';
import {connect} from 'react-redux';
import {baseURL} from 'shared';
import {RootState} from 'store';
import {selectFilters} from 'store/filters/selectors';
import {FiltersStateProps} from 'store/filters/types';
import {selectCurrentOrgId} from 'store/user/selectors';

import {filterOrgMemberReport} from 'routes/OrgMemberReport/service';
import OrgMemberReportTable from 'routes/OrgMemberReport/Table';

import Button from 'components/new/Button';
import PageMenu from 'components/new/Page/Menu';
import PageWrapper from 'components/new/Page/Wrapper';
import SortingPanel from 'components/SortingPanel';

import UseRoleRedirect from 'hooks/UseRoleRedirect';

import Loader from 'shared/uIkit';

import {formatDatePatchPoint} from 'utils/DateFormat';
import {setCurrentMonth} from 'utils/SetCurrentMonth';

import {initialData} from './state';
import {Props} from './types';

const OrgMemberReportPage = ({currentOrgId, filters}: Props) => {
  UseRoleRedirect();
  const location = useLocation();
  const propsData = location.state as FiltersStateProps;

  const {client, project, isActive, isFills, search, department} = filters;

  const [loadingState, setLoadingState] = useState<'pending' | 'done'>('pending');

  const [sort, setSort] = useState('');
  const [data, setData] = useState(initialData);
  const [selectedDate, setSelectedDate] = useState(propsData?.date || setCurrentMonth());

  useEffect(() => {
    const dateStart = formatDatePatchPoint(selectedDate[0]);
    const dateEnd = formatDatePatchPoint(selectedDate[1]);

    void filterOrgMemberReport(
      currentOrgId,
      client,
      dateStart,
      dateEnd,
      project,
      sort,
      isActive,
      isFills,
      department,
    ).then(data => {
      setLoadingState('done');
      setData({cached: data, search: data});
    });
  }, [currentOrgId, client, isActive, isFills, project, sort, selectedDate, department]);

  useEffect(() => {
    const lowercaseSearch = search.toLowerCase();
    if (lowercaseSearch.trim() !== '') {
      setData(prevState => {
        const {search, cached} = prevState;

        if (cached && cached.results) {
          return {
            cached,
            search: {
              ...search,
              results: cached?.results.filter(orgMember =>
                orgMember.fio.toLowerCase().includes(lowercaseSearch),
              ),
            },
          };
        } else {
          return {...prevState, cached: {total_expenses: 0, total_hours: 0, results: []}};
        }
      });
    } else {
      setData(prevState => ({...prevState, search: prevState.cached}));
    }
  }, [search, data.cached]);

  const handleTableSort = () => {
    setSort(prevState => (prevState ? '' : '-'));
  };

  const exportFilters = useMemo(() => {
    const dateStart = formatDatePatchPoint(selectedDate[0]);
    const dateEnd = formatDatePatchPoint(selectedDate[1]);
    return (
      '?client=' +
      client +
      '&date_start=' +
      dateStart +
      '&date_end=' +
      dateEnd +
      '&project=' +
      project +
      '&active=' +
      isActive +
      '&fills=' +
      isFills +
      '&department' +
      department
    );
  }, [project, client, isActive, isFills, selectedDate, department]);

  if (loadingState === 'pending') return <Loader />;

  return (
    <PageWrapper>
      <PageMenu title={'Сотрудники'}>
        <a href={`${baseURL}/${currentOrgId}/report_employee/export/` + exportFilters}>
          <Button type={'submit'}>XLS</Button>
        </a>
      </PageMenu>

      <SortingPanel
        isDepartment
        isSearching
        isClient
        isProject
        isActive
        isFills
        selectedDate={selectedDate}
        setSelectedDate={setSelectedDate}
        selectPeriodType="report"
        initialState={propsData}
      />

      <OrgMemberReportTable selectedDate={selectedDate} sort={handleTableSort} data={data.search} />
    </PageWrapper>
  );
};

const mapStateToProps = (state: RootState) => ({
  currentOrgId: selectCurrentOrgId(state),
  filters: selectFilters(state),
});

export default connect(mapStateToProps)(OrgMemberReportPage);
