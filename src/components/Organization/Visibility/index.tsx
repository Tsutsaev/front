import {Dispatch, bindActionCreators} from '@reduxjs/toolkit';
import React, {useEffect, useMemo, useState} from 'react';
import {connect} from 'react-redux';
import {RootState} from 'store';
import {patchOrganizations} from 'store/organizations/actions';
import {getAllOrgMembers} from 'store/orgMembers/actions';
import {selectOrgMembers} from 'store/orgMembers/selectors';
import {selectCurrentOrgId, selectUser} from 'store/user/selectors';

import TableVisibility from 'components/new/Table/Visibility';
import VisibilityToggleCheckBox from 'components/new/Table/Visibility/ToggleCheckBox';
import {VisibilityOrgType} from 'components/new/Table/Visibility/ToggleCheckBox/types';

import {Props} from './types';

/*
{
  title: 'Сотрудники работают со ставкой',
  field: 'access_off',
},
*/

export const titlesOrgCheckBoxes = [
  {
    title: 'Сотрудники видят сотрудников',
    field: 'access_profile',
  },
  {
    title: 'Сотрудники видят клиентов',
    field: 'access_client',
  },
  {
    title: 'Сотрудники видят проекты',
    field: 'access_project',
  },
  {
    title: 'Сотрудники видят отсутствие',
    field: 'access_rest',
  },
  {
    title: 'Сотрудники видят праздники',
    field: 'access_holiday',
  },
  {
    title: 'Есть доступ к отделам',
    field: 'can_use_departments',
  },
];
const OrganizationVisibility = ({
  organization,
  patchOrganizations,
  getAllOrgMembers,
  user,
  orgMembers,
}: Props) => {
  const [visibility, setVisibility] = useState<VisibilityOrgType>({
    access_profile: organization.access_profile,
    access_client: organization.access_client,
    access_project: organization.access_project,
    access_rest: organization.access_rest,
    access_holiday: organization.access_holiday,
    access_off: organization.access_off,
    can_use_departments: organization.can_use_departments,
  });

  const isTopManager = useMemo(() => {
    return !orgMembers.orgMembers.find(({profile_id}) => profile_id === +user.data.id)
      ?.department_id;
  }, [orgMembers.orgMembers, user.data.id]);

  const [showSave, setShowSave] = useState(false);

  const onSave = () => {
    patchOrganizations({
      orgId: organization.id,
      data: visibility,
    }),
      setShowSave(false);
  };

  const handleChange = (visibility: VisibilityOrgType) => {
    setVisibility(visibility);
    setShowSave(true);
  };

  useEffect(() => {
    getAllOrgMembers(organization.id);
  }, [getAllOrgMembers, organization.id]);

  if (!organization) return <div>Выберите организацию</div>;

  return (
    <TableVisibility title="Видимость" onSave={onSave} showSave={showSave}>
      {titlesOrgCheckBoxes.map(item => {
        if (item.field === 'can_use_departments' && !isTopManager) return null;
        return (
          <VisibilityToggleCheckBox
            key={item.field}
            visibility={visibility}
            field={item.field as keyof VisibilityOrgType}
            title={item.title}
            setVisibility={value => handleChange(value as VisibilityOrgType)}
          />
        );
      })}
    </TableVisibility>
  );
};

const mapStateToProps = (state: RootState) => ({
  currentOrgId: selectCurrentOrgId(state),
  orgMembers: selectOrgMembers(state),
  user: selectUser(state),
});

const mapDispatchToProps = (dispatch: Dispatch) =>
  bindActionCreators(
    {
      patchOrganizations,
      getAllOrgMembers,
    },
    dispatch,
  );

export default connect(mapStateToProps, mapDispatchToProps)(OrganizationVisibility);
