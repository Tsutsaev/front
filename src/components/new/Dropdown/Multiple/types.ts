import {MultiValue} from 'react-select';

export type SingleDropdownProps = {
  labels: MyOption[];
  handleChange: (selectedOption: DropdownMultipleType) => void;
  value: DropdownMultipleType;
  isError?: boolean;
  placeholder?: string;
  isDot?: boolean;
  isPanel?: boolean;
  isClearable?: boolean;
  isAddedNewValue?: boolean;
  width?: number;
  onRemove?: () => void;
};

export type MyOption = {label: string; value: string; color: string};
export type DropdownMultipleType = MultiValue<MyOption> | null;
