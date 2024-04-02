import {NavLink} from 'react-router-dom';

import {Dispatch, bindActionCreators} from '@reduxjs/toolkit';
import React, {useState} from 'react';
import {connect} from 'react-redux';
import {RootState} from 'store';
import {deleteProjectMember, patchProjectMember} from 'store/projectMembers/actions';
import {selectProjectMembers} from 'store/projectMembers/selectors';
import {selectProjects} from 'store/projects/selectors';
import {selectCurrentOrgId} from 'store/user/selectors';
import {reduceValue} from 'utils';

import DeleteModal from 'components/DeleteModal';
import Button from 'components/new/Button';
import EditableDatePicker from 'components/new/Editable/DatePicker';
import EditableInput from 'components/new/Editable/Input';
import TableCell from 'components/new/Table/Cell';
import TableRow from 'components/new/Table/Row';

import {ReactComponent as IconCheck} from 'shared/assets/images/fi-rr-checkbox.svg';
import {ReactComponent as TrashIcon} from 'shared/assets/images/fi-rr-trash.svg';

import {formatDatePatch} from 'utils/DateFormat';

import styles from './index.module.scss';
import ProjectMemberOffModal from './Modal';
import {ProjMemberData, Props} from './types';

const ProjectMemberItem = ({
  data,
  patchProjectMember,
  deleteProjectMember,
  templateColumns,
  currentOrgId,
}: Props) => {
  const [projMemberData, setProjMemberData] = useState<ProjMemberData>({
    date_out: data.date_out ? new Date(data.date_out) : null,
    off: data.off?.toString() || '',
  });

  const [editing, setEditing] = useState({
    date_out: false,
    off: false,
  });
  const [isModalShown, setIsModalShown] = useState(false);
  const [deleteModal, setDeleteModal] = useState(false);

  const onCLickSave = () => {
    if (editing.date_out) {
      handleSave('date_out');
      handleEditing('date_out')(false);
    }
    if (editing.off) {
      setIsModalShown(true);
      handleEditing('off')(false);
    }
  };

  const handleSave = (field: keyof ProjMemberData, update_previous?: boolean) => {
    const value =
      field === 'off'
        ? {off: +projMemberData.off, update_previous: update_previous}
        : {date_out: formatDatePatch(projMemberData.date_out)};

    patchProjectMember({
      orgId: currentOrgId,
      id: data.id,
      data: value,
    });
    setIsModalShown(false);
  };

  const handleDelete = () => {
    deleteProjectMember({
      orgId: currentOrgId,
      id: data.id,
    });
    setDeleteModal(false);
  };

  const handleEditing = (field: keyof typeof editing) => (value: boolean) => {
    setEditing(prev => ({...prev, [field]: value}));
  };

  const handleChange = (field: keyof ProjMemberData) => (value: Date | null | string | boolean) => {
    setProjMemberData(prev => ({...prev, [field]: value}));
  };

  return (
    <TableRow key={data.id} templateColumns={templateColumns}>
      <NavLink className={styles.profile} to={`/organizationmember/edit/${data.profile.id}`}>
        {data.profile.fio}
      </NavLink>

      <TableCell style={{padding: '0 4px'}}>
        <div className={styles.button_field}>
          <EditableDatePicker
            style={{width: '150px'}}
            setEditingRow={handleEditing('date_out')}
            editingRow={editing.date_out}
            selectedDate={projMemberData.date_out}
            setSelectedDate={handleChange('date_out')}
          />
          {editing.date_out && (
            <Button type={'check'} onClick={onCLickSave}>
              <IconCheck />
            </Button>
          )}
        </div>
      </TableCell>

      <TableCell style={{padding: '0 4px'}}>
        <div className={styles.button_field}>
          <EditableInput
            style={{minWidth: '150px'}}
            value={projMemberData.off}
            onChange={handleChange('off')}
            setEditingRow={handleEditing('off')}
            editingRow={editing.off}
          />

          {editing.off && (
            <Button type={'check'} onClick={onCLickSave}>
              <IconCheck />
            </Button>
          )}
        </div>
      </TableCell>

      <TableCell>{reduceValue(data.dur_all_time) || '-'}</TableCell>

      <TableCell style={{padding: '8px'}}>
        <Button type={'icon'} onClick={() => setDeleteModal(true)}>
          <TrashIcon />
        </Button>
      </TableCell>
      {isModalShown && <ProjectMemberOffModal handleSave={value => handleSave('off', value)} />}
      {deleteModal && (
        <DeleteModal
          onDelete={handleDelete}
          onClose={() => setDeleteModal(false)}
          title="участника проекта"
        />
      )}
    </TableRow>
  );
};

const mapStateToProps = (state: RootState) => ({
  currentOrgId: selectCurrentOrgId(state),
  projects: selectProjects(state),
  projectMembers: selectProjectMembers(state),
});

const mapDispatchToProps = (dispatch: Dispatch) =>
  bindActionCreators(
    {
      patchProjectMember,
      deleteProjectMember,
    },
    dispatch,
  );

export default connect(mapStateToProps, mapDispatchToProps)(ProjectMemberItem);
