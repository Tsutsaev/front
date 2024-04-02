import React, {useEffect, useState} from 'react';
import Select, {MultiValue, SingleValue, StylesConfig} from 'react-select';
import './index.scss';
import {PanelDropdownProps, MyOption} from './types';

const PanelDropdown = ({labels, onChange, placeholder, initialState}: PanelDropdownProps) => {
  const stylesPanel: StylesConfig<MyOption> = {
    container: baseStyles => ({
      ...baseStyles,
      width: '100%',
    }),
    control: (baseStyles, state) => ({
      ...baseStyles,
      minWidth: '100px',
      cursor: 'pointer',
      borderRadius: '0px',
      minHeight: '40px',
      boxShadow: 'none',
      borderColor: state.isFocused ? '#9fb6ff' : baseStyles.borderColor,
    }),
    menu: baseStyles => ({
      ...baseStyles,
      borderRadius: '0px',
      padding: '8px 4px',
      minWidth: '250px',
      left: '50%',
      transform: 'translateX(-50%)',
    }),
    menuList: baseStyles => ({
      ...baseStyles,
      padding: '0 8px',
      maxHeight: '300px',
      overflowX: 'hidden',
      scrollbarWidth: 'thin',
      scrollbarColor: '#888',
      borderRadius: '0px',
    }),
    option: (baseStyles, {data, isFocused, isSelected}) => ({
      ...baseStyles,
      cursor: 'pointer',
      color: data.color,
      fontSize: '16px',
      padding: '10px 14px',
      borderRadius: '0px',
      backgroundColor: isSelected ? '#9fb6ff' : isFocused ? '#e5ebff' : baseStyles.backgroundColor,
      wordBreak: 'break-word',
      '@media (max-width: 1300px)': {
        padding: '7px 7px',
      },
    }),
    singleValue: baseStyles => ({
      ...baseStyles,
      color: '#1e1d21',
    }),
  };
  const customNoOptionsMessage = ({inputValue}: {inputValue: string}) => {
    return inputValue ? 'Нет результатов' : 'Нет доступных опций';
  };

  const [activeItem, setActiveItem] = useState<SingleValue<MyOption> | MultiValue<MyOption> | null>(
    null,
  );

  useEffect(() => {
    const startProject = labels.find(label => label.value === initialState);
    if (startProject) {
      setActiveItem(startProject);
      onChange(startProject.value);
    }
  }, [initialState, labels, onChange]);

  const handleChangeItem = (item: SingleValue<MyOption> | MultiValue<MyOption> | null) => {
    const singleValueItem = item as SingleValue<MyOption>;
    setActiveItem(singleValueItem);
    onChange(singleValueItem?.value || null);
  };

  return (
    <Select
      menuPlacement="auto"
      isClearable={true}
      isSearchable={true}
      className="custom-select-control"
      classNamePrefix="custom-select"
      placeholder={placeholder || 'Выберите проект'}
      options={labels}
      onChange={handleChangeItem}
      value={activeItem}
      styles={stylesPanel}
      noOptionsMessage={customNoOptionsMessage}
    />
  );
};

export default PanelDropdown;
