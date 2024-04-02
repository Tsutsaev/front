import React, {useRef} from 'react';

import UseClickOutside from 'hooks/UseClickOutide';

import {ReactComponent as Check} from 'shared/assets/images/fi-rr-check.svg';

import styles from './index.module.scss';
import {DropdownActionProps} from './types';

const DropdownAction = ({
  buttons,
  setIsOpen,
  active,
  position = 'down',
  avatar,
}: DropdownActionProps) => {
  const dropdownListRef = useRef<HTMLDivElement | null>(null);

  UseClickOutside(dropdownListRef, () => setIsOpen(false));

  const handleClick = (onClick: () => void) => {
    setIsOpen(false);
    onClick();
  };

  return (
    <div
      ref={dropdownListRef}
      className={`${position === 'right' ? styles.dropdown__right : styles.dropdown} ${
        avatar ? styles.avatar : ''
      }`}>
      {buttons.map(button => (
        <button
          key={button.title}
          onClick={() => handleClick(button.onClick)}
          className={styles.item}>
          {button.title} {active === button.title && <Check />}
        </button>
      ))}
    </div>
  );
};

export default DropdownAction;
