import {NavLink} from 'react-router-dom';

import React from 'react';

import Button from 'components/new/Button';
import Folding from 'components/new/Folding';

import styles from './index.module.scss';

const OrganizationIntegration = () => {
  return (
    <Folding title="Интеграции">
      <div className={styles.buttons}>
        <NavLink to={'/organization/bitrix'}>
          <Button type={'submit'}>Bitrix</Button>
        </NavLink>
        <NavLink to={'/organization/tracker'}>
          <Button type={'submit'}>Yandex Tracker</Button>
        </NavLink>
      </div>
    </Folding>
  );
};

export default OrganizationIntegration;
