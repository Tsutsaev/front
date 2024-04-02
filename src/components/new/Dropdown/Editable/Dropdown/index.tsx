import React, {useEffect, useState} from 'react';
import {IEditableDropdownProps} from './types';
import styles from './index.module.scss';
import SingleDropdown from '../../Single';

const EditableDropdown = ({
  value,
  handleChange,
  labels,
  setEditingRow,
  editingRow,
  isError,
  placeholder,
}: IEditableDropdownProps) => {
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
          <SingleDropdown
            isFocus={isFocus}
            isError={isError}
            value={value}
            handleChange={handleChange}
            labels={labels}
            placeholder={placeholder}
          />
        </div>
      ) : (
        <div onClick={handleOnCLick} className={styles.editing}>
          <div className={styles.project}>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="7"
              height="7"
              viewBox="0 0 7 7"
              fill="none">
              <circle cx="3" cy="3" r="3" fill={value?.color || '#1e1d21'} />
            </svg>
            <p className={styles.text} style={{color: value?.color}}>
              {value?.label || placeholder || 'Выберите проект'}
            </p>
          </div>
        </div>
      )}
    </>
  );
};

export default EditableDropdown;
