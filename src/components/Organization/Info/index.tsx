import {labelsFills} from 'constants/LabelsFills';

import {Dispatch, bindActionCreators} from '@reduxjs/toolkit';
import React, {memo, useState, useMemo, useEffect} from 'react';
import {connect} from 'react-redux';
import {RootState} from 'store';
import {patchOrganizations} from 'store/organizations/actions';
import {IOrganization, PatchOrgInfoType} from 'store/organizations/types';
import {getAllOrgMembers, getOrgMemberById} from 'store/orgMembers/actions';
import {selectOrgMembers} from 'store/orgMembers/selectors';
import {IOrgMembersProfile} from 'store/orgMembers/types';
import {patchProfile} from 'store/Profile/actions';
import {PatchProfileType} from 'store/Profile/types';
import {selectCurrentOrgId, selectUser} from 'store/user/selectors';

import SingleDropdown from 'components/new/Dropdown/Single';
import {DropdownSingleType} from 'components/new/Dropdown/Single/types';
import Input from 'components/new/Input';
import TableInfo from 'components/new/Table/Info';
import TableInfoRow from 'components/new/Table/Info/Row';

import {getOptionFromId, getOptionFromString} from 'utils/GetOptionFromString';
import {transformOrgMembersData} from 'utils/TransformDropdownData';

import styles from './index.module.scss';
import OrganizationInfoTarif from './Tarif';
import {OrgInfoDataType, Props} from './types';

export const orgTitles = {
  name: 'Название',
  inn: 'ИНН',
  kpp: 'КПП',
  mail_address: 'Почтовый адрес',
  jur_address: 'Юридический адрес',
  fio: 'ФИО представителя',
  phone: 'Телефон представителя',
  email: 'Почтовый адрес представителя',
  fill_mode: 'Форма заполнения часов *',
};

export const orgInputFields: (keyof PatchOrgInfoType | keyof PatchProfileType)[] = [
  'name',
  'inn',
  'kpp',
  'mail_address',
  'jur_address',
];

export const orgInputCreatedFields: (keyof PatchOrgInfoType | keyof PatchProfileType)[] = [
  'phone',
  'email',
];

export const orgDropdownFields: (keyof PatchOrgInfoType | keyof PatchProfileType)[] = ['fill_mode'];

const requiredFields = ['name', 'fio'];

