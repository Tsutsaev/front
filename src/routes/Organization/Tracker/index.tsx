import React, {useEffect, useMemo, useState} from 'react';
import styles from './index.module.scss';
import {useLocation, useNavigate} from 'react-router-dom';
import UseRoleRedirect from 'hooks/UseRoleRedirect';
import Button from 'components/new/Button';
import Input from 'components/new/Input';
import {DropdownSingleType} from 'components/new/Dropdown/Single/types';
import SingleDropdown from 'components/new/Dropdown/Single';
import PageWrapper from 'components/new/Page/Wrapper';
import PageMenu from 'components/new/Page/Menu';
import {RootState} from 'store';
import {selectOrgMembers} from 'store/orgMembers/selectors';
import {connect} from 'react-redux';
import {Pair, Props, ResponceYandexUsers, ResponceYandexUsersAnswer} from './types';
import {getAllOrgMembers} from 'store/orgMembers/actions';
import StatusChecker from 'components/StatusChecker';
import {Dispatch, bindActionCreators} from '@reduxjs/toolkit';
import {selectCurrentOrgId} from 'store/user/selectors';
import {transformOrgMembersData} from 'utils/TransformDropdownData';
import {instance} from 'shared';

const OrganizationTrackerPage = ({orgMembers, currentOrgId, getAllOrgMembers}: Props) => {
  UseRoleRedirect();
  const navigate = useNavigate();
  const location = useLocation();

  const [value, setValue] = useState('');
  const [accessToken, setAccessTojen] = useState<string | null>(null);
  const [yandexUsers, setYandexUsers] = useState<ResponceYandexUsers>({
    yandex_users: [],
  });

  const {orgMembers: orgMembersData, status: orgMembersStatus} = orgMembers;

  const orgMembersLabels = useMemo(() => transformOrgMembersData(orgMembersData), [orgMembersData]);
  const [usersPairs, setUsersPairs] = useState<Pair[]>([]);
  const [requestData, setRequestData] = useState<ResponceYandexUsersAnswer>({
    users: [],
  });

  useEffect(() => {
    getAllOrgMembers(currentOrgId);
  }, [getAllOrgMembers, currentOrgId]);

  useEffect(() => {
    const fragment = location.hash.substring(1);
    const fragmentParams = new URLSearchParams(fragment);
    const access_token = fragmentParams.get('access_token');
    setAccessTojen(access_token);
  }, [location.hash]);

  useEffect(() => {
    setUsersPairs(
      yandexUsers.yandex_users.map(user => ({yandex_uid: user.yandex_uid, value: null})),
    );
  }, [yandexUsers]);

  const matchUsers = (orgMemberId: number, selectedValue: DropdownSingleType) => {
    const updatedPairs = usersPairs.map(pair => {
      if (pair.yandex_uid === orgMemberId) {
        return {yandex_uid: orgMemberId, value: selectedValue};
      }
      return pair;
    });

    setUsersPairs(updatedPairs);
  };

  const submitData = async () => {
    const responce = await instance.get<ResponceYandexUsers>(`/${currentOrgId}/yandex/`, {
      params: {
        access_token: accessToken,
        ya_org_id: value,
      },
    });
    setRequestData({users: []});
    setYandexUsers(responce.data);
  };

  const submitYandexUsers = async () => {
    const yandexUsersData = usersPairs.map(user => ({
      yandex_uid: user.yandex_uid,
      profile_id: Number(user.value?.value),
    }));

    try {
      const responce = await instance.post<ResponceYandexUsersAnswer>(`/${currentOrgId}/yandex/`, {
        users: yandexUsersData,
      });
      setRequestData(responce.data);
    } catch (e) {
      console.warn(e);
    }
  };

  return (
    <PageWrapper>
      <PageMenu title="Интеграция с Yandex Tracker">
        <div className={styles.buttons}>
          <Button
            type="submit"
            onClick={() => {
              navigate('/organization');
            }}>
            Назад
          </Button>
          <Button type="submit" onClick={submitYandexUsers}>
            Сохранить
          </Button>
        </div>
      </PageMenu>

      <div className={styles.integration}>
        Для интеграции с Yandex Tracker{' '}
        <a
          href={
            'https://oauth.yandex.ru/authorize?response_type=token&client_id=b0dc1c6213f24a75818a0f6c1c8e0fc9'
          }
          target="_blank"
          rel="noreferrer">
          перейдите по ссылке
        </a>{' '}
      </div>

      {accessToken && (
        <>
          <div className={styles.text}>Токен доступа</div>
          <div className={styles.input}>
            <div className={styles.token}>{accessToken}</div>
          </div>
          <div className={styles.text}>ID организации трекера</div>
          <div className={styles.input}>
            <Input value={value} onChange={setValue} placeholder="Введите ID организации трекера" />
          </div>
        </>
      )}

      {value && (
        <div>
          <Button onClick={submitData} type="submit">
            Отправить
          </Button>
        </div>
      )}
      {requestData.users.length > 0 ? (
        <>
          <div className={styles.import}>Интегрированные пользователи</div>{' '}
          {yandexUsers.yandex_users.map(user => {
            if (
              !requestData.users.find(
                userResponce =>
                  userResponce.yandex_uid === Number(user.yandex_uid) && userResponce.integrity,
              )
            ) {
              return null;
            }

            return (
              <div key={user.yandex_uid} className={styles.row}>
                <div className={styles.user_data}>
                  <div className={styles.text}>{user.display}</div>
                  <div className={styles.text}>{user.email}</div>
                </div>
              </div>
            );
          })}
        </>
      ) : (
        value && (
          <>
            <StatusChecker statusArray={[orgMembersStatus]}>
              {yandexUsers.yandex_users.map((user, index) => {
                return (
                  <div key={user.yandex_uid} className={styles.row}>
                    <div className={styles.user_data}>
                      <div className={styles.text}>{user.display}</div>
                      <div className={styles.text}>{user.email}</div>
                    </div>

                    <SingleDropdown
                      placeholder="Выберите сотрудника"
                      handleChange={selectedValue => matchUsers(user.yandex_uid, selectedValue)}
                      value={usersPairs[index]?.value || null}
                      labels={orgMembersLabels}
                    />
                  </div>
                );
              })}
            </StatusChecker>
          </>
        )
      )}
    </PageWrapper>
  );
};

const mapStateToProps = (state: RootState) => ({
  orgMembers: selectOrgMembers(state),
  currentOrgId: selectCurrentOrgId(state),
});

const mapDispatchToProps = (dispatch: Dispatch) =>
  bindActionCreators(
    {
      getAllOrgMembers,
    },
    dispatch,
  );

export default connect(mapStateToProps, mapDispatchToProps)(OrganizationTrackerPage);
