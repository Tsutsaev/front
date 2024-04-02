import React from 'react';
import Select, {InputActionMeta, StylesConfig} from 'react-select';

import './index.scss';
import {MyOption, SingleDropdownProps} from './types';

const MultipleDropdown = ({
  labels,
  handleChange,
  value,
  isError,
  placeholder,
  isClearable = true,
  isAddedNewValue,
  width,
}: SingleDropdownProps) => {
  const stylesProject: StylesConfig<MyOption> = {
    container: baseStyles => ({
      ...baseStyles,
      width: width ? width : '100%',
    }),
    control: (baseStyles, state) => ({
      ...baseStyles,
      minWidth: '100px',
      cursor: 'pointer',
      borderRadius: '0px',
      borderColor: state.isFocused ? '#9fb6ff' : isError ? 'red' : baseStyles.borderColor,
    }),
    menu: baseStyles => ({
      ...baseStyles,
      padding: '8px 4px',
    }),
    menuList: baseStyles => ({
      ...baseStyles,
      padding: '0 8px',
      maxHeight: '300px',
      overflowX: 'hidden',
      scrollbarWidth: 'thin',
      scrollbarColor: '#888',
    }),
    option: (baseStyles, {data, isFocused, isSelected}) => ({
      ...baseStyles,
      cursor: 'pointer',
      color: data.color,
      fontSize: '16px',
      padding: '10px 14px',
      borderRadius: '4px',
      backgroundColor: isSelected ? '#9fb6ff' : isFocused ? '#e5ebff' : baseStyles.backgroundColor,
      wordBreak: 'break-all', // Apply dot if isProject is true
      '@media (max-width: 1300px)': {
        padding: '7px 7px',
      },
    }),
    multiValue: baseStyles => {
      return {
        ...baseStyles,
        backgroundColor: '#9fb6ff',
      };
    },
    multiValueLabel: (baseStyles, {data}) => ({
      ...baseStyles,
      color: data.color,
    }),
    multiValueRemove: (baseStyles, {data}) => ({
      ...baseStyles,
      color: data.color,
      ':hover': {
        backgroundColor: data.color,
        color: 'white',
      },
    }),
  };

  const customNoOptionsMessage = ({inputValue}: {inputValue: string}) => {
    return inputValue ? 'Нет результатов' : 'Нет доступных опций';
  };
  const handleInputChange = (inputValue: string, action: InputActionMeta) => {
    const trimmedValue = inputValue.trim(); // Удаляем пробелы в начале и конце строки

    if (action.action === 'input-change' && isAddedNewValue && trimmedValue) {
      const newValue = {label: trimmedValue, value: trimmedValue, color: ''}; // Создаем новую опцию

      // Проверяем, нет ли уже такой опции в списке
      if (!labels.find(option => option.label === trimmedValue)) {
        labels.push(newValue); // Добавляем новую опцию в список
      }
    }
  };

  return (
    <Select
      menuPlacement="auto"
      isClearable={isClearable}
      isSearchable={true}
      isMulti
      className="custom-select-control"
      classNamePrefix="custom-select"
      placeholder={placeholder || 'Выберите проект'}
      options={labels}
      onChange={handleChange}
      value={value}
      styles={stylesProject}
      onInputChange={handleInputChange}
      noOptionsMessage={customNoOptionsMessage}
    />
  );
};

export default MultipleDropdown;
