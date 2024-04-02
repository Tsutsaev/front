import {NavLink} from 'react-router-dom';

import {Dispatch, bindActionCreators} from '@reduxjs/toolkit';
import {format} from 'date-fns';
import React, {useState} from 'react';
import {connect} from 'react-redux';
import {RootState} from 'store';
import {deleteRest, updateRest} from 'store/rest/actions';
import {selectUser} from 'store/user/selectors';

import AgreedSwitcher from 'routes/Rest/AgreedSwitcher';
import TagsList from 'routes/Rest/TagsList';

import DeleteModal from 'components/DeleteModal';
import Button from 'components/new/Button';
import TableCell from 'components/new/Table/Cell';
import TableRow from 'components/new/Table/Row';

import {ReactComponent as TrashIcon} from 'shared/assets/images/fi-rr-trash.svg';

import styles from './index.module.css';
import {Props} from './types';

const templateColumns = 'auto 95px 120px 150px 120px 60px';

const TableRecord = ({user, rest, updateRest, deleteRest, color}: Props) => {
  const {currentOrgId} = user;
  const [showModal, setShowModal] = useState(false);

  const agreedStatusChange = () => {
    updateRest({
      orgId: currentOrgId,
      id: rest.id,
      agreed: !rest.agreed,
    });
  };

  const deleteRecordEvent = () => {
    deleteRest({orgId: currentOrgId, id: rest.id});

    setShowModal(false);
  };

  return (
    <TableRow color={color} templateColumns={templateColumns}>
      <TableCell>
        <NavLink className={styles.profile} to={`/organizationmember/edit/${rest.profile.id}`}>
          {rest.profile.fio}
        </NavLink>
      </TableCell>
      <TableCell>{format(new Date(rest.date_from), 'dd.MM.yy')}</TableCell>
      <TableCell>{format(new Date(rest.date_to), 'dd.MM.yy')}</TableCell>
      <TableCell style={{padding: '8px'}}>
        <TagsList tags={rest.tags} />
      </TableCell>
      <TableCell style={{justifySelf: 'center'}}>
        {user.role === 'manager' ? (
          <AgreedSwitcher agreed={rest.agreed} onClick={agreedStatusChange} editable />
        ) : (
          <AgreedSwitcher agreed={rest.agreed} />
        )}
      </TableCell>
      <TableCell>
        <Button type={'icon'} onClick={() => setShowModal(true)}>
          <TrashIcon />
        </Button>
      </TableCell>

      {showModal && (
        <DeleteModal
          onDelete={deleteRecordEvent}
          onClose={() => setShowModal(false)}
          title="отсутствие"
        />
      )}
    </TableRow>
  );
};

const mapStateToProps = (state: RootState) => ({
  user: selectUser(state),
});

const mapDispatchToProps = (dispatch: Dispatch) =>
  bindActionCreators(
    {
      updateRest,
      deleteRest,
    },
    dispatch,
  );

export default connect(mapStateToProps, mapDispatchToProps)(TableRecord);
