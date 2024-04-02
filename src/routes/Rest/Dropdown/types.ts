import React from 'react';

export type DropdownItem = {
  id: number;
  value: string;
};

export interface RestDropdownProps {
  options?: DropdownItem[];
  onChange: ({id, value}: DropdownItem) => void;
  value: DropdownItem;
  placeholder: string;
  style?: React.CSSProperties;
  error?: boolean;
}