const OrganizationInfo = ({
  organization,
  orgMembers,
  getAllOrgMembers,
  patchOrganizations,
  getOrgMemberById,
  patchProfile,
  user,
}: Props) => {
  const {orgMembers: orgMembersData} = orgMembers;

  const orgMembersLabels = useMemo(() => transformOrgMembersData(orgMembersData), [orgMembersData]);

  useEffect(() => {
    if (Number(user.id) === organization.created_by_id) {
      void getAllOrgMembers(organization.id);
    } else {
      void getOrgMemberById({orgId: organization.id, id: organization.created_by_id});
    }
  }, [organization.id, getAllOrgMembers, getOrgMemberById, organization.created_by_id, user.id]);

  const [orgInfoData, setOrgInfoData] = useState<OrgInfoDataType>({
    name: organization.name,
    inn: organization.inn || '',
    kpp: organization.kpp || '',
    mail_address: organization.mail_address || '',
    jur_address: organization.jur_address || '',
    fio: getOptionFromId(organization.created_by.id, orgMembersLabels),
    phone: organization.created_by.phone || '',
    fill_mode: getOptionFromString('fill_mode', organization.fill_mode),
    email: organization.created_by.email,
  });

  useEffect(() => {
    setOrgInfoData(prev => ({
      ...prev,
      fio: getOptionFromId(organization.created_by.id, orgMembersLabels),
    }));
  }, [orgMembersData, orgMembersLabels, organization.created_by.id]);

  const [errorField, setErrorField] = useState('');

  const handleChange = (
    value: DropdownSingleType | string | null,
    field: keyof OrgInfoDataType,
  ) => {
    setOrgInfoData(prev => ({...prev, [field]: value}));
  };

  const onUndo = (field: keyof OrgInfoDataType) => {
    if (field in organization) {
      const orgField = field as keyof IOrganization;
      const undoValue = orgDropdownFields.includes(field)
        ? getOptionFromString(field as keyof typeof labelsFills, organization[orgField] as string)
        : organization[orgField];

      setOrgInfoData(prev => ({
        ...prev,
        [field]: undoValue,
      }));
    } else {
      setOrgInfoData(prev => ({
        ...prev,
        [field]: organization.created_by[field as keyof Omit<IOrgMembersProfile, 'avatar'>],
      }));
    }
  };

  const onSave = (field: keyof OrgInfoDataType) => {
    if (requiredFields.includes(field) && !orgInfoData[field]) {
      setErrorField(field);
    } else {
      if (field === 'fio') {
        patchOrganizations({
          orgId: organization.id,
          data: {created_by_id: Number(orgInfoData.fio?.value)},
        });
      } else if (['phone', 'email'].includes(field)) {
        patchProfile({
          orgId: organization.id,
          id: organization.created_by.id,
          data: {[field]: orgInfoData[field]},
        });
      } else {
        const patchValue = orgDropdownFields.includes(field)
          ? (orgInfoData[field] as DropdownSingleType)?.value
          : orgInfoData[field];

        patchOrganizations({
          orgId: organization.id,
          data: {[field]: patchValue || null},
        });
      }
      setErrorField('');
    }
  };

  return (
    <TableInfo>
      {orgInputFields.map(field => (
        <TableInfoRow
          key={field}
          isError={errorField === field}
          title={orgTitles[field]}
          value={(orgInfoData[field] || '') as string}
          onUndo={() => onUndo(field)}
          onSave={() => onSave(field)}>
          <Input
            style={{width: '500px'}}
            value={(orgInfoData[field] || '') as string}
            onChange={value => handleChange(value, field)}
            isFocus
          />
        </TableInfoRow>
      ))}

      <TableInfoRow
        title={orgTitles['fio']}
        value={orgInfoData['fio']?.label}
        onUndo={() => onUndo('fio')}
        onSave={() => onSave('fio')}>
        <SingleDropdown
          isFocus
          width={500}
          handleChange={option => handleChange(option, 'fio')}
          value={orgInfoData['fio']}
          labels={orgMembersLabels}
          isClearable={false}
        />
      </TableInfoRow>

      {orgInputCreatedFields.map(field => (
        <TableInfoRow
          key={field}
          isError={errorField === field}
          title={orgTitles[field]}
          value={(orgInfoData[field] || '') as string}
          onUndo={() => onUndo(field)}
          onSave={() => onSave(field)}>
          <Input
            style={{width: '500px'}}
            value={(orgInfoData[field] || '') as string}
            onChange={value => handleChange(value, field)}
            isFocus
          />
        </TableInfoRow>
      ))}

      {orgDropdownFields.map(field => (
        <TableInfoRow
          key={field}
          title={orgTitles[field]}
          value={(orgInfoData[field] as DropdownSingleType)?.label}
          onUndo={() => onUndo(field)}
          onSave={() => onSave(field)}>
          <SingleDropdown
            isFocus
            width={500}
            handleChange={option => handleChange(option, field)}
            value={orgInfoData[field] as DropdownSingleType}
            labels={labelsFills[field as keyof typeof labelsFills]}
            isClearable={false}
          />
        </TableInfoRow>
      ))}

      <OrganizationInfoTarif
        orgId={organization.id}
        is_trial={organization.is_trial}
        is_tarif_requested={organization.is_tarif_requested}
        created_at={organization.created_at}
        initialState={organization.tarif}
      />

      <div className={styles.help}>
        * Произвольное - сотрудники в организации могут заполнять произвольное число часов в день{' '}
        <br /> * Регулярное - сотрудник заполняет 8 часов в день фиксировано
      </div>
    </TableInfo>
  );
};

const mapStateToProps = (state: RootState) => ({
  currentOrgId: selectCurrentOrgId(state),
  orgMembers: selectOrgMembers(state),
  user: selectUser(state).data,
});

const mapDispatchToProps = (dispatch: Dispatch) =>
  bindActionCreators(
    {
      patchOrganizations,
      patchProfile,
      getAllOrgMembers,
      getOrgMemberById,
    },
    dispatch,
  );

export default connect(mapStateToProps, mapDispatchToProps)(memo(OrganizationInfo));
