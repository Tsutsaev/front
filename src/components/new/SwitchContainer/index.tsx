import React, {useState, useRef} from 'react';

import Button from 'components/new/Button';

import UseClickOutside from 'hooks/UseClickOutide';

import {ReactComponent as IconCheck} from 'shared/assets/images/fi-rr-checkbox.svg';
import {ReactComponent as IconUndo} from 'shared/assets/images/fi-rr-undo-alt.svg';

import styles from './index.module.scss';
import {ISwitchContainerProps} from './types';

const SwitchContainer = ({children, value, onSave, onUndo, isError}: ISwitchContainerProps) => {
  const [editing, setEditing] = useState(false);

  // const prevValue = usePrevious(value);

  const ref = useRef(null);
  const handleUndo = () => {
    if (onUndo) onUndo();
    setEditing(false);
  };

  const handleSave = () => {
    if (onSave) onSave();

    setEditing(false);
  };
  UseClickOutside(ref, () => {
    // if (!(value === 'Заполните поле' && prevValue !== value)) {

    onUndo && onUndo();
    setEditing(false);
    //}
  });

  return (
    <div>
      {editing ? (
        <div className={styles.editing} ref={ref}>
          {children}
          <div className={styles.buttons}>
            {onSave && (
              <Button type="check" onClick={handleSave}>
                <IconCheck />
              </Button>
            )}
            {onUndo && (
              <Button type="icon" onClick={handleUndo}>
                <IconUndo />
              </Button>
            )}
          </div>
        </div>
      ) : (
        <div
          onClick={() => setEditing(true)}
          className={`${styles.text} ${isError ? styles.error : ''}`}>
          {value}
        </div>
      )}
    </div>
  );
};

export default SwitchContainer;
