import React, {useState, useMemo, useEffect} from 'react';
import styles from './index.module.scss';
import {useNavigate} from 'react-router-dom';
import UseRoleRedirect from 'hooks/UseRoleRedirect';
import Button from 'components/new/Button';
import Input from 'components/new/Input';
import {DropdownSingleType} from 'components/new/Dropdown/Single/types';
import SingleDropdown from 'components/new/Dropdown/Single';
import {RootState} from 'store';
import {selectOrgMembers} from 'store/orgMembers/selectors';
import {selectCurrentOrgId} from 'store/user/selectors';
import {Dispatch, bindActionCreators} from '@reduxjs/toolkit';
import {getAllOrgMembers} from 'store/orgMembers/actions';
import {connect} from 'react-redux';
import {Pair, Props, ResponceBitrixUsers, ResponceBitrixUsersAnswer} from './types';
import {transformOrgMembersData} from 'utils/TransformDropdownData';
import PageWrapper from 'components/new/Page/Wrapper';
import PageMenu from 'components/new/Page/Menu';
import StatusChecker from 'components/StatusChecker';
import {instance} from 'shared';

const OrganizationBitrixPage = ({orgMembers, currentOrgId, getAllOrgMembers}: Props) => {
  UseRoleRedirect();
  const [value, setValue] = useState('');
  const navigate = useNavigate();
  const {orgMembers: orgMembersData, status: orgMembersStatus} = orgMembers;

  const orgMembersLabels = useMemo(() => transformOrgMembersData(orgMembersData), [orgMembersData]);

  useEffect(() => {
    getAllOrgMembers(currentOrgId);
  }, [getAllOrgMembers, currentOrgId]);

  const [bitrixUsers, setBitrixUsers] = useState<ResponceBitrixUsers>({
    users: [],
  });

  const [usersPairs, setUsersPairs] = useState<Pair[]>([]);
  const [requestData, setRequestData] = useState<ResponceBitrixUsersAnswer>({
    users: [],
  });

  useEffect(() => {
    setUsersPairs(bitrixUsers.users.map(user => ({bitrix_uid: user.id, value: null})));
  }, [bitrixUsers]);

  const matchUsers = (orgMemberId: number, selectedValue: DropdownSingleType) => {
    const updatedPairs = usersPairs.map(pair => {
      if (pair.bitrix_uid === orgMemberId) {
        return {bitrix_uid: orgMemberId, value: selectedValue};
      }
      return pair;
    });

    setUsersPairs(updatedPairs);
  };

  const submitData = async () => {
    const responce = await instance.get<ResponceBitrixUsers>(`/${currentOrgId}/bitrix/`, {
      params: {
        hook: value,
      },
    });
    setRequestData({users: []});
    setBitrixUsers(responce.data);
  };

  const submitBitrixUsers = async () => {
    const bitrixUsersData = usersPairs.map(user => ({
      bitrix_uid: Number(user.bitrix_uid),
      profile_id: Number(user.value?.value),
    }));

    try {
      const responce = await instance.post<ResponceBitrixUsersAnswer>(`/${currentOrgId}/bitrix/`, {
        users: bitrixUsersData,
      });
      setRequestData(responce.data);
    } catch (e) {
      console.warn(e);
    }
  };

  return (
    <PageWrapper>
      <PageMenu title="Интеграция с Bitrix">
        <div className={styles.buttons}>
          <Button
            type="submit"
            onClick={() => {
              navigate('/organization');
            }}>
            Назад
          </Button>
          <Button type="submit" onClick={submitBitrixUsers}>
            Сохранить
          </Button>
        </div>
      </PageMenu>

      <div className={styles.integration}>
        Для интеграции с Битрикс24{' '}
        <a href={'https://dev.1c-bitrix.ru/learning/course/?COURSE_ID=99&LESSON_ID=8581'}>
          создайте входящий вебхук
        </a>{' '}
        с правами доступа: Пользователи (базовый) (user_basic), Задачи (task).
      </div>

      <div className={styles.text}>Входящий вебхук</div>
      <div className={styles.input}>
        <Input value={value} onChange={setValue} placeholder="Введите вебхук" />
        <div className={styles.helper}>
          Права: Пользователи (базовый) (user_basic), Задачи (task).
        </div>
      </div>
      <div>
        <Button type="submit" onClick={submitData}>
          Отправить
        </Button>
      </div>
      {requestData.users.length > 0 ? (
        <>
          <div className={styles.import}>Интегрированные пользователи</div>{' '}
          {bitrixUsers.users.map(user => {
            if (
              !requestData.users.find(
                userResponce =>
                  userResponce.bitrix_uid === Number(user.id) && userResponce.integrity,
              )
            ) {
              return null;
            }

            return (
              <div key={user.id} className={styles.row}>
                <div className={styles.user_data}>
                  <div className={styles.text}>{user.fio}</div>
                  <div className={styles.text}>{user.email}</div>
                </div>
              </div>
            );
          })}
        </>
      ) : (
        bitrixUsers.users.length > 0 && (
          <>
            {' '}
            <div className={styles.import}>
              Все пользователи будут импортированы и получат приглашение в систему.
            </div>
            <StatusChecker statusArray={[orgMembersStatus]}>
              {bitrixUsers.users.map((user, index) => (
                <div key={user.id} className={styles.row}>
                  <div className={styles.user_data}>
                    <div className={styles.text}>{user.fio}</div>
                    <div className={styles.text}>{user.email}</div>
                  </div>
                  <SingleDropdown
                    handleChange={selectedValue => matchUsers(user.id, selectedValue)}
                    value={usersPairs[index]?.value || null}
                    labels={orgMembersLabels}
                    placeholder="Выберите сотрудника"
                  />
                </div>
              ))}
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

export default connect(mapStateToProps, mapDispatchToProps)(OrganizationBitrixPage);
