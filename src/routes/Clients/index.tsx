import Button from 'components/new/Button';
import React from 'react';
import SortingPanel from 'components/SortingPanel';
import {NavLink} from 'react-router-dom';
import ClientTable from 'components/Client/ClientTable';
import PageWrapper from 'components/new/Page/Wrapper';
import PageMenu from 'components/new/Page/Menu';
import UseRoleRedirect from 'hooks/UseRoleRedirect';

const ClientsPage = () => {
  UseRoleRedirect();
  return (
    <PageWrapper>
      <PageMenu title="Клиенты">
        <NavLink to={'create'}>
          <Button type={'submit'}>Добавить</Button>
        </NavLink>
      </PageMenu>

      <SortingPanel isSearching />

      <ClientTable />
    </PageWrapper>
  );
};

export default ClientsPage;
