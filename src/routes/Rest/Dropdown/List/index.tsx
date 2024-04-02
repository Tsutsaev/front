import React, {useEffect} from 'react';
import styles from 'routes/Rest/Dropdown/index.module.css';
import {DropdownItem} from 'routes/Rest/Dropdown/types';

interface DropdownListProps {
  options: DropdownItem[] | undefined;
  style?: React.CSSProperties;
  onChange: (option: DropdownItem) => void;
  setIsOpen: (state: boolean) => void;
}

const DropdownList = ({options, style, onChange, setIsOpen}: DropdownListProps) => {
  useEffect(() => {
    const closeDropdown = () => {
      setIsOpen(false);
    };
    document.addEventListener('click', closeDropdown);

    return () => document.removeEventListener('click', closeDropdown);
  }, [setIsOpen]);

  return (
    <section className={styles.dropdown__list} style={style}>
      {options?.map(option => (
        <div
          className={styles.dropdown__list__item}
          key={option.id}
          onClick={() => onChange(option)}>
          {option.value}
        </div>
      ))}
    </section>
  );
};

export default DropdownList;
