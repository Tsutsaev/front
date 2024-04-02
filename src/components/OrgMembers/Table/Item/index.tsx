import React from 'react';
import {OrgMembersTableItemType} from './types';
import styles from './index.module.scss';
import {NavLink} from 'react-router-dom';
import {ReactComponent as AgreedIcon} from 'shared/assets/images/Yes.svg';
import DisagreeIcon from 'shared/assets/images/No.png';
import {format, parseISO} from 'date-fns';
import TableRow from 'components/new/Table/Row';
import {reduceName} from 'utils';
import TooltipCustom from 'components/new/Tooltip';

const formattedDate = (date: string | null) => {
  if (!date) return '-';
  const stringDate = parseISO(date);

  return format(stringDate, 'dd.MM.yy');
};

const OrgMembersTableItem = ({
  templateColumns,

  orgMember,
  type,
}: OrgMembersTableItemType) => {
  return (
    <TableRow color={type} templateColumns={templateColumns}>
      <TooltipCustom content={orgMember.profile.fio}>
        <NavLink className={styles.profile} to={`/organizationmember/edit/${orgMember.profile_id}`}>
          <img src={orgMember.profile.avatar} alt="avatar" />
          {reduceName(orgMember.profile.fio)}
        </NavLink>
      </TooltipCustom>
      <p className={styles.text}>{orgMember.role === 'manager' ? 'Менеджер' : 'Сотрудник'}</p>

      <p className={styles.text}>
        {orgMember.sheet_off ? <AgreedIcon /> : <img src={DisagreeIcon} alt={'status'} />}
      </p>
      <p className={styles.text}>
        {orgMember.fill_mode === 'regular' ? 'Произвольное' : 'Регулярное'}
      </p>
      <p className={styles.text}>{formattedDate(orgMember.date_in)}</p>
      <p className={styles.text}>{formattedDate(orgMember.date_out)}</p>
    </TableRow>
  );
};

export default OrgMembersTableItem;
