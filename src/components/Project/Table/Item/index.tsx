import {Link} from 'react-router-dom';

import React from 'react';
import {reduceName} from 'utils';

import {TagsList} from 'components/new';
import TableCell from 'components/new/Table/Cell';
import TableRow from 'components/new/Table/Row';
import TooltipCustom from 'components/new/Tooltip';

import {formatDateString} from 'utils/DateFormat';

import styles from './index.module.scss';
import {ClientTableItemType} from './types';

const ProjectTableItem = ({templateColumns, project, type}: ClientTableItemType) => {
  return (
    <TableRow color={type} templateColumns={templateColumns}>
      <TableCell>
        <TooltipCustom content={project.name}>
          <Link to={'' + project.id} className={styles.link__to__project}>
            {reduceName(project.name)}
          </Link>
        </TooltipCustom>
      </TableCell>
      <TableCell>
        <TooltipCustom content={project?.client?.name || ''}>
          <Link to={'/client/edit/' + project.client?.id} className={styles.link__to__project}>
            {reduceName(project?.client?.name || '', 15)}
          </Link>
        </TooltipCustom>
      </TableCell>
      <TableCell>{formatDateString(project.date_start)}</TableCell>
      <TableCell>{formatDateString(project.date_end)}</TableCell>
      <TableCell>{project.budget}</TableCell>
      <TableCell>{project.department?.name}</TableCell>

      <TableCell>
        <TagsList tags={project.tags} />
      </TableCell>
    </TableRow>
  );
};

export default ProjectTableItem;
