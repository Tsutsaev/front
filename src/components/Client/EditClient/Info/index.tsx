import React, {memo, useState} from 'react';

import {ClientInfoDataType, Props} from './types';
import {PatchClientType} from 'store/clients/types';
import TableInfo from 'components/new/Table/Info';
import TableInfoRow from 'components/new/Table/Info/Row';
import Input from 'components/new/Input';
import {connect} from 'react-redux';
import {Dispatch, bindActionCreators} from '@reduxjs/toolkit';
import {patchClient} from 'store/clients/actions';
import {useParams} from 'react-router-dom';
import {RootState} from 'store';
import {selectCurrentOrgId} from 'store/user/selectors';

export const clientTitles = {
  name: 'Название',
  inn: 'ИНН',
  kpp: 'КПП',
  mail_address: 'Почтовый адрес',
  jur_address: 'Юридический адрес',
};

export const clientFields: (keyof PatchClientType)[] = [
  'name',
  'inn',
  'kpp',
  'mail_address',
  'jur_address',
];

const EditClientInfo = ({client, currentOrgId, patchClient}: Props) => {
  const {id} = useParams();
  const [clientInfoData, setClientInfoData] = useState<ClientInfoDataType>({
    name: client.name,
    inn: client.inn || '',
    kpp: client.kpp || '',
    mail_address: client.mail_address || '',
    jur_address: client.jur_address || '',
  });

  const [error, setError] = useState(false);
  const onChangeInputInfoData = (value: string, field: keyof ClientInfoDataType) => {
    setClientInfoData(prev => ({...prev, [field]: value}));
  };

  const onUndo = (field: keyof ClientInfoDataType) => {
    setClientInfoData(prev => ({...prev, [field]: client[field]}));
  };

  const onSave = (field: keyof ClientInfoDataType) => {
    if (field === 'name' && !clientInfoData[field]) {
      setError(true);
    } else {
      patchClient({
        orgId: currentOrgId,
        id: Number(id),
        data: {[field]: clientInfoData[field]},
      }),
        setError(false);
    }
  };

  return (
    <TableInfo>
      {clientFields.map(field => (
        <TableInfoRow
          key={field}
          isError={error && field === 'name'}
          title={clientTitles[field]}
          value={clientInfoData[field]}
          onUndo={() => onUndo(field)}
          onSave={() => onSave(field)}>
          <Input
            style={{width: '500px'}}
            value={clientInfoData[field]}
            onChange={value => onChangeInputInfoData(value, field)}
            isFocus
            isError={error}
          />
        </TableInfoRow>
      ))}
    </TableInfo>
  );
};

const mapStateToProps = (state: RootState) => ({
  currentOrgId: selectCurrentOrgId(state),
});

const mapDispatchToProps = (dispatch: Dispatch) =>
  bindActionCreators(
    {
      patchClient,
    },
    dispatch,
  );

export default connect(mapStateToProps, mapDispatchToProps)(memo(EditClientInfo));
