import {Dispatch, bindActionCreators} from '@reduxjs/toolkit';
import React, {memo, useState, useEffect, useMemo} from 'react';
import {connect} from 'react-redux';
import {RootState} from 'store';
import {getAllClients} from 'store/clients/actions';
import {selectClients} from 'store/clients/selectors';
import {selectFilters} from 'store/filters/selectors';
import {getFilteredProjects} from 'store/projects/actions';
import {selectProjects} from 'store/projects/selectors';
import {IProjectState} from 'store/projects/types';
import {selectCurrentOrgId} from 'store/user/selectors';

import Table from 'components/new/Table';
import TableHeader from 'components/new/Table/Header';
import StatusChecker from 'components/StatusChecker';

import ProjectTableItem from './Item';
import {Props} from './types';

const templateColumns = '230px 180px 100px 130px 100px 120px auto';

const ProjectsTable = ({filters, currentOrgId, projects, getFilteredProjects}: Props) => {
  const {search, client} = filters;
  const {projects: projectsData, status} = projects;
  const [filteredProjects, setFilteredProjects] = useState<IProjectState[]>(projectsData);
  const [ordering, setOrdering] = useState('');

  useEffect(() => {
    getFilteredProjects({orgId: currentOrgId, ordering: ordering, client: client});
  }, [getFilteredProjects, currentOrgId, ordering, client, search]);

  useEffect(() => {
    const lowercaseSearch = search.toLowerCase();

    if (lowercaseSearch.trim() === '') {
      setFilteredProjects(projectsData);
    } else {
      const filtered = projectsData.filter(
        project =>
          project.name.toLowerCase().includes(search.toLowerCase()) ||
          project.tags.filter(tag => tag.toLowerCase().includes(search.toLowerCase())).length,
      );
      setFilteredProjects(filtered);
    }
  }, [search, projectsData]);

  const titles = useMemo(
    () => [
      {
        title: 'Проект',
        sort: () => setOrdering(prevState => (prevState ? '' : '-')),
      },
      {title: 'Клиент'},
      {title: 'Начало'},
      {title: 'Завершение'},
      {title: 'Бюджет'},
      {title: 'Отдел'},
      {title: 'Теги'},
    ],
    [],
  );

  return (
    <StatusChecker statusArray={[status]}>
      <Table>
        <TableHeader titles={titles} templateColumns={templateColumns} />

        {filteredProjects?.map((project, index) => (
          <ProjectTableItem
            key={project.id}
            project={project}
            type={index % 2 === 0 ? 'gray' : 'white'}
            templateColumns={templateColumns}
          />
        ))}
      </Table>
    </StatusChecker>
  );
};

const mapStateToProps = (state: RootState) => ({
  clients: selectClients(state),
  filters: selectFilters(state),
  projects: selectProjects(state),
  currentOrgId: selectCurrentOrgId(state),
});

const mapDispatchToProps = (dispatch: Dispatch) =>
  bindActionCreators(
    {
      getAllClients,
      getFilteredProjects,
    },
    dispatch,
  );

export default connect(mapStateToProps, mapDispatchToProps)(memo(ProjectsTable));
