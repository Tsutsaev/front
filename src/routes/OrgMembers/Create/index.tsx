import {FillMode} from 'constants/FillMode';
import {labelsFills} from 'constants/LabelsFills';
import {UserRole} from 'constants/UserRole';

import {useNavigate} from 'react-router-dom';

import {Dispatch, bindActionCreators} from '@reduxjs/toolkit';
import {formatISO} from 'date-fns';
import React, {useState, useEffect, useMemo} from 'react';
import {connect} from 'react-redux';
import {RootState} from 'store';
import {createOrgMembers} from 'store/orgMembers/actions';
import {getProjectsByOrg} from 'store/projects/actions';
import {selectProjects} from 'store/projects/selectors';
import {selectCurrentOrgId} from 'store/user/selectors';

import Button from 'components/new/Button';
import CustomDatePicker from 'components/new/DatePicker';
import SingleDropdown from 'components/new/Dropdown/Single';
import {DropdownSingleType} from 'components/new/Dropdown/Single/types';
import Input from 'components/new/Input';
import TableInfo from 'components/new/Table/Info';
import TableInfoRow from 'components/new/Table/Info/Row';
import TableVisibility from 'components/new/Table/Visibility';
import VisibilityToggleCheckBox from 'components/new/Table/Visibility/ToggleCheckBox';
import {VisibilityType} from 'components/new/Table/Visibility/ToggleCheckBox/types';
import {titlesEditOrgMembersCheckBoxes} from 'components/OrgMembers/Edit/CheckBoxes';
import {
  orgMemberDateFields,
  orgMemberDropdownFields,
  orgMemberInputFields,
  orgMemberTitles,
} from 'components/OrgMembers/Edit/Info';

import UseAppDispatch from 'hooks/UseAppDispatch';
import UseRoleRedirect from 'hooks/UseRoleRedirect';

import {ReactComponent as PlusIcon} from 'shared/assets/images/fi-rr-plus.svg';

import {formatDate} from 'utils/DateFormat';
import {transformDropdownData} from 'utils/TransformDropdownData';

import styles from './index.module.scss';
import {Data, InfoData, Props} from './types';

const requiredFields = ['email', 'fio'];

const OrgMembersCreate = ({currentOrgId, getProjectsByOrg, projects}: Props) => {
  UseRoleRedirect();
  const dispatch = UseAppDispatch();
  const navigate = useNavigate();
  const [isError, setIsError] = useState(false);
  const [data, setData] = useState<InfoData>({
    fio: '',
    email: '',
    phone: '',
    role: labelsFills.role[1],
    off: '',
    fill_mode: labelsFills.fill_mode[1],
    hour_rate: '',
    start_time: '09:00',
    date_in: new Date(),
    date_out: null,
    current_project: null,
    department_id: null,
  });

  const [visibility, setVisibility] = useState<VisibilityType>({
    sheet_off: true,
    off_other: false,
    fired: false,
    fulltime: true,
  });
  const {projects: ProjectsData} = projects;
  const projectsLabels = useMemo(() => transformDropdownData(ProjectsData), [ProjectsData]);

  useEffect(() => {
    getProjectsByOrg(currentOrgId);
  }, [getProjectsByOrg, currentOrgId]);

  const handleChange = (value: string | Date | DropdownSingleType, field: keyof Data) => {
    setData(prev => ({...prev, [field]: value}));
  };

  const onCreate = async () => {
    if (data.fio && data.email) {
      setIsError(false);
      const createData = {
        ...data,
        off: Number(data.off),
        hour_rate: Number(data.hour_rate),
        role: data.role.value as UserRole,
        fill_mode: data.fill_mode.value as FillMode,
        date_in: formatISO(data.date_in as Date).split('T')[0],
        date_out: data.date_out ? formatISO(data.date_out).split('T')[0] : null,
        current_project: data.current_project ? Number(data.current_project?.value) : null,
        ...visibility,
      };

      try {
        await dispatch(createOrgMembers({orgId: currentOrgId, data: createData}));
        navigate('/organizationmember');
      } catch (error) {
        console.log(error);
      }
    } else {
      setIsError(true);
    }
  };
  return (
    <div className={styles.container}>
      <div className={styles.menu}>
        <h1 className={styles.header}>Добавление сотрудника</h1>

        <div className={styles.buttons}>
          <Button
            type={'submit'}
            onClick={() => {
              navigate('/organizationmember');
            }}>
            Назад
          </Button>

          <Button type={'submit'} onClick={onCreate}>
            <PlusIcon style={{width: '18px'}} />
            Сохранить
          </Button>
        </div>
      </div>
      <TableInfo>
        {orgMemberInputFields.map(field => (
          <TableInfoRow
            key={field}
            isError={isError && requiredFields.includes(field)}
            title={orgMemberTitles[field]}
            value={data[field] as string}>
            <Input
              style={{width: '500px'}}
              value={data[field] as string}
              onChange={value => handleChange(value, field)}
              isFocus
            />
          </TableInfoRow>
        ))}

        {orgMemberDropdownFields.map(field => (
          <TableInfoRow
            key={field}
            title={orgMemberTitles[field]}
            value={(data[field] as DropdownSingleType)?.label}>
            <SingleDropdown
              isFocus
              width={500}
              handleChange={option => handleChange(option, field)}
              value={data[field] as DropdownSingleType}
              labels={
                field === 'current_project'
                  ? projectsLabels
                  : labelsFills[field as keyof typeof labelsFills]
              }
              isClearable={field === 'current_project'}
            />
          </TableInfoRow>
        ))}

        {orgMemberDateFields.map(field => (
          <TableInfoRow
            key={field}
            title={orgMemberTitles[field]}
            value={formatDate(data[field] as Date)}>
            <CustomDatePicker
              style={{width: '500px'}}
              setSelectedDate={date => handleChange(date, field)}
              selectedDate={data[field] as Date}
              autoFocus
            />
          </TableInfoRow>
        ))}

        <div className={styles.help}>
          * Произвольное - сотрудники в организации могут заполнять произвольное число часов в день{' '}
          <br /> * Регулярное - сотрудник заполняет 8 часов в день фиксировано
        </div>
      </TableInfo>

      <TableVisibility title="Доступ">
        {titlesEditOrgMembersCheckBoxes.map(item => (
          <VisibilityToggleCheckBox
            key={item.field}
            field={item.field as keyof VisibilityType}
            title={item.title}
            visibility={visibility}
            setVisibility={value => setVisibility(value as VisibilityType)}
          />
        ))}
      </TableVisibility>
    </div>
  );
};

const mapStateToProps = (state: RootState) => ({
  currentOrgId: selectCurrentOrgId(state),
  projects: selectProjects(state),
});

const mapDispatchToProps = (dispatch: Dispatch) =>
  bindActionCreators(
    {
      getProjectsByOrg,
    },
    dispatch,
  );

export default connect(mapStateToProps, mapDispatchToProps)(OrgMembersCreate);
