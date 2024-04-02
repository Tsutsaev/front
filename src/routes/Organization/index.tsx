import {NavLink} from 'react-router-dom';

import {Dispatch, bindActionCreators} from '@reduxjs/toolkit';
import React, {useEffect, useMemo, useState} from 'react';
import {connect} from 'react-redux';
import {RootState} from 'store';
import {deleteOrganizations, getAllOrganizations} from 'store/organizations/actions';
import {selectOrganizations} from 'store/organizations/selectors';
import {selectCurrentOrgId, selectUser} from 'store/user/selectors';
import {setCurrentOrgId} from 'store/user/slice';

import DeleteModal from 'components/DeleteModal';
import OrganizationDepartment from 'components/Department/Table';
import Button from 'components/new/Button';
import PageMenu from 'components/new/Page/Menu';
import PageWrapper from 'components/new/Page/Wrapper';
import OrganizationInfo from 'components/Organization/Info';
import OrganizationIntegration from 'components/Organization/Integration';
import OrganizationVisibility from 'components/Organization/Visibility';
import StatusChecker from 'components/StatusChecker';

import UseRoleRedirect from 'hooks/UseRoleRedirect';

import Loader from 'shared/uIkit/Loader';

import styles from './index.module.scss';
import {Props} from './types';

const OrganizationPage = ({
  getAllOrganizations,
  deleteOrganizations,
  organizations,
  currentOrgId,
  setCurrentOrgId,
  user,
}: Props) => {
  UseRoleRedirect();
  const {organizations: orgData, status: orgStatus} = organizations;
  const {data, isTopManager} = user;
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    getAllOrganizations();
  }, [currentOrgId, getAllOrganizations]);

  const organization = orgData.find(org => org.id === currentOrgId);

  const isFounder = useMemo(
    () => organization?.created_by.id === +data.id,
    [data.id, organization?.created_by.id],
  );

  const onDelete = () => {
    setShowModal(false);
    if (organization?.created_by.id === Number(data.id)) {
      deleteOrganizations(organization.id);
      if (data.current_organization) {
        localStorage.setItem('org', data.current_organization.toString() || '');
        setCurrentOrgId(data.current_organization);
      } else {
        localStorage.clear();
      }
    }
  };

  if (!organization) return <Loader />;

  return (
    <StatusChecker statusArray={[orgStatus]}>
      <PageWrapper>
        <PageMenu title="Организация">
          <div className={styles.buttons}>
            {organization.tarif === 3 && isTopManager && (
              <NavLink to={'create'}>
                <Button type="submit" onClick={() => {}}>
                  Добавить
                </Button>
              </NavLink>
            )}
          </div>
        </PageMenu>

        <OrganizationInfo organization={organization} />

        <OrganizationVisibility organization={organization} />
        {(isTopManager || isFounder) && <OrganizationIntegration />}
        {organization.can_use_departments && <OrganizationDepartment />}

        {isFounder && (
          <div className={styles.buttons}>
            <Button
              onClick={() => {
                setShowModal(true);
              }}
              type={'reset'}>
              Удалить организацию
            </Button>
          </div>
        )}

        {showModal && (
          <DeleteModal
            onDelete={() => onDelete()}
            onClose={() => setShowModal(false)}
            title="организацию"
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
});

const mapDispatchToProps = (dispatch: Dispatch) =>
  bindActionCreators(
    {
      getAllOrganizations,
      deleteOrganizations,
      setCurrentOrgId,
    },
    dispatch,
  );

export default connect(mapStateToProps, mapDispatchToProps)(OrganizationPage);
