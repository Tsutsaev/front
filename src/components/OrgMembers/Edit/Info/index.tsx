import {labelsFills} from 'constants/LabelsFills';

import {useParams} from 'react-router-dom';

import {Dispatch, bindActionCreators} from '@reduxjs/toolkit';
import {formatISO} from 'date-fns';
import React, {memo, useState, useMemo, useEffect} from 'react';
import {connect} from 'react-redux';
import {SingleValue} from 'react-select';
import {RootState} from 'store';
import {getDepartmentsByOrg} from 'store/department/actions';
import {selectDepartments} from 'store/department/selectors';
import {selectCanUseDepartments} from 'store/organizations/selectors';
import {patchOrgMembers} from 'store/orgMembers/actions';
import {IOrgMembers, IOrgMembersProfile, PatchOrgMembersInfoType} from 'store/orgMembers/types';
import {patchProfile} from 'store/Profile/actions';
import {PatchProfileType} from 'store/Profile/types';
import {getProjMemberById} from 'store/projectMembers/actions';
import {selectProjectMembers} from 'store/projectMembers/selectors';
import {selectCurrentOrgId} from 'store/user/selectors';

import CustomDatePicker from 'components/new/DatePicker';
import SingleDropdown from 'components/new/Dropdown/Single';
import {DropdownSingleType, MyOption} from 'components/new/Dropdown/Single/types';
import Input from 'components/new/Input';
import TableInfo from 'components/new/Table/Info';
import TableInfoRow from 'components/new/Table/Info/Row';

import {formatDate} from 'utils/DateFormat';
import {getOptionFromId, getOptionFromString} from 'utils/GetOptionFromString';
import {transformDropdownData} from 'utils/TransformDropdownData';

import styles from './index.module.scss';
import {OrgMemberInfoDataType, Props} from './types';

/*
  const toggleAccess = async (field: string) => {
    if (field === 'fill_mode') {
      const access = (fillType as SingleValue<MyOption>)?.value !== 'regular';
      await dispatch(
        patchOrgMembers({
          orgId: currentOrgId,
          id: orgMemberId,
          data: {fulltime: access},
        }),
      );
    }
  };

  */

export const orgMemberTitles = {
  fio: 'ФИО*',
  phone: 'Телефон',
  email: 'Email*',
  off: 'Часовая ставка',
  start_time: 'Время начала рабочего дня (МСК)',
  hour_rate: 'Норма часов',
  fill_mode: 'Форма заполнения часов*',
  role: 'Роль*',
  date_in: 'Дата устройства',
  date_out: 'Дата увольнения',
  current_project: 'Текущий проект',
  department_id: 'Отдел',
};

export const orgMemberInputFields: (keyof PatchOrgMembersInfoType | keyof PatchProfileType)[] = [
  'fio',
  'phone',
  'email',
  'off',
  'start_time',
  'hour_rate',
];

export const orgMemberDropdownFields: (keyof PatchOrgMembersInfoType | keyof PatchProfileType)[] = [
  'fill_mode',
  'role',
  'department_id',
  'current_project',
];

export const orgMemberDateFields: (keyof PatchOrgMembersInfoType | keyof PatchProfileType)[] = [
  'date_in',
  'date_out',
];

const requiredFields = ['fio', 'email'];

