import {SingleValue} from 'react-select';

export interface SingleDropdownProps {
  labels: MyOption[];
  handleChange: (selectedOption: DropdownSingleType) => void;
  value: DropdownSingleType;
  isError?: boolean;
  placeholder?: string;
  isDot?: boolean;
  isClearable?: boolean;
  isFocus?: boolean;
  width?: number;
}
export type DropdownSingleType = SingleValue<MyOption> | null;
export type DropdownSingleTypeWithoutNull = SingleValue<MyOption>;
export type MyOption = {label: string; value: string; color: string};
