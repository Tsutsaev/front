import {TagsList} from 'components/new';
import Table from 'components/new/Table';
import TableHeader from 'components/new/Table/Header';
import TableRow from 'components/new/Table/Row';
import TooltipCustom from 'components/new/Tooltip';
import {format, parseISO} from 'date-fns';
import UseAppSelector from 'hooks/UseAppSelector';
import React from 'react';
import {NavLink} from 'react-router-dom';
import {reduceName} from 'utils';
import styles from './index.module.scss';

const titles = [
  {title: 'Название'},
  {title: 'Начало'},
  {title: 'Завершение'},
  {title: 'Бюджет'},
  {title: 'Теги'},
];
const formattedDate = (date: string | null) => {
  if (!date) return '-';
  const stringDate = parseISO(date);

  return format(stringDate, 'dd.MM.yy');
};

const templateColumns = 'minmax(125px, 1fr) 150px 150px 150px minmax(125px, 1fr)';

const EditClientProjects = () => {
  const projects = UseAppSelector(state => state.projects.projects);
  return (
    <div className={styles.container}>
      <div className={styles.header}>Проекты</div>

      <Table>
        <TableHeader titles={titles} templateColumns={templateColumns} />

        {projects.map((project, index) => (
          <TableRow
            key={project.id}
            color={index % 2 === 0 ? 'gray' : 'white'}
            templateColumns={templateColumns}>
            <TooltipCustom content={project.name}>
              <NavLink to={`/project/${project.id}`} className={styles.project}>
                {reduceName(project.name)}
              </NavLink>
            </TooltipCustom>
            <p className={styles.text}>{formattedDate(project.date_start)}</p>
            <p className={styles.text}>{formattedDate(project.date_end)}</p>
            <p className={styles.text}>{project.budget}</p>
            <p className={styles.text}>
              {' '}
              <TagsList tags={project.tags} />
            </p>
          </TableRow>
        ))}
      </Table>
    </div>
  );
};

export default EditClientProjects;
