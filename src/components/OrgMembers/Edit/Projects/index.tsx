import {NavLink} from 'react-router-dom';

import React from 'react';
import {connect} from 'react-redux';
import {RootState} from 'store';
import {reduceName} from 'utils';

import Folding from 'components/new/Folding';
import Table from 'components/new/Table';
import TableHeader from 'components/new/Table/Header';
import TableRow from 'components/new/Table/Row';
import TooltipCustom from 'components/new/Tooltip';

import styles from './index.module.scss';
import {Props} from './types';

const titles = [{title: 'Проект'}, {title: 'Клиент'}];

const templateColumns = 'auto 400px';

const EditOrgMembersProjects = ({projectMembers}: Props) => {
  return (
    <Folding title="Проекты">
      <Table>
        <TableHeader titles={titles} templateColumns={templateColumns} />

        {projectMembers.map((projMember, index) => (
          <TableRow
            key={projMember.id}
            color={index % 2 === 0 ? 'gray' : 'white'}
            templateColumns={templateColumns}>
            <TooltipCustom content={projMember.project.name}>
              <NavLink to={`/project/${projMember.project.id}`} className={styles.link}>
                <p
                  className={styles.project}
                  style={{color: projMember.project.color || '#1e1d21'}}>
                  {' '}
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="7"
                    height="7"
                    viewBox="0 0 7 7"
                    fill="none">
                    <circle cx="3" cy="3" r="3" fill={projMember.project.color || '#1e1d21'} />
                  </svg>{' '}
                  {reduceName(projMember.project.name)}
                </p>
              </NavLink>
            </TooltipCustom>
            <TooltipCustom content={projMember.project.client?.name}>
              <NavLink to={`/client/edit/${projMember.project.client_id}`} className={styles.link}>
                {reduceName(projMember.project.client?.name || '')}
              </NavLink>
            </TooltipCustom>
          </TableRow>
        ))}
      </Table>
    </Folding>
  );
};

const mapStateToProps = (state: RootState) => ({
  projectMembers: state.projMembers.projMembers,
});

export default connect(mapStateToProps)(EditOrgMembersProjects);
