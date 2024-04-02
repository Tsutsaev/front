import React, {useEffect, useMemo, memo} from 'react';
import {connect} from 'react-redux';
import {RootState} from 'store';
import {getAllClients} from 'store/clients/actions';
import {getDepartmentsByOrg} from 'store/department/actions';
import {
  setClient,
  setFillingType,
  setIsActive,
  setIsFilled,
  setIsFills,
  setIsFired,
  setIsSheetOff,
  setMemberType,
  setOrgMember,
  setProject,
  setSearch,
  setDepartment,
} from 'store/filters/slice';
import {selectCanUseDepartments} from 'store/organizations/selectors';
import {getAllOrgMembers} from 'store/orgMembers/actions';
import {getProjectsByClient, getProjectsByOrg} from 'store/projects/actions';

import FiredFilter from 'components/FiredFilter';
import DateDropdown from 'components/new/Dropdown/Date';
import PanelDropdown from 'components/new/Dropdown/Panel';
import SwitchFilter from 'components/new/SwitchFilter';

import UseAppDispatch from 'hooks/UseAppDispatch';
import UseAppSelector from 'hooks/UseAppSelector';
import {UseDateContext} from 'hooks/UseDateContext';

import Search from 'shared/uIkit/Search';

import {transformDropdownData, transformOrgMembersData} from 'utils/TransformDropdownData';

import {labelsFillingType, labelsIsFilled, labelsIsSheetOff, labelsMemberType} from './data';
import styles from './index.module.scss';
import {Props} from './types';

