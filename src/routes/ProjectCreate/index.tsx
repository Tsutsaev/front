import {Link, useNavigate} from 'react-router-dom';

import {Dispatch, bindActionCreators} from '@reduxjs/toolkit';
import {format} from 'date-fns';
import React, {useEffect, useMemo, useState} from 'react';
import {connect} from 'react-redux';
import {RootState} from 'store';
import {getAllClients} from 'store/clients/actions';
import {selectClients} from 'store/clients/selectors';
import {getDepartmentsByOrg} from 'store/department/actions';
import {selectDepartments} from 'store/department/selectors';
import {createProject, getAllTags} from 'store/projects/actions';
import {CreateProjectData} from 'store/projects/types';
import {selectCurrentOrgId} from 'store/user/selectors';

import {TagsList} from 'components/new';
import Button from 'components/new/Button';
import CustomDatePicker from 'components/new/DatePicker';
import MultipleDropdown from 'components/new/Dropdown/Multiple';
import {DropdownMultipleType} from 'components/new/Dropdown/Multiple/types';
import SingleDropdown from 'components/new/Dropdown/Single';
import {DropdownSingleType, MyOption} from 'components/new/Dropdown/Single/types';
import Input from 'components/new/Input';
import PageMenu from 'components/new/Page/Menu';
import PageWrapper from 'components/new/Page/Wrapper';
import TableInfo from 'components/new/Table/Info';
import TableInfoRow from 'components/new/Table/Info/Row';
import StatusChecker from 'components/StatusChecker';

import UseAppDispatch from 'hooks/UseAppDispatch';
import UseRoleRedirect from 'hooks/UseRoleRedirect';

import {ReactComponent as PlusIcon} from 'shared/assets/images/fi-rr-plus.svg';

import {formatDate} from 'utils/DateFormat';
import {transformDropdownData} from 'utils/TransformDropdownData';

import styles from './index.module.css';
import {InfoData, Props} from './types';

export const projectTitles = {
  name: 'Название*',
  client_id: 'Клиент*',
  date_start: 'Дата начала',
  date_end: 'Дата завершения',
  budget: 'Бюджет',
  tags: 'Теги',
  department_id: 'Отдел',
};

export const projectDateFields: (keyof CreateProjectData)[] = ['date_start', 'date_end'];
export const projectInputFields: (keyof CreateProjectData)[] = ['name', 'budget'];

const ProjectCreate = ({
  getAllClients,
  currentOrgId,
  clients,
  getDepartmentsByOrg,
  departments,
}: Props) => {
  UseRoleRedirect();
  const navigate = useNavigate();
  const [error, setError] = useState(false);
  const {clients: clientsData, status} = clients;
  const clientLabels = useMemo(() => transformDropdownData(clientsData), [clientsData]);
  const [tagsLabels, setTagsLabels] = useState<MyOption[]>([]);

  const {departments: departmentsData, departmentsStatus} = departments;

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
      name: '',
      client_id: null,
      date_start: new Date(),
      date_end: null,
      budget: '0',
      tags: [],
      department_id: null,
    }),
    [],
  );

  const [infoData, setInfoData] = useState<InfoData>(initialState);

  const dispatch = UseAppDispatch();

  const createNewProject = async () => {
    if (infoData.date_start && infoData.client_id && infoData.name) {
      const date_start = format(infoData.date_start, 'yyyy-MM-dd');
      const date_end = infoData.date_end ? format(infoData.date_end, 'yyyy-MM-dd') : null;
      const budget = +infoData.budget || null;

      await dispatch(
        createProject({
          orgId: currentOrgId,
          data: {
            name: infoData.name,
            client_id: Number(infoData.client_id?.value),
            date_start,
            date_end,
            tags: infoData.tags?.map(tag => tag.label) || [],
            budget,
            department_id: Number(infoData.department_id?.value),
          },
        }),
      );
      navigate('/project');
    } else {
      setError(true);
    }
  };

  useEffect(() => {
    setInfoData(initialState);
  }, [initialState]);

  useEffect(() => {
    getAllClients({orgId: currentOrgId});
    getDepartmentsByOrg(currentOrgId);
  }, [getAllClients, getDepartmentsByOrg, currentOrgId]);

  const handleValueChange = (
    value: string | Date | DropdownSingleType | DropdownMultipleType,
    field: keyof InfoData,
  ) => {
    setInfoData(prev => ({...prev, [field]: value}));
  };

  return (
    <PageWrapper>
      <StatusChecker statusArray={[status, departmentsStatus]}>
        <PageMenu title={'Создание проекта'}>
          <div className={styles.content__header__buttons}>
            <Link to={'/project'}>
              <Button type={'submit'}>Назад</Button>
            </Link>

            <Button type={'submit'} onClick={createNewProject}>
              <PlusIcon style={{width: '16px'}} /> Сохранить
            </Button>
          </div>
        </PageMenu>
        <TableInfo>
          <TableInfoRow isError={error} title={projectTitles.name} value={infoData.name || ''}>
            <Input
              style={{width: '500px'}}
              value={infoData['name'] || ''}
              onChange={value => handleValueChange(value, 'name')}
              isFocus
            />
          </TableInfoRow>

          <TableInfoRow
            isError={error}
            title={projectTitles['client_id']}
            value={infoData['client_id']?.label}>
            <SingleDropdown
              isFocus
              width={500}
              handleChange={option => handleValueChange(option, 'client_id')}
              value={infoData['client_id']}
              labels={clientLabels}
              isClearable
            />
          </TableInfoRow>

          {projectDateFields.map(field => (
            <TableInfoRow
              key={field}
              title={projectTitles[field]}
              value={formatDate(infoData[field] as Date)}>
              <CustomDatePicker
                style={{width: '500px'}}
                setSelectedDate={date => handleValueChange(date, field)}
                selectedDate={infoData[field] as Date}
                autoFocus
              />
            </TableInfoRow>
          ))}

          <TableInfoRow title={projectTitles['budget']} value={infoData['budget'] || ''}>
            <Input
              style={{width: '500px'}}
              value={infoData['budget'] || ''}
              onChange={value => handleValueChange(value, 'budget')}
              isFocus
            />
          </TableInfoRow>
          <TableInfoRow
            title={'Тэги'}
            value={<TagsList tags={infoData.tags?.map(tag => tag.label) || []} />}>
            <MultipleDropdown
              isAddedNewValue
              labels={tagsLabels}
              handleChange={value => handleValueChange(value, 'tags')}
              value={infoData['tags']}
            />
          </TableInfoRow>

          <TableInfoRow title={'Отдел'} value={infoData['department_id']?.label}>
            <SingleDropdown
              isFocus
              isClearable
              width={500}
              labels={departmentsLabels}
              handleChange={value => handleValueChange(value, 'department_id')}
              value={infoData['department_id']}
            />
          </TableInfoRow>
        </TableInfo>
      </StatusChecker>
    </PageWrapper>
  );
};

const mapStateToProps = (state: RootState) => ({
  currentOrgId: selectCurrentOrgId(state),
  clients: selectClients(state),
  departments: selectDepartments(state),
});

const mapDispatchToProps = (dispatch: Dispatch) =>
  bindActionCreators({getAllClients, getDepartmentsByOrg}, dispatch);

export default connect(mapStateToProps, mapDispatchToProps)(ProjectCreate);
