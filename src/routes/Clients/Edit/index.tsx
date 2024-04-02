import {useNavigate, useParams} from 'react-router-dom';

import {Dispatch, bindActionCreators} from '@reduxjs/toolkit';
import React, {useEffect, useState} from 'react';
import {connect} from 'react-redux';
import {RootState} from 'store';
import {deleteClient, getAllClients, getClientById} from 'store/clients/actions';

import {selectClients} from 'store/clients/selectors';
import {getProjectsByClient} from 'store/projects/actions';
import {selectUser} from 'store/user/selectors';
import EditClientInfo from 'components/Client/EditClient/Info';

import EditClientProjects from 'components/Client/EditClient/Projects';
import DeleteModal from 'components/DeleteModal';
import Button from 'components/new/Button';
import PageMenu from 'components/new/Page/Menu';
import PageWrapper from 'components/new/Page/Wrapper';
import StatusChecker from 'components/StatusChecker';

import UseRoleRedirect from 'hooks/UseRoleRedirect';

import styles from './index.module.scss';
import {Props} from './types';

const ClientsEdit = ({
  clients,
  user,
  deleteClient,
  getClientById,
  getProjectsByClient,
  getAllClients,
}: Props) => {
  UseRoleRedirect();
  const {id} = useParams();
  const navigate = useNavigate();
  const {clients: clientsData, status: clientsStatus} = clients;
  const {currentOrgId, status: userStatus} = user;
  const [showModal, setShowModal] = useState(false);

  const client = clientsData.find(client => client.id === Number(id));

  const onDelete = () => {
    setShowModal(false);
    if (client) deleteClient({orgId: currentOrgId, id: client.id});
    navigate('/client');
  };

  useEffect(() => {
    getAllClients({orgId: currentOrgId});
  }, [getAllClients, currentOrgId]);

  useEffect(() => {
    if (client) getClientById({orgId: currentOrgId, id: client.id});
    if (client) getProjectsByClient({orgId: currentOrgId, clientId: client.id});
  }, [client, currentOrgId, getClientById, getProjectsByClient]);

  if (!client) return null;

  return (
    <StatusChecker statusArray={[clientsStatus, userStatus]}>
      <PageWrapper>
        <PageMenu title={client.name}>
          <div className={styles.buttons}>
            <Button
              type={'submit'}
              onClick={() => {
                navigate('/client');
              }}>
              Назад
            </Button>
          </div>
        </PageMenu>

        <EditClientInfo client={client} />
        <EditClientProjects />

        <div className={styles.buttons}>
          <Button
            onClick={() => {
              setShowModal(true);
            }}
            type={'reset'}>
            Удалить клиента
          </Button>
        </div>

        {showModal && (
          <DeleteModal
            onDelete={() => onDelete()}
            onClose={() => setShowModal(false)}
            title="клиента"
          />
        )}
      </PageWrapper>
    </StatusChecker>
  );
};

const mapStateToProps = (state: RootState) => ({
  clients: selectClients(state),
  user: selectUser(state),
});

const mapDispatchToProps = (dispatch: Dispatch) =>
  bindActionCreators(
    {
      deleteClient,
      getClientById,
      getProjectsByClient,
      getAllClients,
    },
    dispatch,
  );

export default connect(mapStateToProps, mapDispatchToProps)(ClientsEdit);
