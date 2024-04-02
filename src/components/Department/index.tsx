import {useParams} from 'react-router-dom';

import {Dispatch, bindActionCreators} from '@reduxjs/toolkit';
import React, {memo, useEffect, useMemo, useState} from 'react';
import {connect} from 'react-redux';
import {RootState} from 'store';
import {patchDepartment} from 'store/department/actions';
import {DepartmentInfoType} from 'store/department/types';
import {patchOrgMembers} from 'store/orgMembers/actions';
import {selectOrgMembers} from 'store/orgMembers/selectors';
import {selectCurrentOrgId, selectUser} from 'store/user/selectors';

import {TagsList} from 'components/new';
import MultipleDropdown from 'components/new/Dropdown/Multiple';
import {DropdownMultipleType} from 'components/new/Dropdown/Multiple/types';
import Input from 'components/new/Input';
import TableInfo from 'components/new/Table/Info';
import TableInfoRow from 'components/new/Table/Info/Row';
import StatusChecker from 'components/StatusChecker';

import {getMultyOptionsFromId} from 'utils/GetOptionFromString';
import {transformDropdownData} from 'utils/TransformDropdownData';

import {Props} from './types';

export const titles = {
  name: 'Название',
  managers: 'Менеджеры отдела',
};

const DepartmentInfo = ({
  department,
  currentOrgId,
  patchDepartment,
  orgMembers,
  patchOrgMembers,
}: Props) => {
  const {id} = useParams();
  const {orgMembers: orgMembersData, status} = orgMembers;
  const orgMembersLabels = useMemo(
    () => transformDropdownData(orgMembersData.filter(({role}) => role === 'manager')),
    [orgMembersData],
  );

  const departmentManagersId = useMemo(
    () =>
      orgMembersData.map(orgMeber =>
        orgMeber.role === 'manager' && orgMeber.department_id === Number(id) ? orgMeber.id : null,
      ),
    [orgMembersData, id],
  );

  const [departmentInfoData, setDepartmentInfoData] = useState<DepartmentInfoType>({
    name: department.name,
    created_at: department.created_at,
    created_by: department.created_by.fio,
    managers: getMultyOptionsFromId(departmentManagersId, orgMembersLabels),
  });

  const [prevStateManagers, setPrevStateManagers] = useState(departmentInfoData.managers);

  useEffect(() => {
    setDepartmentInfoData(prev => ({
      ...prev,
      managers: getMultyOptionsFromId(departmentManagersId, orgMembersLabels),
    }));
    setPrevStateManagers(getMultyOptionsFromId(departmentManagersId, orgMembersLabels));
  }, [setDepartmentInfoData, departmentManagersId, orgMembersLabels]);

  const [errorField, setErrorField] = useState(false);

  const handleChange = (value: string | DropdownMultipleType, field: keyof DepartmentInfoType) => {
    setDepartmentInfoData(prev => ({...prev, [field]: value}));
  };

  const onUndo = (field: keyof DepartmentInfoType) => {
    const value =
      field === 'name'
        ? department.name
        : getMultyOptionsFromId(departmentManagersId, orgMembersLabels);
    setDepartmentInfoData(prev => ({
      ...prev,
      [field]: value,
    }));
  };

  const onSave = (field: keyof DepartmentInfoType) => {
    if (field === 'name' && !departmentInfoData.name) {
      setErrorField(true);
    } else if (field === 'name') {
      patchDepartment({orgId: currentOrgId, data: {name: departmentInfoData.name}, id});
    } else if (id) {
      const difference = prevStateManagers?.filter(v => !departmentInfoData.managers?.includes(v));

      departmentInfoData.managers?.forEach(manager => {
        patchOrgMembers({
          orgId: currentOrgId,
          id: +manager.value,
          data: {
            department_id: +id,
          },
        });
      });

      difference?.forEach(manager => {
        patchOrgMembers({
          orgId: currentOrgId,
          id: +manager.value,
          data: {
            department_id: null,
          },
        });
      });
    }
    setErrorField(false);
  };

  return (
    <TableInfo>
      <TableInfoRow
        isError={errorField}
        title={titles.name}
        value={departmentInfoData.name}
        onUndo={() => onUndo('name')}
        onSave={() => onSave('name')}>
        <Input
          style={{width: '500px'}}
          value={departmentInfoData.name}
          onChange={value => handleChange(value, 'name')}
          isFocus
        />
      </TableInfoRow>
      <StatusChecker statusArray={[status]}>
        <TableInfoRow
          isError={errorField}
          title={titles.managers}
          value={
            <TagsList tags={departmentInfoData.managers?.map(manager => manager.label) || []} />
          }
          onUndo={() => onUndo('managers')}
          onSave={() => onSave('managers')}>
          <MultipleDropdown
            width={500}
            placeholder="Выберите менеджера отдела"
            value={departmentInfoData.managers}
            labels={orgMembersLabels}
            handleChange={value => handleChange(value, 'managers')}
          />
        </TableInfoRow>
      </StatusChecker>
    </TableInfo>
  );
};

const mapStateToProps = (state: RootState) => ({
  currentOrgId: selectCurrentOrgId(state),
  orgMembers: selectOrgMembers(state),
  user: selectUser(state).data,
});

const mapDispatchToProps = (dispatch: Dispatch) =>
  bindActionCreators(
    {
      patchDepartment,
      patchOrgMembers,
    },
    dispatch,
  );
export default connect(mapStateToProps, mapDispatchToProps)(memo(DepartmentInfo));
