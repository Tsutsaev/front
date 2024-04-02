import React from 'react';
import styles from './index.module.scss';
import {RootState} from 'store';
import {connect} from 'react-redux';
import {Props} from './types';
import Table from 'components/new/Table';
import TableHeader from 'components/new/Table/Header';
import TableRow from 'components/new/Table/Row';

const titles = [{title: 'Проект'}, {title: 'Клиент'}];

const templateColumns = 'auto 400px';

const MeProjects = ({projectMembers}: Props) => {
  return (
    <div className={styles.container}>
      <div className={styles.header}>Проекты</div>

      <Table>
        <TableHeader titles={titles} templateColumns={templateColumns} />

        {projectMembers.map((projMember, index) => (
          <TableRow
            key={projMember.id}
            color={index % 2 === 0 ? 'gray' : 'white'}
            templateColumns={templateColumns}>
            <div className={styles.text}>
              <p className={styles.project} style={{color: projMember.project.color || '#1e1d21'}}>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="7"
                  height="7"
                  viewBox="0 0 7 7"
                  fill="none">
                  <circle cx="3" cy="3" r="3" fill={projMember.project.color || '#1e1d21'} />
                </svg>{' '}
                {projMember.project.name}
              </p>
            </div>

            <div className={styles.text}>{projMember.project.client?.name}</div>
          </TableRow>
        ))}
      </Table>
    </div>
  );
};

const mapStateToProps = (state: RootState) => ({
  projectMembers: state.projMembers.projMembers,
});

export default connect(mapStateToProps)(MeProjects);
