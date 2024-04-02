import {bindActionCreators, Dispatch} from '@reduxjs/toolkit';
import React, {useEffect, useState} from 'react';
import {connect} from 'react-redux';
import {RootState} from 'store';
import {createDepartment, getDepartmentsByOrg} from 'store/department/actions';
import {selectDepartments} from 'store/department/selectors';
import {selectCurrentOrgId, selectUser} from 'store/user/selectors';
import {reduceName} from 'utils';

import Button from 'components/new/Button';
import Folding from 'components/new/Folding';
import Input from 'components/new/Input';
import Table from 'components/new/Table';
import TableCell from 'components/new/Table/Cell';
import TableHeader from 'components/new/Table/Header';
import TableRow from 'components/new/Table/Row';
import TooltipCustom from 'components/new/Tooltip';
import StatusChecker from 'components/StatusChecker';

import {ReactComponent as IconCheck} from 'shared/assets/images/fi-rr-checkbox.svg';

import styles from './index.module.scss';
import {Props} from './types';

const templateColumns = 'auto 200px 200px 30px';
const titles = [{title: 'Название'}];

const OrganizationDepartment = ({
  currentOrgId,
  getDepartmentsByOrg,
  createDepartment,
  departments,
  user,
}: Props) => {
  const {departments: departmentsData, departmentsStatus} = departments;
  const isTopManager = user.isTopManager;
  const [addingRow, setAddingRow] = useState(false);
  const [createData, setCreateData] = useState('');

  const [isError, setIsError] = useState(false);
  useEffect(() => {
    getDepartmentsByOrg(currentOrgId);
  }, [getDepartmentsByOrg, currentOrgId]);
  const onCreate = () => {
    if (createData) {
      setIsError(false);

      try {
        createDepartment({orgId: currentOrgId, name: createData});
        setAddingRow(false);
      } catch (error) {
        console.log(error);
      }
    } else {
      setIsError(true);
    }
  };

  return (
    <Folding title="Отделы">
      <div className={styles.header}>
        <div></div>
        {isTopManager && (
          <Button
            type={addingRow ? 'disabled' : 'submit'}
            onClick={() => {
              setAddingRow(true);
            }}>
            Добавить
          </Button>
        )}
      </div>
      <StatusChecker statusArray={[departmentsStatus]}>
        <Table>
          <TableHeader titles={titles} templateColumns={templateColumns} />
          {addingRow && (
            <TableRow color={'white'} templateColumns={templateColumns}>
              <Input isError={isError} value={createData} onChange={setCreateData} />
              <div></div>
              <div></div>
              <TableCell style={{padding: '5px'}}>
                <Button onClick={onCreate} type="check">
                  <IconCheck />
                </Button>
              </TableCell>
            </TableRow>
          )}
          {departmentsData?.map((department, index) => {
            return (
              <TableRow
                key={department.id}
                color={index % 2 === 0 ? 'gray' : 'white'}
                templateColumns={templateColumns}>
                <TooltipCustom content={department.name}>
                  {reduceName(department.name)}
                </TooltipCustom>
              </TableRow>
            );
          })}
        </Table>
      </StatusChecker>
    </Folding>
  );
};

const mapStateToProps = (state: RootState) => ({
  currentOrgId: selectCurrentOrgId(state),
  departments: selectDepartments(state),
  user: selectUser(state),
});

const mapDispatchToProps = (dispatch: Dispatch) =>
  bindActionCreators({getDepartmentsByOrg, createDepartment}, dispatch);

export default connect(mapStateToProps, mapDispatchToProps)(OrganizationDepartment);
