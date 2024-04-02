import {FillMode} from 'constants/FillMode';
import {labelsFills} from 'constants/LabelsFills';

import {useNavigate} from 'react-router-dom';

import {Dispatch, bindActionCreators} from '@reduxjs/toolkit';
import React, {useState} from 'react';
import {connect} from 'react-redux';
import {RootState} from 'store';
import {createOrganizations} from 'store/organizations/actions';
import {selectCurrentOrgId} from 'store/user/selectors';

import Button from 'components/new/Button';
import SingleDropdown from 'components/new/Dropdown/Single';
import {DropdownSingleType} from 'components/new/Dropdown/Single/types';
import Input from 'components/new/Input';
import TableInfo from 'components/new/Table/Info';
import TableInfoRow from 'components/new/Table/Info/Row';
import TableVisibility from 'components/new/Table/Visibility';
import VisibilityToggleCheckBox from 'components/new/Table/Visibility/ToggleCheckBox';
import {VisibilityOrgType} from 'components/new/Table/Visibility/ToggleCheckBox/types';
import {titlesOrgCheckBoxes} from 'components/Organization/Visibility';

import UseRoleRedirect from 'hooks/UseRoleRedirect';

import styles from './index.module.scss';
import {InfoData, PostOrganizationsInfo, Props} from './types';

const orgInputFields: (keyof PostOrganizationsInfo)[] = [
  'name',
  'inn',
  'kpp',
  'mail_address',
  'jur_address',
];

const orgTitles = {
  name: 'Название',
  inn: 'ИНН',
  kpp: 'КПП',
  mail_address: 'Почтовый адрес',
  jur_address: 'Юридический адрес',
  fill_mode: 'Форма заполнения часов *',
};

const OrganizationCreatePage = ({createOrganizations}: Props) => {
  UseRoleRedirect();
  const navigate = useNavigate();
  const [isError, setIsError] = useState(false);
  const [orgInfoData, setOrgInfoData] = useState<InfoData>({
    name: '',
    fill_mode: labelsFills.fill_mode[1],

    inn: '',
    kpp: '',
    mail_address: '',
    jur_address: '',
  });

  const [visibility, setVisibility] = useState<VisibilityOrgType>({
    access_profile: false,
    access_client: false,
    access_project: false,
    access_rest: true,
    access_holiday: true,
    access_off: false,
    can_use_departments: false,
  });

  const onCreate = () => {
    if (orgInfoData.name) {
      setIsError(false);
      const createData = {
        ...orgInfoData,
        fill_mode: orgInfoData.fill_mode?.value as FillMode,
        ...visibility,
        tarif: 1,
      };
      createOrganizations(createData);

      navigate('/organization');
    } else {
      setIsError(true);
    }
  };

  const handleChange = (value: string | Date | DropdownSingleType, field: keyof InfoData) => {
    setOrgInfoData(prev => ({...prev, [field]: value}));
  };

  return (
    <div className={styles.container}>
      <div className={styles.menu}>
        <h1 className={styles.header}>Добавление организации</h1>

        <div className={styles.buttons}>
          <Button
            type="submit"
            onClick={() => {
              navigate('/organization');
            }}>
            Назад
          </Button>

          <Button type="submit" onClick={onCreate}>
            Создать
          </Button>
        </div>
      </div>
      <TableInfo>
        {orgInputFields.map(field => (
          <TableInfoRow
            key={field}
            isError={isError && field === 'name'}
            title={orgTitles[field]}
            value={orgInfoData[field] || ''}>
            <Input
              style={{width: '500px'}}
              value={orgInfoData[field] || ''}
              onChange={value => handleChange(value, field)}
              isFocus
            />
          </TableInfoRow>
        ))}

        <TableInfoRow title={'Форма заполнения'} value={orgInfoData.fill_mode?.label}>
          <SingleDropdown
            isFocus
            width={500}
            handleChange={option => handleChange(option, 'fill_mode')}
            value={orgInfoData.fill_mode}
            labels={labelsFills['fill_mode']}
            isClearable={false}
          />
        </TableInfoRow>

        <div className={styles.help}>
          * Произвольное - сотрудники в организации могут заполнять произвольное число часов в день{' '}
          <br /> * Регулярное - сотрудник заполняет 8 часов в день фиксировано
        </div>
      </TableInfo>

      <TableVisibility title="Доступ">
        {titlesOrgCheckBoxes.map(item => (
          <VisibilityToggleCheckBox
            key={item.field}
            field={item.field as keyof VisibilityOrgType}
            title={item.title}
            visibility={visibility}
            setVisibility={value => setVisibility(value as VisibilityOrgType)}
          />
        ))}
      </TableVisibility>
    </div>
  );
};

const mapStateToProps = (state: RootState) => ({
  currentOrgId: selectCurrentOrgId(state),
});

const mapDispatchToProps = (dispatch: Dispatch) =>
  bindActionCreators(
    {
      createOrganizations,
    },
    dispatch,
  );

export default connect(mapStateToProps, mapDispatchToProps)(OrganizationCreatePage);
