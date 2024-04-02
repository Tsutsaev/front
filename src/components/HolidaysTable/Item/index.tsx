import {parseISO} from 'date-fns';
import React, {useState} from 'react';
import {connect} from 'react-redux';
import {instance} from 'shared';
import {RootState} from 'store';
import {selectCurrentOrgId, selectRole} from 'store/user/selectors';

import DeleteModal from 'components/DeleteModal';
import Button from 'components/new/Button';
import EditableDatePicker from 'components/new/Editable/DatePicker';
import EditableInput from 'components/new/Editable/Input';
import TableRow from 'components/new/Table/Row';

import {ReactComponent as IconCheck} from 'shared/assets/images/fi-rr-checkbox.svg';
import {ReactComponent as IconDelete} from 'shared/assets/images/fi-rr-trash.svg';
import {ReactComponent as IconUndo} from 'shared/assets/images/fi-rr-undo-alt.svg';

import {formatDateWithWeek} from 'utils/FormatDateWithWeek';

import styles from './index.module.scss';
import {StateProps} from './types';

const HolidaysItem = ({
  templateColumns,
  holiday,
  onRemove,
  userRole,
  currentOrgId,
  color,
}: StateProps) => {
  const [value, setValue] = useState(holiday?.description || 'Не заполнено');
  const [selectedDate, setSelectedDate] = useState<Date | null>(parseISO(holiday.date_at));
  const [editingRow, setEditingRow] = useState(false);
  const [showModal, setShowModal] = useState(false);

  if (!currentOrgId) return null;

  const onSave = async () => {
    if (holiday && selectedDate) {
      try {
        const dateParts = selectedDate.toISOString().split('T');
        const dateWithoutTime = dateParts[0];

        const data = {
          date_at: dateWithoutTime,
          description: value,
        };

        await instance.patch(`/${currentOrgId}/holiday/${holiday.id}/`, data);
      } catch (error) {
        console.error('Ошибка при сохранении данных:', error);
      }
    }
    setEditingRow(false);
  };

  const onUndo = () => {
    setValue(holiday?.description || 'Не заполнено');
    setEditingRow(false);
  };

  return (
    <TableRow color={color} templateColumns={templateColumns}>
      {userRole === 'manager' ? (
        <EditableDatePicker
          setEditingRow={userRole === 'manager' ? setEditingRow : () => {}}
          editingRow={editingRow}
          selectedDate={selectedDate}
          setSelectedDate={setSelectedDate}
        />
      ) : (
        <div className={`${styles.text} ${styles.date}`}>{formatDateWithWeek(selectedDate)}</div>
      )}

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
          onDelete={() => onRemove(holiday.id)}
          onClose={() => setShowModal(false)}
          title="праздник"
        />
      )}
    </TableRow>
  );
};

const mapStateToProps = (state: RootState) => ({
  userRole: selectRole(state),
  currentOrgId: selectCurrentOrgId(state),
});

export default connect(mapStateToProps)(HolidaysItem);