const SortingPanel = ({
  isFilled,
  isFillingType,
  isMemberType,
  isSearching,
  selectPeriodType,
  isProject,
  isClient,
  isFired,
  isSheetOff,
  isOrgMembers,
  isActive,
  isFills,
  isDepartment,
  selectedDate,
  setSelectedDate,
  initialState,
  canUseDepartments,
}: Props) => {
  const dispatch = UseAppDispatch();
  const projects = UseAppSelector(state => state.projects.projects);
  const {isTopManager, currentOrgId} = UseAppSelector(state => state.user);
  const status = UseAppSelector(state => state.projects.status);
  const filterClient = UseAppSelector(state => state.filters.client);

  const clients = UseAppSelector(state => state.clients.clients);
  const statusClients = UseAppSelector(state => state.clients.status);

  const departmentsState = UseAppSelector(state => state.departments.departments);
  const statusDepartments = UseAppSelector(state => state.departments.departmentsStatus);

  const orgMembers = UseAppSelector(state => state.orgMembers.orgMembers);
  const statusOrgMembers = UseAppSelector(state => state.orgMembers.status);
  const {date, setDate} = UseDateContext();

  const clientsLabels = useMemo(() => transformDropdownData(clients), [clients]);
  const departmentsLabels = useMemo(
    () => transformDropdownData(departmentsState),
    [departmentsState],
  );
  const orgMembersLabels = useMemo(() => transformOrgMembersData(orgMembers), [orgMembers]);

  const projectLabels = useMemo(() => {
    const labels = transformDropdownData(projects);
    labels.push({
      value: '0',
      label: 'Без проекта',
      color: '',
    });
    return labels;
  }, [projects]);

  useEffect(() => {
    return () => {
      dispatch(setFillingType(null));
      dispatch(setIsFilled(null));
      dispatch(setMemberType(null));
      dispatch(setClient(null));
      dispatch(setOrgMember(null));
      dispatch(setProject(null));
      dispatch(setSearch(''));
      dispatch(setIsFired(false));
      setDate([null, null]);
      dispatch(setDepartment(null));
    };
  }, [dispatch, setDate]);

  useEffect(() => {
    if (isClient) void dispatch(getAllClients({orgId: currentOrgId}));
    if (isOrgMembers) void dispatch(getAllOrgMembers(currentOrgId));
  }, [dispatch, currentOrgId, isClient, isOrgMembers]);

  useEffect(() => {
    if (filterClient) {
      void dispatch(getProjectsByClient({orgId: currentOrgId, clientId: Number(filterClient)}));
    } else {
      void dispatch(getProjectsByOrg(currentOrgId));
      if (isProject) {
        if (filterClient) {
          void dispatch(getProjectsByClient({orgId: currentOrgId, clientId: Number(filterClient)}));
        } else {
          void dispatch(getProjectsByOrg(currentOrgId));
        }
      }
    }
  }, [dispatch, currentOrgId, isProject, filterClient]);

  useEffect(() => {
    void dispatch(getDepartmentsByOrg(currentOrgId));
  }, [dispatch, currentOrgId]);

  if (
    (status === 'failed' && isProject) ||
    (statusClients === 'failed' && isClient) ||
    (statusOrgMembers === 'failed' && isOrgMembers) ||
    (statusDepartments === 'failed' && isDepartment)
  ) {
    return <div>Произошла ошибка</div>;
  }

  return (
    <div className={styles.panel}>
      {isSearching && <Search />}
      {selectPeriodType && (
        <div className={styles.item}>
          <DateDropdown
            type={selectPeriodType}
            selectedDate={selectedDate || date}
            setSelectedDate={setSelectedDate || setDate}
          />
        </div>
      )}
      {isFired && <FiredFilter />}
      {isClient && (
        <div className={styles.item}>
          <PanelDropdown
            onChange={value => dispatch(setClient(value))}
            labels={clientsLabels}
            isError={false}
            placeholder="Клиент"
            initialState={initialState?.client}
          />
        </div>
      )}
      {isDepartment && isTopManager && canUseDepartments && (
        <div className={styles.item}>
          <PanelDropdown
            onChange={value => dispatch(setDepartment(value))}
            labels={departmentsLabels}
            isError={false}
            placeholder="Отдел"
          />
        </div>
      )}
      {isProject && (
        <div className={styles.item}>
          <PanelDropdown
            onChange={value => dispatch(setProject(value))}
            labels={projectLabels}
            isError={false}
            placeholder="Проект"
            initialState={initialState?.project}
          />
        </div>
      )}

      {isOrgMembers && (
        <div className={styles.item}>
          <PanelDropdown
            onChange={value => dispatch(setOrgMember(value))}
            labels={orgMembersLabels}
            isError={false}
            placeholder="Сотрудник"
          />
        </div>
      )}

      {isFillingType && (
        <div className={styles.item}>
          <PanelDropdown
            onChange={value => dispatch(setFillingType(value))}
            labels={labelsFillingType}
            isError={false}
            placeholder="Форма заполнения"
          />
        </div>
      )}
      {isSheetOff && (
        <div className={styles.item}>
          <PanelDropdown
            onChange={value => dispatch(setIsSheetOff(value))}
            labels={labelsIsSheetOff}
            isError={false}
            placeholder="Заполнение часов"
          />
        </div>
      )}

      {isMemberType && (
        <div className={styles.item}>
          <PanelDropdown
            onChange={value => dispatch(setMemberType(value))}
            labels={labelsMemberType}
            isError={false}
            placeholder="Тип сотрудника"
          />
        </div>
      )}

      {isFilled && (
        <div className={styles.item}>
          <PanelDropdown
            onChange={value => dispatch(setIsFilled(value))}
            labels={labelsIsFilled}
            isError={false}
            placeholder="Заполнение"
          />
        </div>
      )}

      {isActive && (
        <div className={styles.item}>
          <SwitchFilter onChange={value => dispatch(setIsActive(value))} title={'Активные'} />
        </div>
      )}

      {isFills && (
        <div className={styles.item}>
          <SwitchFilter onChange={value => dispatch(setIsFills(value))} title={'Заполняет'} />
        </div>
      )}
    </div>
  );
};

const mapStateToProps = (state: RootState) => ({
  canUseDepartments: selectCanUseDepartments(state),
});

export default connect(mapStateToProps)(memo(SortingPanel));
