import {NavLink, useParams} from 'react-router-dom';

import {bindActionCreators, Dispatch} from '@reduxjs/toolkit';
import React, {useMemo, useState} from 'react';
import {connect} from 'react-redux';
import {RootState} from 'store';
import {patchOrgMembers} from 'store/orgMembers/actions';
import {selectOrgMembers} from 'store/orgMembers/selectors';
import {selectCurrentOrgId, selectUser} from 'store/user/selectors';
import {reduceName} from 'utils';

import DeleteModal from 'components/DeleteModal';
import Button from 'components/new/Button';
import SingleDropdown from 'components/new/Dropdown/Single';
import {DropdownSingleType} from 'components/new/Dropdown/Single/types';
import Table from 'components/new/Table';
import TableCell from 'components/new/Table/Cell';
import TableHeader from 'components/new/Table/Header';
import TableRow from 'components/new/Table/Row';
import TooltipCustom from 'components/new/Tooltip';
import StatusChecker from 'components/StatusChecker';

import {ReactComponent as IconCheck} from 'shared/assets/images/fi-rr-checkbox.svg';
import {ReactComponent as TrashIcon} from 'shared/assets/images/fi-rr-trash.svg';

import {transformDropdownData} from 'utils/TransformDropdownData';

import styles from './index.module.scss';
import {Props} from './types';

const titles = [{title: 'ФИО'}, {title: 'Роль'}];

const templateColumns = 'auto  300px 30px';

const EditMembersDepartament = ({orgMembers, patchOrgMembers, currentOrgId, user}: Props) => {
  const {id} = useParams();
  const [dataModal, setDataModal] = useState(0);
  const {orgMembers: orgMembersData} = orgMembers;

  const orgMembersLabels = useMemo(() => transformDropdownData(orgMembersData), [orgMembersData]);

  const [createData, setCreateData] = useState<DropdownSingleType>(null);

  const [addingRow, setAddingRow] = useState(false);

  const onDelete = () => {
    setDataModal(0);
    patchOrgMembers({
      orgId: currentOrgId,
      id: dataModal,
      data: {
        department_id: null,
      },
    });
  };

  const onCreate = () => {
    setAddingRow(false);
    id &&
      createData &&
      patchOrgMembers({
        orgId: currentOrgId,
        id: +createData.value,
        data: {
          department_id: +id,
        },
      });
  };

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        Сотрудники отдела
        <div className={styles.buttons}>
          {user.isTopManager && (
            <Button onClick={() => setAddingRow(true)} type={addingRow ? 'disabled' : 'submit'}>
              Добавить
            </Button>
          )}
        </div>
      </div>
      <StatusChecker>
        <Table>
          <TableHeader titles={titles} templateColumns={templateColumns} />

          {addingRow && (
            <TableRow color={'white'} templateColumns={templateColumns}>
              <SingleDropdown
                labels={orgMembersLabels}
                value={createData}
                handleChange={setCreateData}
                placeholder="Выберите сотрудника"
                isClearable
              />
              <TableCell>-</TableCell>

              <TableCell style={{padding: '0px'}}>
                <Button onClick={onCreate} type="check">
                  <IconCheck />
                </Button>
              </TableCell>
            </TableRow>
          )}

          {orgMembersData?.map((member, index) => {
            if (member.department_id !== Number(id)) return null;
            return (
              <TableRow
                key={member.id}
                color={index % 2 === 0 ? 'gray' : 'white'}
                templateColumns={templateColumns}>
                <TooltipCustom content={member.profile.fio}>
                  <NavLink
                    to={`/organizationmember/edit/${member.profile.id}`}
                    className={styles.link}>
                    {reduceName(member.profile.fio)}
                  </NavLink>
                </TooltipCustom>
                <p className={styles.text}>
                  {member.role === 'employee' ? 'Сотрудник' : 'Менеджер'}
                </p>
                <Button type={'icon'} onClick={() => setDataModal(member.id)}>
                  <TrashIcon />
                </Button>
              </TableRow>
            );
          })}
        </Table>

        {!!dataModal && (
          <DeleteModal
            onDelete={() => onDelete()}
            onClose={() => setDataModal(0)}
            title="сотрудника отдела"
          />
        )}
      </StatusChecker>
    </div>
  );
};

const mapStateToProps = (state: RootState) => ({
  currentOrgId: selectCurrentOrgId(state),
  orgMembers: selectOrgMembers(state),
  user: selectUser(state),
});

const mapDispatchToProps = (dispatch: Dispatch) => bindActionCreators({patchOrgMembers}, dispatch);

export default connect(mapStateToProps, mapDispatchToProps)(EditMembersDepartament);
