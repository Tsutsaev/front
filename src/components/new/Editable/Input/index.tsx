import React, {useEffect, useMemo, useState} from 'react';
import {EditableInputProps} from './types';

import styles from './index.module.scss';
import Input from 'components/new/Input';

const offStyleInput = {
  padding: '5.5px 5px 3.5px 5px',
  height: '30px',
  minHeight: '30px',
  width: '100px',
  minWidth: '100px',
};

const offStyleText = {
  padding: '6px 5px 3.5px 5px',
  height: '30px',
  minHeight: '30px',
  width: '100px',
  minWidth: '100px',
};
const EditableInput = ({editingRow, setEditingRow, isOff, style, ...props}: EditableInputProps) => {
  const {isTime, isMultiline, size, value, placeholder} = props;
  const formattedValue = value.replace(/\n/g, '<br />');

  const classContainer = useMemo(() => {
    return `${styles.editing} ${size ? styles[size] : ''} ${
      isMultiline ? styles.textarea : styles.input
    } ${isTime ? styles.time : ''}`;
  }, [size, isMultiline, isTime]);

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
        <div style={style} className={classContainer}>
          <Input {...props} isFocus={isFocus} style={isOff ? offStyleInput : style} />
        </div>
      ) : (
        <div style={style} onClick={handleOnCLick} className={classContainer}>
          <p
            style={isOff ? offStyleText : style}
            className={`${styles.text} ${size ? styles[size] : ''} `}
            dangerouslySetInnerHTML={{__html: formattedValue || placeholder || ''}}
          />
        </div>
      )}
    </>
  );
};

export default EditableInput;
