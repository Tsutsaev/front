import {Outlet, useNavigate} from 'react-router-dom';

import {Dispatch, bindActionCreators} from '@reduxjs/toolkit';
import {Sidebar} from 'components';
import {Navbar} from 'components';
import React, {useEffect, useMemo, useState} from 'react';
import {connect} from 'react-redux';
import {RootState} from 'store';
import {getAllOrgMembers} from 'store/orgMembers/actions';
import {selectOrgMembers} from 'store/orgMembers/selectors';
import {IOrgMembersListState} from 'store/orgMembers/types';
import {selectUser} from 'store/user/selectors';
import {setCurrentOrgId, setIsTopManager, setRole} from 'store/user/slice';
import {IUserState} from 'store/user/types';
import 'react-toastify/dist/ReactToastify.css';

import {getOneOrgId, getUserRole} from 'routes/Root/service';

import Loader from 'shared/uIkit';

import styles from './index.module.scss';

interface StateProps {
  orgMembers: IOrgMembersListState;
  user: IUserState;
}

interface DispatchProps {
  getAllOrgMembers: typeof getAllOrgMembers;
  setCurrentOrgId: typeof setCurrentOrgId;
  setRole: typeof setRole;
  setIsTopManager: typeof setIsTopManager;
}

type Props = StateProps & DispatchProps;

const Root = ({
  user,
  orgMembers,
  setCurrentOrgId,
  setRole,
  getAllOrgMembers,
  setIsTopManager,
}: Props) => {
  const navigate = useNavigate();
  const localOrgId = localStorage.getItem('org');
  const [isDataLoading, setIsDataLoading] = useState<boolean>(true);

  const isTopManager = useMemo(() => {
    return !orgMembers.orgMembers.find(
      ({profile_id, role}) => role === 'manager' && profile_id === +user.data.id,
    )?.department_id;
  }, [orgMembers.orgMembers, user.data.id]);

  useEffect(() => {
    if (!user.isLogged) {
      navigate('/auth');
    } else {
      if (localOrgId) {
        setCurrentOrgId(+localOrgId);
        getAllOrgMembers(+localOrgId);

        void getUserRole(localOrgId, user.data.id).then(role => {
          if (!role) {
            localStorage.clear();
          } else {
            setRole(role);
            setIsDataLoading(false);
          }
        });
      } else {
        void getOneOrgId().then(id => {
          if (id) {
            setCurrentOrgId(id);
            getAllOrgMembers(id);
            localStorage.setItem('org', String(id));
            void getUserRole(id, user.data.id).then(role => {
              if (role) {
                setRole(role);
                setIsDataLoading(false);
              }
            });
          }
        });
      }
    }
  }, [
    setRole,
    setCurrentOrgId,
    getAllOrgMembers,
    localOrgId,
    navigate,
    user.data.id,
    user.isLogged,
  ]);
  useEffect(() => {
    setIsTopManager(isTopManager);
  }, [isTopManager, setIsTopManager]);

  if (isDataLoading) return <Loader />;

  return (
    <div className={styles.container}>
      <Sidebar.default />
      <div className={styles.page__content}>
        <Navbar.default />
        <Outlet />
      </div>
    </div>
  );
};

const mapStateToProps = (state: RootState) => ({
  user: selectUser(state),
  orgMembers: selectOrgMembers(state),
});

const mapDispatchToProps = (dispatch: Dispatch) =>
  bindActionCreators(
    {
      getAllOrgMembers,
      setCurrentOrgId,
      setRole,
      setIsTopManager,
    },
    dispatch,
  );

export default connect(mapStateToProps, mapDispatchToProps)(Root);
