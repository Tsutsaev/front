import {labelsFills} from 'constants/LabelsFills';

import {Dispatch, bindActionCreators} from '@reduxjs/toolkit';
import {formatISO} from 'date-fns';
import React, {memo, useEffect, useMemo, useState} from 'react';
import {connect} from 'react-redux';
import {RootState} from 'store';
import {getDepartmentsByOrg} from 'store/department/actions';
import {selectDepartments} from 'store/department/selectors';
import {selectCanUseDepartments} from 'store/organizations/selectors';
import {patchOrgMembers} from 'store/orgMembers/actions';
import {selectOrgMembers} from 'store/orgMembers/selectors';
import {IOrgMembers, IOrgMembersProfile, PatchOrgMembersInfoType} from 'store/orgMembers/types';
import {patchProfile} from 'store/Profile/actions';
import {PatchProfileType} from 'store/Profile/types';
import {getProjMemberById} from 'store/projectMembers/actions';
import {selectProjectMembers} from 'store/projectMembers/selectors';
import {selectUser} from 'store/user/selectors';

import CustomDatePicker from 'components/new/DatePicker';
import SingleDropdown from 'components/new/Dropdown/Single';
import {DropdownSingleType} from 'components/new/Dropdown/Single/types';
import Input from 'components/new/Input';
import TableInfo from 'components/new/Table/Info';
import TableInfoRow from 'components/new/Table/Info/Row';

import {formatDate} from 'utils/DateFormat';
import {getOptionFromId, getOptionFromString} from 'utils/GetOptionFromString';
import {transformDropdownData} from 'utils/TransformDropdownData';

import styles from './index.module.scss';
import {MyProfileInfoDataType, Props} from './types';

export const profileTitles = {
  fio: 'ФИО*',
  phone: 'Телефон',
  email: 'Email',
  off: 'Часовая ставка',
  start_time: 'Время начала рабочего дня (МСК)',
  hour_rate: 'Норма часов',
  fill_mode: 'Форма заполнения часов*',
  role: 'Роль*',
  date_in: 'Дата устройства',
  date_out: 'Дата увольнения',
  department_id: 'Отдел',
  current_project: 'Текущий проект',
};

export const profileInputFields: (keyof PatchOrgMembersInfoType | keyof PatchProfileType)[] = [
  'fio',
  'phone',
  'email',
  'off',
  'start_time',
  'hour_rate',
];

export const profileDropdownFields: (keyof PatchOrgMembersInfoType | keyof PatchProfileType)[] = [
  'fill_mode',
  'role',
  'department_id',
  'current_project',
];

export const profileDateFields: (keyof PatchOrgMembersInfoType | keyof PatchProfileType)[] = [
  'date_in',
  'date_out',
];

const requiredFields = ['fio', 'email'];

