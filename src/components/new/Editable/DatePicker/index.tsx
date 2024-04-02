import React, {useEffect, useState} from 'react';

import CustomDatePicker from 'components/new/DatePicker';

import {formatDateWithWeek} from 'utils/FormatDateWithWeek';

import styles from './index.module.scss';
import {EditableDatePickerProps} from './types';

const EditableDatePicker = ({
  selectedDate,
  setEditingRow,
  editingRow,
  setSelectedDate,
  isError,
  style,
}: EditableDatePickerProps) => {
  const [isFocus, setIsFocus] = useState(false);

  const handleOnCLick = () => {
    setIsFocus(true);
    setEditingRow(true);
  };

  useEffect(() => {
    if (!editingRow) setIsFocus(false);
  }, [editingRow]);

  return (
    <>
      {editingRow ? (
        <div className={styles.editing}>
          <CustomDatePicker
            autoFocus={isFocus}
            isError={isError}
            selectedDate={selectedDate}
            setSelectedDate={setSelectedDate}
            isArbitrary
            style={style}
          />
        </div>
      ) : (
        <div onClick={handleOnCLick} className={`${styles.text} ${styles.date}`}>
          {formatDateWithWeek(selectedDate)}
        </div>
      )}
    </>
  );
};

export default EditableDatePicker;
