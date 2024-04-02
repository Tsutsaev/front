import React from 'react';

export type InputProps = {
  value: string;
  onChange: (value: string) => void;
  size?: InputSize;
  isError?: boolean;
  isFocus?: boolean;
  isMultiline?: boolean;
  placeholder?: string;
  isTable?: boolean;
  isTime?: boolean;
  style?: React.CSSProperties;
  handleEsc?: () => void;
  handleEnter?: () => void;
};

export type InputSize = 'mini';
