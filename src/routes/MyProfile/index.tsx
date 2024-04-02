import {useNavigate} from 'react-router-dom';

import {Dispatch, bindActionCreators} from '@reduxjs/toolkit';
import React, {useEffect} from 'react';
import {connect} from 'react-redux';
import {RootState} from 'store';
import {getOrgMemberById} from 'store/orgMembers/actions';
import {selectOrgMembers} from 'store/orgMembers/selectors';
import {getProjMemberById} from 'store/projectMembers/actions';
import {selectUser} from 'store/user/selectors';

import ProfileAvatar from 'routes/ProfileAvatar';

import MeCheckBoxes from 'components/MyProfile/CheckBoxes';
import MeInfo from 'components/MyProfile/Info';
import MeProjects from 'components/MyProfile/Projects';
import Button from 'components/new/Button';
import EditOrgMembersCheckBoxes from 'components/OrgMembers/Edit/CheckBoxes';
import EditOrgMembersProjects from 'components/OrgMembers/Edit/Projects';
import StatusChecker from 'components/StatusChecker';

import styles from './index.module.scss';
import {Props} from './types';
const MyProfilePage = ({getProjMemberById, getOrgMemberById, orgMembers, user}: Props) => {
  const navigate = useNavigate();

  const {orgMembers: orgMembersData, status: orgMembersStatus} = orgMembers;
  const {data, role, currentOrgId, status: userStatus} = user;
  const orgMember = orgMembersData.find(orgMember => orgMember.profile_id === Number(data.id));

  useEffect(() => {
    if (orgMember) getProjMemberById({orgId: currentOrgId, id: orgMember?.profile.id});
  }, [orgMember, getProjMemberById, currentOrgId]);

  useEffect(() => {
    getOrgMemberById({orgId: currentOrgId, id: Number(data.id)});
  }, [data.id, currentOrgId, getOrgMemberById]);

  if (!orgMember) return null;

  return (
    <StatusChecker statusArray={[orgMembersStatus, userStatus]}>
      <div className={styles.container}>
        <div className={styles.menu}>
          <div className={styles.profile}>
            <ProfileAvatar userData={data} />
            <h1 className={styles.header}>{orgMember?.profile.fio}</h1>
          </div>
          <div className={styles.buttons}>
            <Button
              type="submit"
              onClick={() => {
                navigate('/organizationmember');
              }}>
              Назад
            </Button>
          </div>
        </div>

        <MeInfo orgMember={orgMember} />
        {role === 'employee' ? (
          <>
            <MeCheckBoxes orgMember={orgMember} />
            <MeProjects />
          </>
        ) : (
          <>
            <EditOrgMembersCheckBoxes orgMember={orgMember} />
            <EditOrgMembersProjects />
          </>
        )}
      </div>
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
      getProjMemberById,
      getOrgMemberById,
    },
    dispatch,
  );

export default connect(mapStateToProps, mapDispatchToProps)(MyProfilePage);
