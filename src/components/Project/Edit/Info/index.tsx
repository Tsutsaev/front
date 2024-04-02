import {Dispatch, bindActionCreators} from '@reduxjs/toolkit';
import {formatISO} from 'date-fns';
import React, {memo, useState, useMemo, useEffect} from 'react';
import {connect} from 'react-redux';
import {RootState} from 'store';
import {selectClients} from 'store/clients/selectors';
import {getDepartmentsByOrg} from 'store/department/actions';
import {selectDepartments} from 'store/department/selectors';
import {selectProjectMembers} from 'store/projectMembers/selectors';
import {getAllTags, patchProject} from 'store/projects/actions';
import {PatchProjectInfoType} from 'store/projects/types';
import {selectCurrentOrgId} from 'store/user/selectors';

import {TagsList} from 'components/new';
import CustomDatePicker from 'components/new/DatePicker';
import MultipleDropdown from 'components/new/Dropdown/Multiple';
import {DropdownMultipleType} from 'components/new/Dropdown/Multiple/types';
import {MyOption} from 'components/new/Dropdown/Panel/types';
import SingleDropdown from 'components/new/Dropdown/Single';
import {DropdownSingleType} from 'components/new/Dropdown/Single/types';
import Input from 'components/new/Input';
import TableInfo from 'components/new/Table/Info';
import TableInfoRow from 'components/new/Table/Info/Row';

import {formatDate} from 'utils/DateFormat';
import {getMultyOptionsFromStrings, getOptionFromId} from 'utils/GetOptionFromString';
import {transformDropdownData} from 'utils/TransformDropdownData';

import {ProjectInfoDataType, Props} from './types';

export const projectTitles = {
  name: 'Название*',
  client_id: 'Клиент',
  date_start: 'Дата начала',
  date_end: 'Дата завершения',
  budget: 'Бюджет',
  tags: 'Теги',
  department_id: 'Отдел',
};

export const projectDateFields: (keyof PatchProjectInfoType)[] = ['date_start', 'date_end'];
export const projectInputFields: (keyof PatchProjectInfoType)[] = ['name', 'budget'];