const EditOrgMembersInfo = ({
  currentOrgId,
  projectMembers,
  orgMember,
  departments,
  patchProfile,
  patchOrgMembers,
  getProjMemberById,
  getDepartmentsByOrg,
  canUseDepartments,
}: Props) => {
  const {id} = useParams();
  const {projMembers: ProjectMembersData} = projectMembers;
  const {departments: departmentsData} = departments;
  const projectsLabels = useMemo(
    () => transformDropdownData(ProjectMembersData),
    [ProjectMembersData],
  );

  const departmentsLabels = useMemo(
    () => transformDropdownData(departmentsData),
    [departmentsData],
  );

  const [orgMemberInfoData, setOrgMemberInfoData] = useState<OrgMemberInfoDataType>({
    fio: orgMember.profile.fio,
    phone: orgMember.profile.phone || '',
    email: orgMember.profile.email,
    off: orgMember.off ? orgMember.off.toString() : '',
    start_time: orgMember.start_time.substring(0, 5),
    hour_rate: orgMember.hour_rate?.toString() || '',
    fill_mode: getOptionFromString('fill_mode', orgMember.fill_mode),
    role: getOptionFromString('role', orgMember.role),
    date_in: orgMember.date_in ? new Date(orgMember.date_in) : null,
    date_out: orgMember.date_out ? new Date(orgMember.date_out) : null,
    current_project: getOptionFromId(orgMember.current_project, projectsLabels),
    department_id: getOptionFromId(orgMember.department_id, departmentsLabels),
  });

  const [errorField, setErrorField] = useState('');

  useEffect(() => {
    getProjMemberById({orgId: currentOrgId, id: Number(orgMember.profile.id)});
    getDepartmentsByOrg(currentOrgId);
  }, [getProjMemberById, getDepartmentsByOrg, currentOrgId, orgMember.profile.id]);

  useEffect(() => {
    setOrgMemberInfoData(prev => ({
      ...prev,
      current_project: getOptionFromId(orgMember.current_project, projectsLabels),
      department_id: getOptionFromId(orgMember.department_id, departmentsLabels),
    }));
  }, [projectsLabels, orgMember.current_project, orgMember.department_id, departmentsLabels]);

  const handleDropdownChange = (option: DropdownSingleType, field: keyof OrgMemberInfoDataType) => {
    setOrgMemberInfoData(prev => ({...prev, [field]: option}));
  };

  const onChangeInputInfoData = (value: string, field: keyof OrgMemberInfoDataType) => {
    setOrgMemberInfoData(prev => ({...prev, [field]: value}));
  };

  const handleDateChange = (date: Date | null, field: keyof OrgMemberInfoDataType) => {
    setOrgMemberInfoData(prev => ({...prev, [field]: date}));
  };

  const onUndo = (field: keyof OrgMemberInfoDataType) => {
    if (field in orgMember) {
      const labels = field === 'current_project' ? projectsLabels : departmentsLabels;
      const orgMemberField = field as keyof IOrgMembers;
      const undoValue = orgMemberDropdownFields.includes(field)
        ? field !== 'current_project' && field !== 'department_id'
          ? getOptionFromString(
              field as keyof typeof labelsFills,
              orgMember[orgMemberField] as string,
            )
          : getOptionFromId(orgMember[orgMemberField] as number, labels)
        : orgMemberDateFields.includes(field)
        ? orgMember[orgMemberField]
          ? new Date(orgMember[orgMemberField] as string)
          : null
        : orgMember[orgMemberField];

      setOrgMemberInfoData(prev => ({
        ...prev,
        [field]: undoValue,
      }));
    } else {
      setOrgMemberInfoData(prev => ({
        ...prev,
        [field]: orgMember.profile[field as keyof IOrgMembersProfile],
      }));
    }
  };

  const onSave = (field: keyof OrgMemberInfoDataType) => {
    if ([...requiredFields, 'phone'].includes(field)) {
      if (!orgMemberInfoData[field]) {
        setErrorField(field);
      } else {
        patchProfile({
          orgId: currentOrgId,
          id: Number(id),
          data: {[field]: orgMemberInfoData[field]},
        });

        setErrorField('');
      }
    } else {
      const patchValue = orgMemberDropdownFields.includes(field)
        ? (orgMemberInfoData[field] as SingleValue<MyOption>)?.value
        : orgMemberDateFields.includes(field)
        ? orgMemberInfoData[field]
          ? formatISO(orgMemberInfoData[field] as Date).split('T')[0]
          : null
        : orgMemberInfoData[field];
      patchOrgMembers({
        orgId: currentOrgId,
        id: orgMember.id,
        data: {[field]: patchValue || null},
      });
    }
  };

  return (
    <TableInfo>
      {orgMemberInputFields.map(field => (
        <TableInfoRow
          key={field}
          isError={errorField === field}
          title={orgMemberTitles[field]}
          value={(orgMemberInfoData[field] || '') as string}
          onUndo={() => onUndo(field)}
          onSave={() => onSave(field)}>
          <Input
            style={{width: '500px'}}
            value={(orgMemberInfoData[field] || '') as string}
            onChange={value => onChangeInputInfoData(value, field)}
            isFocus
          />
        </TableInfoRow>
      ))}

      {orgMemberDropdownFields.map(field => {
        if (field === 'department_id' && !canUseDepartments) return null;
        return (
          <TableInfoRow
            key={field}
            title={orgMemberTitles[field]}
            value={(orgMemberInfoData[field] as DropdownSingleType)?.label}
            onUndo={() => onUndo(field)}
            onSave={() => onSave(field)}>
            <SingleDropdown
              isFocus
              width={500}
              handleChange={option => handleDropdownChange(option, field)}
              value={orgMemberInfoData[field] as DropdownSingleType}
              labels={
                field === 'current_project'
                  ? projectsLabels
                  : field === 'department_id'
                  ? departmentsLabels
                  : labelsFills[field as keyof typeof labelsFills]
              }
              isClearable={['current_project', 'department_id'].includes(field)}
              placeholder={field === 'current_project' ? 'Выберите проект' : 'Выберите отдел'}
            />
          </TableInfoRow>
        );
      })}

      {orgMemberDateFields.map(field => (
        <TableInfoRow
          key={field}
          title={orgMemberTitles[field]}
          value={formatDate(orgMemberInfoData[field] as Date)}
          onUndo={() => onUndo(field)}
          onSave={() => onSave(field)}>
          <CustomDatePicker
            style={{width: '500px'}}
            setSelectedDate={date => handleDateChange(date, field)}
            selectedDate={orgMemberInfoData[field] as Date}
            autoFocus
          />
        </TableInfoRow>
      ))}

      <div className={styles.help}>
        * Произвольное - сотрудники в организации могут заполнять произвольное число часов в день{' '}
        <br /> * Регулярное - сотрудник заполняет 8 часов в день фиксировано
      </div>
    </TableInfo>
  );
};

const mapStateToProps = (state: RootState) => ({
  currentOrgId: selectCurrentOrgId(state),
  projectMembers: selectProjectMembers(state),
  departments: selectDepartments(state),
  canUseDepartments: selectCanUseDepartments(state),
});

const mapDispatchToProps = (dispatch: Dispatch) =>
  bindActionCreators(
    {
      patchOrgMembers,
      patchProfile,
      getProjMemberById,
      getDepartmentsByOrg,
    },
    dispatch,
  );

export default connect(mapStateToProps, mapDispatchToProps)(memo(EditOrgMembersInfo));
