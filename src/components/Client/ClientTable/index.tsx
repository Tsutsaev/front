import React, {memo, useState, useEffect, useMemo} from 'react';
import ClientTableItem from './Item';
import StatusChecker from 'components/StatusChecker';
import {RootState} from 'store';
import {selectClients} from 'store/clients/selectors';
import {Props} from './types';
import Table from 'components/new/Table';
import TableHeader from 'components/new/Table/Header';
import {selectFilters} from 'store/filters/selectors';
import {connect} from 'react-redux';
import {getAllClients} from 'store/clients/actions';
import {Dispatch, bindActionCreators} from '@reduxjs/toolkit';
import {selectCurrentOrgId} from 'store/user/selectors';

const templateColumns = 'minmax(150px, 1fr) 150px 150px 300px';

const ClientTable = ({clients, filters, currentOrgId, getAllClients}: Props) => {
  const {search} = filters;
  const {clients: clientsData, status} = clients;
  const [isSorting, setIsSorting] = useState(true);
  const [filteredClients, setFilteredClients] = useState(clientsData);

  useEffect(() => {
    getAllClients({orgId: currentOrgId, isSorting: isSorting});
  }, [isSorting, currentOrgId, getAllClients]);

  useEffect(() => {
    const lowercaseSearch = search.toLowerCase();

    if (lowercaseSearch.trim() === '') {
      setFilteredClients(clientsData);
    } else {
      const filteredClients = clientsData.filter(client =>
        [client.name, client.inn, client.kpp].some(
          field => field && field.toLowerCase().includes(lowercaseSearch),
        ),
      );
      setFilteredClients(filteredClients);
    }
  }, [search, clientsData]);

  const titles = useMemo(
    () => [
      {title: 'Название', sort: () => setIsSorting(prev => !prev)},
      {title: 'ИНН'},
      {title: 'КПП'},
      {title: 'Юридический адрес'},
    ],
    [],
  );

  return (
    <StatusChecker statusArray={[status]}>
      <Table>
        <TableHeader titles={titles} templateColumns={templateColumns} />
        {filteredClients.map((client, index) => {
          return (
            <ClientTableItem
              key={client.id}
              client={client}
              templateColumns={templateColumns}
              type={index % 2 === 0 ? 'gray' : 'white'}
            />
          );
        })}
      </Table>
    </StatusChecker>
  );
};

const mapStateToProps = (state: RootState) => ({
  clients: selectClients(state),
  filters: selectFilters(state),
  currentOrgId: selectCurrentOrgId(state),
});

const mapDispatchToProps = (dispatch: Dispatch) =>
  bindActionCreators(
    {
      getAllClients,
    },
    dispatch,
  );

export default connect(mapStateToProps, mapDispatchToProps)(memo(ClientTable));
