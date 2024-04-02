import React, {useEffect, useState} from 'react';
import {connect} from 'react-redux';
import {RootState} from 'store';
import {patchOrgMembers} from 'store/orgMembers/actions';
import {selectCurrentOrgId} from 'store/user/selectors';

import TableVisibility from 'components/new/Table/Visibility';
import VisibilityToggleCheckBox from 'components/new/Table/Visibility/ToggleCheckBox';
import {VisibilityType} from 'components/new/Table/Visibility/ToggleCheckBox/types';

import UseAppDispatch from 'hooks/UseAppDispatch';

import {IEditOrgMembersCheckBoxesProps} from './types';

export const titlesEditOrgMembersCheckBoxes = [
  {
    title: 'Заполняет часы',
    field: 'sheet_off',
  },
  {
    title: 'Заполняет часы в другой системе',
    field: 'off_other',
  },
  {
    title: 'Работает полный день',
    field: 'fulltime',
  },
  {
    title: 'Заблокирован в системе',
    field: 'fired',
  },
];

const EditOrgMembersCheckBoxes = ({orgMember, currentOrgId}: IEditOrgMembersCheckBoxesProps) => {
  const [showSave, setShowSave] = useState(false);
  const dispatch = UseAppDispatch();
  const [visibility, setVisibility] = useState<VisibilityType>({
    sheet_off: orgMember.sheet_off,
    off_other: orgMember.off_other,
    fired: orgMember.fired,
    fulltime: orgMember.fulltime,
  });

  useEffect(() => {
    setVisibility({
      sheet_off: orgMember.sheet_off,
      off_other: orgMember.off_other,
      fired: orgMember.fired,
      fulltime: orgMember.fulltime,
    });
  }, [orgMember]);

  const onSave = () => {
    void dispatch(
      patchOrgMembers({
        orgId: currentOrgId,
        id: orgMember.id,
        data: visibility,
      }),
    );
    setShowSave(false);
  };

  const handleChange = (visibility: VisibilityType) => {
    setVisibility(visibility);
    setShowSave(true);
  };

  return (
    <TableVisibility title="Доступ" onSave={onSave} showSave={showSave}>
      {titlesEditOrgMembersCheckBoxes.map(item => (
        <VisibilityToggleCheckBox
          key={item.field}
          visibility={visibility}
          field={item.field as keyof VisibilityType}
          title={item.title}
          setVisibility={value => handleChange(value as VisibilityType)}
        />
      ))}
    </TableVisibility>
  );
};
const mapStateToProps = (state: RootState) => ({
  currentOrgId: selectCurrentOrgId(state),
});

export default connect(mapStateToProps)(EditOrgMembersCheckBoxes);
