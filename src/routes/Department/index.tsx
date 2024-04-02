import {NavLink, useNavigate, useParams} from 'react-router-dom';

import {Dispatch, bindActionCreators} from '@reduxjs/toolkit';
import React, {useEffect, useState} from 'react';
import {connect} from 'react-redux';
import {RootState} from 'store';
import {deleteDepartment, getDepartmentById} from 'store/department/actions';
import {selectDepartments} from 'store/department/selectors';
import {selectOrganizations} from 'store/organizations/selectors';
import {getFilteredOrgMembers} from 'store/orgMembers/actions';
import {selectCurrentOrgId, selectUser} from 'store/user/selectors';

import DeleteModal from 'components/DeleteModal';
import DepartmentInfo from 'components/Department';
import EditMembersDepartament from 'components/Department/Members';
import Button from 'components/new/Button';
import PageMenu from 'components/new/Page/Menu';
import PageWrapper from 'components/new/Page/Wrapper';
import StatusChecker from 'components/StatusChecker';

import UseRoleRedirect from 'hooks/UseRoleRedirect';

import styles from './index.module.scss';
import {Props} from './types';

const DepartmentPage = ({
  currentOrgId,
  deleteDepartment,
  getDepartmentById,
  departments,
  getFilteredOrgMembers,
}: Props) => {
  UseRoleRedirect();
  const navigate = useNavigate();
  const {id} = useParams();
  const {departments: departmentsData, departmentsStatus} = departments;
  const [showModal, setShowModal] = useState(false);

  const onDelete = () => {
    setShowModal(false);
    id && deleteDepartment({orgId: currentOrgId, id});
    navigate('/organization');
  };

  useEffect(() => {
    getDepartmentById({orgId: currentOrgId, id});
    getFilteredOrgMembers({orgId: currentOrgId});
  }, [getDepartmentById, getFilteredOrgMembers, currentOrgId, id]);

  return (
    <StatusChecker statusArray={[departmentsStatus]}>
      <PageWrapper>
        <PageMenu title="Отдел">
          <div className={styles.buttons}>
            <NavLink to={'/organization'}>
              <Button type="submit" onClick={() => {}}>
                Назад
              </Button>
            </NavLink>
          </div>
        </PageMenu>

        {departmentsData[0] && <DepartmentInfo department={departmentsData[0]} />}
        <EditMembersDepartament />
        <div className={styles.buttons}>
          <Button
            onClick={() => {
              setShowModal(true);
            }}
            type={'reset'}>
            Удалить отдел
          </Button>
        </div>

        {showModal && (
          <DeleteModal
            onDelete={() => onDelete()}
            onClose={() => setShowModal(false)}
            title="отдел"
          />
        )}
      </PageWrapper>
    </StatusChecker>
  );
};

const mapStateToProps = (state: RootState) => ({
  organizations: selectOrganizations(state),
  currentOrgId: selectCurrentOrgId(state),
  user: selectUser(state),
  departments: selectDepartments(state),
});

const mapDispatchToProps = (dispatch: Dispatch) =>
  bindActionCreators(
    {
      deleteDepartment,
      getDepartmentById,
      getFilteredOrgMembers,
    },
    dispatch,
  );

export default connect(mapStateToProps, mapDispatchToProps)(DepartmentPage);
