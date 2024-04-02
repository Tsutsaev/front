import React from 'react';
import Select, {StylesConfig} from 'react-select';

import './index.scss';

import {SingleDropdownProps, MyOption, DropdownSingleType} from './types';

const dot = (color = 'transparent') => ({
  alignItems: 'center',
  display: 'flex',

  ':before': {
    backgroundColor: color,
    borderRadius: 10,
    content: '" "',
    display: 'block',
    marginRight: 8,
    minHeight: 7,
    minWidth: 7,

    '@media (max-width: 1200px)': {
      minHeight: 5,
      minWidth: 5,
      marginRight: 4,
    },

    '@media (max-width: 1000px)': {
      display: 'none',
    },
  },
});

const SingleDropdown = ({
  labels,
  handleChange,
  value,
  isError,
  placeholder,
  isDot,
  isClearable = true,
  isFocus,
  width,
}: SingleDropdownProps) => {
  const styles: StylesConfig<MyOption> = {
    container: baseStyles => ({
      ...baseStyles,
      width: width ? width : '100%',
    }),
    control: (baseStyles, state) => ({
      ...baseStyles,
      minWidth: '100px',
      cursor: 'pointer',
      borderRadius: '0px',
      height: '40px',

      borderColor: state.isFocused ? '#9fb6ff' : isError ? 'red' : baseStyles.borderColor,
    }),
    menu: baseStyles => ({
      ...baseStyles,
      borderRadius: '0px',
      padding: '8px 4px',
    }),
    valueContainer: baseStyles => ({
      ...baseStyles,
      padding: '2px 12px',
    }),
    menuList: baseStyles => ({
      ...baseStyles,
      padding: '0 8px',
      maxHeight: '300px',
      overflowX: 'hidden',
      scrollbarWidth: 'thin',
      scrollbarColor: '#888',
    }),
    input: baseStyles => ({
      ...baseStyles,
      margin: '0px',
    }),
    placeholder: baseStyles => ({
      ...baseStyles,
      margin: '0px',
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
      ...(isDot ? dot(data.color) : {}),
      '@media (max-width: 1300px)': {
        padding: '7px 7px',
      },
    }),
    singleValue: baseStyles => ({
      ...baseStyles,
      color: '#1e1d21',
      margin: '0',
    }),
    clearIndicator: baseStyles => ({
      ...baseStyles,
      display: 'none',
    }),
  };

  const customNoOptionsMessage = ({inputValue}: {inputValue: string}) => {
    return inputValue ? 'Нет результатов' : 'Нет доступных опций';
  };

  return (
    <Select
      menuPlacement="auto"
      backspaceRemovesValue={isClearable}
      escapeClearsValue={isClearable}
      isClearable={isClearable}
      isSearchable={true}
      className="custom-select-control"
      classNamePrefix="custom-select"
      placeholder={placeholder || 'Выберите проект'}
      options={labels}
      onChange={selectedOption => handleChange(selectedOption as DropdownSingleType)}
      value={value}
      styles={styles}
      noOptionsMessage={customNoOptionsMessage}
      defaultMenuIsOpen={isFocus}
      autoFocus={isFocus}
    />
  );
};

export default SingleDropdown;
