import {useNavigate, useParams} from 'react-router-dom';

import {Dispatch, bindActionCreators} from '@reduxjs/toolkit';
import React, {useEffect, useState} from 'react';
import {connect} from 'react-redux';
import {RootState} from 'store';
import {deleteOrgMembers, getOrgMemberById} from 'store/orgMembers/actions';
import {selectOrgMembers} from 'store/orgMembers/selectors';
import {getProjMemberById} from 'store/projectMembers/actions';
import {selectUser} from 'store/user/selectors';

import DeleteModal from 'components/DeleteModal';
import Button from 'components/new/Button';
import PageMenu from 'components/new/Page/Menu';
import PageWrapper from 'components/new/Page/Wrapper';
import EditOrgMembersCheckBoxes from 'components/OrgMembers/Edit/CheckBoxes';
import EditOrgMembersInfo from 'components/OrgMembers/Edit/Info';
import EditOrgMembersProjects from 'components/OrgMembers/Edit/Projects';
import StatusChecker from 'components/StatusChecker';

import UseRoleRedirect from 'hooks/UseRoleRedirect';

import styles from './index.module.scss';
import {Props} from './types';

const OrgMembersEdit = ({
  orgMembers,
  user,
  deleteOrgMembers,
  getProjMemberById,
  getOrgMemberById,
}: Props) => {
  UseRoleRedirect();
  const {id} = useParams();
  const navigate = useNavigate();

  const [showModal, setShowModal] = useState(false);
  const {orgMembers: orgMembersData, status: orgMemberStatus} = orgMembers;
  const {currentOrgId, status: userStatus} = user;

  const orgMember = orgMembersData.find(orgMember => orgMember.profile_id === Number(id));

  const onDelete = () => {
    setShowModal(false);
    if (orgMember) deleteOrgMembers({orgId: currentOrgId, id: orgMember.id});
    navigate('/organizationmember');
  };

  useEffect(() => {
    void getOrgMemberById({orgId: currentOrgId, id: Number(id)});
  }, [id, currentOrgId, getOrgMemberById]);

  useEffect(() => {
    if (orgMember) getProjMemberById({orgId: currentOrgId, id: orgMember?.profile.id});
  }, [orgMember, currentOrgId, getProjMemberById]);

  if (!orgMember) return null;

  return (
    <StatusChecker statusArray={[orgMemberStatus, userStatus]}>
      <PageWrapper>
        <PageMenu title={orgMember.profile.fio}>
          <div className={styles.buttons}>
            <Button
              type={'submit'}
              onClick={() => {
                navigate('/organizationmember');
              }}>
              Назад
            </Button>
          </div>
        </PageMenu>

        <EditOrgMembersInfo orgMember={orgMember} />
        <EditOrgMembersCheckBoxes orgMember={orgMember} />
        <EditOrgMembersProjects />

        <div className={styles.buttons}>
          <Button
            type={'reset'}
            onClick={() => {
              setShowModal(true);
            }}>
            Удалить сотрудника
          </Button>
        </div>

        {showModal && (
          <DeleteModal
            onDelete={() => onDelete()}
            onClose={() => setShowModal(false)}
            title="сотрудника"
          />
        )}
      </PageWrapper>
    </StatusChecker>
  );
};

const mapStateToProps = (state: RootState) => ({
  orgMembers: selectOrgMembers(state),
  user: selectUser(state),
});

const mapDispatchToProps = (dispatch: Dispatch) =>
  bindActionCreators(
    {
      getOrgMemberById,
      getProjMemberById,
      deleteOrgMembers,
    },
    dispatch,
  );

export default connect(mapStateToProps, mapDispatchToProps)(OrgMembersEdit);
