import {InputSize} from 'components/new/Input/types';

export type EditableInputProps = {
  value: string;
  onChange: (value: string) => void;
  setEditingRow: (editingRow: boolean) => void;
  editingRow: boolean;
  size?: InputSize;
  isError?: boolean;
  isFocus?: boolean;
  isMultiline?: boolean;
  placeholder?: string;
  isTable?: boolean;
  isTime?: boolean;
  style?: React.CSSProperties;
  isOff?: boolean;
  handleEsc?: () => void;
  handleEnter?: () => void;
};
