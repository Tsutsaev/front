import React, {useState} from 'react';
import {StateProps} from './types';
import {ReactComponent as IconCheck} from 'shared/assets/images/fi-rr-checkbox.svg';
import {ReactComponent as IconDelete} from 'shared/assets/images/fi-rr-trash.svg';
import {ReactComponent as IconUndo} from 'shared/assets/images/fi-rr-undo-alt.svg';
import styles from './index.module.scss';
import {instance} from 'shared';
import DeleteModal from 'components/DeleteModal';
import EditableInput from 'components/new/Editable/Input';
import Button from 'components/new/Button';
import {selectCurrentOrgId, selectRole} from 'store/user/selectors';
import {RootState} from 'store';
import {connect} from 'react-redux';
import TableRow from 'components/new/Table/Row';

const TagsItem = ({templateColumns, tag, onRemove, currentOrgId, userRole, color}: StateProps) => {
  const [value, setValue] = useState(tag?.name || 'Не заполнено');
  const [editingRow, setEditingRow] = useState(false);
  const [showModal, setShowModal] = useState(false);

  if (!currentOrgId) return null;

  const onSave = async () => {
    if (tag) {
      try {
        await instance.patch(`/${currentOrgId}/tag/${tag.id}/`, {name: value});
      } catch (error) {
        console.error('Ошибка при сохранении данных:', error);
      }
    }
    setEditingRow(false);
  };

  const onUndo = () => {
    setValue(tag?.name || 'Не заполнено');
    setEditingRow(false);
  };

  return (
    <TableRow color={color} templateColumns={templateColumns}>
      <EditableInput
        value={value}
        onChange={setValue}
        setEditingRow={userRole === 'manager' ? setEditingRow : () => {}}
        editingRow={editingRow}
      />

      {userRole === 'manager' && (
        <div className={styles.buttons}>
          {editingRow ? (
            <>
              <Button type="check" onClick={onSave}>
                <IconCheck />
              </Button>

              <Button type="icon" onClick={onUndo}>
                <IconUndo />
              </Button>
            </>
          ) : (
            <div className={styles.empty}></div>
          )}
          <Button
            type="icon"
            onClick={() => {
              setShowModal(true);
            }}>
            <IconDelete />
          </Button>
        </div>
      )}
      {showModal && (
        <DeleteModal
          onDelete={() => onRemove(tag.id)}
          onClose={() => setShowModal(false)}
          title="тег"
        />
      )}
    </TableRow>
  );
};

const mapStateToProps = (state: RootState) => ({
  userRole: selectRole(state),
  currentOrgId: selectCurrentOrgId(state),
});

export default connect(mapStateToProps)(TagsItem);
