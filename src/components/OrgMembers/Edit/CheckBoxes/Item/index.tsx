import React from 'react';
import {ReactComponent as IconNotAcces} from 'shared/assets/images/fi-rr-cross.svg';
import {ReactComponent as IconAccess} from 'shared/assets/images/fi-rr-check.svg';
import styles from './index.module.scss';
import {EditOrgMembersCheckBoxesItemProps} from './types';

const EditOrgMembersCheckBoxesItem = ({
  title,
  access,
  setAccess,
  field,
}: EditOrgMembersCheckBoxesItemProps) => {
  const toggleChange = () => {
    setAccess({...access, [field]: !access[field]});
  };

  return (
    <div className={styles.variable}>
      <div
        onClick={toggleChange}
        className={`${styles.checkbox} ${access[field] ? styles.access : styles.not__access} `}>
        {access[field] ? <IconAccess /> : <IconNotAcces />}
      </div>
      <div className={styles.title}>{title}</div>
    </div>
  );
};

export default React.memo(EditOrgMembersCheckBoxesItem);
