import {Link} from 'react-router-dom';

import React from 'react';

import Button from 'components/new/Button';
import PageMenu from 'components/new/Page/Menu';
import PageWrapper from 'components/new/Page/Wrapper';
import ProjectsTable from 'components/Project/Table';
import SortingPanel from 'components/SortingPanel';

import UseRoleRedirect from 'hooks/UseRoleRedirect';

const ProjectsPage = () => {
  UseRoleRedirect();

  return (
    <PageWrapper>
      <PageMenu title="Проекты">
        <Link to={'/project/create/'}>
          <Button type={'submit'}>Добавить</Button>
        </Link>
      </PageMenu>
      <SortingPanel isSearching isClient />
      <ProjectsTable />
    </PageWrapper>
  );
};

export default ProjectsPage;