const MeInfo = ({
  user,
  projectMembers,
  orgMember,
  patchOrgMembers,
  getProjMemberById,
  departments,
  getDepartmentsByOrg,
  canUseDepartments,
  patchProfile,
}: Props) => {
  const {role, currentOrgId} = user;
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
  const [errorField, setErrorField] = useState('');
  const [profileInfoData, setProfileInfoData] = useState<MyProfileInfoDataType>({
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

  useEffect(() => {
    getProjMemberById({orgId: currentOrgId, id: Number(orgMember.profile.id)});
    getDepartmentsByOrg(currentOrgId);
  }, [getProjMemberById, getDepartmentsByOrg, currentOrgId, orgMember.profile.id]);

  useEffect(() => {
    setProfileInfoData(prev => ({
      ...prev,
      current_project: getOptionFromId(orgMember.current_project, projectsLabels),
      department_id: getOptionFromId(orgMember.department_id, departmentsLabels),
    }));
  }, [projectsLabels, orgMember.current_project, orgMember.department_id, departmentsLabels]);

  const handleChange = (
    value: string | Date | DropdownSingleType,
    field: keyof MyProfileInfoDataType,
  ) => {
    setProfileInfoData(prev => ({...prev, [field]: value}));
  };

  const onUndo = (field: keyof MyProfileInfoDataType) => {
    if (field in orgMember) {
      const labels = field === 'current_project' ? projectsLabels : departmentsLabels;
      const orgMemberField = field as keyof IOrgMembers;
      const undoValue = profileDropdownFields.includes(field)
        ? field !== 'current_project' && field !== 'department_id'
          ? getOptionFromString(
              field as keyof typeof labelsFills,
              orgMember[orgMemberField] as string,
            )
          : getOptionFromId(orgMember[orgMemberField] as number, labels)
        : profileDateFields.includes(field)
        ? orgMember[orgMemberField]
          ? new Date(orgMember[orgMemberField] as string)
          : null
        : orgMember[orgMemberField];

      setProfileInfoData(prev => ({
        ...prev,
        [field]: undoValue,
      }));
    } else {
      setProfileInfoData(prev => ({
        ...prev,
        [field]: orgMember.profile[field as keyof IOrgMembersProfile],
      }));
    }
  };

  const onSave = (field: keyof MyProfileInfoDataType) => {
    if ([...requiredFields, 'phone'].includes(field)) {
      if (!profileInfoData[field]) {
        setErrorField(field);
      } else {
        patchProfile({
          orgId: currentOrgId,
          id: Number(orgMember.profile.id),
          data: {[field]: profileInfoData[field]},
        });
      }
    } else {
      const patchValue = profileDropdownFields.includes(field)
        ? (profileInfoData[field] as DropdownSingleType)?.value
        : profileDateFields.includes(field)
        ? profileInfoData[field]
          ? formatISO(profileInfoData[field] as Date).split('T')[0]
          : null
        : profileInfoData[field];

      patchOrgMembers({
        orgId: currentOrgId,
        id: orgMember.id,
        data: {[field]: patchValue || null},
      });
    }
  };

  if (role === 'employee')
    return (
      <div className={styles.container}>
        <div className={styles.row}>
          <div className={styles.title}>ФИО</div>
          <div className={` ${styles.text} `}>{orgMember.profile.fio}</div>
        </div>

        <div className={styles.row}>
          <div className={styles.title}>Телефон</div>
          <div className={` ${styles.text} `}>{orgMember.profile.phone}</div>
        </div>

        <div className={styles.row}>
          <div className={styles.title}>Email</div>
          <div className={` ${styles.text} `}>{orgMember.profile.email}</div>
        </div>
      </div>
    );

  return (
    <TableInfo>
      {profileInputFields.map(field => (
        <TableInfoRow
          key={field}
          isError={errorField === field}
          title={profileTitles[field]}
          value={(profileInfoData[field] || '') as string}
          onUndo={() => onUndo(field)}
          onSave={() => onSave(field)}>
          <Input
            style={{width: '500px'}}
            value={(profileInfoData[field] || '') as string}
            onChange={value => handleChange(value, field)}
            isFocus
          />
        </TableInfoRow>
      ))}

      {profileDropdownFields.map(field => {
        if (field === 'department_id' && !canUseDepartments) return null;
        return (
          <TableInfoRow
            key={field}
            title={profileTitles[field]}
            value={(profileInfoData[field] as DropdownSingleType)?.label}
            onUndo={() => onUndo(field)}
            onSave={() => onSave(field)}>
            <SingleDropdown
              isFocus
              width={500}
              handleChange={option => handleChange(option, field)}
              value={profileInfoData[field] as DropdownSingleType}
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

      {profileDateFields.map(field => (
        <TableInfoRow
          key={field}
          title={profileTitles[field]}
          value={formatDate(profileInfoData[field] as Date)}
          onUndo={() => onUndo(field)}
          onSave={() => onSave(field)}>
          <CustomDatePicker
            style={{width: '500px'}}
            setSelectedDate={date => handleChange(date, field)}
            selectedDate={profileInfoData[field] as Date}
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
  user: selectUser(state),
  projectMembers: selectProjectMembers(state),
  profiles: selectOrgMembers(state),
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

export default connect(mapStateToProps, mapDispatchToProps)(memo(MeInfo));
