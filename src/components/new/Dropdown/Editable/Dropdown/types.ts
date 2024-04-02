import {DropdownSingleType, MyOption} from 'components/new/Dropdown/Single/types';

export type IEditableDropdownProps = {
  setEditingRow: (editingRow: boolean) => void;
  editingRow: boolean;
  isError?: boolean;
  placeholder?: string;
  labels: MyOption[];
  handleChange: (option: DropdownSingleType) => void;
  value: DropdownSingleType;
};
