import React from 'react';
import {ClientTableItemType} from './types';
import styles from './index.module.scss';
import {NavLink} from 'react-router-dom';
import {reduceName} from 'utils';
import TableRow from 'components/new/Table/Row';
import TooltipCustom from 'components/new/Tooltip';

const ClientTableItem = ({
  templateColumns,

  client,
  type,
}: ClientTableItemType) => {
  return (
    <TableRow color={type} templateColumns={templateColumns}>
      <TooltipCustom content={client.name}>
        <NavLink className={styles.profile} to={`/client/edit/${client.id}`}>
          {reduceName(client.name)}
        </NavLink>
      </TooltipCustom>
      <p className={styles.text}>{client.inn}</p>

      <p className={styles.text}>{client.kpp}</p>
      <p className={styles.text}>{client.jur_address}</p>
    </TableRow>
  );
};

export default ClientTableItem;