const EditProjectInfo = ({
  currentOrgId,
  clients,
  project,
  patchProject,
  getDepartmentsByOrg,
  departments,
}: Props) => {
  const {clients: clientsData} = clients;
  const clientLabels = useMemo(() => transformDropdownData(clientsData), [clientsData]);
  const [tagsLabels, setTagsLabels] = useState<MyOption[]>([]);

  const {departments: departmentsData} = departments;
  const departmentsLabels = useMemo(
    () => transformDropdownData(departmentsData),
    [departmentsData],
  );
  useEffect(() => {
    const fetchData = async () => {
      const tags = await getAllTags(currentOrgId);
      setTagsLabels(tags.map(tag => ({value: tag.id.toString(), label: tag.name, color: ''})));
    };
    void fetchData();
  }, [currentOrgId]);

  const initialState = useMemo(
    () => ({
      name: project.name,
      client_id: getOptionFromId(project.client_id, clientLabels),
      date_start: new Date(project.date_start),
      date_end: project.date_end ? new Date(project.date_end) : null,
      budget: project.budget?.toString() || null,
      tags: getMultyOptionsFromStrings(project.tags),
      department_id: getOptionFromId(project.department_id, departmentsLabels),
    }),
    [project, clientLabels, departmentsLabels],
  );

  const [projectInfoData, setProjectInfoData] = useState<ProjectInfoDataType>(initialState);

  useEffect(() => {
    setProjectInfoData(initialState);
  }, [initialState]);

  useEffect(() => {
    getDepartmentsByOrg(currentOrgId);
  }, [getDepartmentsByOrg, currentOrgId]);

  const handleValueChange = (
    value: DropdownSingleType | DropdownMultipleType | string | Date | null | number,
    field: keyof ProjectInfoDataType,
  ) => {
    setProjectInfoData(prev => ({...prev, [field]: value}));
  };

  const onUndo = (field: keyof ProjectInfoDataType) => {
    setProjectInfoData(prev => ({
      ...prev,
      [field]: initialState[field],
    }));
  };

  const onSave = (field: keyof ProjectInfoDataType) => {
    const patchValue =
      field === 'client_id' || field === 'department_id'
        ? projectInfoData[field]?.value
        : projectDateFields.includes(field)
        ? projectInfoData[field]
          ? formatISO(projectInfoData[field] as Date).split('T')[0]
          : null
        : field === 'tags'
        ? projectInfoData.tags?.map(tag => tag.label)
        : projectInfoData[field];

    patchProject({
      orgId: currentOrgId,
      id: project.id,
      data: {[field]: patchValue || null},
    });
  };

  return (
    <TableInfo>
      <TableInfoRow
        title={projectTitles.name}
        value={projectInfoData.name || ''}
        onUndo={() => onUndo('name')}
        onSave={() => onSave('name')}>
        <Input
          style={{width: '500px'}}
          value={projectInfoData['name'] || ''}
          onChange={value => handleValueChange(value, 'name')}
          isFocus
        />
      </TableInfoRow>

      <TableInfoRow
        title={projectTitles['client_id']}
        value={projectInfoData['client_id']?.label}
        onUndo={() => onUndo('client_id')}
        onSave={() => onSave('client_id')}>
        <SingleDropdown
          isFocus
          width={500}
          handleChange={option => handleValueChange(option, 'client_id')}
          value={projectInfoData['client_id']}
          labels={clientLabels}
          isClearable
        />
      </TableInfoRow>

      {projectDateFields.map(field => (
        <TableInfoRow
          key={field}
          title={projectTitles[field]}
          value={formatDate(projectInfoData[field] as Date)}
          onUndo={() => onUndo(field)}
          onSave={() => onSave(field)}>
          <CustomDatePicker
            style={{width: '500px'}}
            setSelectedDate={date => handleValueChange(date, field)}
            selectedDate={projectInfoData[field] as Date}
            autoFocus
          />
        </TableInfoRow>
      ))}

      <TableInfoRow
        title={projectTitles['budget']}
        value={projectInfoData['budget'] || ''}
        onUndo={() => onUndo('budget')}
        onSave={() => onSave('budget')}>
        <Input
          style={{width: '500px'}}
          value={projectInfoData['budget'] || ''}
          onChange={value => handleValueChange(value, 'budget')}
          isFocus
        />
      </TableInfoRow>
      <TableInfoRow
        title={'Тэги'}
        onUndo={() => onUndo('tags')}
        onSave={() => onSave('tags')}
        value={<TagsList tags={projectInfoData.tags?.map(tag => tag.label) || []} />}>
        <MultipleDropdown
          isClearable={false}
          width={500}
          isAddedNewValue
          labels={tagsLabels}
          handleChange={value => handleValueChange(value, 'tags')}
          value={projectInfoData['tags']}
        />
      </TableInfoRow>

      <TableInfoRow
        title={'Отдел'}
        onUndo={() => onUndo('department_id')}
        onSave={() => onSave('department_id')}
        value={projectInfoData['department_id']?.label}>
        <SingleDropdown
          isFocus
          isClearable
          width={500}
          labels={departmentsLabels}
          handleChange={value => handleValueChange(value, 'department_id')}
          value={projectInfoData['department_id']}
        />
      </TableInfoRow>
    </TableInfo>
  );
};

const mapStateToProps = (state: RootState) => ({
  currentOrgId: selectCurrentOrgId(state),
  projectMembers: selectProjectMembers(state),
  clients: selectClients(state),
  departments: selectDepartments(state),
});

const mapDispatchToProps = (dispatch: Dispatch) =>
  bindActionCreators({patchProject, getDepartmentsByOrg}, dispatch);

export default connect(mapStateToProps, mapDispatchToProps)(memo(EditProjectInfo));
