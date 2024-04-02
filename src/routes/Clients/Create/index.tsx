import {useNavigate} from 'react-router-dom';

import {Dispatch, bindActionCreators} from '@reduxjs/toolkit';
import React, {useState} from 'react';
import {connect} from 'react-redux';
import {RootState} from 'store';
import {createClient} from 'store/clients/actions';
import {selectCurrentOrgId} from 'store/user/selectors';

import {clientFields, clientTitles} from 'components/Client/EditClient/Info';
import Button from 'components/new/Button';
import Input from 'components/new/Input';
import TableInfo from 'components/new/Table/Info';
import TableInfoRow from 'components/new/Table/Info/Row';

import UseRoleRedirect from 'hooks/UseRoleRedirect';

import {ReactComponent as PlusIcon} from 'shared/assets/images/fi-rr-plus.svg';

import styles from './index.module.scss';
import {Data, Props} from './types';

const ClientsCreate = ({currentOrgId, createClient}: Props) => {
  UseRoleRedirect();
  const navigate = useNavigate();
  const [isError, setIsError] = useState(false);
  const [data, setData] = useState<Data>({
    name: '',
    inn: '',
    kpp: '',
    mail_address: '',
    jur_address: '',
  });

  const onChangeInputInfoData = (value: string | null, field: keyof Data) => {
    setData({...data, [field]: value});
  };

  const onCreate = () => {
    if (data.name) {
      setIsError(false);
      createClient({orgId: currentOrgId, data: data});
      navigate('/client');
    } else {
      setIsError(true);
    }
  };

  return (
    <div className={styles.container}>
      <div className={styles.menu}>
        <h1 className={styles.header}>Добавление клиента</h1>

        <div className={styles.buttons}>
          <Button
            type={'submit'}
            onClick={() => {
              navigate('/client');
            }}>
            Назад
          </Button>
          <Button type={'submit'} onClick={onCreate}>
            {<PlusIcon style={{height: '18px'}} />} Сохранить
          </Button>
        </div>
      </div>
      <TableInfo>
        {clientFields.map(field => (
          <TableInfoRow
            key={field}
            isError={isError && field === 'name'}
            title={clientTitles[field]}
            value={data[field]}>
            <Input
              style={{width: '500px'}}
              value={data[field]}
              onChange={value => onChangeInputInfoData(value, field)}
              isFocus
              isError={isError}
              placeholder="Заполните поле"
            />
          </TableInfoRow>
        ))}
      </TableInfo>
    </div>
  );
};

const mapStateToProps = (state: RootState) => ({
  currentOrgId: selectCurrentOrgId(state),
});

const mapDispatchToProps = (dispatch: Dispatch) =>
  bindActionCreators(
    {
      createClient,
    },
    dispatch,
  );

export default connect(mapStateToProps, mapDispatchToProps)(ClientsCreate);
