import React, {useState, useEffect, useMemo} from 'react';
import styles from './index.module.scss';
import UseRoleRedirect from 'hooks/UseRoleRedirect';
import SingleDropdown from 'components/new/Dropdown/Single';
import {RootState} from 'store';
import {selectUser} from 'store/user/selectors';
import {selectOrgMembers} from 'store/orgMembers/selectors';
import {Dispatch, bindActionCreators} from '@reduxjs/toolkit';
import {DropdownState, Props} from './types';
import {connect} from 'react-redux';
import {selectClients} from 'store/clients/selectors';
import {selectProjects} from 'store/projects/selectors';

import {getAllClients} from 'store/clients/actions';
import {getOrgMembersByClientProjectDate} from 'store/orgMembers/actions';
import {getProjectsByClient, getProjectsByOrg} from 'store/projects/actions';
import Button from 'components/new/Button';
import {instance} from 'shared';
import {formatDrpTime} from 'utils/FormatDrpTime';
import {transformDropdownData} from 'utils/TransformDropdownData';
import {AxiosResponse} from 'axios';
import MultipleDropdown from 'components/new/Dropdown/Multiple';
import {formatDatePatch} from 'utils/DateFormat';
import {DropdownSingleType} from 'components/new/Dropdown/Single/types';
import {DropdownMultipleType} from 'components/new/Dropdown/Multiple/types';
import StatusChecker from 'components/StatusChecker';
import {fileType} from 'constants/FileType';
import SortingPanel from 'components/SortingPanel';
import {setCurrentMonth} from 'utils/SetCurrentMonth';

const ExportPage = ({
  orgMembers,
  user,
  clients,
  projects,
  getAllClients,
  getProjectsByClient,
  getProjectsByOrg,
  getOrgMembersByClientProjectDate,
}: Props) => {
  UseRoleRedirect();
  const [selectedDate, setSelectedDate] = useState(setCurrentMonth());

  const [dropdownState, setDropdownState] = useState<DropdownState>({
    project: null,
    client: null,
    orgMember: null,
  });

  const {orgMembers: orgMembersData, status: orgMembersStatus} = orgMembers;
  const {currentOrgId, status: userStatus} = user;
  const {clients: clientsData, status: clientsStatus} = clients;
  const {projects: projectsData, status: projectsStatus} = projects;

  useEffect(() => {
    getAllClients({orgId: currentOrgId});
  }, [currentOrgId, getAllClients]);

  useEffect(() => {
    const singleCLientIdValue = dropdownState.client?.value;
    const singleProjectIdValue = dropdownState.project?.value;
    getOrgMembersByClientProjectDate({
      orgId: currentOrgId,
      clientId: singleCLientIdValue,
      projectId: singleProjectIdValue,
      work_period_before: formatDatePatch(selectedDate[1]),
      work_period_after: formatDatePatch(selectedDate[0]),
    });
  }, [
    selectedDate,
    dropdownState.client,
    dropdownState.project,
    currentOrgId,
    getOrgMembersByClientProjectDate,
  ]);

  useEffect(() => {
    if (dropdownState.client) {
      const singleCLientIdValue = Number(dropdownState.client?.value);
      getProjectsByClient({orgId: currentOrgId, clientId: singleCLientIdValue});
    } else {
      getProjectsByOrg(currentOrgId);
    }
  }, [currentOrgId, getProjectsByClient, getProjectsByOrg, dropdownState.client]);

  useEffect(() => {
    if (dropdownState.client) {
      const singleCLientIdValue = Number(dropdownState.client?.value);
      getProjectsByClient({orgId: currentOrgId, clientId: singleCLientIdValue});
    } else {
      getProjectsByOrg(currentOrgId);
    }
  }, [currentOrgId, getProjectsByClient, getProjectsByOrg, dropdownState.client]);

  const orgMembersLabels = useMemo(() => transformDropdownData(orgMembersData), [orgMembersData]);

  const clientsLabels = useMemo(() => transformDropdownData(clientsData), [clientsData]);
  const projectsLabels = useMemo(() => transformDropdownData(projectsData), [projectsData]);

  const handleChangeDropdownState = (
    data: DropdownSingleType | DropdownMultipleType,
    field: keyof DropdownState,
  ) => {
    setDropdownState(prev => ({...prev, [field]: data}));
  };

  const getNumberValue = (value: DropdownSingleType) => {
    if (value) return Number(value.value);
    return null;
  };

  const getMultyValue = (value: DropdownMultipleType): number[] | null => {
    if (value) {
      const numbers: number[] = value.map(item => parseInt(item.value, 10));
      return numbers;
    }
    return null;
  };

  const handleSubmitExport = async (type: keyof typeof fileType) => {
    const data = {
      ext: type,
      drp: formatDrpTime(selectedDate, true),
      client: getNumberValue(dropdownState.client),
      project: getNumberValue(dropdownState.project),
      employes: getMultyValue(dropdownState.orgMember),
    };

    try {
      const response: AxiosResponse<ArrayBuffer> = await instance.post(
        `/${currentOrgId}/report_export/`,
        data,
        {responseType: 'blob'},
      );
      const dataBlob = type === 'csv' ? ['\ufeff', response.data] : [response.data];
      const blob = new Blob(dataBlob, {
        type: response.headers['Content-Type'] as string,
      });
      const url = URL.createObjectURL(blob);
      Object.assign(document.createElement('a'), {
        href: url,
        download: `exported_file.${fileType[type]}`,
      }).click();

      URL.revokeObjectURL(url);
    } catch (error) {
      console.error('Ошибка при получении данных:', error);
    }
  };

  return (
    <div className={styles.container}>
      <div className={styles.menu}>
        <h1 className={styles.header}>Экспорт</h1>
        <div className={styles.buttons}>
          <Button onClick={() => handleSubmitExport('csv_zip')} type="submit">
            CSV в ZIP
          </Button>
          <Button onClick={() => handleSubmitExport('csv')} type="submit">
            CSV
          </Button>
          <Button onClick={() => handleSubmitExport('xls')} type="submit">
            XLS
          </Button>
        </div>
      </div>
      <SortingPanel
        selectedDate={selectedDate}
        setSelectedDate={setSelectedDate}
        selectPeriodType="withYear"
      />
      <StatusChecker statusArray={[clientsStatus, projectsStatus, orgMembersStatus, userStatus]}>
        <div className={styles.text}>Клиент</div>
        <SingleDropdown
          handleChange={data => handleChangeDropdownState(data, 'client')}
          value={dropdownState.client}
          labels={clientsLabels}
          placeholder="Выберите клиента"
        />

        <div className={styles.text}>Проект</div>
        <SingleDropdown
          handleChange={data => handleChangeDropdownState(data, 'project')}
          value={dropdownState.project}
          labels={projectsLabels}
        />

        <div className={styles.text}>Сотрудники</div>
        <MultipleDropdown
          handleChange={data => handleChangeDropdownState(data, 'orgMember')}
          value={dropdownState.orgMember}
          labels={orgMembersLabels}
          placeholder="Выберите сотрудников"
        />
      </StatusChecker>
    </div>
  );
};

const mapStateToProps = (state: RootState) => ({
  orgMembers: selectOrgMembers(state),
  user: selectUser(state),
  clients: selectClients(state),
  projects: selectProjects(state),
});

const mapDispatchToProps = (dispatch: Dispatch) =>
  bindActionCreators(
    {
      getAllClients,
      getProjectsByClient,
      getProjectsByOrg,
      getOrgMembersByClientProjectDate,
    },
    dispatch,
  );

export default connect(mapStateToProps, mapDispatchToProps)(ExportPage);
